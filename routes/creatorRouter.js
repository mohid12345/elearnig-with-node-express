const express = require("express");
const creatorRouter = express.Router(); 
const creatorControllers = require("../controllers/creator_controllers/creatorControllers");
const path = require("path");

// creatorRouter.get("/creatorLogin",creatorControllers.getCreatorLogin)
// creatorRouter.post("/creatorLogin",creatorControllers.postCreatorLogin)
creatorRouter.route("/creatorLogin")
.get(creatorControllers.getCreatorLogin)
.post(creatorControllers.postCreatorLogin)

creatorRouter.route("/creatorSignup")
.get(creatorControllers.getCreatorSignup)
.post(creatorControllers.postCreatorSignup)

creatorRouter.get("/creatorLogout", creatorControllers.creatorLogout)

// userRouter.post("/creatorLogin",Controllers.postLogin);



// userRouter.route("/creatorSignup")
// .get(creatorControllers.getCreatorSignup)
// .post(creatorControllers.postCreatorSignup);




module.exports = creatorRouter;

