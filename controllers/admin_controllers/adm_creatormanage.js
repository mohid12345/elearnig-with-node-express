const creatorCollection = require("../../models/creatorSchema")


// user manage page
module.exports.getCreator = async(req,res)=>{
try {
    const creatorcollection = await creatorCollection.find()
    res.render("admin-creatormanage",{creatorcollection})
} catch(error) {
    console.error(error)
}
}

//admin-block creator
module.exports.blockCreator = async(req,res)=>{
  try{
const Idcreator = req.params.creatorId
const newStatus = await creatorCollection.findById({_id:Idcreator})
const updatedStatus = await creatorCollection.updateOne({_id:Idcreator},{$set:{status:"Block"}})
res.redirect("/admin/admin-creatormanage")
  }
  catch(error){
    console.error(error)
  }
}

//unblock creator

module.exports.unblockCreator = async(req,res)=>{
  try{
const Idcreator = req.params.creatorId 
const newStatus = await creatorCollection.findById({_id:Idcreator})
const updateStatus = await creatorCollection.updateOne({_id: Idcreator},{$set:{status:"unblocked"}})
res.redirect("/admin/admin-creatormanage")
  } catch(error) {
    console.error(error)
  }
}

// // unblock user
// module.exports.unblockUser = async(req,res) => {
//   try {
//     const Iduser = req.params.userId
//     const newStatus = await userCollection.findById({_id:Iduser})
//     const updatedStatus = await userCollection.updateOne({_id:Iduser},{$set:{status:"unblocked"}})
//     res.redirect("/admin/admin-usermanage") 
//   } catch (error) {
//     console.error(error)
//   }
// }