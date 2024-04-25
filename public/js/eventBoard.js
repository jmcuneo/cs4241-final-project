// Set input boxes to empty - user does not have to delete previous entry
const resetTextBoxes = function () {
  document.querySelector("#event").value = "";
  document.querySelector("#date").value = "";
  document.querySelector("#startTime").value = "";
  document.querySelector("#endTime").value = "";
  document.querySelector("#location").value = "";
};

//check if input box is empty
function isEmpty(str) {
  return !str || str.length === 0;
}

const submit = async function (event) {
  event.preventDefault();
  const eventInput = document.querySelector("#event");
  const dateInput = document.querySelector("#date");
  const startInput = document.querySelector("#startTime");
  const endInput = document.querySelector("#endTime");
  const locationInput = document.querySelector("#location");
  const descriptionInput = document.querySelector("#description");

  //check all fields complete
  if (
    isEmpty(eventInput.value) ||
    isEmpty(dateInput.value) ||
    isEmpty(startInput.value) ||
    isEmpty(locationInput.value)
  ) {
    alert(
      "Please fill out all fields. If the end time is unknown, you may leave it blank."
    );
    return;
  }
  var input = document.getElementById("imageInput");
  var file = input.files[0];

  //wrap everything in formdata in order to pass image file over properly
  var formData = new FormData();
  formData.append("image", file);

  formData.append("event", eventInput.value);
  formData.append("date", dateInput.value);
  formData.append("startTime", startInput.value);
  formData.append("endTime", endInput.value);
  formData.append("location", locationInput.value);
  formData.append("description", descriptionInput.value);

  // Send FormData object with all the data in a single request
  const response = await fetch("/submit", {
    method: "POST",
    body: formData,
  });

  const text = await response.json();
  alert("event added");
  resetTextBoxes();
};


//allow user to view which file they opened
function previewImage() {
  var input = document.getElementById("imageInput");
  var file = input.files[0];

  var reader = new FileReader();
  reader.onload = function (event) {
    var imgPreview = document.getElementById("imagePreview");
    imgPreview.innerHTML =
      '<img src="' + event.target.result + '" width="200" alt="Preview">';
  };
  reader.readAsDataURL(file);
}

window.onload = function () {
  const button = document.getElementById("submit");
  button.onclick = submit;
  const uploadButton = document.getElementById("upload");
  uploadButton.onclick = upload;

  const descriptionButton = document.getElementById("details");
  descriptionButton.onclick = description;
  document
    .getElementById("imageInput")
    .addEventListener("change", previewImage);
};
