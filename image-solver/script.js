const mysteryPic = document.getElementById('mystery-pic');
const imageGallery = document.getElementById('image-gallery');
const matchButton = document.getElementById('match-button');
const resultDiv = document.getElementById('result');

let images = []; // Array to hold image URLs
let mysteryImage = null; // To hold the full mystery image
let pixelatedData = null; // To hold pixelated image data

// Load images and display the mystery pixel area
function loadImages() {
    // Replace with your image URLs
    images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
    
    // Display random mystery image
    const randomIndex = Math.floor(Math.random() * images.length);
    mysteryImage = images[randomIndex];

    // Create a small pixelated view of a portion of the mystery image
    createMysteryPic(mysteryImage);
    
    // Display image gallery
    images.forEach(image => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'image-item';
        imgDiv.style.backgroundImage = `url(${image})`;
        imageGallery.appendChild(imgDiv);
    });
}

// Function to create a small pixelated area from the mystery image
function createMysteryPic(imageSrc) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 100; // Full image width for scaling
    canvas.height = 100; // Full image height for scaling

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        // Draw the full image on canvas
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get a small pixelated portion (e.g., a 20x20 section)
        const x = Math.floor(Math.random() * (canvas.width - 20));
        const y = Math.floor(Math.random() * (canvas.height - 20));
        
        // Extract the pixelated area
        const imageData = context.getImageData(x, y, 20, 20);
        context.putImageData(imageData, 0, 0);
        pixelatedData = imageData.data; // Store pixelated data for comparison

        // Display the small area
        mysteryPic.style.backgroundImage = `url(${canvas.toDataURL()})`;
    };
}

// Function to find the best match for the pixelated area
function findMatch() {
    if (!pixelatedData) {
        alert('Pixelated data is not ready.');
        return;
    }

    let bestMatch = null;
    let bestScore = Infinity; // Lower is better
    
    images.forEach(imageSrc => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 100; // Full image width for scaling
            canvas.height = 100; // Full image height for scaling
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Extract a small pixelated area (same logic as before)
            const x = Math.floor(Math.random() * (canvas.width - 20));
            const y = Math.floor(Math.random() * (canvas.height - 20));
            const comparisonData = context.getImageData(x, y, 20, 20).data;

            // Calculate a score based on pixel differences
            const score = calculateScore(pixelatedData, comparisonData);
            if (score < bestScore) {
                bestScore = score;
                bestMatch = imageSrc;
            }
            // Update the result after all images are processed
            if (imageSrc === images[images.length - 1]) {
                resultDiv.textContent = `Best match: ${bestMatch} with score ${bestScore}`;
            }
        };
    });
}

// Function to calculate the difference score between two pixelated data sets
function calculateScore(data1, data2) {
    let score = 0;
    for (let i = 0; i < data1.length; i++) {
        score += Math.abs(data1[i] - data2[i]);
    }
    return score;
}

// Initialize the app and set up event listeners
loadImages();
matchButton.onclick = findMatch;
