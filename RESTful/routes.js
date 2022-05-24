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

        //Retrieve xml file data for specific user
        let data_file = './calendars/'+user+'.xml';
        let xml;
        fs.readFile(data_file, 'utf8', (err, data) => {
            //See if attempt to read file returns an error
            if (err) {
                (err.errno == -4058) ? res.status(404).send('There is no database associated with the requested user') : 
                                       res.status(400).send('Something went wrong');
                return;
            }

            //Parse xml data into json
            parser.parseString(data, (err, result) => {
                let events = result.schedule.event;

                //Get index of event to be updated
                let index = events.findIndex(e => e.$.id === eventId);

                //Update event
                result.schedule.event[index].description[0] = req.body.details;
                xml = builder.buildObject(result);
            });
        })

        console.log(xml);

        fs.writeFile(data_file, xml, function (err,data) {
            if (err) console.log(err);
            console.log('successfully updated');
            res.status(200).send(JSON.stringify(data));
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
            parser.parseString(data, (err, result) => {
                let events = result.schedule.event;

                //Get index of event to be updated
                let index = events.findIndex(e => e.$.id === eventId);

                //Update event
                result.schedule.event.splice(index, 1);
                xml = builder.buildObject(result);
            });
        })
    })
};

module.exports = router;