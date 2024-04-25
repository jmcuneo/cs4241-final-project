const getUsername = fetch("/user", { method: "GET" })
  .then(r => r.json());

document.addEventListener("DOMContentLoaded", async () => {
    document.body.classList.add("hidden");
    getUsername.then(d => document.getElementById("user").innerHTML = d.username);
    const today = new Date();
    document.querySelector("#month").value = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}`;

    const loadPosts = fetch("/personalPosts", {
        method: "GET",
    })
    .then(r => r.json())
    .then(function (data) {
        for (let message of data) {
            appendMessage(message.username, message.content, message.datetime);
        }
    });

    await Promise.all([calendarView(), loadPosts]);
    document.body.classList.remove("hidden");
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

function appendMessage(username, content, datetime) {
    const wrapper = document.createElement("div");
    const quillReadOnly = new Quill(wrapper, {
        placeholder: 'MESSAGE EMPTY',
        readOnly: true,
        theme: 'snow',
        modules: {
            syntax: true
        }
    });
    
    let toAppend = [{insert: `${username}\n`}];
    try {
        toAppend = toAppend.concat(JSON.parse(content));
    } catch(_) {
        toAppend.push({insert: content + "\n"});
    }
    toAppend.push({insert: `${datetime}`});
    quillReadOnly.setContents(toAppend);
    document.querySelector("#post-collection").prepend(wrapper);
}

const getUserEvents = async function (filter) {
    await fetch("/user-events", {
        method: "GET"
    }).then((response) => response.json()).then((data) => {
        console.log(data);
        userEvents = filter === null ? data : data.filter(filter);
        console.log(userEvents);
        const table = document.querySelector("#events");
        table.innerHTML = "<tr><th>Event</th><th>Date</th><th>Start Time</th><th>End Time</th><th>Location</th><th>Details</th></tr>";
        for (e of userEvents) {
            const startDate = new Date(e.startTime);
            const endDate = new Date(e.endTime);
            table.innerHTML += `<tr><td class='events'>${e.event}</td>
                                    <td class='events'>${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}</td>
                                    <td class='events'>${startDate.getHours()}:${(startDate.getMinutes() < 10 ? "0" : "") + startDate.getMinutes()}</td>
                                    <td class='events'>${endDate.getHours()}:${(endDate.getMinutes() < 10 ? "0" : "") + endDate.getMinutes()}</td>
                                    <td class='events'>${e.location}</td>
                                    <td class='events'><button class="info" onclick="info(this, '${e._id}')">See more details</button></td>`;
        }
    });
};

const info = async function (button, eventId) {
    // Disable the more details button
    button.disabled = true;

    // Fetch event info
    const reqObj = { eventId: eventId};
    const response = await fetch("/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqObj),
    });
    const eventInfo = await response.json();

    // Display event details
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('event-details');

    if (eventInfo.image) {
        const imgElement = document.createElement('img');
        imgElement.src = eventInfo.image;
        detailsContainer.appendChild(imgElement);
    }

    if (eventInfo.description) {
        const descElement = document.createElement('p');
        descElement.textContent = eventInfo.description;
        detailsContainer.appendChild(descElement);
    }

    if ((eventInfo.image == null) && (eventInfo.description == null)) {
        console.log("nothing to display");
        const descElement = document.createElement('p');
        descElement.textContent = "No additional details";
        detailsContainer.appendChild(descElement);

    }

    const tableRow = button.closest('tr');
    const existingDetailsContainer = tableRow.querySelector('.event-details');
    if (existingDetailsContainer) {
        existingDetailsContainer.remove();
    } else {
        tableRow.appendChild(detailsContainer);
    }

    // Enable the "Show less" button if details are displayed
    const showLessButton = document.querySelector('.show-less');
    if (detailsContainer && !showLessButton) {
        const showLessBtn = document.createElement('button');
        showLessBtn.textContent = 'Show less';
        showLessBtn.classList.add('show-less');
        showLessBtn.addEventListener('click', function () {
            detailsContainer.remove();
            button.disabled = false;
            this.remove();
        });
        tableRow.appendChild(showLessBtn);
    }
};