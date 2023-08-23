const commonFn = require("../common/commonFn.js");

async function saveReportSendEmailEmployee(employeesSendEmail) {
    let reportsJSON = commonFn.readFileWithPath("app/reports/reports.json");
    try {
        let reports = "";
        if (!reportsJSON) {
            reports = [];
        } else {
            reports = JSON.parse(reportsJSON);
        }

        employeesSendEmail.forEach((item) => {
            reports.push({
                FullName: item.FullName,
                CreatedDate: commonFn.getDateNow("default", "-"),
                Email: item.Email,
            });
        });
        commonFn.writeFileWithPath(
            "app/reports/reports.json",
            JSON.stringify(reports)
        );
    } catch (error) {
        console.log("Có lỗi xảy ra khi lưu báo cáo", error);
    }
}

async function getDataReport(monthReport, yearReport) {
    let reportsJSON = commonFn.readFileWithPath("app/reports/reports.json");
    try {
        if (reportsJSON) {
            let reports = JSON.parse(reportsJSON);
            let response = reports.filter((item) => {
                let dateItem = new Date(item.CreatedDate);
                let monthItem = dateItem.getMonth() + 1;
                let yearItem = dateItem.getFullYear();
                if (monthItem == monthReport && yearItem == yearReport) {
                    return item;
                }
            });

            return response;
        }
    } catch (error) {
        console.log("Có lỗi xảy ra khi lưu báo cáo", error);
    }
}

module.exports = {
    saveReportSendEmailEmployee,
    getDataReport,
};
