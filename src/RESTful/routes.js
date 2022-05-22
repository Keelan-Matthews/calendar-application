// let router = (app,fs) => {
//     let data_file = 'data.json';

//     app.get('/data', (req,res) => {
//         fs.readFile(data_file, (err, data) => {
//             if (err) throw err;
//             res.send(JSON.parse(data));
//         });
//     });

//     app.get('/data/:id', (req,res) => {
//         let idReq = req.params["id"];
//         fs.readFile(data_file, (err, data) => {
//             if (err) throw err;
//             let json = JSON.parse(data);
//             let filtered = json.filter(e => e.id == idReq);
//             res.send(filtered);
//         });
//     });

//     app.post('/data', (req, res) => {
//         fs.readFile(data_file, (err, data) => {
//             if (err) throw err;
//             let json = JSON.parse(data);

//             json[json.length] = req.body;
//             let newData = JSON.stringify(json);

//             fs.writeFile(data_file, newData, (err, data) =>{
//                 if (err) throw err;
//             });

//             res.send(json);
//         });

//     });

//     app.put('/data/:id', (req, res) => {
//         let data_file = 'data.json';
//         let idReq = req.params["id"];
//         fs.readFile(data_file, (err, data) => {
//             if (err) throw err;
//             let json = JSON.parse(data);

//             index = json.findIndex((e => e.id == idReq));
//             json[index] = req.body;

//             let newdata = JSON.stringify(json);
//             fs.writeFile(data_file, newdata, (err) =>{
//                 if (err) throw err;
//             });

//             res.send(json);
//         });
//     });

//     app.delete('/data/:id', (req, res) => {
//         let data_file = 'data.json';
//         let idReq = req.params["id"];
//         fs.readFile(data_file, (err, data) => {
//             if (err) throw err;
//             let json = JSON.parse(data);
//             index = json.findIndex((e => e.id == idReq));
//             json.splice(index,1);

//             let newdata = JSON.stringify(json);
//             fs.writeFile(data_file, newdata, (err) =>{
//                 if (err) throw err;
//             });

//             res.send(json);
//         });
//     });
// };

// module.exports = router;

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
            res.status(200).json(json);
        })
    })
};

module.exports = router;