let quill;
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("hidden");
    quill = new Quill("#description", {
      theme: "snow",
      modules: {
          syntax: true,
          toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['clean']
          ]
      }
  });

  
  const button = document.getElementById("submit");
  button.onclick = submit;

  document.getElementById("image-input").addEventListener("change", previewImage);

  const imagePreview = document.getElementById("image-preview");
  const popupWrapper = document.getElementById("image-popup-wrapper");
  const popupImage = document.getElementById("image-popup");
  const closePopup = document.getElementById("close-popup");
  imagePreview.addEventListener("click", () => {
    popupWrapper.classList.remove("hidden");
    document.body.style.overflowY = "hidden";
    popupImage.src = imagePreview.src;
  });
  closePopup.addEventListener("click", () => {
    popupWrapper.classList.add("hidden");
    document.body.style.overflowY = "auto";
  });
  document.body.classList.remove("hidden");
});

// Set input boxes to empty - user does not have to delete previous entry
const resetTextBoxes = function () {
  document.querySelector("#event").value = "";
  document.querySelector("#date").value = "";
  document.querySelector("#startTime").value = "";
  document.querySelector("#endTime").value = "";
  document.querySelector("#location").value = "";
  document.querySelector("#image-input").value = "";
  document.querySelector("#image-preview").classList.add("hidden");
  quill.setContents([]);
};

//check if input box is empty
function isEmpty(str) {
  return !str || str.length === 0;
}

//submit
const submit = async function (event) {
  event.preventDefault();
  const eventInput = document.querySelector("#event");
  const dateInput = document.querySelector("#date");
  const startInput = document.querySelector("#startTime");
  const endInput = document.querySelector("#endTime");
  const locationInput = document.querySelector("#location");

  //check all fields complete
  if (isEmpty(eventInput.value) ||
      isEmpty(dateInput.value) ||
      isEmpty(startInput.value) ||
      isEmpty(endInput.value) ||
      isEmpty(locationInput.value)) {
    alert("Please fill out all required fields.");
    return;
  }
  let input = document.getElementById("image-input");
  let file = input.files[0];

  //wrap everything in formdata in order to pass image file over properly
  let formData = new FormData();
  formData.append("image", file);

  const date = dateInput.value;

  formData.append("event", eventInput.value);
  formData.append("date", date);
  formData.append("startTime", `${date}T${startInput.value}:00`);
  formData.append("endTime", `${date}T${endInput.value}:00`);
  formData.append("location", locationInput.value);
  formData.append("description", JSON.stringify(quill.getContents()));

  // Send FormData object with all the data in a single request
  const response = await fetch("/submit", {
    method: "POST",
    body: formData,
  });

  const text = await response.json();
  alert("event added");
  //generateTable(text);
  resetTextBoxes();
};


//allow user to view which file they opened
function previewImage() {
  let input = document.getElementById("image-input");
  let file = input.files[0];

  let reader = new FileReader();
  reader.onload = function (event) {
    let imgPreview = document.getElementById("image-preview");
    imgPreview.src = event.target.result;
    imgPreview.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
}