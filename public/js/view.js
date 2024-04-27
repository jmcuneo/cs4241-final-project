const addToTable = function (entry) {
  const table = document.getElementById("table");
  const row = `<tr id="entryRow">
                <td>${entry.event}</td>
                <td>${entry.date}</td>
                <td>${entry.startTime}</td>
                <td>${entry.endTime}</td>
                <td>${entry.location}</td>
                <td><button class="info" onclick="info(this, '${entry._id}')">See more details</button></td>
                <td><button onclick="addToPersonal('${entry._id}');">Add</button></td>
              </tr>`;
  table.insertAdjacentHTML("beforeend", row);
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

  if((eventInfo.image == null) && (eventInfo.description == null)){
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
      showLessBtn.addEventListener('click', function() {
          detailsContainer.remove();
          button.disabled = false;
          this.remove();
      });
      tableRow.appendChild(showLessBtn);
  }
};

  const refreshPage = async function () {
    const response = await fetch("/refresh", {
      method: "POST",
      body: "",
    });
    const text = await response.json();
    for(let i = 0; i < text.length; i++){
        addToTable(text[i]);
    }
  };

window.onload = function () {
  //pull all data from mongo
    refreshPage();
}

const addToPersonal = function (eventId) {
    console.log(JSON.stringify({eventId: eventId}));
    fetch("/add-user-event", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({eventId: eventId})
    }).then((response) => response.text()).then((text) => console.log(text));
};