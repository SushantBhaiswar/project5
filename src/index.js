const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route.js');
const app = express();
const connection = require("./db");
const multer = require("multer");

app.use(bodyParser.json());
app.use(multer().any())

// database connection
connection();
app.use('/', router);

app.use((req, res) =>{
   res.status(400).send({ status: false, message: 'invalid URL' })
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
