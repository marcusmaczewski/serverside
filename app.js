const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// Morgan: Auto "restart" projektet på ændringer
const logger = require('morgan');
app.use(logger('dev', {
	// Ignorer filer som ender på x
	skip: req => !req.url.endsWith('.html') && req.url.indexOf('.') > -1
}));


// App settings
app.use(express.json());
app.use(express.urlencoded( { extended:true} ));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/public', express.static(__dirname + "/public"));


// Istantier upload express file upload funktioner
const fileupload = require('express-fileupload');
app.use(fileupload({
	limits:{
		filesize: 5 * 1024 * 1024
	}
}));

// Istantier mongoose
const mongoose = require("mongoose");

// opret forbindelse til vores mongodb server
const db = mongoose.connect("mongodb://localhost:27017/maczewskimongo", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

// For at fixe fejlen med billede der ikke bliver fundet
app.use(express.static('./public'));

// Istantier vores routes som gør vores "endpoints" mulige
require('./routes')(app);

// App start
app.listen(port, () => {
	console.log(`Serveren kører... http://localhost:${port}`);
});