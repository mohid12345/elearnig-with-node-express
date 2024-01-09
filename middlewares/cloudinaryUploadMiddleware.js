const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.API_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

// console.log("dat 1 : ",cloudinary.config().cloud_name);

const cloudinaryUploadMiddleware = (courseVid) => async (req, res, next) => {
    try {
        // console.log("data 2 is :", req.files);
        // console.log("data 3 is :", req.files[courseVid]);

        if (!req.files || !req.files[courseVid]) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const files = Array.isArray(req.files[courseVid]) ? req.files[courseVid] : [req.files[courseVid]];
        //check req. object contain array with key courseVid and if not array (?) then will be converted to array
        // console.log("dat 3.1 is : ",files);

        const uploadedVideoUrls = [];

       //promise was not working so moved to async 
       for(const file of files) {
        const result = await new Promise((res, rej) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'video' },
            (error, result) => {
                if (error) {
                    console.error(error);
                    rej(error);
                } else {
                    res(result.secure_url);
                }
            }
        ).end(file.data);
    });

    uploadedVideoUrls.push(result);
}

        req.cloudinaryVideoUrls = uploadedVideoUrls;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = cloudinaryUploadMiddleware;
