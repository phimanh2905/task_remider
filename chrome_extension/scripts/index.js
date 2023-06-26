var buttonShowAll = document.getElementById("showAllClick");
var buttonGetAll = document.getElementById("getAllClick");
var buttonDownload = document.getElementById("downloadClick");

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
    function (tabs) {
      const { id: tabId } = tabs[0].url;
      const getBody = `(function getHeaderBody(){
                var dataParent = [];
                var selectorRowData = document.querySelectorAll('.cdk-drag.task-wrap.cdk-drag-disabled.ng-star-inserted');
    
                selectorRowData.forEach(item1 => {
                    var selectorColumnData = item1.querySelectorAll('.header-grid.ng-star-inserted');
                    var dataChildren = [];
                    selectorColumnData.forEach(item2 => {
                        var textColumnData = item2.textContent;
                        dataChildren.push(textColumnData);
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
        console.log(rowHeader);
        var thead = document.querySelector("#headerData");
        var textHeader = "";
        rowHeader.forEach((item) => {
          textHeader += `<th>${item}</th>`;
        });
        thead.innerHTML = textHeader;

        const getDateNow = () => {
          const now = new Date();
          return `Thời gian lấy dữ liệu: ${now.getDate()}/${
            now.getMonth() + 1
          }/${now.getFullYear()}`;
        };

        document.querySelector("#timeNow").textContent = getDateNow();
      });

      chrome.tabs.executeScript(tabId, { code: getBody }, function (result) {
        // const rowHeader = result[0];
        // console.log(rowHeader);
        const rowBody = result[0];
        console.log(rowBody);
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

function downloadHTML() {
  download("data.html", document.getElementsByTagName("html")[0].innerHTML);
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function sendMail(params) {}

buttonShowAll.addEventListener("click", showAllData);
buttonGetAll.addEventListener("click", getDataAMISCongViec);
buttonDownload.addEventListener("click", downloadHTML);
