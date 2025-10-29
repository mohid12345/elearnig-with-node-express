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

    // Normalize inputs (support existing POST form, then redirect to GET with query)
    let { sort, categories } = req.body;
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (categories) {
      const arrayCats = Array.isArray(categories) ? categories : [categories];
      arrayCats.forEach(c => params.append('categories', c));
    }
    return res.redirect(`/courses?${params.toString()}`);
  } catch (error) {
    console.log(error);
    res.redirect('/courses');
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
        
        let coursedata = await courseCollection.find();
        
console.log(search_course);
      if(search_course) {
        const regexPattern = new RegExp(search_course, 'i');
       coursedata = await courseCollection.find({
        $and: [
          {
            $or: [
              { courseName: { $regex: regexPattern } },
              { courseCategory: { $regex: regexPattern } },
              { courseAuthor: { $regex: regexPattern } },
            ],
          },
        ],
      });
      console.log("hey 111",coursedata);
      }
    

      if(req.user){
        const userData = await userCollection.findOne({email:req.user})
        const username = userData.username;
        res.render("courses", { loggedIn, username, coursedata, categorydata });
      } else {
        res.render("courses", { loggedIn, coursedata, categorydata });
      }

  } catch(error) {
    console.error("Error:", error);
  }
}