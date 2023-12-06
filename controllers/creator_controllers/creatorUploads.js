const couseSchema = require("../../models/course")
const categoryCollection = require("../../models/category")

module.exports.getCreatorUpload = async (req, res) =>{
    try{
        const categories = await categoryCollection.find();
        res.render("creatorCourseUpload", { categories });
        // res.render("creatorCourseUpload")

    }catch(error){
        console.log(error)
    }
}


// module.exports.getCategory = async (req, res) => {
//     try {
//         const categories = await categoryCollection.find();
//         res.render("admin-categorylist", { categories });
//     } catch (error) {
//         console.error(error);
//     }
// };