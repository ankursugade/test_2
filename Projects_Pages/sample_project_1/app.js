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
    console.log("Image selected");

    const file = event.target.files[0];
    const img = new Image();
    img.onload = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        console.log("Image loaded and drawn on the canvas");
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
    console.log("Drawing started");
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
    console.log("Drawing in progress");
}

function stopDrawing() {
    isDrawing = false;
    context.closePath();
    console.log("Drawing stopped");
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas cleared");
}

submitButton.addEventListener("click", e => {
    e.preventDefault(); // prevent default form submission 
    console.log("Submit button pressed");

    canvas.toBlob(blob => {
        // Create a FormData object and append the Blob to it
        const formData = new FormData();

        // Create a unique file name for the image
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const dateString = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        const fileName = `Observation_Image_${dateString}.png`;

        formData.append('editedImage', blob, fileName);

        // Define the URL where the file will be uploaded using Google Apps Script
        const uploadURL = 'https://script.google.com/macros/s/AKfycbzpxU0Kfq_GXTxLdY_dktmQ92MefswRpmkOACxp9b6SIX-SEzN1GpmH8Xwmr0HFjxLeKQ/exec';

        // Create query parameters for the request, including the filename and MIME type
        const qs = new URLSearchParams({ filename: fileName, mimeType: 'image/png' });

        // Send a POST request to upload the file content to the specified URL
        fetch(`${uploadURL}?${qs}`, { method: 'POST', body: formData })
            .then(res => res.json()) // Parse the response as JSON
            .then(data => {
                // Extract the "fileUrl" value from the JSON response and store it
                const receivedURL = data.fileUrl;
                console.log('Image submitted successfully');

                // Redirect to the second HTML file with the file URL as a parameter
                window.location.href = `04_observation_report.html?fileURL=${receivedURL}`;
            })
            .catch(err => {
                console.log('Image submission failed');
                console.error(err);
            }); // Handle any errors during the request
    }, 'image/png'); // specify the image format ('image/png' for PNG )
});
