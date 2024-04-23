document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    document.querySelector("#month").value = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}`;
    calendarView();
});

let personalEvents = [];

async function getPersonalCalendar() {
    await fetch("/user-events", {
        method: "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        personalEvents = data;
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
    const dateString = document.querySelector("#month").value.split("-");
    const year = dateString[0];
    const month = dateString[1] - 1;
    const date = new Date(year, month);

    document.querySelector("#cal-yr-m").textContent = Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);

    const calendar = document.querySelector("#calendar");
    calendar.querySelectorAll(".removable").forEach(r => calendar.removeChild(r));
    const startDay = new Date(year, month, 1).getUTCDay();
    const daysInMonth = new Date(year, month + 1, 0).getUTCDate();

    const firstWeek = document.createElement("tr");
    firstWeek.classList.add("removable");
    for(let i = 0; i < startDay; i++) {
        firstWeek.appendChild(document.createElement("td"));
    }
    let day = 1;
    for(; day + startDay <= 7; day++) {
        firstWeek.appendChild(createDayButton(year, month, day));
    }
    calendar.appendChild(firstWeek);

    while(daysInMonth - day >= 7) {
        const week = document.createElement("tr");
        week.classList.add("removable");
        for(let i = 0; i < 7; i++, day++) {
            week.appendChild(createDayButton(year, month, day));
        }
        calendar.appendChild(week);
    }

    if(daysInMonth !== day) {
        const lastWeek = document.createElement("tr");
        lastWeek.classList.add("removable");
        for(; day <= daysInMonth; day++) {
            lastWeek.appendChild(createDayButton(year, month, day));
        }

        for(; (startDay + day) % 7 !== 1; day++) {
            lastWeek.appendChild(document.createElement("td"));
        }
        calendar.appendChild(lastWeek);
    }
};

function createDayButton(year, month, day) {
    const button = document.createElement("td");
    button.onclick = () => getEventsOnDay(year, month, day);
    button.classList.add("hoverable");
    button.textContent = day;
    return button;
}

function getEventsOnDay(year, month, day) {
    document.querySelector("#date-specifier").textContent = `(${Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric"}).format(new Date(year, month, day))})`;
    const eventsOnDay = personalEvents.filter(e => {
        const eventDate = new Date(e.datetime);
        return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === month && eventDate.getUTCDate() === day;
    });
    const list = document.querySelector("#personal-events");
    list.innerHTML = "";
    eventsOnDay.forEach(e => {
        const item = document.createElement("li");
        item.textContent = JSON.stringify(e);
        list.appendChild(item);
    });

    if(eventsOnDay.length === 0) {
        const item = document.createElement("li");
        item.textContent = "You have not created any events!";
        list.appendChild(item);
    }
};