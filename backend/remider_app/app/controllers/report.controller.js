const commonFn = require("../common/commonFn.js");
const reportService = require("../services/report.service.js");

exports.getDataReport = async (req, res) => {
  let response = {
    success: true,
    data: [],
  }
  let query = req.query
  response.data = await reportService.getDataReport(query.month, query.year);
  res.json(response);
};