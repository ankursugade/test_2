// Get references to the HTML elements
const form = document.getElementById('form'); // First form for file upload

// Add an event listener to the first form for file submission
form.addEventListener('submit', e => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the selected file from the file input
    const file = form.file.files[0];

    // Create a FileReader to read the file content as an array buffer
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);

    // When the file is loaded, perform the following actions
    fr.onload = f => {
        // Define the URL where the file will be uploaded using Google Apps Script
        const uploadURL = "https://script.google.com/macros/s/AKfycbxDNHL8-FbieIc07Zwk4F47UJqIQRyo-1Wtm6ZD6k8_fTOd0zB0j0M_7-r7iODd6VqY6Q/exec";

        // Create query parameters for the request, including the filename and MIME type
        const qs = new URLSearchParams({ filename: file.name, mimeType: file.type });

        // Send a POST request to upload the file content to the specified URL
        fetch(`${uploadURL}?${qs}`, { method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)]) })
            .then(res => res.json()) // Parse the response as JSON
            .then(data => {
                // Extract the "fileUrl" value from the JSON response and store it
                const receivedURL = data.fileUrl;

                // Redirect to the second HTML file with the file URL as a parameter
                window.location.href = `04_observation_report.html?fileURL=${receivedURL}`;
            })
            .catch(err => console.log(err)); // Handle any errors during the request
    }
});

// If no file is uploaded, set the second form's text field to 'Not Applicable' when the first form is submitted
form.addEventListener('submit', e => {
    if (!form.file.files.length) {
        e.preventDefault(); // Prevent the default form submission behavior

        // Redirect to the second HTML file with a default file URL parameter
        window.location.href = `04_observation_report.html?fileURL=Not Applicable`;
    }
});
