const courseCollection = require("../../models/course");
const categoryCollection = require("../../models/category");

//for homepage
module.exports.getUserRoute = async(req, res) => {
    try{
        const loggedIn = req.cookies.loggedIn;
        const courseData = await courseCollection.find()
        const userName = req.cookies.username;
        const categoryData = await categoryCollection.find();
        // console.log(userRouter.locals); - this is  a express data storages systerm to further use
        res.render("main",{loggedIn,userName,courseData,categoryData});
    }catch(error){
    console.error(error);
}
}

//  getting course/course page
// module.exports.getUserRoute_Course = async (req,res) => {
//     try {
//       const {startIndex , endIndex } = req.pagination;
//       const users = data.slice(startIndex , endIndex);
//       res.json({ users , total: data.length});
      
//       const loggedIn = req.cookies.loggedIn;
//       const coursedata = await courseCollection.find()
//       res.render("courses", {loggedIn, coursedata});
//     } catch (error) {
//       console.error(error);
//     }
//   }

  // test 0
module.exports.getUserRoute_Course = async (req,res) => {
    try {
      // const {startIndex , endIndex } = req.pagination;
      // const users = data.slice(startIndex , endIndex);
      // res.json({ users , total: data.length});

      const loggedIn = req.cookies.loggedIn;
      const coursedata = await courseCollection.find()
      const categorydata = await categoryCollection.find();
      res.render("courses", {loggedIn, coursedata, categorydata,categories:null,sort:null});
    } catch (error) {
      console.error(error);
    }
  }
//getting About page
module.exports.getUserRoute_About = async(req, res)=> {
  try {
    const loggedIn = req.cookies.loggedIn;
    res.render("about", {loggedIn})
  } catch (error) {
    console.log(error);
  }
}
//getting Contact page
module.exports.getUserRoute_Contact = async(req, res) =>{
  try{
  const loggedIn = req.cookies.loggedIn
  res.render("contact", {loggedIn})
} catch (error) {
  console.log(error);
}
}
  
//logout
module.exports.getLogout = (req,res) => {
    res.clearCookie("token");
    res.clearCookie("loggedIn");
    res.redirect("/")
  }
  