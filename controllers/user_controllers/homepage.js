const courseCollection = require("../../models/course")

//for homepage
module.exports.getUserRoute = async(req, res) => {
    try{
        const loggedIn = req.cookies.loggedIn;
        const courseData = await courseCollection.find()
        // console.log(userRouter.locals); - this is  a express data storages systerm to further use
        res.render("main",{loggedIn, courseData});
    }catch(error){
    console.error(error);
}
}

//  getting course/course page
module.exports.getUserRoute_Course = async (req,res) => {
    try {
      const loggedIn = req.cookies.loggedIn;
      const coursedata = await courseCollection.find()
      // const unblockedCourses = coursedata.filter(course => course.courseStatus !== 'Block');
      // res.render("courses", {loggedIn, coursedata: unblockedCourses});
      res.render("courses", {loggedIn, coursedata});
    } catch (error) {
      console.error(error);
    }
  }
  
//logout
module.exports.getLogout = (req,res) => {
    res.clearCookie("token");
    res.clearCookie("loggedIn");
    res.redirect("/")
  }
  