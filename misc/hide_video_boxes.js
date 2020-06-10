// Hides the camera boxes. If you just want to collapse the boxes to the name, change "camera-views" to "video-container"
// Note: this has to be re-ran when the UI refreshes.

let cameras = document.getElementById("camera-views");
cameras.style.display = cameras.style.display === "none" ? "flex" : "none";
