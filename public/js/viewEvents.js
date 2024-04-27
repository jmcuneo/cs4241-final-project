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
    const eventsList = document.querySelector("#personal-events");
    for (let ev of result) {
      const startDate = new Date(ev.startTime);
      const endDate = new Date(ev.endTime);

      
      if(new Date() < endDate) {
        eventsList.appendChild(createPersonalEvent(ev.event, startDate, endDate, ev.location, ev._id, true));
      }
    }

    if(eventsList.children.length === 0) {
      const emptyMsg = document.createElement("h4");
      emptyMsg.innerHTML = "<span>There are no upcoming events!</span>";
      eventsList.appendChild(emptyMsg);
    }
  });
};