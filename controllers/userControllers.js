const userCollection = require("../models/userSchema");

module.exports.getUserRoute = (req, res) => {
  if (req.session.user) {
    // res.redirect("/user/main");
    res.redirect("userDashboard")
  } else {
    // res.render("main");
    res.render("main");
    
// res.render("about");
// });
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
  }
  };

// module.exports.postLogin = async (req, res) => {
//   if (req.session.user){
//   const data = await userCollection.findOne({ email: req.body.email });
//   if (data) {
//     if (req.body.email !== data.email) {
//       res.render("userLogin", { subreddit: "incorrect email" });
//     } else if (req.body.password !== data.password) {
//       res.render("userLogin", { subreddit: "incorrect password" });
//     } else {
//       if (req.body.email == data.email && req.body.password == data.password) {
//         req.session.user = data.email;
//         const user = req.session.user;
//         res.render("userDashboard", { user });
//       }
//     }
//   } else {
//     res.redirect("/");
//   }
// }
// }

//postLogin start

module.exports.postLogin = async (req, res) => {
  if (req.session.user) {
    // The user is already logged in, redirect them to their dashboard
    return res.redirect("userDashboard");
  }

  const { email, password } = req.body;
  try {
    const user = await userCollection.findOne({ email }); //find email from db 

    if (!user) {
      return res.render("userLogin", { error: "Incorrect email" });
    }

    // Compare the hashed password
    // if (user.password !== password) {
    //   return res.render("userLogin", { error: "Incorrect password" });

    // compare hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.render('userLogin', { error: 'Incorrect password' });
    }  
 

    req.session.user = user.email;
    return res.redirect("userDashboard");
  } catch (error) {
    console.error("Login error:", error);
    return res.render("errorPage", { error: "An error occurred during login" });
  }
};


module.exports.getUserDashboard = (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    res.render("userDashboard", { user });
  }
};

module.exports.getUserLogout = (req, res) => {
  req.session.user = null;
  // console.log(req.session);
  // res.redirect("/user");
  res.render("main");
};

module.exports.getUserSignup = (req, res) => {
  res.render("userSignup");
};

module.exports.postUserSignup = async (req, res) => {
  const data = await userCollection.findOne({ email: req.body.email });
  if (data) {
    res.render("userSignup", {
      error: "User With this email Already Exist try with different Email",
    });
  } else {
    await userCollection.create({
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      password: req.body.password,
    });
    res.redirect("/");
  }
};
