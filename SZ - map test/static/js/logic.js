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