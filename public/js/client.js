//profile info 

window.onload = async function () {
    fetch("/user", {
        method: "GET",
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        const username = data.username;
        document.getElementById("user").innerHTML = username;
    });
    await getUserEvents(null);
};

let userEvents = [];
const getUserEvents = async function (filter) {
    await fetch("/user-events", {
        method: "GET"
    }).then((response) => response.json()).then((data) => {
        console.log(data);
        userEvents = filter === null ? data : data.filter(filter);
        console.log(userEvents);
        const table = document.querySelector("#events");
        table.innerHTML = "<tr><th>Event</th><th>Date</th><th>Start Time</th><th>End Time</th><th>Location</th></tr>";
        for (e of userEvents) {
            const startDate = new Date(e.startTime);
            const endDate = new Date(e.endTime);
            table.innerHTML += `<tr><td class='events'>${e.event}</td>
                                    <td class='events'>${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}</td>
                                    <td class='events'>${startDate.getHours()}:${startDate.getMinutes()}</td>
                                    <td class='events'>${endDate.getHours()}:${endDate.getMinutes()}</td>
                                    <td class='events'>${e.location}</td>`;
        }
    });
};

const calendarView = async function () {
    const date = document.querySelector("#month").value;
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
        str += "<td class='calendar'></td>";
    let day = 1;
    for (day; day + startDay <= 7; day++)
        str += `<td class='calendar'><button onclick='getEventsOnDay(${year}, ${month}, ${day})'>${day}</button></td>`;
    calendar.innerHTML += str + "</tr>";
    while (day <= daysInMonth[month - 1]) {
        str = "<tr>";
        for (let i = 0; i < 7; day++, i++)
            str += `<td class='calendar'>${day <= daysInMonth[month - 1] ? `<button onclick='getEventsOnDay(${year}, ${month}, ${day})'>${day}</button>` : ""}</td>`;
        calendar.innerHTML += str + "</tr>";
    }
    await getUserEvents((e) => e.startTime.substr(0, 7) === date);
};

const getEventsOnDay = async function (year, month, day) {
    console.log(`${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`);
    await getUserEvents((e) => e.startTime.substr(0, 10) === `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`);
};