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
    const email = req.query.email;
      emaildata = email;
    const existingUser = await userCollection.findOne({
      $or: [
          { email: req.query.email },
      ]
    });
      if (existingUser) {
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
  } else {
    res.status(200).json({error: "This mail-id is not registered!"})
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
      res.status(200).json({ error: "Incorrect OTP" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports.postSubmitOtp = async (req, res) => {
  try {
    // Validate emaildata to avoid null or undefined issues
    if (!emaildata) {
      throw new Error('Invalid emaildata');
    }
    let passworddata = req.body.password;
    console.log(passworddata);

    // Find the user by emaildata
    const user = await userCollection.findOne({ email: emaildata });
    console.log(user);

    if (user) {
      // Update the password if the user is found
      await userCollection.updateOne(
        { email: emaildata },
        { $set: { password: req.body.password } }
      );

      // Redirect or respond accordingly
      res.redirect("/userLogin");
    } else {
      // User not found, redirect or respond accordingly
      res.redirect("/userLogin");
    }
  } catch (error) {
    console.error(error);
    // Handle the error, e.g., redirect to an error page
    res.redirect("/errorPage");
  }
};
