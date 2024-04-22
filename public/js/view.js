const addToTable = function (entry) {
    const table = document.getElementById("table");
    const row = `<tr id="entryRow">
                  <td>${entry.event}</td>
                  <td>${entry.date}</td>
                  <td>${entry.startTime}</td>
                  <td>${entry.length}</td>
                  <td>${entry.location}</td>
                  <td><button class="info">See more details</button></td>
                </tr>`;
    table.insertAdjacentHTML("beforeend", row);
    //eventlistener
    const infoButton = table.querySelector(".info:last-child");
    infoButton.addEventListener("click", function (event) {
      event.preventDefault();
    });
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

  const info = async function (entryIndex){
    console.log("hello world");
    //send the index of the entry user wants to delete from array
    const reqObj = { entryIndex: entryIndex };
    const response = await fetch("/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqObj),
    });
    const info = await response.json();
    //get image
    if((info.image == null) && (info.description == null)){
        console.log("nothing to display");
        const descriptionContainer = document.getElementById('descriptionContainer');
        const txtElement = document.createElement('p');
        txtElement.innerHTML = "No additional details";
        descriptionContainer.appendChild(txtElement);
    }
    if(info.image != null){
        console.log("response image type: ", typeof(info.image));
        console.log("image: ", info.image);
        const imageContainer = document.getElementById('imageContainer');
        const imgElement = document.createElement('img');
        imgElement.src = info.image;
        //imgElement.alt = 'Uploaded Image';
        imageContainer.appendChild(imgElement) 
    }else {
        console.log("no image");
    }
    if(info.description != null){
        console.log("response desc type: ", typeof(info.description));
        console.log("descrip: ", info.description.description);
        const descriptionContainer = document.getElementById('descriptionContainer');
        const txtElement = document.createElement('p');
        txtElement.innerHTML = info.description.description;
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

    const tableEvent = document.getElementById("table");
    tableEvent.addEventListener("click", function (event) {
      event.preventDefault();
      if (event.target && event.target.classList.contains("info")) {
        const entryIndex = event.target.closest("tr").rowIndex - 1; // Subtract 1 because of table header
        info.onclick = info(entryIndex);
      }
    });
}