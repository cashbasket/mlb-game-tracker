var nodemailer = require('nodemailer');

function sendMail(type, to, hostName, token) {
  var subject, text;
  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PW
    }
  });
  if (type === 'reset') {
    subject = 'Password Reset';
    text = 'Hi, there!\n\n You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n' + 'To complete the password reset process, please click on the link below, or paste it into your browser:\n\n' +
		'https://' + hostName + '/reset/' + token + '\n\n' +
		'If you did not request this email, please ignore it; your password will remain unchanged.\n';
  } else if (type === 'confirm-reset') {
    subject = 'Your Password has been changed';
    text = 'Hi (again),\n\n' +
		'We\'re just letting you know that the password for your account was successfully changed.\n';
  }
  var mailOptions = {
    to: to,
    from: process.env.MAIL_ADDRESS,
    subject: subject,
    text: text
  };
  return smtpTransport.sendMail(mailOptions);
}

module.exports = {
  sendMail : sendMail
};