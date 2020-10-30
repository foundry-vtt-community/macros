// Hides the camera boxes.
// Note: this has to be re-ran when the UI refreshes.

let cameras = document.getElementById("camera-views");
cameras.style.display = cameras.style.display === "none" ? "flex" : "none";
