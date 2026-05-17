const nodemailer = require('nodemailer');

// Set up the email transporter (Using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // NOTE: Use an App Password if using Gmail
  },
});

const sendOrderConfirmationEmail = async (userEmail, order) => {
  try {
    const mailOptions = {
      from: `"ROBU.in Clone" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h2>Thank you for shopping with us!</h2>
        <p>Your order <strong>${order.orderNumber}</strong> has been successfully placed.</p>
        <p><strong>Total Amount:</strong> ₹${order.total}</p>
        <p>We will notify you as soon as your items are shipped.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // We don't throw the error here so that the main order process doesn't fail 
    // just because an email failed to send.
  }
};

module.exports = { sendOrderConfirmationEmail };