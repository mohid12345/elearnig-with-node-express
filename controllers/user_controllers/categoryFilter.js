const categoryCollection = require("../../models/category");
const courseCollection = require("../../models/course");
const userCollection = require("../../models/userSchema")

const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const couponCollection = require("../../models/coupons");
require("dotenv").config();

// filter
// module.exports.filterCategory = async(req,res) => {
//   try{
//     const loggedIn = req.cookies.loggedIn;
//     const userData = await userCollection.findOne({email: req.user})
//     const username = userData.username;
//     const categoryId = req.params.categoryId

//     let sortOrder = 0;
//     if (req.query.sort === "desc") {
//       sortOrder = -1;
//     } else if (req.query.sort === "asc") {
//       sortOrder = 1;
//     }

//     const category = await categoryCollection.findById(categoryId)
//     const categoryName = category.catgName

//     if(req.query.sort){
//       const coursedata = await courseCollection
//       .find({ courseCategory: categoryName })
//       .sort({ sellingPrice: sortOrder });
//     } 

//     const coursedata = await courseCollection
//     .find({ courseCategory: categoryName })

//     const courseCount = coursedata.length;
//     const categorydata =  await categoryCollection.find()
//     console.log(coursedata)
//     res.render("user-coursefilter", { loggedIn, username, coursedata, courseCount, categorydata})
//   }catch(error) {
//     console.error("Error:", error);
//   }
// }



module.exports.filterCategory = async (req, res) => {
  try {
    const loggedIn = req.cookies.loggedIn;
    const userData = await userCollection.findOne({ email: req.user });
    const username = userData.username;
    let coursedata;
    let { sort, categories } = req.body;
    console.log("sort",sort);

    sort = (sort == "highToLow") ? 1 : -1;

    const categorydata = await categoryCollection.find({});

    if (sort && categories) {
      const category = await categoryCollection.findById(categories);
      const categoryName = category.catgName;

      coursedata = await courseCollection
        .find({ courseCategory: categoryName })
        .sort({ sellingPrice: sort });
      coursedata = coursedata.filter(course => course.courseStatus !== 'Block');
      const courseCount = coursedata.length;

      res.render("courses", { username, loggedIn, coursedata, categorydata, courseCount });
    } else {
      coursedata = await courseCollection.find({})
        .sort({ courseAmount: sort });
      coursedata = coursedata.filter(course => course.courseStatus !== 'Block');
      const courseCount = coursedata.length;
      console.log(coursedata);
      res.render("courses", { username, loggedIn, coursedata, categorydata, courseCount });
    }
  } catch (error) {
    console.log(error);
  }
};



// search 
module.exports.searchCourses = async(req,res) => {
  try {
    const loggedIn = req.cookies.loggedIn;
    const userData = await userCollection.findOne({email: req.user})
    const username = userData.username;
    const { search_course } = req.body;

      // decoding from token
      const token = req.cookies.token;
      const verifyToken = jwt.verify(
        token, 
        process.env.JWT_SECRET_KEY,
        (err, decoded) => {
          if(err) {
            // return res.redirect ("/login");
            console.log("error")
          }
          req.user = decoded;
        })
    
        const categorydata = await categoryCollection.find();
        const category = categorydata.filter(category => category.categoryStatus !== 'Block');

        let coursedata = await courseCollection.find();
        coursedata = coursedata.filter(course => course.courseStatus !== 'Block');

      if(search_course) {
        const regexPattern = new RegExp(search_course, 'i');
       coursedata = await courseCollection.find({
        $and: [
          {
            $or: [
              { courseName: { $regex: regexPattern } },
              { courseCategory: { $regex: regexPattern } },
              { courseBrand: { $regex: regexPattern } },
            ],
          },
          { courseStatus: 'Unblock' },
        ],
      });
      }
    

      if(req.user){
        const userData = await userCollection.findOne({email:req.user})
        const username = userData.username;
        res.render("courses", { loggedIn, username, coursedata, categorydata: category });
      } else {
        res.render("courses", { loggedIn, coursedata, categorydata: category });
      }

  } catch(error) {
    console.error("Error:", error);
  }
}