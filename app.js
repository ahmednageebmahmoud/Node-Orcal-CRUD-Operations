//Read Vriabels From .env File To Use Direct From "process.env"
require('dotenv').config();
const express = require('express');
const { join } = require('path');

//Create Express App
const app = express();

//Tell Express Where Our View Main Path
app.set('views', process.cwd() + '/src/views');
//Tell Express What View Engin We Need To Use
app.set("view engine", "ejs");
//To Make Express Detect Static Files Automaticly Without Create Single Router To Each File
app.use(express.static(join(process.cwd(), '/src/public')));
//For Parsing application/json And Set Linit To Request Body
app.use(express.json({ limit: '900mb' }));
app.use(express.urlencoded({ extended: true, limit: '900mb' }));



/** Load User Module */
require('./modules/user/router')(app);

app.get('/',(req,res)=>{
    res.render('index')
})



let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express server listening http://localhost:${port}`);
});