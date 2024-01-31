const categoryCollection = require("../../models/category");
const courseCollection = require("../../models/course");
const multer = require("multer");
const mongoose = require("mongoose")

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


// adding course test 0
let courseId
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

//video upload course 0
module.exports.postCourseVideo = async (req, res) => {
    try {
        if (courseId) {
            console.log(courseId);
            if (req.files) {
                const videoUrls = req.cloudinaryVideoUrls; // Fix the property name
                console.log("urls are: ", videoUrls);

                const course = await courseCollection.findById(courseId);

                if (course) {
                    // Assuming courseVid is an array in your schema
                    videoUrls.forEach((url) => {
                        course.courseVid.push({ url });
                    });

                    await course.save();

                    // res.status(200);
                    return res.status(200).json({ success: true, message: 'Videos uploaded successfully' });
                    // res.status(200).send("Videos uploaded successfully");
                    const coursedata = await courseCollection.find();
                    res.render("admin-courselist", { coursedata });
                } else {
                    res.status(404).json({ success: false, message: 'No videos uploaded accessable' });
                }
            } else {
                return res.status(400).json({ success: false, message: 'No videos uploaded' });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Invalid courseId' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
