const express = require("express");
const creatorRouter = express.Router(); 
const creatorControllers = require("../controllers/creatorControllers");
const path = require("path");

creatorRouter.get("/creatorLogin",creatorControllers.getCreatorLogin)
creatorRouter.route("/creatorSignup")
.get(creatorControllers.getCreatorSignup)
.post(creatorControllers.postCreatorSignup);

// userRouter.post("/creatorLogin",Controllers.postLogin);



// userRouter.route("/creatorSignup")
// .get(creatorControllers.getCreatorSignup)
// .post(creatorControllers.postCreatorSignup);




module.exports = creatorRouter;

