const express = require("express");
const userRouter = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
userRouter.use(cookieParser());

const paginationMiddleware = require("../middlewares/paginat_middleware")
const userMiddleware = require("../middlewares/user_authentication");
const userControllers = require("../controllers/user_controllers/userControllers");
const otpVerification = require("../controllers/user_controllers/otpVerification");
const userForget = require("../controllers/user_controllers/userForget");
const homepageControll = require("../controllers/user_controllers/homepage");
const loginControll = require("../controllers/user_controllers/login");
const courseControll = require("../controllers/user_controllers/coursedetails");
const wishlistControl = require("../controllers/user_controllers/wishlistCntrol");
const cartControl = require("../controllers/user_controllers/cartController")
const accountControll = require("../controllers/user_controllers/account")
const checkoutControll = require("../controllers/user_controllers/checkout")
const filterControll = require("../controllers/user_controllers/categoryFilter");
const path = require("path");

userRouter.use("/uploads", express.static("uploads"));

//homepage routes
userRouter.get("/", homepageControll.getUserRoute);
userRouter.get("/userLogout", homepageControll.getLogout);

//userlogin
userRouter.get("/userLogin", (req, res) => {
    res.render("userLogin");
});
userRouter.post("/userLogin", loginControll.postLogin);
userRouter.get("/userForgetPwd", loginControll.getForgetPwd);



//for sign-up page
userRouter.get("/send-otp", otpVerification.getSendOtp);
userRouter.post("/verify-otp", otpVerification.postVerifyOtp);

//forgetpasswordRoutes
//set as same script for signup
userRouter.get("/forget-send-otp", userForget.getSendOtp);
userRouter.post("/forget-verify-otp", userForget.postVerifyOtp);
userRouter.post("/userForgetSubmit", userForget.postSubmitOtp);


userRouter.route("/userSignup").get(userControllers.getUserSignup).post(userControllers.postUserSignup);

// userRouter.get("/course-details/:courseId", userMiddleware.verifyUser, courseControll.courseDetails)
userRouter.get("/course-details/:courseId", courseControll.courseDetails);

// Render the about page
userRouter.get("/about", homepageControll.getUserRoute_About);
// Router the course page
// userRouter.get("/courses",paginationMiddleware(10), homepageControll.getUserRoute_Course);
userRouter.get("/courses", homepageControll.getUserRoute_Course);
// Render the contact page
userRouter.get("/contact", homepageControll.getUserRoute_Contact);
// Render the contact page

//Rendering the wishlist page
userRouter.get("/userWishlist",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.getWishlistPage);
userRouter.post("/addWishlist",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.postWishlistPage);
userRouter.get("/delete-wishlist",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.deleteWishlist);
userRouter.post("/addCartFrom",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,wishlistControl.postCartPageFrom);


//Renderign the cart page
userRouter.get("/userCart",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cartControl.getCartPage);
userRouter.post("/addCart",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cartControl.postCartPage);
userRouter.get("/delete-cart",userMiddleware.verifyUser,userMiddleware.checkBlockedStatus,cartControl.deleteCart);
userRouter.get("/get-subtotal", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, cartControl.subtotal)


//checkout 
userRouter.get("/userCheckout", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.getCheckout)
userRouter.get("/get-grandtotal", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.grandtotal)
userRouter.post("/add-coupon", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.applyCoupon)
userRouter.post("/remove-coupon", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.removeCoupon)
userRouter.get("/order-placed", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.getPlaceOrder)
userRouter.post("/cashOnDelivery", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.cashOnDelivery)
userRouter.post("/razorpay", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.razorpayOrder)
userRouter.get("/razorpayorder-placed", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.razorpayOrderPlaced)
// userRouter.post("/walletPay", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, checkoutControll.walletPay)




//account
userRouter.get("/userAccount", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getUserAccount)
userRouter.get("/get-usereditdetails", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getUsereditdetails)
userRouter.post("/post-userupdatedetails", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.postUserupdateddetails)
userRouter.get("/get-changepswd", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getChangepswd)
userRouter.post("/post-changedpswd", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.postChangedswd)
// userRouter.get("/get-changeemail", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getChangeEmail)
// userRouter.get("/newsend-otp", userMiddleware.verifyUser,  accountControll.newSendotp)
// userRouter.post("/newverify-otp", userMiddleware.verifyUser,  accountControll.newVerifyotp)

userRouter.get("/get-address", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.addAddress)
userRouter.post("/post-address", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.postAddress)
userRouter.get("/edit-address/:objectId/:addressId", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.editAddress)
userRouter.post("/post-editedaddress", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.postEditedaddress)
userRouter.get("/order-details/:orderId", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getOrderdetails)
userRouter.post("/cancel-order", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.cancelOrder)
userRouter.post("/return-order", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.returnOrder)
userRouter.get("/get-coupons", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, accountControll.getCoupons)


// filter
userRouter.post("/filter-category", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, filterControll.filterCategory)
userRouter.post("/search", userMiddleware.verifyUser, userMiddleware.checkBlockedStatus, filterControll.searchCourses)



module.exports = userRouter;
