//Read Vriabels From .env File To Use Direct From "process.env"
require("dotenv").config();
const express = require("express");
const { join } = require("path");
const session = require("express-session");
const flash = require("connect-flash");


//Create Express App
const app = express();

//Tell Express Where Our View Main Path
app.set("views", process.cwd() + "/src/views");

//Tell Express What View Engin We Need To Use
app.set("view engine", "ejs");

//To Make Express Detect Static Files Automaticly Without Create Single Router To Each File
app.use(express.static(join(process.cwd(), "/src/public")));

//For Parsing application/json And Set Linit To Request Body
app.use(express.json({ limit: "900mb" }));
app.use(express.urlencoded({ extended: true, limit: "900mb" }));

//Help Us To Send Dynamic Vriables To Ejs To Render It In Page
app.use(flash());

//Integration Wtih Express Session
app.use(session({
  name: "OracelDemo",
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: false, maxAge: 12 * 60 * 60 * 1000 },
  secret: process.env.SESSIONS_SECRET,
}));

//Pass Out Load User Infom Middleware
app.use(mw.loadUserInfo);

/** Load User Module */
require("./modules/user/router")(app);

app.get("/", (req, res) => {
  res.render("index");
});

//Store DB In Gloable To User It In Ant Where Without Require
global.db = require("./core/db");
//Migrate Data Base Before Start The App
global.db.migrate().then(() => {
  //Start App Now
  let port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Express server listening http://localhost:${port}`);
  });
}).catch(error => {
  console.log(`Express server Not Started`);
})
