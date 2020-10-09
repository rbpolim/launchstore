const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "fd5f19f01b01a3",
      pass: "3410bcb79b4fa6"
    }
  });

module.exports = transport