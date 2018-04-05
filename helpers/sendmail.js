var nodemailer = require('nodemailer');

const sendMail = (type, to, hostName, protocol, token) => {
  var subject, text;
  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PW
    }
  });
  if (type === 'reset') {
    subject = 'WENT YARD Password Reset';
    text = `Hi, there!
    
You are receiving this email because you (or someone else, but hopefully not) has requested a password reset for your account.

To complete the password reset process, please click on the link below, or paste it into your browser:
${protocol}://${hostName}/reset/${token}

NOTE: this link will only work for 24 hours. If you do not reset your password before then, the link will expire and you will have to request another email via the "Forgot Password" page.

If you did not request this email, please ignore it; your password will remain unchanged if you do nothing.

Thanks!

- The WENT YARD Team`;
  } else if (type === 'confirm-reset') {
    subject = 'Your WENT YARD password has been updated';
    text = `Hello from WENT YARD (again)!

We're just letting you know that the password for your account was successfully updated... hopefully by you.  If you are NOT the one who updated your password, please reply to this email and let us know.

- The WENT YARD Team`;
  }
  var mailOptions = {
    to: to,
    from: process.env.MAIL_ADDRESS,
    subject: subject,
    text: text
  };
  return smtpTransport.sendMail(mailOptions);
};

module.exports = {
  sendMail : sendMail
};