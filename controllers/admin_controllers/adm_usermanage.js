const userCollection = require("../../models/userSchema")
const mongoosePaginate = require("mongoose-paginate")

pagenate = userCollection.schema.plugin(mongoosePaginate)
// user manage page
//test 0  
// module.exports.getUsers1 = async(req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const perPage = parseInt(req.query.perPage) || 10

//     const users = await userCollection.paginate({},{page, limit: perPage})
//     console.log(users);
//     // res.render('admin-usermanage', { users });

//   } catch(error){
//     console.error(error);
//     res.status(500).send('Internal Server Error')
//   }
// }

//test 1
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