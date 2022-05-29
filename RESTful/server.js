// Keelan Matthews u21549967
let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let cors = require('cors');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
let routes = require('./routes.js')(app,fs);

let port = process.env.PORT || 3000;
app.listen(port);
console.log('listening on port ' + port);