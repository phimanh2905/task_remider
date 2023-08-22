const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');
const emailConfig = require("../config/email.config");
const transporter = nodemailer.createTransport({
  service: emailConfig.SERVICE,
  auth: {
    user: emailConfig.USER,
    pass: emailConfig.PASSWORD
  }
});

async function generateMailOptions(emailAddress, subjectEmail, contentEmail) {
  return {
    from: emailConfig.USER,
    to: emailAddress,
    subject: subjectEmail,
    text: contentEmail
  };
}

async function sendEmail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Lỗi khi gửi email:', error);
      return {
        success: false,
        message: "Gửi email không thành công",
      }
    } else {
      console.log(`Email đã được gửi: To(${mailOptions.to})`, info.response);
      return {
        success: true,
        message: "Gửi email thành công",
      }
    }
  });
}

exports.sendMail = (req, res) => {
  const filePath = `${path.dirname(fs.realpathSync('app/data/employees.json'))}/employees.json`;
  let response = { success: false, message: "" };

  fs.readFileSync(filePath, 'utf8', async (error, data) => {
    if (error) {
      console.error('Lỗi khi đọc tệp JSON:', error);
      response = { success: false, message: "Có lỗi xảy ra!" };
      return;
    }

    try {
      let employees = JSON.parse(data);
      let employeesSendEmail = employees.filter(x => req.body.indexOf(x.FullName) == -1);

      for (let i = 0; i < employeesSendEmail.length; i++) {
        let mailOptions = await generateMailOptions(employeesSendEmail[i].Email, "Nhắc tạo task", "Tạo task đi nhé :))");
        response = await sendEmail(mailOptions);
      }
    }
    catch (error) {
      console.error('Có lỗi khi thực hiện gửi mail:', error);
      response = { success: false, message: "Có lỗi xảy ra!" }
    }
  });
  res.json(response);
};

// exports.sendMail = (req, res) => {
//   const { timeNow, rowHeader, rowBody } = req.body;
//   const filePath = '../data/employees.json';

//   console.log(rowHeader);
//   console.log(rowBody);

//   const response = { message: "sendMail success", error: "" };

//   const transferMasterData = (rowHeader, rowBody) => {
//     let masterData = [];
//     rowBody.forEach((body) => {
//       rowHeader.forEach((header) => {});
//     });
//     return masterData;
//   };

//   try {
//     const masterData = this.transferMasterData(rowHeader, rowBody);
//   } catch (error) {
//     response.error = error;
//   }
//   res.json(response);
// };