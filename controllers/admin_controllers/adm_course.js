const categoryCollection = require("../../models/category")
const courseCollection = require("../../models/course")

//render course list page

module.exports.getCourseList = async(req,res)=>{
    try{
        const coursedata = await courseCollection.find()
        res.render("admin-courselist", {coursedata});
    }
    catch(error){
        console.error(error);
    }
}

// render add course page
module.exports.getAddCourse = async(req,res) => {
    console.log("hey there")
    try {
      const categorydata = await categoryCollection.find();
      const categories = Array.isArray(categorydata)
      ? categorydata
      : [categorydata];
      res.render("admin-addcourse", {categories});
    } catch (error) {
      console.error(error);
    }
  }

  
  // adding course
  module.exports.postCourse = async (req, res) => {
    try {
      if (req.files) {
        const courseImg=req.files;
        let arr = [];
          courseImg.forEach((element) => {
            arr.push({ name: element.filename, path: element.path})
          });
        
          const imageIds = arr.map((courseImg) => courseImg.path)
        
        await courseCollection.create({
          courseName: req.body.courseName,
          courseDiscription: req.body.courseDiscription,
          courseCategory: req.body.courseCategory,
          courseAuthor: req.body.courseAuthor,
          courseAmount: req.body.courseAmount,
          courseDuration: req.body.courseDuration,
          courseLessonNos: req.body.courseLessonNos,
          courseImg: imageIds,
        });
        const coursedata = await courseCollection.find()
        res.render("admin-courselist", {coursedata});
        console.log(imageIds)
      } else {
        res.status(400).send("No images selected for upload");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  
  // delete a course
  module.exports.deleteCourse = async(req,res) => {
    try{
      const courseId = req.params.courseId;
      console.log(courseId)
      const result = await courseCollection.deleteOne({_id:courseId})
      if(result.deletedCount === 1) {
        res.redirect("/admin/course-list")
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
      res.render("admin-editcourse", {coursedata, categorydata})
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
  
  // let sizeSmall=0;
  // let sizeMedium=0;
  // let sizeLarge=0;
  //   if(req.body.sizeSmall){
  //     sizeSmall=req.body.stockSmall
  //   } 
  //   if(req.body.sizeMedium){
  //     sizeMedium=req.body.stockMedium
  //   } 
  //   if(req.body.sizeLarge){
  //     sizeLarge=req.body.stockLarge
  //   } 
  
  //   const sizes=[{
  //     small:sizeSmall,
  //     medium:sizeMedium,
  //     large:sizeLarge,
  //   }]
  
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
      res.redirect('/admin/course-list');
    } catch (error) {
      console.log(error);
      res.redirect("/admin/edit-course", { error: "An error occurred while updating the course, please try again" });
    }
  };