let clickedStatuses = {};

// Function to create buttons for each book
 function createBookButtons(data) {
    let buttonsContainer = document.getElementById('buttons-container');
    let row0 = buttonsContainer.appendChild(document.createElement('div'));
    let row1 = buttonsContainer.appendChild(document.createElement('div'));
    let count = 0;

    for (let title in data) {
        clickedStatuses[title] = false;
        let book = data[title];
        let button = document.createElement('button');
        let img = document.createElement('img');

        // Set button text to book title - I commented this out but we can add it back in
        // button.textContent = book.title;

        // Set image source to cover image from file
        img.src = `cover_images/${book.title}_cover.jpg`;
        img.alt = `${book.title} cover`;
        img.style.maxWidth = 'auto';
        img.style.maxHeight = '80%';
        img.style.objectFit = 'cover'; 

        // Append the image to the button
        button.appendChild(img);
        
        // Append the button to the row
        if (count < 7) {
            row0.appendChild(button);
        } else {
            row1.appendChild(button);
        } 
        
        button.classList.add('button');

        let hoverBox = document.createElement('div') 
        hoverBox.classList.add('hover-box');
        hoverBox.innerHTML = `
            <p><strong>Title:</strong> ${book.title}</p>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Publisher:</strong> ${book.publisher}</p>
            <p><strong>Publish Date:</strong> ${book.publish_date}</p>
        `;
        hoverBox.style.display = 'none'; // Hide the hover box initially

        // Append the hover box to the button
        button.appendChild(hoverBox);

        // Event listener for mouse enter
        button.addEventListener('mouseover', function() {
            hoverBox.style.display = 'block'; // Show the hover box
        });

        // Event listener for mouse leave
        button.addEventListener('mouseleave', function() {
            hoverBox.style.display = 'none'; // Hide the hover box
        });

        button.addEventListener('click', function() {
            clickedStatuses[title] = !clickedStatuses[title]; 
            console.log(clickedStatuses)
        });

        count++;
        console.log(count)
    }  
}

// fetch function to load json data and run function to create top tiles

async function connectJsonToButtons() {
    fetch('book_info.json')
        .then(response => response.json())
        .then(data => createBookButtons(data))
        .catch(error => console.error('Error loading JSON:', error));
}

connectJsonToButtons();

// Adding the tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// baseMaps object to hold the streetmap layer
let baseMaps = {
    "Street Map": streetmap
};

// crate a map object
let map = L.map("map", {
    center: [39.7392, -100],
    zoom: 4,
    layers: [streetmap]
});

// layer control, pass it baseMaps and overlayMaps.
// L.control.layers(baseMaps, {
//     collapsed: false
// }).addTo(map);

let states = ['Florida', 'Colorado'];
let books = ['Gender Queer: A Memoir', "All Boys Aren't Blue"];

function createDropdowns() {
    // Use d3 to select dropdown menu
    var dropdownMenu1 = d3.select("#selDataset1");

        // add states to dropdown menu
        states.forEach((state) => {
            dropdownMenu1.append("option").attr("value", state).text(state);
    });

    var dropdownMenu2 = d3.select("#selDataset2");

        // add books to dropdown menu
        books.forEach((book) => {
            dropdownMenu2.append("option").attr("value", book).text(book);
    });

    // Set up event listeners for changes in dropdown menus
    dropdownMenu1.on("change", function() {
        updateMarker();
    });
    dropdownMenu2.on("change", function() {
        updateMarker();
    });
};

createDropdowns();

let marker;

// Create a layer group for markers
let markersLayer = L.layerGroup().addTo(map);

function updateMarker() {
    // Get selected state and book
    var selectedState = d3.select("#selDataset1").property("value");
    var selectedBook = d3.select("#selDataset2").property("value");

    // Clear existing markers
    markersLayer.clearLayers();

    // Add marker for the selected state
    if (selectedState) {
        // Get coordinates for the selected state
        var coordinates = getCoordinates(selectedState);
        if (coordinates) {
            // Create marker and bind popup
            var marker = L.marker(coordinates);
            marker.bindPopup("Book: " + selectedBook + "<br>State: " + selectedState);
            // Add marker to layer group
            markersLayer.addLayer(marker);
        }
    }
};

// Define a dictionary mapping state names to coordinates
let stateCoordinates = {
    'Florida': [27.994402, -81.760254], // Example coordinates for Florida
    'Colorado': [39.550051, -105.782067] // Example coordinates for Colorado
};

// Function to get coordinates for a given state (you need to implement this)
function getCoordinates(state) {
    return stateCoordinates[state];
};