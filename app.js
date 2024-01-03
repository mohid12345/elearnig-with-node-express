const express = require('express');
const mongoose = require('mongoose');
const nocache = require('nocache');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const{v4: uuidv4} = require('uuid');
const path = require("path");
require("dotenv").config();
const app = express();
const bodyparser = require("body-parser");
const jsonParse = bodyparser.json();

app.use(jsonParse);

const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");
const creatorRouter = require("./routes/creatorRouter");

const PORT = process.env.PORT;

app.use(nocache());
app.use(cookieParser()); // parsing the incoming data
app.use(express.urlencoded({extended: true})); // parsing the incoming data
app.set('view engine', 'ejs');
// app.set("views","./views");
// app.set("views", path.join(__dirname, "views","user"));
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public")); //serving public file
app.use(
    session({    
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,  
})
);

app.use("/", (req, res, next) => {
  app.set("views", path.join(__dirname, "views", "user"));
  next();
}, userRouter);
app.use("/admin", (req, res, next) => {
  app.set("views", path.join(__dirname, "views", "admin"));
  next();
}, adminRouter);
app.use("/creator", (req, res, next) => {
  app.set("views", path.join(__dirname, "views", "creator"));
  next();
}, creatorRouter);

const MONGO_CNT = "mongodb://127.0.0.1:27017/EdX-db";
app.listen(PORT, async () => {
    try {
      await mongoose.connect(MONGO_CNT);
      console.log(" SERVER CONNECTED");
      console.log(`http://localhost:${PORT}`);
      console.log("DB Connected Successfully");
    } catch (err) {
      console.error(err);
    }
  });
