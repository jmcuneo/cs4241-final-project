const addToTable = function (entry) {
    const table = document.getElementById("table");
    const row = `<tr id="entryRow">
                  <td>${entry.event}</td>
                  <td>${entry.date}</td>
                  <td>${entry.startTime}</td>
                  <td>${entry.length}</td>
                  <td>${entry.location}</td>
                  <td><button class="info" onclick="info('${entry.event}')">See more details</button></td>
                </tr>`;
    table.insertAdjacentHTML("beforeend", row);
    //eventlistener
    const infoButton = table.querySelector(".info:last-child");
    // infoButton.addEventListener("click", function (event) {
    //   event.preventDefault();
    // });
  };
 //check if input box is empty
 function isEmpty(str) {
    return !str || str.length === 0;
  }

// const view =  async function (event){
//     event.preventDefault();
//     const response = await fetch("/view", {
//             method: "POST",
//             body: "",
//           });
//     const events = await response.json();
  
//   }

  const info = async function (eventName){
    console.log("hello world");
    //send the index of the entry user wants to delete from array
    const reqObj = { eventName: eventName };
    const response = await fetch("/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqObj),
      //body: JSON.stringify(eventName)
    });
    const eventInfo = await response.json();
    //get image
    if((eventInfo.image == null) && (eventInfo.description == null)){
        console.log("nothing to display");
        const descriptionContainer = document.getElementById('descriptionContainer');
        const txtElement = document.createElement('p');
        txtElement.innerHTML = "No additional details";
        descriptionContainer.appendChild(txtElement);
    }
    if(eventInfo.image != null){
        console.log("response image type: ", typeof(eventInfo.image));
        console.log("image: ", eventInfo.image);
        const imageContainer = document.getElementById('imageContainer');
        const imgElement = document.createElement('img');
        imgElement.src = eventInfo.image;
        //imgElement.alt = 'Uploaded Image';
        imageContainer.appendChild(imgElement) 
    }else {
        console.log("no image");
    }
    if(eventInfo.description != null){
        console.log("response desc type: ", typeof(eventInfo.description));
        console.log("descrip: ", eventInfo.description.description);
        const descriptionContainer = document.getElementById('descriptionContainer');
        const txtElement = document.createElement('p');
        txtElement.innerHTML = eventInfo.description.description;
        descriptionContainer.appendChild(txtElement); 

    }else{
        console.log("no text");
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
    console.log("page refreshed.");
  };


window.onload = function () {
    refreshPage();
    // const viewButton = document.getElementById("view");
    // viewButton.onclick = view;

    // const tableEvent = document.getElementById("table");
    // tableEvent.addEventListener("click", function (event) {
    //   event.preventDefault();
    //   if (event.target && event.target.classList.contains("info")) {
    //     const entryIndex = event.target.closest("tr").rowIndex - 1; // Subtract 1 because of table header
    //     info.onclick = info(entryIndex);
    //   }
    // });
}