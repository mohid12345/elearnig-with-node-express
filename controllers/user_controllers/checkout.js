const userCollection = require("../../models/userSchema");
const courseCollection = require("../../models/course");
const cartCollection = require("../../models/cart");
const { subtotal } = require("./cartController");
const orderCollection = require("../../models/order");
const couponCollection = require("../../models/coupons")

const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const instance  = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});



// render checkout
module.exports.getCheckout = async (req, res) => {
  try {
    const loggedIn = req.cookies.loggedIn;
    const username = req.cookies.username;

    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const cartDetails = await cartCollection.findOne({ userId: userId }).populate("courses.courseId");
    // const addressDetails = await addressCollection.findOne({userId: userId})

    res.render("userCheckout", { loggedIn, username, cartDetails });
  } catch (error) {
    console.error(error);
  }
};

// grandtotal amount
module.exports.grandtotal = async (req, res) => {
  try {
    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const cartDetails = await cartCollection
      .findOne({ userId: userId })
      .populate("courses.courseId");

    let subtotal = 0;
    for (const courseitem of cartDetails.courses) {
      const course = await courseCollection.findById(courseitem.courseId);
      const courseAmount = parseFloat(course.courseAmount);
      if(!isNaN(courseAmount))
      subtotal += courseAmount;
      // console.log("dat 1: ",subtotal);
    }

    res.json({ success: true, subtotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};





// cash on delivery
module.exports.cashOnDelivery = async (req, res) => {
  try {
    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const cartDetails = await cartCollection.findOne({ userId: userId }).populate('courses.courseId');

    // Check if courseStock is sufficient for each course in the cart
    const stockCheck = cartDetails.courses.every(courseItem => {
      return courseItem.courseId.courseStock >= courseItem.quantity;
    });

    if (!stockCheck) {
      // Redirect to cart if courseStock is insufficient
      return res.redirect('/cart');
    }

    let totalAmount = 0;

    const orderCourses = await Promise.all(cartDetails.courses.map(async (courseItem) => {
      const course = await courseCollection.findById(courseItem.courseId);
      totalAmount += course.sellingPrice * courseItem.quantity;

      // Update courseStock
      course.courseStock -= courseItem.quantity;
      await course.save();

      return {
        courseId: courseItem.courseId,
        price: course.sellingPrice,
        quantity: courseItem.quantity,
      };
    }));

    const paymentMethod = 'Cash On Delivery';
    // const addressId = req.query.selectedAddresses;
    // const address = await addressCollection.findOne({ userId: userId, 'address._id': addressId }, { 'address.$': 1 });

    const userOrder = await orderCollection.create({
      userId,
      courses: orderCourses,
      totalAmount,
      paymentMethod,
    });

     // Delete courses from cart
     await cartCollection.findOneAndDelete({ userId: userId })

    res.status(200).json({ message: "order placed" });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).render('error');
  }
};


// render place order
module.exports.getPlaceOrder = async(req,res) => {
  try{
    const loggedIn = req.cookies.loggedIn;
    const username = req.cookies.username;
    res.render("user-orderplaced",{loggedIn,username})
  }catch(error){
    console.error("error: ", error)
  }
}



// apply coupon
module.exports.applyCoupon = async(req,res) => {
  try{
    const couponCode = req.body.couponCode;
    const totalAmount = req.body.subtotalData;

    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const usedCoupon = await couponCollection.findOne({couponCode: couponCode})
    const minAmount = usedCoupon.minimumPurchase; 
    const currentDate = new Date();

    console.log(totalAmount,usedCoupon.discountAmount);

    if(usedCoupon) {
      if (usedCoupon.redeemedUser.includes(userId)) {
        res.status(200).json({alreadyRedeemed: true, message: "Coupon already redeemed by the user"});
      } else if (usedCoupon.minimumPurchase > totalAmount) {
        res.status(200).json({minimumAmount: true, message: "Minimum Purchase Amount " + minAmount + " required"}); 
      } else if (usedCoupon.status === 'Block') {
        res.status(200).json({blocked:true, message: "coupon is blocked"})
      } else if (
        usedCoupon.expiryDate && usedCoupon.expiryDate.getTime() < currentDate.getTime() 
      ) {
        res.status(200).send({expired: true, message: "coupon is expired"})
      } 
      else {
        // usedCoupon.redeemedUser.push(userId)
        // await usedCoupon.save();

        const couponAmount = parseFloat(usedCoupon.discountAmount)
        const updatedTotal = Math.max(totalAmount - couponAmount)
        console.log(updatedTotal);

        res.status(200).json({
          applied: true,
          message: "Coupon applied successfully",
          couponAmount: couponAmount,
          updatedTotal: updatedTotal.toFixed(2),
          couponCode,
        });
      }
    } else {
      res.status(404).send({ message: "Coupon not found" });
    }
    
  }catch(error){
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// remove coupon
module.exports.removeCoupon = async(req,res) => {
  try {
    const couponCode = req.body.couponCode;
    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const usedCoupon = await couponCollection.findOne({couponCode: couponCode})

    if(usedCoupon){
      const removecoupon = await couponCollection.updateOne(
        {couponCode: couponCode},
        {$pull: { redeemedUser: userId}}
      );
    }
    // res.redirect("/checkout");
    res.status(200).json({message: "coupon removed succussfully"});
  }catch(error){
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}




// razorpay order
module.exports.razorpayOrder = async(req,res) => {
  try{
    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const couponCode = req.body.couponCode;


    console.log("coupon cd",couponCode);
    const cartDetails = await cartCollection.findOne({ userId: userId }).populate('courses.courseId');
    
    // Check if courseStock is sufficient for each course in the cart
    // const stockCheck = cartDetails.courses.every(courseItem => {
    //   return courseItem.courseId.courseStock >= courseItem.quantity;
    // });

    // const statusCheck = cartDetails.courses.every(courseItem => {
    //   return courseItem.courseId.courseStatus !== 'Block';
    // });

    // if (!stockCheck || !statusCheck) {
    //   return res.redirect('/cart');
    // }
    // return res.redirect('/cart');

    // finding amount
    let totalAmount = 0;
    let orderCourses = await Promise.all(cartDetails.courses.map(async (courseItem) => {
      let course = await courseCollection.findById(courseItem.courseId);
      // totalAmount += course.sellingPrice;

      const courseAmount = parseFloat(course.courseAmount);
          if (!isNaN(courseAmount)) {
            totalAmount += courseAmount;
          }
      return {
        courseId: courseItem.courseId,
        price: course.courseAmount,
      };
    }));

    if (couponCode) {
      const usedCoupon = await couponCollection.findOne({ couponCode: couponCode });
      
      if (usedCoupon) {
        
        const minAmount = usedCoupon.minimumPurchase;
        const currentDate = new Date();
        console.log("inside checking", couponCode);
        if (usedCoupon.redeemedUser.includes(userId)) {
          res.status(200).json({ alreadyRedeemed: true, message: "Coupon already redeemed by the user" });
        } 
        else if (usedCoupon.minimumPurchase > totalAmount) {
          res.status(200).json({ minimumAmount: true, message: "Unable use coupon the order price decreased to "+ totalAmount });
        } 
        else if (usedCoupon.status === 'Block') {
          res.status(200).json({ blocked: true, message: "Coupon is blocked" });
        } else if (
          usedCoupon.expiryDate && usedCoupon.expiryDate.getTime() < currentDate.getTime()
        ) {
          res.status(200).send({ expired: true, message: "Coupon is expired" });
        } else {
          

          const couponAmount = parseFloat(usedCoupon.discountAmount);
          totalAmount = Math.max(totalAmount - couponAmount, 0);
          console.log("total amount",totalAmount);


          var options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: "order_rcptid_11",
          };
          
          instance.orders.create(options, function(err, order) {
            if (err) {
              console.error("Razorpay error:", err);
              return res.status(500).json({ success: false, message: "Error creating order" });
            }
          
            console.log("Razorpay Order:", order);
            console.log("Total Amount:", totalAmount);
          
            res.status(200).json({
              success: true,
              message: "order placed",
              totalAmount: totalAmount.toFixed(2),
              order: order,
              orderId: order.id,
            });
          });
          
        }
      } else {
        res.status(404).send({ message: "Coupon not found" });
      }
    } else {


      var options = {
        amount: totalAmount * 100,  
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function(err, order) {
        console.log("orders: ",order);
        console.log("total amount ",totalAmount);

        res.status(200).json({
          success: true, 
          message: "order placed",
          totalAmount: totalAmount.toFixed(2),
          order: order,
          orderId: order.id,
        });
      });

    }

  } catch (error) {
    console.log('Error:', error);
    res.status(500).render('error');
  }
}


// saving razorpay
module.exports.razorpayOrderPlaced = async(req,res) => {
  try{
    const loggedIn = req.cookies.loggedIn;
    const userData = await userCollection.findOne({email: req.user})
    const userId = userData._id;
    const username = userData.username;
    
    const totalAmount = req.query.amount;
    const couponCode = req.query.couponCode;
    
    const cartDetails = await cartCollection.findOne({ userId: userId }).populate('courses.courseId');
    
    // if(couponCode){
      //   const usedCoupon = await couponCollection.findOne({ couponCode: couponCode });
      //   if(usedCoupon){
        //     usedCoupon.redeemedUser.push(userId)
        //     await usedCoupon.save();
        //   }
        // }
        console.log("finally....");
        
        const orderCourses = await Promise.all(cartDetails.courses.map(async (courseItem) => {
          const course = await courseCollection.findById(courseItem.courseId);
          // Update courseStock
          // course.courseStock -= courseItem.quantity;
          await course.save();
          
          return {
            courseId: courseItem.courseId,
            price: course.courseAmount,
            // quantity: courseItem.quantity,
          };
        }));
        
      const paymentMethod = 'Online payment';
      const paymentStatus = 'Success';

      const userOrder = await orderCollection.create({
        userId,
        courses: orderCourses,
        totalAmount,
        paymentMethod,
        paymentStatus,
      });

      // Delete courses from cart
      await cartCollection.findOneAndDelete({ userId: userId });

    
    res.render("user-orderplaced",{loggedIn,username})
  }catch (error) {
    console.log('Error:', error);
    res.status(500).render('error');
  }
}


// // wallet pay
// module.exports.walletPay = async(req, res) => {
//   try{

//     const userData = await userCollection.findOne({ email: req.user });
//     const userId = userData._id;
//     console.log("userid",userId);
//     const cartDetails = await cartCollection.findOne({ userId: userId }).populate('courses.courseId');

//     const walletData = await walletCollection.findOne({userId: userId});
//     console.log("walletdata: ",walletData);
//     const walletAmout = walletData.amount;
    
//     const couponCode = req.body.couponCode;
//     const addressId = req.body.selectedAddresses;
//     const address = await addressCollection.findOne({ userId: userId, 'address._id': addressId }, { 'address.$': 1 });

//     console.log(couponCode,addressId);
  
    
//     // Check if courseStock is sufficient for each course in the cart
//     const stockCheck = cartDetails.courses.every(courseItem => {
//       return courseItem.courseId.courseStock >= courseItem.quantity;
//     });

//     const statusCheck = cartDetails.courses.every(courseItem => {
//       return courseItem.courseId.courseStatus !== 'Block';
//     });

//     if (!stockCheck || !statusCheck) {  
//       return res.redirect('/cart');
//     }

//     let totalAmount = 0;
//     let orderCourses = await Promise.all(cartDetails.courses.map(async (courseItem) => {
//       let course = await courseCollection.findById(courseItem.courseId);
//       totalAmount += course.sellingPrice * courseItem.quantity;

//       return {
//         courseId: courseItem.courseId,
//         price: course.sellingPrice,
//         quantity: courseItem.quantity,
//       };
//     }));
    


//   if (couponCode) {
//     const usedCoupon = await couponCollection.findOne({ couponCode: couponCode });
    
//     if (usedCoupon) {
      
//       const minAmount = usedCoupon.minimumPurchase;
//       const currentDate = new Date();
//       console.log("inside checking", couponCode);
//       if (usedCoupon.redeemedUser.includes(userId)) {
//         res.status(200).json({ alreadyRedeemed: true, message: "Coupon already redeemed by the user" });
//       } 
//       else if (usedCoupon.minimumPurchase > totalAmount) {
//         res.status(200).json({ minimumAmount: true, message: "Unable use coupon the order price decreased to "+ totalAmount });
//       } 
//       else if (usedCoupon.status === 'Block') {
//         res.status(200).json({ blocked: true, message: "Coupon is blocked" });
//       } else if (
//         usedCoupon.expiryDate && usedCoupon.expiryDate.getTime() < currentDate.getTime()
//       ) {
//         res.status(200).send({ expired: true, message: "Coupon is expired" });
//       } else {

//         const couponAmount = parseFloat(usedCoupon.discountAmount);
//         totalAmount = Math.max(totalAmount - couponAmount, 0);
//         console.log("total amount",totalAmount);

//         if(totalAmount <= walletAmout){

//           let orderCourses = await Promise.all(cartDetails.courses.map(async (courseItem) => {
//             let course = await courseCollection.findById(courseItem.courseId);
//             // Update courseStock
//             course.courseStock -= courseItem.quantity;
//             await course.save();
      
//             return {
//               courseId: courseItem.courseId,
//               price: course.sellingPrice,
//               quantity: courseItem.quantity,
//             };
//           }));
          
//           const paymentMethod = 'Wallet';
//           const paymentStatus = 'Success';

//           const userOrder = await orderCollection.create({
//             userId,
//             courses: orderCourses,
//             orderDate: new Date(),
//             totalAmount,
//             paymentMethod,
//             paymentStatus,
//             address,
//           });
//           // Delete courses from cart
//           await cartCollection.findOneAndDelete({ userId: userId });
//           // res.status(200).json({ message: "order placed" });

//           usedCoupon.redeemedUser.push(userId)
//           await usedCoupon.save();

//           // Subtract totalAmount from the walletAmount
//           await walletCollection.findOneAndUpdate(
//             { userId },
//             { $inc: { amount: -totalAmount } }
//           );

//           res.status(200).json({
//             applied: true,
//             message: "Coupon applied successfully",
//             couponAmount: couponAmount,
//             totalAmount: totalAmount.toFixed(2),
//           });
//         } else {
//           res.status(200).json({excessAmount: true, message: "you have only " + walletAmout + " in your wallet"})
//           }

//       }
//     } else {
//       res.status(404).send({ message: "Coupon not found" });
//     }
//   } else {

//     if(totalAmount <= walletAmout){

//       const orderCourses = await Promise.all(cartDetails.courses.map(async (courseItem) => {
//         const course = await courseCollection.findById(courseItem.courseId);
//         // totalAmount += course.sellingPrice * courseItem.quantity;
//         // Update courseStock
//         course.courseStock -= courseItem.quantity;
//         await course.save();

//         return {
//           courseId: courseItem.courseId,
//           price: course.sellingPrice,
//           quantity: courseItem.quantity,
//         };
//       }));
//       const paymentMethod = 'Wallet';
//       const paymentStatus = 'Success'

//       const userOrder = await orderCollection.create({
//         userId,
//         courses: orderCourses,
//         orderDate: new Date(),
//         totalAmount,
//         paymentMethod,
//         paymentStatus,
//         address,
//       });
//       // Delete courses from cart
//       await cartCollection.findOneAndDelete({ userId: userId });

//       // Subtract totalAmount from the walletAmount
//       await walletCollection.findOneAndUpdate(
//         { userId },
//         { $inc: { amount: -totalAmount } }
//       );

//       res.status(200).json({applied: true, message: "order placed" });
//     } else {
//         res.status(200).json({excessAmount: true, message: "you have only " + walletAmout + " in your wallet"})
//       }
//   }



//   } catch(error){
//     console.error("error: ", error)
//   }
// }

// render place order page
module.exports.getPlaceOrder = async(req,res) => {
  try{
    const loggedIn = req.cookies.loggedIn;
    const userData = await userCollection.findOne({email: req.user})
    const userId = userData._id;
    const username = userData.username;
    
    res.render("user-orderplaced",{loggedIn,username})
  } catch(error){
    console.error("error: ", error)
  }
}



// apply coupon
module.exports.applyCoupon = async(req,res) => {
  try{
    const couponCode = req.body.couponCode;
    const totalAmount = req.body.subtotalData;

    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const usedCoupon = await couponCollection.findOne({couponCode: couponCode})
    const minAmount = usedCoupon.minimumPurchase; 
    const currentDate = new Date();

    console.log(totalAmount,usedCoupon.discountAmount);

    if(usedCoupon) {
      if (usedCoupon.redeemedUser.includes(userId)) {
        res.status(200).json({alreadyRedeemed: true, message: "Coupon already redeemed by the user"});
      } else if (usedCoupon.minimumPurchase > totalAmount) {
        res.status(200).json({minimumAmount: true, message: "Minimum Purchase Amount " + minAmount + " required"}); 
      } else if (usedCoupon.status === 'Block') {
        res.status(200).json({blocked:true, message: "coupon is blocked"})
      } else if (
        usedCoupon.expiryDate && usedCoupon.expiryDate.getTime() < currentDate.getTime() 
      ) {
        res.status(200).send({expired: true, message: "coupon is expired"})
      } 
      else {
        // usedCoupon.redeemedUser.push(userId)
        // await usedCoupon.save();

        const couponAmount = parseFloat(usedCoupon.discountAmount)
        const updatedTotal = Math.max(totalAmount - couponAmount)
        console.log(updatedTotal);

        res.status(200).json({
          applied: true,
          message: "Coupon applied successfully",
          couponAmount: couponAmount,
          updatedTotal: updatedTotal.toFixed(2),
          couponCode,
        });
      }
    } else {
      res.status(404).send({ message: "Coupon not found" });
    }
    
  }catch(error){
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// remove coupon
module.exports.removeCoupon = async(req,res) => {
  try {
    const couponCode = req.body.couponCode;
    const userData = await userCollection.findOne({ email: req.user });
    const userId = userData._id;
    const usedCoupon = await couponCollection.findOne({couponCode: couponCode})

    if(usedCoupon){
      const removecoupon = await couponCollection.updateOne(
        {couponCode: couponCode},
        {$pull: { redeemedUser: userId}}
      );
    }
    // res.redirect("/checkout");
    res.status(200).json({message: "coupon removed succussfully"});
  }catch(error){
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}






