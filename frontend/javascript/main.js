const calendarDays = document.getElementById('calendar-days');

// Function to generate days and events for the month
function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay() - 1;


  calendarDays.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += '<div class="calendar-day"></div>';
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.classList.add(`calendar-day-${i}`);
    dayElement.textContent = i;
    calendarDays.appendChild(dayElement);
  }
  readData(month + 1, year);
  monthAndYear = `${month + 1}-${year}`
}

const prevMonthButton = document.querySelector('.prev-month');
const nextMonthButton = document.querySelector('.next-month');
const currentMonthElement = document.querySelector('.current-month');

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let dataEmployees = [];
let monthAndYear = "";
prevMonthButton.addEventListener('click', () => {
  if (currentMonth === 0) {
    currentYear -= 1;
    currentMonth = 11;
  } else {
    currentMonth -= 1;
  }
  updateCalendar();
});

nextMonthButton.addEventListener('click', () => {
  if (currentMonth === 11) {
    currentYear += 1;
    currentMonth = 0;
  } else {
    currentMonth += 1;
  }
  updateCalendar();
});

function updateCalendar() {
  currentMonthElement.textContent = `${new Date(currentYear, currentMonth).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`;
  generateCalendar(currentYear, currentMonth);
}

updateCalendar();

async function readData(month, year) {
  const response = await fetch(`http://localhost:8080/api/reports?month=${month}&year=${year}`, {
    method: "GET", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
  });

  result = await response.json();
  dataEmployees = result.data.filter(item => {
    let dateItem = new Date(item.CreatedDate);
    return dateItem.getMonth() + 1 == month && dateItem.getFullYear() == year;
  });
  let dataGroup = groupData(dataEmployees, "CreatedDate");
  for (const [key, value] of dataGroup.entries()) {
    let date = new Date(key);
    bindDataIntoDay(date.getDate(), value)
  }
}

function bindDataIntoDay(day, data) {
  var element = document.querySelector(`.calendar-days .calendar-day-${day}`);
  var innerElement = `<span>${day}<span>`;
  for (let i = 0; i < data.length; i++) {
    if (i < 2) {
      innerElement += `<div class="full-name" onclick="showByName('${data[i].Email}')">${data[i].FullName}</div>`
    }
    else {
      innerElement += `<div class="see-more" onclick="showByDay('${data[i].CreatedDate}')">Xem thêm</div>`
      break;
    }
  }
  element.innerHTML = innerElement;
}

function groupData(data, property) {
  const groupedData = new Map();
  data.forEach(item => {
    if (!groupedData.has(item[property])) {
      groupedData.set(item[property], []);
    }
    groupedData.get(item[property]).push(item);
  });
  return groupedData;
}

function showByName(email) {
  let dataByEmail = dataEmployees.filter(x => x.Email == email);
  let name = dataByEmail[0].FullName;
  let innerElement = `<div>Đã nhắc <b>${name}</b> tạo TASK <b>${dataByEmail.length}</b> lần vào các ngày: </div>`;
  innerElement += `<div>${dataByEmail.map(d => convertDate(d.CreatedDate, "ddMMYYYY", "/")).join(', ')}</div>`
  document.querySelector(".alert-content").innerHTML = innerElement;
  showAlert();
}

function showByDay(date) {
  let dataByDate = dataEmployees.filter(x => x.CreatedDate == date);
  let dateShowByDay = convertDate(dataByDate[0].CreatedDate, "ddMMYYYY", "/");
  let innerElement = `<div>Ngày <b>${dateShowByDay}</b> đã nhắc <b>${dataByDate.length}</b> thành viên tạo TASK: </div>`;
  innerElement += `<div>${dataByDate.map(d => d.FullName).join(', ')}</div>`
  document.querySelector(".alert-content").innerHTML = innerElement;
  showAlert();
}

function showReportByMonth() {
  let employees = groupData(dataEmployees, "Email");
  let innerMessageReport = `<h4 style='text-align: center; padding-bottom: 12px;'>Danh sách thành viên được nhắc tạo Task ${monthAndYear}</h4><div style='max-height: calc(100vh - 100px); overflow: auto;'><table><thead><th>Tên</th><th>Email</th><th>Số lần</th></thead>`;
  for (const [key, value] of employees.entries()) {
    innerMessageReport += `<tr><td>${value[0].FullName}</td><td>${value[0].Email}</td><td> ${value.length} lần</td></tr>`
  }
  innerMessageReport += "</table></div>"
  document.querySelector(".alert-content").innerHTML = innerMessageReport;
  showAlert();
}

function convertDate(dateString, typeDate, charDate) {
  let dateConvert = new Date(dateString);
  let date = ("0" + dateConvert.getDate()).slice(-2);
  let month = ("0" + (dateConvert.getMonth() + 1)).slice(-2);
  let year = dateConvert.getFullYear();

  switch (typeDate) {
    case "ddMMYYYY":
      return date + charDate + month + charDate + year;
    default: return month + charDate + date + charDate + year;
  }
}
