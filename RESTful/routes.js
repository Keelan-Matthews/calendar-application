let xml2js = require('xml2js');
let parser = new xml2js.Parser();
let builder = new xml2js.Builder();

let router = (app,fs) => {

    /*
    * This request fetches the calendar for a specific
    * user passed in as a parameter and returns it as
    * a json object.
    */
    app.get('/calendar/:user', (req, res) => {
        let user = req.params['user'];

        if (user === null) {
            res.status(400).send("User has not been specified"); //Bad request
            return;
        }

        //Retrieve xml file data for specific user
        let data_file = './calendars/'+user+'.xml';

        fs.readFile(data_file, 'utf8', (err, data) => {
            //See if attempt to read file returns an error
            if (err) {
                (err.errno == -4058) ? res.status(404).send('There is no database associated with the requested user') : 
                                       res.status(400).send('Something went wrong');
                return;
            }

            //Parse xml data into json
            let json;
            parser.parseString(data, (err, result) => {
                json = result;
            });

            //Send json to client
            res.status(200).send(JSON.stringify(json));
        })
    })

    /* This request updates a specific event to reflect the edits
    * made on the web client.
    */
    app.patch('/calendar/:user/update/:eventId', (req, res) => {
        let user = req.params['user'];
        let eventId = req.params['eventId'];

        if (user === null) {
            res.status(400).send("User has not been specified"); //Bad request
            return;
        }

        if (eventId === null) {
            res.status(400).send("Event ID has not been specified"); //Bad request
            return;
        }

        // Retrieve xml file data for specific user
        let data_file = './calendars/'+user+'.xml';
        
        fs.readFile(data_file, 'utf8', (err, data) => {
            //See if attempt to read file returns an error
            if (err) {
                (err.errno == -4058) ? res.status(404).send('There is no database associated with the requested user') : 
                                       res.status(400).send('Something went wrong');
                return;
            }

            //Parse xml data into json
            let json;
            parser.parseString(data, (err, result) => {
                let events = result.schedule.event;

                //Get index of event to be updated
                let index = events.findIndex(e => e.$.id === eventId);

                //Update event
                events[index].description[0] = req.body.details;

                json = result;
            });

            let xml = builder.buildObject(json);

            fs.writeFile(data_file, xml, function (err,data) {
                if (err) console.log(err);
                console.log('successfully updated');
                res.status(200).send(JSON.stringify({'status':'updated'}));
            })
        })      
    })

    // This request deletes a specified event from the xml database
    app.delete('/calendar/:user/delete/:eventId', (req, res) => {
        let user = req.params['user'];
        let eventId = req.params['eventId'];

        if (user === null) {
            res.status(400).send("User has not been specified"); //Bad request
            return;
        }

        if (eventId === null) {
            res.status(400).send("Event ID has not been specified"); //Bad request
            return;
        }

        //Retrieve xml file data for specific user
        let data_file = './calendars/'+user+'.xml';

        fs.readFile(data_file, 'utf8', (err, data) => {
            //See if attempt to read file returns an error
            if (err) {
                (err.errno == -4058) ? res.status(404).send('There is no database associated with the requested user') : 
                                       res.status(400).send('Something went wrong');
                return;
            }

            //Parse xml data into json
            let json;
            parser.parseString(data, (err, result) => {
                let events = result.schedule.event;

                //Get index of event to be updated
                let index = events.findIndex(e => e.$.id === eventId);
                console.log(events[index]);

                //Update event
                events.splice(index, 1);
                json = result;
            });

            let xml = builder.buildObject(json);

            fs.writeFile(data_file, xml, function (err,data) {
                if (err) console.log(err);
                console.log('successfully deleted');
                res.status(200).send(JSON.stringify({'status':'deleted'}));
            })
        })
    })

    /* This request adds a new event to the schedule of the 
    * passed in user.
    */
    app.post('/calendar/:user/add', (req, res) => {
        let user = req.params['user'];

        if (user === null) {
            res.status(400).send("User has not been specified"); //Bad request
            return;
        }

        //Retrieve xml file data for specific user
        let data_file = './calendars/'+user+'.xml';

        fs.readFile(data_file, 'utf8', (err, data) => {
            //See if attempt to read file returns an error
            if (err) {
                (err.errno == -4058) ? res.status(404).send('There is no database associated with the requested user') : 
                                       res.status(400).send('Something went wrong');
                return;
            }

            //Convert passed data to match json object Properties
            let passedReq = req.body;

            //Extract date properties from passed in date
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let day = new Date(passedReq.date).getDate();
            let d = new Date(passedReq.date);
            let month = monthNames[d.getMonth()];

            //Get object for guests (amount varies so it needs a separate method)
            let guests = [];
            for (let i = 0; i < passedReq.guests.length; i++) {
                if (passedReq.guests[i].name != '' && passedReq.guests[i].email != '') {
                    guests.push({
                        "name": passedReq.guests[i].name, 
                        "email": passedReq.guests[i].email
                    })
                }
            }
            
            //Convert time variables to match XML requirements
            let start = tConvert(passedReq.start);
            let end = tConvert(passedReq.end);
            let startHour = start.substring(0, start.indexOf(':'));
            let endHour = end.substring(0, end.indexOf(':'));

            start = startHour.length == 1 ? "0"+start : start;
            end = endHour.length == 1 ? "0"+end : end;

            //Populate new event
            let noSpace = passedReq.name.replace(' ','').toUpperCase();
            const newEvent = {
                "$": {
                    "id": noSpace.substring(0, 5)+passedReq.eventType.substring(0,1)+rnd()
                }, 
                "title": [passedReq.name],
                "type": [passedReq.eventType],
                "date": [
                    {
                        "$": {
                            "repeat": passedReq.repeat
                        },
                        "day": [day],
                        "month": [month],
                        "startingTime": [start],
                        "endingTime": [end]
                    }
                ],
                "guests": [
                    {
                        "guest": guests
                    }
                ],
                "venue": [passedReq.venue],
                "description": [passedReq.details]
            }

            //Remove Date attribute if it is no-repeat
            if (newEvent.date[0].$.repeat === "No Repeat")
                delete newEvent.date[0].$;

            // Parse xml data into json
            let json;
            parser.parseString(data, (err, result) => {
                result.schedule.event.push(newEvent);
                json = result;
            });

            let xml = builder.buildObject(json);

            fs.writeFile(data_file, xml, function (err,data) {
                if (err) console.log(err);
                res.status(200).send(JSON.stringify({'status':'added'}));
            })
        })
    })

    //Used to generate random set of 3 characters for ID
    function rnd() {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; //used for random chars
        let result = '';

        for (let i = 0; i < 3; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));

        return result;
    }

    function tConvert (time) {
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { 
          time = time.slice (1);  
          time[5] = +time[0] < 12 ? ' AM' : ' PM'; 
          time[0] = +time[0] % 12 || 12; 
        }
        return time.join (''); 
    }
};

module.exports = router;