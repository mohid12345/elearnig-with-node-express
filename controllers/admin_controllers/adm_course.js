const categoryCollection = require("../../models/category");
const courseCollection = require("../../models/course");
const multer = require("multer");

require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.API_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});
console.log(cloudinary.config().cloud_name);

//render course list page

module.exports.getCourseList = async (req, res) => {
    try {
        const coursedata = await courseCollection.find();
        res.render("admin-courselist", { coursedata });
    } catch (error) {
        console.error(error);
    }
};

// render add course page
module.exports.getAddCourse = async (req, res) => {
    try {
        const categorydata = await categoryCollection.find();
        const categories = Array.isArray(categorydata) ? categorydata : [categorydata];
        res.render("admin-addcourse", { categories });
    } catch (error) {
        console.error(error);
    }
};

/////////////////////////////////////////////////////

// module.exports.postCourse = async (req, res) => {
//   try {
//     if (req.files && req.files.courseImg && req.files.courseVid) {
//       const courseImages = req.files.courseImg;
//       const courseVideos = req.files.courseVid;

//       const imageIds = await Promise.all(courseImages.map(uploadToCloudinary));
//       const videoIds = await Promise.all(courseVideos.map(uploadToCloudinary));

//       await courseCollection.create({
//         courseName: req.body.courseName,
//         courseDiscription: req.body.courseDiscription,
//         courseCategory: req.body.courseCategory,
//         courseAuthor: req.body.courseAuthor,
//         courseAmount: req.body.courseAmount,
//         courseDuration: req.body.courseDuration,
//         courseLessonNos: req.body.courseLessonNos,
//         courseImg: imageIds,
//         courseVideo: videoIds,
//       });

//       const coursedata = await courseCollection.find();
//       res.render("admin-courselist", { coursedata });
//     } else {
//       res.status(400).send("No images or videos selected for upload");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// // Function to upload a file to Cloudinary
// async function uploadToCloudinary(file) {
//   try {
//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: 'auto', // 'auto' detects whether it's an image or video
//     });
//     console.log(`File uploaded to Cloudinary: ${result.secure_url}`);
//     return result.secure_url;
//   } catch (error) {
//     console.error(`Error uploading file to Cloudinary: ${error.message}`);
//     throw error;
//   }
// }

//////////////////////////////////////////////////////

// adding course test 0
module.exports.postCourse1 = async (req, res) => {
    try {
        if (req.files) {
            const courseImg = req.body.courseImg;
            // const courseVid = req.files;
            let arr = [];
            courseImg.forEach((element) => {
                arr.push({ name: element.filename, path: element.path });
            });
            // courseVid.forEach((element) => {
            //     arr.push({ name: element.filename, path: element.path });
            // });

            // const videoIds = arr.map((courseImg) => courseImg.path)
            // let arr1 = []
            // courseVid.forEach((element) =>{
            //   arr1.push({ name: element.filename, path: element.path})
            // });

            const imageIds = arr.map((courseImg) => courseImg.path);
            console.log("IMAGE ID" + imageIds);
            // const videoIds = arr.map((courseVid) => courseVid.path);
            // console.log("VIDEO ID" + videoIds);

            await courseCollection.create({
                courseName: req.body.courseName,
                courseDiscription: req.body.courseDiscription,
                courseCategory: req.body.courseCategory,
                courseAuthor: req.body.courseAuthor,
                courseAmount: req.body.courseAmount,
                courseDuration: req.body.courseDuration,
                courseLessonNos: req.body.courseLessonNos,
                courseRequirements: req.body.courseRequirements,
                courseForwho: req.body.courseForwho,
                courseImg: imageIds,
                // courseVid: videoIds,
            });

            const coursedata = await courseCollection.find();
            res.render("admin-courselist", { coursedata });
            console.log(imageIds);
        } else {
            res.status(400).send("No images selected for upload");
        }
    } catch (error) {
        console.log(error);
    }
    const courseVid = req.body.courseVid;

    async function run() {
        try {
            const result = await cloudinary.uploader.upload(courseVid, { resource_type: "video" });
            console.log(`> Result: ${result.secure_url}`);
        } catch (error) {
            console.error(error);
        }
    }
    run();

    // if (courseVid) {
    //     try {
    //         const result = await cloudinary.uploader.upload(courseVid, { resource_type: "video" });
    //         console.log(`> Result: ${result.secure_url}`);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
};

//test 1
// adding course
module.exports.postCourse2 = async (req, res) => {
  try {
      if (req.files) {
          const courseImg = req.files['courseImg'];
          const courseVid = req.files['courseVid'];

          let imgArr = [];
          // let vidArr = [];

          if (courseImg) {
              courseImg.forEach((element) => {
                  imgArr.push({ name: element.filename, path: element.path });
              });
          }

          // if (courseVid) {
          //     courseVid.forEach((element) => {
          //         vidArr.push({ name: element.filename, path: element.path });
          //     });
          // }


          const imageIds = imgArr.map((img) => img.path);
          // const videoIds = vidArr.map((vid) => vid.path);

          console.log("IMAGE IDs: " + imageIds);
          // console.log("VIDEO IDs: " + videoIds);

          // Rest of your logic...
          async function run() {
            try {
                const result = await cloudinary.uploader.upload(courseVid, { resource_type: "video" });
                console.log(`> Result: ${result.secure_url}`);
            } catch (error) {
                console.error(error);
            }
        }
        run();
        if (courseVid) {
        try {
            const result = await cloudinary.uploader.upload(courseVid, { resource_type: "video" });
            console.log(`> Result: ${result.secure_url}`);
        } catch (error) {
            console.error(error);
        }
    }

          await courseCollection.create({
              courseName: req.body.courseName,
              courseDiscription: req.body.courseDiscription,
              courseCategory: req.body.courseCategory,
              courseAuthor: req.body.courseAuthor,
              courseAmount: req.body.courseAmount,
              courseDuration: req.body.courseDuration,
              courseLessonNos: req.body.courseLessonNos,
              courseRequirements: req.body.courseRequirements,
              courseForwho: req.body.courseForwho,
              courseImg: imageIds,
              // courseVid: videoIds,
          });

          const coursedata = await courseCollection.find();
          res.render("admin-courselist", { coursedata });
      } else {
          res.status(400).send("No files selected for upload");
      }
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
};

///////////////test 2


// Controller for handling image and video uploads
exports.postCourse = async (req, res) => {
  try {
    // Handle image uploads (stored locally)
    const courseImg = req.files;

    // Handle video upload to Cloudinary
    const courseVid = req.body.courseVid;

    // Process image uploads
    let imgArr = [];
    if (courseImg) {
      courseImg.forEach((element) => {
        imgArr.push({ name: element.filename, path: element.path });
      });
    }

    // Process video upload to Cloudinary
    let vidArr = [];
    if (courseVid) {
      const result = await cloudinary.uploader.upload(courseVid, { resource_type: 'video' });
      vidArr.push({ name: result.original_filename, path: result.secure_url });
    }

    // Combine image and video data as needed
    const imageIds = imgArr.map((img) => img.path);
    const videoIds = vidArr.map((vid) => vid.path);

    // Create a new course entry in your database
    await courseCollection.create({
      courseName: req.body.courseName,
      courseDiscription: req.body.courseDiscription,
      courseCategory: req.body.courseCategory,
      courseAuthor: req.body.courseAuthor,
      courseAmount: req.body.courseAmount,
      courseDuration: req.body.courseDuration,
      courseLessonNos: req.body.courseLessonNos,
      courseRequirements: req.body.courseRequirements,
      courseForwho: req.body.courseForwho,
      courseImg: imageIds,
      courseVid: videoIds,
    });

    // Redirect or respond as needed
    res.status(200).json({ message: 'Course added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};









// delete a course
module.exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        console.log(courseId);
        const result = await courseCollection.deleteOne({ _id: courseId });
        if (result.deletedCount === 1) {
            res.redirect("/admin/course-list");
        } else {
            res.status(404).send("Category not found");
        }
    } catch (error) {
        console.error(error);
    }
};

// render course edit page
module.exports.editCourse = async (req, res) => {
    try {
        const course = req.params.courseId;
        const coursedata = await courseCollection.findOne({ _id: course });
        const categorydata = await categoryCollection.find();
        res.render("admin-editcourse", { coursedata, categorydata });
    } catch (error) {
        console.log(error);
    }
};

//saving edited details into the db
module.exports.updateCourse = async (req, res) => {
    try {
        // console.log(editId.courseName)
        const editId = req.params.courseId;
        const existingCourse = await courseCollection.findById(editId);

        const { courseName, courseDiscription, courseCategory, courseBrand, courseAmount, courseSize, courseStock } =
            req.body;

        // Get newly uploaded photos
        const courseImg = req.files;
        const newPhotos = courseImg.map((element) => ({ name: element.filename, path: element.path }));
        const picPaths = newPhotos.map((photo) => photo.path);
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
        res.redirect("/admin/course-list");
    } catch (error) {
        console.log(error);
        res.redirect("/admin/edit-course", { error: "An error occurred while updating the course, please try again" });
    }
};
