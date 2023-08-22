const commonFn = require("../common/commonFn.js");
const path = require('path');
const fs = require('fs');

exports.sendMail = async (req, res) => {
  console.log(path.dirname(fs.mkdir('app/data/employees.json')));
  const filePath = `${path.dirname(fs.realpathSync('app/data/employees.json'))}/employees.json`;
  let response = { success: false, message: "" };

  let employeesJSON = fs.readFileSync(filePath, 'utf8');
  try {
    let employees = JSON.parse(data);
    let employeesSendEmail = employees.filter(x => req.body.indexOf(x.FullName) == -1);

    for (let i = 0; i < employeesSendEmail.length; i++) {
      // Lấy nội dung HTML cần gửi
      let sloganMessageContent = await getSloganMessageContent();

      let replacements = [
        {
          FieldName: 'FullName',
          FieldValue: employeesSendEmail[i].FullName
        },
        {
          FieldName: 'DateNow',
          FieldValue: commonFn.getDateNow()
        },
        {
          FieldName: 'SloganMessage',
          FieldValue: sloganMessageContent.Content
        },
        {
          FieldName: 'Author',
          FieldValue: sloganMessageContent.Author ?? 'Khuất danh'
        }
      ]

      // Lấy nội dung HTML cần gửi
      let htmlContentEmail = await getEmailTemplateContent('email_reminder_task.html', replacements);

      // Subject email
      let subjectEmail = `[Lưu ý] Đề nghị thành viên ${employeesSendEmail[i].FullName} kiểm tra và cập nhật công việc ngày ${commonFn.getDateNow()}`;
      
      let mailOptions = await generateMailOptions(
        employeesSendEmail[i].Email,
        emailConfig.CC,
        emailConfig.BCC,
        subjectEmail,
        htmlContentEmail,
        'html'
      );
      response = await sendEmail(mailOptions);
    }
  }
  catch (error) {
    console.error('Có lỗi khi thực hiện gửi mail:', error);
    response = { success: false, message: "Có lỗi xảy ra!" }
  }
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