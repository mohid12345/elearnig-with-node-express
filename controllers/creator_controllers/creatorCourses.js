const categoryCollection = require("../../models/category")
const courseCollection = require("../../models/course")
const multer = require("multer")

module.exports.getCreatorUpload = async (req, res) => {
  try {
      const categories = await categoryCollection.find();
      res.render("creatorCourseUpload", { categories });
      // res.render("creatorCourseUpload")
  } catch (error) {
      console.log(error);
  }
};

// adding course
let courseId;
module.exports.postCourse = async (req, res) => {
  try {
      if (req.files) {
          const courseImg = req.files;
          let arr = [];
          courseImg.forEach((element) => {
              arr.push({ name: element.filename, path: element.path });
          });
          const imageIds = arr.map((courseImg) => courseImg.path);

          const newCourse = await courseCollection.create({
              courseName: req.body.courseName,
              courseDiscription: req.body.courseDiscription,
              courseRequirements: req.body.courseRequirements,
              courseForwho: req.body.courseForwho,
              courseCategory: req.body.courseCategory,
              courseAuthor: req.body.courseAuthor,
              courseAmount: req.body.courseAmount,
              courseDuration: req.body.courseDuration,
              courseLessonNos: req.body.courseLessonNos,
              courseImg: imageIds,
          });
          courseId = newCourse._id;

          res.status(200);
      } else {
          res.status(400).send("No images selected for upload");
      }
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
};

//video posting by creator
module.exports.postCourseVideo = async (req, res) => {
  try {
      if (courseId) {
          console.log(courseId);
          if (req.files) {
              const videoUrl = req.cloudinarVideoUrl;
              console.log("url is: ", videoUrl);
              const course = await courseCollection.findById(courseId);

              if (course) {
                  course.courseVid.push({ url: videoUrl });
                  await course.save();
                  res.status(200);
                  const coursedata = await courseCollection.find();
                  res.render("creatorCourselist", { coursedata });
              } else {
                  res.status(404).send("Course not found");
              }
          } else {
              res.status(404).send("No video selected for upload");
          }
      } else {
          res.status(400).send("Invalid courseId");
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
  }
};



//render course list page

module.exports.getCourseList = async(req,res)=>{
    try{
        const coursedata = await courseCollection.find()
        res.render("creatorCourselist", {coursedata});
    }
    catch(error){
        console.error(error);
    }
}

// render add course page
// module.exports.getAddCourse = async(req,res) => {
//     try {
//       const categorydata = await categoryCollection.find();
//       const categories = Array.isArray(categorydata)? categorydata : [categorydata];
//       res.render("creator-addcourse", {categories});
//     } catch (error) {
//       console.error(error);
//     }
//   }
   
  // delete a course
  module.exports.deleteCourse = async(req,res) => {
    try{
      const courseId = req.params.courseId;
      console.log(courseId)
      const result = await courseCollection.deleteOne({_id:courseId})
      if(result.deletedCount === 1) {
        res.redirect("/creator/creator-course-list")
      } else {
        res.status(404).send("Category not found")
      }
    } catch(error) {
      console.error(error);
    }
  }
  
  // render course edit page
  module.exports.editCourse = async(req,res) => {
    try{
      const course = req.params.courseId;
      const coursedata = await courseCollection.findOne({_id:course})
      const categorydata = await categoryCollection.find();
      res.render("creatorEditCourse", {coursedata, categorydata})
      // res.redirect("/creator/creatorEditCourse", {coursedata, categorydata})
    } catch (error) {
      console.log(error);
    }
  }
  
  
  //saving edited details into the db
  module.exports. updateCourse = async (req, res) => {
    try {
      // console.log(editId.courseName)
      const editId = req.params.courseId;
      const existingCourse = await courseCollection.findById(editId);
  
      const {
        courseName,
        courseDiscription,
        courseCategory,
        courseBrand,
        courseAmount,
        courseSize,
        courseStock,
      } = req.body;
  
      // Get newly uploaded photos
      const courseImg = req.files;
      const newPhotos = courseImg.map((element) => ({ name: element.filename, path: element.path }));
      const picPaths=newPhotos.map((photo) => photo.path);
      // Include old photos that weren't edited
      const updatedPhotos = existingCourse.courseImg.map((oldPhoto, index) =>
      picPaths[index] ? picPaths[index] : oldPhoto
      );
      const updatedData = {
        courseName,
        courseDiscription,
        courseCategory,
        courseBrand,
        courseAmount,
        courseSize,
        courseStock,
        courseImg: updatedPhotos,
      };
      const updatedCourse = await courseCollection.findByIdAndUpdate(editId, updatedData, { new: true });
      const successMessage = "Course updated successfully";
      res.redirect('/creator/course-list');
    } catch (error) {
      console.log(error);
      res.redirect("/creator/edit-course", { error: "An error occurred while updating the course, please try again" });
    }
  };