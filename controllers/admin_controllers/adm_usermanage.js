const userCollection = require("../../models/userSchema")


// user manage page
module.exports.getUsers = async(req,res) => {
  try {
    const usercollection = await userCollection.find()
    res.render("admin-usermanage", {usercollection})
  } catch(error) {
    console.error(error)
  }
}

// block user
module.exports.blockUser = async(req,res) => {
  try {
    const Iduser = req.params.userId
    const newStatus = await userCollection.findById({_id:Iduser})
    const updatedStatus = await userCollection.updateOne({_id:Iduser},{$set:{status:"Block"}})
    res.redirect("/admin/admin-usermanage") 
  } catch (error) {
    console.error(error)
  }
}

// unblock user
module.exports.unblockUser = async(req,res) => {
  try {
    const Iduser = req.params.userId
    const newStatus = await userCollection.findById({_id:Iduser})
    const updatedStatus = await userCollection.updateOne({_id:Iduser},{$set:{status:"unblocked"}})
    res.redirect("/admin/admin-usermanage") 
  } catch (error) {
    console.error(error)
  }
}