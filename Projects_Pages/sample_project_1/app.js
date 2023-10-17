// app.js

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const clearButton = document.getElementById("clearButton");
const submitButton = document.getElementById("submitButton");
const imageInput = document.getElementById("imageInput");

let isDrawing = false;

imageInput.addEventListener("change", loadImage);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
clearButton.addEventListener("click", clearCanvas);

function loadImage(event) {
    const file = event.target.files[0];
    const img = new Image();
    img.onload = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, 1500, 1500);
    };
    img.src = URL.createObjectURL(file);
}

function startDrawing(event) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(
        event.touches[0].clientX - canvas.getBoundingClientRect().left,
        event.touches[0].clientY - canvas.getBoundingClientRect().top
    );
}

function draw(event) {
    if (!isDrawing) return;
    context.lineWidth = 5; // Adjust as needed
    context.lineCap = "round";
    context.strokeStyle = colorPicker.value;
    context.lineTo(
        event.touches[0].clientX - canvas.getBoundingClientRect().left,
        event.touches[0].clientY - canvas.getBoundingClientRect().top
    );
    context.stroke();
}

function stopDrawing() {
    isDrawing = false;
    context.closePath();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

submitButton.addEventListener("click", () => {
    const imageDataURL = canvas.toDataURL("image/png");
    localStorage.setItem("editedImage", imageDataURL);
    window.location.href = "02_observation_image.html";
});
