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

const PORT = process.env.PORT || 3000;

app.use(nocache());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set("views","./views");
app.set("views", path.join(__dirname, "views","user"));
app.use(express.static("public"));
app.use(
    session({
    secret: uuidv4(),
    resave: false,
    saveUninitalise: false,
})
);

//setting up route handlers
app.use("/admin",adminRouter);
app.use("/user", userRouter);
app.use("/creator",creatorRouter);


//route handling
app.get('/',(req, res)=>{
    res.render("main");

    // if(req.session.user){
    //     res.redirect("/user/userDashboard");
    // }else if (req.session.admin){
    //     res.redirect("/admin/adminDashboard");
    // }else{
    //     res.render("main");
    // }
});
app.get('/about',(req, res)=>{
res.render("about");
});
app.get('/courses',(req, res)=>{
res.render("courses");
});
app.get('/contact',(req, res)=>{
res.render("contact");
});
app.get('/contact',(req, res)=>{
    res.render("contact");
    });
    app.get('/user-login',(req, res)=>{
        res.render("user-login");
        });

app.listen(PORT, ()=>{
    
    console.log("server started");
    console.log(`app is listning on the port http://localhost:${PORT}`);
    
});
