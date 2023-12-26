const mongoose = require("mongoose")
const orderCollection = require("../../models/order");
const userCollection = require("../../models/userSchema");
const courseCollection = require("../../models/course");
const couponCollection = require("../../models/coupons");


// render coupon list 
module.exports.getCouponlist = async(req,res) => {
  try{
    const coupons = await couponCollection.find()
    res.render("admin-couponlist", { coupons })
  }catch(error){
    console.error("Error: ", error);
  }
}

// render add coupon page
module.exports.addCoupon = async(req,res) => {
  try{
    res.render("admin-addcoupon")
  }catch(error){
    console.error("Error: ", error);
  }
} 

// save coupon
module.exports.postCoupon = async(req,res) => {

  const couponCode = req.body.couponCode;
  const description = req.body.description;
  const discountAmount = req.body.discountAmount;
  const minimumPurchase = req.body.minimumPurchase;
  const expiryDate = req.body.expiryDate;
  const status = req.body.status;

  try{
    await couponCollection.create({
      couponCode: couponCode,
      description: description,
      discountAmount: discountAmount,
      minimumPurchase: minimumPurchase,
      expiryDate: expiryDate,
      status: status,
    })
    
    res.redirect("/admin/coupon-list")
  }catch(error){
    console.error("Error: ", error);
  }
}

// render coupon edit
module.exports.editCoupon = async(req,res) => {
  try{
    const couponId = req.params.couponId;
    const coupon = await couponCollection.findById({_id: couponId})
    res.render("admin-editcoupon", {coupon})
  }catch(error){
    console.error("Error: ", error);
  }
}

// save edited coupon
module.exports.postEditcoupon = async(req,res) => {
  try{
    const couponId = req.params.couponId
    const coupon = await couponCollection.findById(couponId)
    coupon.couponCode = req.body.couponCode;
    coupon.description = req.body.description;
    coupon.discountAmount = req.body.discountAmount;
    coupon.minimumPurchase = req.body.minimumPurchase;
    coupon.expiryDate = req.body.expiryDate;
    coupon.status = req.body.status;
    await coupon.save();

    res.redirect("/admin/coupon-list")
  }catch(error){
    console.error("Error: ", error);
  }
}

// block category
module.exports.blockCoupon = async (req,res) => {
  try {
    const couponId = req.params.couponId
    const updatedStatus = await couponCollection.updateOne({_id: couponId}, {$set: {status: "Block"}})
    res.redirect('/admin/coupon-list')
  } catch (error) {
    console.error(error)
  }
}

// unblock category
module.exports.unblockCoupon = async (req,res) => {
  try {
    const couponId = req.params.couponId
    const updatedStatus = await couponCollection.updateOne({_id: couponId}, {$set: {status: "Unblock"}})
    res.redirect('/admin/coupon-list')
  } catch (error) {
    console.error(error)
  }
}
