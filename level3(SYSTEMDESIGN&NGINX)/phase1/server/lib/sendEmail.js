const sendEmail = async (email, otp) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 5000); // Simulate a delay of 2 seconds
  });
  console.log(`Email sent to ${email} with OTP: ${otp}`);
};

export default sendEmail;