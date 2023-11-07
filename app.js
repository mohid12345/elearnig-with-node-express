const express = require('express');
const mongoose = require('mongoose');
const nocache = require('nocache');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const{v4: uuidv4} = require('uuid');
const path = require("path");
require("dotenv").config();
const app = express();


//importing routes
const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");
const creatorRouter = require("./routes/creatorRouter");

const PORT = process.env.PORT || 8000;

// const LOCAL_STR = "mongodb://localhost:27017/e-learning-user-admin";

app.use(nocache());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// app.set("views","./views");
// app.set("views", path.join(__dirname, "views","user"));
app.use(express.static("public"));
app.use(
    session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
})
);

//setting up route handlers
// app.use("/", userRouter);

app.use("/", (req, res, next) => {
  app.set("views", path.join(__dirname, "views", "user"));
  next();
}, userRouter);


// app.use("/", adminRouter);

app.use("/", (req, res, next) => {
  app.set("views", path.join(__dirname, "views", "admin"));
  next();
}, adminRouter);

// app.use("/", adminRouter);
// app.use("/creator",creatorRouter);

// const db = mongoose.connect(LOCAL_STR);


// app.get('/courses',(req, res)=>{
// res.render("courses");
// });
// app.get('/contact',(req, res)=>{
// res.render("contact");
// });
// app.get('/contact',(req, res)=>{
//     res.render("contact");
//     });
//     app.get('/user-login',(req, res)=>{
//         res.render("user-login");
//         });

const MONGO_CNT = "mongodb://127.0.0.1:27017/EdX-db";
app.listen(PORT, async () => {
    try {
      await mongoose.connect(MONGO_CNT);
      console.log(" SERVER CONNECTED");
      console.log(`http://localhost:${PORT}`);
      console.log("DB Connected Sucessuflly");
    } catch (err) {
      console.error(err);
    }
  });