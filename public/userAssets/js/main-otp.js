// main-otp.js

document.addEventListener("DOMContentLoaded", function () {
  // Set the countdown duration in seconds (2 minutes = 120 seconds)
  const countdownDuration = 120;
  let countdown = countdownDuration;

  // Function to update the countdown display
  function updateCountdown() {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    // Display the countdown in the "countdown" element
    document.getElementById("countdown").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Decrement the countdown
    countdown--;

    // Check if the countdown has reached zero
    if (countdown < 0) {
      // Display a message when the countdown reaches zero
      document.getElementById("countdown").innerText = "Time's up!";
    }
  }

  // Function to restart the countdown
  function restartCountdown() {
    // Reset the countdown
    countdown = countdownDuration;

    // Update the countdown display
    updateCountdown();
  }

  // Initial update
  updateCountdown();

  // Update the countdown every second
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Resend OTP functionality
  document.getElementById("resendOtp").addEventListener("click", function () {
    // Restart the countdown when the "Resend OTP" button is clicked
    restartCountdown();

    // Optionally, you can trigger the OTP resend logic here
    // Example: Call a function to send a new OTP
    // sendNewOTP();
  });

  // Optionally, you can add a "Resend" functionality after the countdown ends
  document.getElementById("resend").innerHTML = '<a href="/resendOTP">Resend OTP</a>';

  // You might want to clear the interval when the user verifies the OTP
  // Example:
  // document.getElementById("verifyOTPButton").addEventListener("click", function () {
  //   clearInterval(countdownInterval);
  // });
});
