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

let states = ["Alaska", "Alabama", "Arkansas", "Arizona", "California", "Colorado", "Connecticut", "District of Columbia", "Delaware", "Florida", "Georgia", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"];
let books = ["Gender Queer: A Memoir", "All Boys Aren't Blue", "The Bluest Eye", "Flamer", 
    "Looking For Alaska", "The Perks of Being a Wallflower", "Lawn Boy", 
    "The Absoutely True Diary of a Part-Time Indian", "Out of Darkness",
    "A Court of Mist and Fury", "Crank", "Me and Earl and the Dying Girl", 
    "This Book is Gay"];

function createDropdowns() {
    var dropdownMenu1 = d3.select("#selDataset1");
        states.forEach((state) => {
        dropdownMenu1.append("option").attr("value", state).text(state);
    });
    
    var dropdownMenu2 = d3.select("#selDataset2");
        books.forEach((book) => {
        dropdownMenu2.append("option").attr("value", book).text(book);
    });
    
    dropdownMenu1.on("change", function() {
        updateMarker();
    });
    
    dropdownMenu2.on("change", function() {
        updateMarker();
    });
};
    
createDropdowns();
    
let markersLayer = L.layerGroup().addTo(map);
    
function updateMarker() {
    markersLayer.clearLayers();
    
    var selectedState = d3.select("#selDataset1").property("value");
    var selectedBook = d3.select("#selDataset2").property("value");
    
    if (selectedState) {
        coordinates(selectedState, selectedBook);
    }
};
    
const url = 'https://gist.githubusercontent.com/meiqimichelle/7727723/raw/0109432d22f28fd1a669a3fd113e41c4193dbb5d/USstates_avg_latLong';
let stateCoordinates;
    
function coordinates(selectedState, selectedBook) {
    d3.json(url).then((data) => {
        stateCoordinates = {};
        data.forEach(state => {
            stateCoordinates[state.state] = [state.latitude, state.longitude];
        });
    
    // Call updateMarker function inside coordinates function
    updateMarker(selectedState, selectedBook);
    }).catch(error => console.log(error));
}
    
function getCoordinates(state) {
    return stateCoordinates[state];
};