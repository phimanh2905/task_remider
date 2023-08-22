const buttonShowAll = document.getElementById("showAllClick");
const buttonGetAll = document.getElementById("getAllClick");
const buttonSendMail = document.getElementById("sendMailClick");

buttonShowAll.addEventListener("click", showAllData);
buttonGetAll.addEventListener("click", getDataAMISCongViec);
buttonSendMail.addEventListener("click", async () => {
  const timeNow = localStorage.getItem("timenow");
  const rowHeader = localStorage.getItem("rowHeader");
  const rowBody = JSON.parse(localStorage.getItem("rowBody"));

  const { message } = await this.postJSON(
    "http://localhost:8080/api/tasks/sendmail",
    rowBody.map(item=>item[7])
  );
  // const { message } = await this.postJSON(
  //   "http://localhost:8080/api/tasks/sendmail",
  //   {
  //     timeNow,
  //     rowHeader,
  //     rowBody,
  //   }
  // );
  document.querySelector("#responseSendMail").innerHTML = message;
});

function showAllData() {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabs) {
      const { id: tabId } = tabs[0].url;
      const code = `(function showAllData(){
                var timer = 500;
                var eventElement = document.querySelectorAll('.cursor-pointer.h-32.d-flex.align-items-center.ng-star-inserted .icon-carret-right');
                eventElement.forEach((item) => {
                    setTimeout(() => { item.click() }, timer)
                    timer += 500;
                }) 
                return timer;
              })()`;
      chrome.tabs.executeScript(tabId, { code }, function (result) {});
    }
  );
}

function getDataAMISCongViec() {
  chrome.tabs.query(
    { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
    (tabs) => {
      const { id: tabId } = tabs[0].url;
      const getBody = `(function getHeaderBody(){
                var dataParent = [];
                var selectorRowData = document.querySelectorAll('.cdk-drag.task-wrap.cdk-drag-disabled.ng-star-inserted');
                var parentId = 1;

                selectorRowData.forEach(item1 => {
                  var selectorColumnData = item1.querySelectorAll('.header-grid.ng-star-inserted');
                  var dataChildren = [];
                  
                  selectorColumnData.forEach(item2 => {
                    if(item2) {
                      var marginLeft = ''
                      var rowParentTask = item2.querySelector('.icon-sub-task-circle');
                      if(rowParentTask) {
                        parentId = selectorColumnData[0].textContent
                      }

                      var tasknameFormat = item2.querySelector('.taskname-format');
                      if (tasknameFormat) {
                          marginLeft = (tasknameFormat.querySelector('.pos-relative').style.marginLeft).replace('px','')
                      }
                      
                      if(marginLeft && marginLeft != ''){
                        if(marginLeft > 0){
                            dataChildren.push(parentId);
                        }
                        else {
                            dataChildren.push('');
                        }
                      }
                      
                      var textColumnData = item2.textContent;
                      dataChildren.push(textColumnData);
                    }
                  });
                  
                  dataParent.push(dataChildren);
                });
    
                return dataParent;
              })()`;
      const getHeader = `(function getHeader(){
                var headers = [];
                var headerElements = document.querySelector("#header-id").querySelectorAll("._col-name");
                headerElements.forEach(header => {
                    headers.push(header.textContent);
                });
                return headers;
              })()`;

      chrome.tabs.executeScript(tabId, { code: getHeader }, function (result) {
        const rowHeader = result[0];
        if (!rowHeader.some((x) => x == "STT")) {
          rowHeader.unshift("STT");
        }
        localStorage.setItem("rowHeader", JSON.stringify(rowHeader));
        var thead = document.querySelector("#headerData");
        var textHeader = "";
        rowHeader.forEach((item) => {
          if(item == 'Tên công việc') {
            textHeader += '<th>Mã công việc cha</th>'
          }
          textHeader += `<th>${item}</th>`;
        });
        thead.innerHTML = textHeader;

        const timeNow = `Thời gian lấy dữ liệu: ${getDateTimeNow()}`;
        document.querySelector("#timenow").textContent = timeNow;
        localStorage.setItem("timenow", timeNow);
      });

      chrome.tabs.executeScript(tabId, { code: getBody }, (result) => {
        const rowBody = result[0];
        localStorage.setItem("rowBody", JSON.stringify(rowBody));
        var tbody = document.querySelector("#bodyData");
        var textBody = "";
        rowBody.forEach((item) => {
          var tr = "";
          for (var i = 0; i < item.length; i++) {
            var td = `<td>${item[i]}</td>`;
            tr += td;
          }
          textBody += `<tr>${tr}</tr>`;
        });
        tbody.innerHTML = textBody;
      });
    }
  );
}

function getDateTimeNow(){
  let dateNow = Date.now();

  let date_ob = new Date(dateNow);
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  return date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
}

async function postJSON(url, data) {
  let result = null;
  try {
    const response = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
  return result;
}
