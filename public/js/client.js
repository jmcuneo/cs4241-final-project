//profile info 

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

const getPersonalCalendar = function() {
    fetch("/user-events", {
        method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        personalEvents = data;
        console.log(data);
        const list = document.querySelector("#events");
        list.innerHTML = "";
        data.forEach((e) => list.innerHTML += `<li>${JSON.stringify(e)}</li>`);
    });
};

const calendarView = function() {
    const date = document.querySelector("#month").value;
    const year = parseInt(date.substr(0, 4));
    const century = parseInt(date.substr(0, 2));
    const subyear = parseInt(date.substr(2, 2));
    const month = parseInt(date.substr(5, 2));
    console.log(century + ", " + subyear + ", " + month);
    for (e of personalEvents) {
        if (e.datetime.substr(0, 7) === date)
            console.log(e);
    }
    const calendar = document.querySelector("#calendar");
    const monthCodes = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    const centuryCodes = [4, 2, 0, 6, 4, 2, 0];
    const isLeapYear = year % 100 === 0 ? (year % 400 === 0) : (year % 4 === 0);
    const startDay = (((subyear + Math.floor(subyear / 4)) % 7) + monthCodes[month - 1] + centuryCodes[century - 17] + 1 + (month <= 2 ? (isLeapYear ? -1 : 0) : 0)) % 7;
    console.log(startDay);
    const daysInMonth = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let str = "<tr>";
    let day = 0;
    for (let i = 0; i < startDay; i++)
        str += "<td></td>";
    for (let i = 1; i + startDay <= 7; i++)
        str += `<td>${i}</td>`;
    calendar.innerHTML += str + "</tr>"
};