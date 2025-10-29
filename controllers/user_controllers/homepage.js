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

  // Courses page with filtering, sorting, and pagination
module.exports.getUserRoute_Course = async (req,res) => {
    try {
      const loggedIn = req.cookies.loggedIn;
      const categorydata = await categoryCollection.find();

      // Query params
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit || '9', 10), 1), 48);
      const sortParam = req.query.sort || null; // 'lowToHigh' | 'highToLow' | null
      const selectedCategories = req.query.categories
        ? (Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories])
        : null;

      // Build filter
      let filter = {};
      if (selectedCategories && selectedCategories.length > 0) {
        const categoryDocs = await categoryCollection.find({ _id: { $in: selectedCategories } });
        const names = categoryDocs.map(c => c.catgName);
        filter.courseCategory = { $in: names };
      }

      // Build sort
      let sort = {};
      if (sortParam === 'lowToHigh') sort = { courseAmount: 1 };
      else if (sortParam === 'highToLow') sort = { courseAmount: -1 };

      const totalCount = await courseCollection.countDocuments(filter);
      const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
      const safePage = Math.min(page, totalPages);

      const coursedata = await courseCollection
        .find(filter)
        .sort(sort)
        .skip((safePage - 1) * limit)
        .limit(limit);

      res.render("courses", {
        loggedIn,
        coursedata,
        categorydata,
        categories: selectedCategories,
        sort: sortParam,
        page: safePage,
        totalPages,
        limit,
        totalCount,
      });
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
  