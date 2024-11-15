const API_KEY = 'AIzaSyD4Jf3ivupRP5VUfdkSeo7cG9cUTFHawHQ'; // Replace with your API key
const SHEET_ID = '1eSpW1Wa4-DkVidWFX-azeCuLO7259-qcslPPmliZrpE'; // Replace with your Google Sheet ID

// Function to search for a product
function searchProduct(productCode) {
  // Check if the product code is passed directly; if not, get it from the input
  if (!productCode) {
    productCode = document.getElementById('productCodeInput').value;
  }

  // Validate the product code input
  if (!productCode) {
    alert('Please enter a valid Product Code.');
    return;
  }

  // Fetch product data from Google Sheets
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const rows = data.values;
      const headers = rows[0]; // Get the header row
      const product = rows.find(row => row[0] === productCode); // Find the product by code

      if (product) {
        // Populate the product details in the result section
        const productDataDiv = document.getElementById('productData');
        productDataDiv.innerHTML = ''; // Clear any previous details
        headers.forEach((header, index) => {
          const detail = document.createElement('p');
          detail.textContent = `${header}: ${product[index]}`;
          productDataDiv.appendChild(detail);
        });

        // Hide the home section and show the result section
        document.getElementById('home').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('backButton').style.display = 'block';
      } else {
        alert('Product not found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching product data. Please try again later.');
    });
}

// Function to go back to the home section
function goBack() {
  document.getElementById('home').style.display = 'block';
  document.getElementById('result').style.display = 'none';
  document.getElementById('backButton').style.display = 'none';
  document.getElementById('productCodeInput').value = ''; // Clear input field
}

// Function to start the QR Code scanner
function startQRScanner() {
  if (typeof Html5Qrcode === "undefined") {
    alert("QR Code scanner library failed to load!");
    return;
  }

  const html5QrCode = new Html5Qrcode("cameraFeed");
  
  // Show the camera modal
  const cameraModal = document.getElementById('cameraModal');
  cameraModal.style.display = 'flex';
  cameraModal.style.visibility = 'visible';

  // Start scanning for QR codes
  html5QrCode.start(
    { facingMode: "environment" }, // Use the back camera
    { fps: 10, qrbox: { width: 200, height: 200 } }, // Set scanner frame size
    (qrCodeMessage) => {
      html5QrCode.stop(); // Stop scanning
      searchProduct(qrCodeMessage); // Search for the product using the scanned code
      closeModal(); // Close the modal
    },
    (errorMessage) => {
      console.warn("QR Code scanning error:", errorMessage);
    }
  ).catch((err) => {
    console.error("Unable to start scanning", err);
    alert("Error starting the camera. Please try again.");
  });
}

// Function to close the camera modal
function closeModal() {
  const cameraModal = document.getElementById('cameraModal');
  cameraModal.style.visibility = 'hidden';
  cameraModal.style.display = 'none'; // Hide the camera modal
}
function openCamera() {
  const cameraModal = document.getElementById('cameraModal');
  cameraModal.style.visibility = 'visible';
  cameraModal.style.display = 'flex'; // Show the camera modal
}
