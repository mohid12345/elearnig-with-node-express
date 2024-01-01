const mongoose = require("mongoose")
const orderCollection = require("../../models/order");
const userCollection = require("../../models/userSchema");
const courseCollection = require("../../models/course");

// render order manage page
module.exports.getOrderlist = async(req,res) => {
  try{
    const orderDetails = await orderCollection.find().populate('courses.courseId').populate('userId');
    res.render("admin-orderlist",{ orderDetails})
  }catch (error) {
    console.error("Error:", error)
  }
}

// render order details page
module.exports.getOrdermanage = async(req,res) => {
  try{
    const orderId = req.params.orderId
    const orderDetails = await orderCollection.findById({_id: orderId}).populate('courses.courseId').populate('userId');;
    res.render("admin-ordermanage",{ orderDetails })
  }catch (error) {
    console.error("Error:", error)
  }
}

// dispatch order
module.exports.dispatchOrder = async(req,res) => {
  try{
    const orderId = req.query.orderId
    const orderData = await orderCollection.findById(orderId)

    orderData.orderStatus = "Shipped";
    await orderData.save();

    res.status(200).json({message: "The order is shipped"})
  }catch(error){
    console.error("Error:", error)
  }
}

// deliver order
module.exports.deliverOrder = async(req,res) => {
  try{
    const orderId = req.query.orderId
    const orderData = await orderCollection.findById(orderId)

    orderData.orderStatus = "Delivered";
    orderData.paymentStatus = "Success";
    orderData.deliveryDate = Date.now();
   
    const expiryDate = new Date(orderData.deliveryDate);
    expiryDate.setDate(expiryDate.getDate() + 2);

    orderData.expiryDate = expiryDate; 

    await orderData.save();

    res.status(200).json({message: "The order is delivered"})
  }catch(error){
    console.error("Error:", error)
  }
}

// cancel order
module.exports.cancelOrder = async(req,res) => {
  try{
    const orderId = req.query.orderId;
    const orderData = await orderCollection.findById(orderId);
    const courseIds = orderData.courses.map((course) => course.courseId);
    const courseData = await courseCollection.find({_id: { $in: courseIds }});

    // Iterate over each course in courseData
    for(const course of courseData) {
      // Find the corresponding order course
      const orderCourse = orderData.courses.find((orderCourse) => 
        orderCourse.courseId.equals(course._id)
      );

      // Update courseStock based on the order quantity
      course.courseStock += orderCourse.quantity;

      // Save the updated course
      await course.save();
    }

    // save the order status
    orderData.orderStatus = "Cancelled";
    await orderData.save();

    res.status(200).json({message: "The order is cancelled"})
    
  } catch(error){
    console.error("Error:", error)
    res.status(500).json({error: "Error found while cancelling course"});
  }
}

module.exports.getSalesReport = async(req, res) => {
  try{
  const orderData =  await orderCollection.find({paymentStatus : "Success",});
  res.render("admin-salesreport",{orderData});
} catch(error){
  console.log("Error: ", error);
}
}

//sales report filtering
module.exports.filterSales = async(req,res) => {
  try {
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    // console.log("2222222222: ",startDate, endDate);

    const orderData = await orderCollection.find({
      paymentStatus : "Success",
      createdAt: { $gte: startDate, $lte: endDate },
    });

    res.render("admin-salesreport", { orderData });
  } catch(error) {
    console.log("Error: ", error)
  }
}