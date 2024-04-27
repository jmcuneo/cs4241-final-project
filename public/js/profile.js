const getUsername = fetch("/user", { method: "GET" })
    .then(r => r.json());

document.addEventListener("DOMContentLoaded", async () => {
    document.body.classList.add("hidden");
    getUsername.then(d => document.getElementById("user").innerHTML = d.username);
    const today = new Date();
    document.querySelector("#month").value = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}`;

    const loadPosts = fetch("/personalPosts", { method: "GET" })
    .then(r => r.json())
    .then(function (data) {
        for (let message of data) {
            appendMessage(message.username, message.content, message.datetime);
        }
    });

    const popupWrapper = document.getElementById("image-popup-wrapper");
    const closePopup = document.getElementById("close-popup");
    closePopup.addEventListener("click", () => {
        popupWrapper.classList.add("hidden");
        document.body.style.overflowY = "auto";
    });

    await Promise.all([calendarView(), loadPosts]);
    document.body.classList.remove("hidden");
});

let personalEvents = [];

async function calendarView() {
    await getUserEvents(null);
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
    for (let i = 0; i < startDay; i++) {
        firstWeek.appendChild(document.createElement("td"));
    }
    let day = 1;
    for (; day + startDay <= 7; day++) {
        firstWeek.appendChild(createDayButton(year, month, day));
    }
    calendar.appendChild(firstWeek);

    while (daysInMonth - day >= 7) {
        const week = document.createElement("tr");
        week.classList.add("removable");
        for (let i = 0; i < 7; i++, day++) {
            week.appendChild(createDayButton(year, month, day));
        }
        calendar.appendChild(week);
    }

    if (daysInMonth !== day) {
        const lastWeek = document.createElement("tr");
        lastWeek.classList.add("removable");
        for (; day <= daysInMonth; day++) {
            lastWeek.appendChild(createDayButton(year, month, day));
        }

        for (; (startDay + day) % 7 !== 1; day++) {
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

async function getEventsOnDay(year, month, day) {
    document.querySelector("#date-specifier").textContent = `(${Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(year, month, day))})`;
    personalEvents.filter(e => {
        const eventDate = new Date(e.datetime);
        return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === month && eventDate.getUTCDate() === day;
    });

    await getUserEvents((e) => e.startTime.substr(0, 10) === `${year}-${month + 1 < 10 ? "0" : ""}${month + 1}-${day < 10 ? "0" : ""}${day}`);
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

    let toAppend = [{ insert: `${username}\n` }];
    try {
        toAppend = toAppend.concat(JSON.parse(content));
    } catch (_) {
        toAppend.push({ insert: content + "\n" });
    }
    toAppend.push({ insert: `${datetime}` });
    quillReadOnly.setContents(toAppend);
    document.querySelector("#post-collection").prepend(wrapper);
}

async function getUserEvents(filter) {
    const table = document.querySelector("#personal-events");
    table.innerHTML = "";
    await fetch("/user-events", { method: "GET" })
        .then(response => response.json())
        .then((data) => {
            personalEvents = filter === null ? data : data.filter(filter);
            for (e of personalEvents) {
                const startDate = new Date(e.startTime);
                const endDate = new Date(e.endTime);
                table.appendChild(createPersonalEvent(e.event, startDate, endDate, e.location, e._id));
            }

            if(personalEvents.length === 0) {
                const emptyMsg = document.createElement("h4");
                emptyMsg.textContent = "You have not created any events" + (filter === null ? "!" : " on this day!");
                table.appendChild(emptyMsg);
            }
        });
};

function createPersonalEvent(name, start, end, location, eventId) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("event-wrapper");

    const headerWrapper = document.createElement("div");
    headerWrapper.classList.add("event-header");
    headerWrapper.classList.add("header");

    const eventName = document.createElement("h4");
    eventName.classList.add("header");
    eventName.textContent = name;
    headerWrapper.appendChild(eventName);

    const details = document.createElement("button");
    details.textContent = "More Details";
    details.classList.add("hoverable");
    details.classList.add("detail-button");
    details.type = "button";
    headerWrapper.appendChild(details);
    wrapper.appendChild(headerWrapper);

    const timeWrapper = document.createElement("div");
    timeWrapper.classList.add("time-wrapper");
    const eventStart = document.createElement("h5");
    const startLabel = document.createElement("span");
    startLabel.textContent = "Start Time";
    const startContent = document.createElement("span");
    startContent.textContent = Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric", "hour12": true, "hour": "2-digit", "minute": "2-digit" }).format(start);
    eventStart.appendChild(startLabel);
    eventStart.appendChild(startContent);
    const eventEnd = document.createElement("h5");
    const endLabel = document.createElement("span");
    endLabel.textContent = "End Time";
    const endContent = document.createElement("span");
    endContent.textContent = Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric", "hour12": true, "hour": "2-digit", "minute": "2-digit" }).format(end);
    eventEnd.appendChild(endLabel);
    eventEnd.appendChild(endContent);

    timeWrapper.appendChild(eventStart);
    timeWrapper.appendChild(eventEnd);
    wrapper.appendChild(timeWrapper);

    const eventLocation = document.createElement("h5");
    eventLocation.classList.add("center");
    const locationLabel = document.createElement("span");
    locationLabel.textContent = "Location";
    const locationContent = document.createElement("span");
    locationContent.textContent = location;

    eventLocation.appendChild(locationLabel);
    eventLocation.appendChild(locationContent);
    wrapper.appendChild(eventLocation);

    const extraInfo = document.createElement("div");
    extraInfo.classList.add("hidden");

    const flyerWrapper = document.createElement("div");
    flyerWrapper.classList.add("center");

    const flyerLabel = document.createElement("h5");
    flyerLabel.innerHTML = "<span>Flyer</span>";
    flyerWrapper.appendChild(flyerLabel);

    const flyer = document.createElement("img");
    flyer.style.maxWidth = "70%";
    flyer.alt = "Could not load flyer from servers...";
    flyer.classList.add("hoverable");

    const popupWrapper = document.getElementById("image-popup-wrapper");
    const popupImage = document.getElementById("image-popup");
    flyer.addEventListener("click", () => {
        popupWrapper.classList.remove("hidden");
        document.body.style.overflowY = "hidden";
        popupImage.src = flyer.src;
    });

    flyerWrapper.appendChild(flyer);
    extraInfo.appendChild(flyerWrapper);

    const descriptionLabel = document.createElement("h5");
    descriptionLabel.innerHTML = "<span>Event Description</span>";
    extraInfo.appendChild(descriptionLabel);

    const descriptionDiv = document.createElement("div");
    const description = new Quill(descriptionDiv, {
        placeholder: 'MESSAGE EMPTY',
        readOnly: true,
        theme: 'snow',
        modules: {
            syntax: true
        }
    });
    extraInfo.appendChild(descriptionDiv);

    details.onclick = async () => {
        await toggleInfo(flyer, description, eventId);
        if (details.textContent === "More Details") {
            details.textContent = "Less Details";
            extraInfo.classList.remove("hidden");
        } else {
            details.textContent = "More Details";
            extraInfo.classList.add("hidden");
        }
    };
    wrapper.appendChild(extraInfo);

    return wrapper;
}

async function toggleInfo(flyer, description, eventId) {
    const reqObj = { eventId: eventId };
    const response = await fetch("/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqObj),
    });
    const eventInfo = await response.json();

    flyer.src = eventInfo.image;
    description.setContents(JSON.parse(eventInfo.description));
};