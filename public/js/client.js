window.onload = function() {
    const profileInfo = fetch("/user", {
        method: "GET",
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        const username = data.username;
        document.getElementById("user").innerHTML = username;
      });

}

let personalEvents = [];

async function getPersonalCalendar() {
    await fetch("/user-events", {
        method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        personalEvents = data;
        console.log(data);
        const list = document.querySelector("#personal-events");
        list.innerHTML = "";
        if(data.length > 0) {
            data.forEach(e => {
                const item = document.createElement("li");
                item.textContent = JSON.stringify(e);
                list.appendChild(item);
            });
        } else {
            const item = document.createElement("li");
            item.textContent = "You have not created any events!";
            list.appendChild(item);
        }
    });
};

async function calendarView() {
    await getPersonalCalendar();
    const date = document.querySelector("#month").value;
    console.log(date);
    const year = parseInt(date.substr(0, 4));
    const century = parseInt(date.substr(0, 2));
    const subyear = parseInt(date.substr(2, 2));
    const month = parseInt(date.substr(5, 2));
    const calendar = document.querySelector("#calendar");
    const monthCodes = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    const centuryCodes = [4, 2, 0, 6, 4, 2, 0];
    const isLeapYear = year % 100 === 0 ? (year % 400 === 0) : (year % 4 === 0);
    const startDay = (((subyear + Math.floor(subyear / 4)) % 7) + monthCodes[month - 1] + centuryCodes[century - 17] + 1 + (month <= 2 ? (isLeapYear ? -1 : 0) : 0)) % 7;
    const daysInMonth = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    calendar.innerHTML = "<tr><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th></tr>";
    let str = "<tr>";
    for (let i = 0; i < startDay; i++)
        str += "<td></td>";
    let day = 1;
    for (day; day + startDay <= 7; day++)
        str += `<td><button onclick='getEventsOnDay(${year}, ${month}, ${day})'>${day}</button></td>`;
    calendar.innerHTML += str + "</tr>";
    while (day <= daysInMonth[month - 1]) {
        str = "<tr>";
        for (let i = 0; i < 7; day++, i++)
            str += `<td>${day <= daysInMonth[month - 1] ? `<button onclick='getEventsOnDay(${year}, ${month}, ${day})'>${day}</button>` : ""}</td>`;
        calendar.innerHTML += str + "</tr>";
    }
};

function getEventsOnDay(year, month, day) {
    //console.log(year + ", " + month + ", " + day);
    console.log(`${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`);
    const eventsOnDay = personalEvents.filter((e) => e.datetime.substr(0, 10) === `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`);
    const list = document.querySelector("#events");
    list.innerHTML = "";
    eventsOnDay.forEach((e) => list.innerHTML += `<li>${JSON.stringify(e)}</li>`);
};