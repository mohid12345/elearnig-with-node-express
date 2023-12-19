// require("dotenv").config();

// cloudinaryUploadMiddleware.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.API_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
});

console.log(cloudinary.config().cloud_name);
const cloudinaryUploadMiddleware = (courseVid) => async (req, res, next) => {
    try {
        console.log("data 1 is :", req.files); //working
        if (!req.files || !req.files[courseVid]) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.files[courseVid];
        console.log("test 2: ", file);

        // Use Cloudinary's stream API for direct upload
        const result = await cloudinary.uploader
            .upload_stream(
                {
                    resource_type: "video",
                },
                (error, result) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json({ error: "Internal server error" });
                    } else {
                        req.cloudinaryVideoUrl = result.secure_url;
                        next();
                    }
                }
            )
            .end(file.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = cloudinaryUploadMiddleware;
