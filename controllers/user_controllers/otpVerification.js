const nodemailer = require("nodemailer")
const userCollection = require("../../models/userSchema")
// generating otp for node mailer
let generatedOTP = null;
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}


// sending otp 
module.exports.getSendOtp = async (req,res) => {
  try {
    const phoneNumber = req.query.phoneNumber;
    console.log(phoneNumber)
    const existingUser = await userCollection.findOne({
      $or: [
          { email: req.query.email },
          { phoneNumber: phoneNumber }
      ]
    });
    if (existingUser) {
      // Handle the case where either email or phoneNumber already exists
      if (existingUser.email === req.query.email && existingUser.phoneNumber === req.query.phoneNumber) {
        res.status(200).json({error: "User already exists"})
      } else  {
        res.status(200).json({error: "User already exists"})
      }
  } else 
  {
    const email = req.query.email;

    generatedOTP = generateOTP();
    console.log(generatedOTP);

      // Create a Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "mohidmohan8482@gmail.com",
        pass: "rrnq vrmh vaag prjr",
      },
    }); 

      //  Compose and Send an Email
    const mailOptions = {
      from: 'mohidmohan8482@gmail.com',
      to: email,
      subject: 'Account verification mail',
      text: `Your OTP for verification is: ${generatedOTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email has been sent: ' + info.response);
      }
    });
  
    res.status(200).json({message: "OTP send successfully"})
  }
  } catch (error) {
    console.error(error)
  }
} 

// verify otp
module.exports.postVerifyOtp = async (req, res) => {
  try {
    
    const userEnteredOTP = req.query.otpInput;
   

    if (userEnteredOTP && generatedOTP && userEnteredOTP === generatedOTP.toString()) {
      // OTP is correct
      console.log(userEnteredOTP+"verified")
      res.status(200).json({ message: "OTP verification successful" });
    } else {
      // Incorrect OTP
      res.status(400).json({ error: "Incorrect OTP" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}