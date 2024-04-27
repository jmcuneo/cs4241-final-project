document.addEventListener("DOMContentLoaded", async () => {
  document.body.classList.add("hidden");
  const popupWrapper = document.getElementById("image-popup-wrapper");
  const closePopup = document.getElementById("close-popup");
  closePopup.addEventListener("click", () => {
    popupWrapper.classList.add("hidden");
    document.body.style.overflowY = "auto";
  });

  await refreshPage();
  document.body.classList.remove("hidden");
});

async function refreshPage() {
  fetch("/refresh", { method: "POST" })
  .then(r => r.json())
  .then(result => {
    for (let ev of result) {
      const startDate = new Date(ev.startTime);
      const endDate = new Date(ev.endTime);
      document.querySelector("#personal-events").appendChild(createPersonalEvent(ev.event, startDate, endDate, ev.location, ev._id));
    }
  });
};

// TODO: UPDATE

const addToPersonal = function (eventId) {
  console.log(JSON.stringify({ eventId: eventId }));
  fetch("/add-user-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId: eventId })
  }).then((response) => response.text()).then((text) => console.log(text));
};