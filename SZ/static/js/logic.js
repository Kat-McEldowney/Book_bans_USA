// Define the book data
let booksData = {
  "Gender Queer: A Memoir": {
      "title": "Gender Queer",
      "author": "Maia Kobabe",
      "publisher": "Turtleback",
      "publish_date": 2019
  },
  "All Boys Aren't Blue": {
      "title": "All Boys Aren't Blue",
      "author": "George M. Johnson",
      "publisher": "Farrar, Straus & Giroux",
      "publish_date": 2020
  },
  "The Bluest Eye": {
      "title": "The Bluest Eye",
      "author": "Toni Morrison",
      "publisher": "Debolsillo",
      "publish_date": 1970
  },
  "Flamer": {
      "title": "Flamer",
      "author": "Mike Curato",
      "publisher": "Henry Holt and Co. (BYR)",
      "publish_date": 2020
  },
  "Looking for Alaska": {
      "title": "Looking for Alaska",
      "author": "John Green",
      "publisher": "Large Print Press",
      "publish_date": 2005
  },
  "The Perks of Being a Wallflower": {
      "title": "The Perks of Being a Wallflower",
      "author": "Stephen Chbosky",
      "publisher": "Editura Trei",
      "publish_date": 1999
  },
  "Lawn Boy": {
      "title": "Lawn Boy",
      "author": "Gary Paulsen",
      "publisher": "Random House Publishing Group",
      "publish_date": 1993
  },
  "The Absolutely True Diary of a Part-Time Indian": {
    "title": "The Absolutely True Diary of a Part-Time Indian",
    "author": "Sherman Alexie",
    "publisher": "Little, Brown and Company",
    "publish_date": 2007
  },
  "Out of Darkness": {
      "title": "Out of darkness",
      "author": "Ashley Hope Perez P\u00e9rez",
      "publisher": "Carolrhoda Lab",
      "publish_date": 2015
  },
  "A Court of Mist and Fury": {
      "title": "A Court of Mist and Fury",
      "author": "Sarah J. Maas",
      "publisher": "Bloomsbury USA Childrens",
      "publish_date": 2014
  },
  "Crank": {
      "title": "Crank",
      "author": "Ellen Hopkins",
      "publisher": "Simon & Schuster, Limited",
      "publish_date": 2001
  },
  "Me and Earl and the Dying Girl": {
      "title": "Me and Earl and the Dying Girl",
      "author": "Jesse Andrews",
      "publisher": "Imprint unknown",
      "publish_date": 2012
  },
  "This Book Is Gay": {
      "title": "This Book Is Gay",
      "author": "Dawson, James (Young adult fiction writer)",
      "publisher": "Hot Key Books",
      "publish_date": 2014
  }
};

// ----------------------------------------------------------------------------------------------

// Selects all elements with the class book-image from the HTML and stores them in bookImages
// https://www.w3schools.com/jsref/met_document_queryselectorall.asp
let bookImages = document.querySelectorAll('.book-image');

// Convert bookImages to array for looping
bookImages = Array.from(bookImages); // querySelectorAll returns a NodeList, not an array. Need array for forEach

// Loop through each book image
// bookImage represents current bookImage and index represents its index in the array
bookImages.forEach((bookImage, index) => {
  // Get the book title from the 'alt' atribute in the html
  let bookTitle = bookImage.getAttribute('alt');
  // console.log('Book title:', bookTitle); // Check the value of bookTitle for debugging purposes
  
  // Get the book data using the title
  let bookData = booksData[bookTitle];
  console.log('Book data:', bookData); // checks if bookData is correctly retrieved 

  // Call the function to add hover effect
  addHoverEffect(bookImage, bookData);
   
});

// ----------------------------------------------------------------------------------------------

// Function to create hover effect for each book image
function addHoverEffect(bookImage, bookData) {
  let hoverBox = document.createElement('div');
  hoverBox.classList.add('hover-box');
  hoverBox.innerHTML = `
      <p><strong>Title:</strong> ${bookData.title}</p>
      <p><strong>Author:</strong> ${bookData.author}</p>
      <p><strong>Publisher:</strong> ${bookData.publisher}</p>
      <p><strong>Publish Date:</strong> ${bookData.publish_date}</p>
  `;
  hoverBox.style.display = 'none'; // Hide the hover box initially
  hoverBox.style.position = 'absolute'; // Set position to absolute
  hoverBox.style.backgroundColor = 'white'; // Add a white background color

  // Append the hover box to the body element
  document.body.appendChild(hoverBox);

  // Event listener for mouse enter
  bookImage.addEventListener('mouseover', function(event) {
      hoverBox.style.display = 'block'; // Show the hover box
      hoverBox.style.left = event.pageX + 'px'; // Set left position relative to the mouse cursor
      hoverBox.style.top = event.pageY + 'px'; // Set top position relative to the mouse cursor
  });

  // Event listener for mouse leave
  bookImage.addEventListener('mouseleave', function() {
      hoverBox.style.display = 'none'; // Hide the hover box
  });
}

// ----------------------------------------------------------------------------------------------

// Set up map
// Adding the tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Define an overlay object to hold overlay layers
let overlayLayers = {};

// Define the bounds for the United States
let bounds = L.latLngBounds(
  L.latLng(24.396308, -125.0), // Southwest corner (lower left)
  L.latLng(49.384358, -66.93457) // Northeast corner (upper right)
);

// Creating a map object and setting the view to center on the US
let map = L.map('map', {
  maxBounds: bounds, // Set the maximum bounds
  maxBoundsViscosity: 1.0 // Make the bounds stick to the edges of the map
}).setView([39.8283, -98.5795], 4);

// Adding the streetmap layer to the map
streetmap.addTo(map);
//Finished setting up map

// ----------------------------------------------------------------------------------------------

// get coordinates for each state
stateUrl = "https://gist.githubusercontent.com/meiqimichelle/7727723/raw/0109432d22f28fd1a669a3fd113e41c4193dbb5d/USstates_avg_latLong";
let stateCoordinates;

d3.json(stateUrl).then((data) => {
    stateCoordinates = {};
    data.forEach(state => {
        stateCoordinates[state.state] = [state.latitude, state.longitude];
    });

    console.log(stateCoordinates);
});

// Function to get coordinates for a given state
function getCoordinates(state) {
    return stateCoordinates[state];
};
// Finished getting coordinates for each state

// ----------------------------------------------------------------------------------------------

let bannedBooks = []; // Store all banned book entries

// Load the JSON data containing the ban information
d3.json("pen_13_most_banned.json").then(function(data) {
  bannedBooks = data; // Store all the ban information
});

// ----------------------------------------------------------------------------------------------

// When clicking on a book image (set up in html)
function onBookImageClick(bookTitle) {
  handleBookClick(bookTitle);
}

// ----------------------------------------------------------------------------------------------

 // Define getColor function to color marker based on number of bans
 function getColor(totalBans) {
  if (totalBans < 3) {
      return "green";
  } else if (totalBans < 5) {
      return "yellow";
  } else if (totalBans < 8) {
      return "orange";
  } else if (totalBans < 12) {
      return "orange-dark";
  } else {
      return "red";
  }
};

// ----------------------------------------------------------------------------------------------

// Function to handle book click event
function handleBookClick(bookTitle) {
  console.log("Clicked on book:", bookTitle); // Debug output

  // remove all the markers in one go
  clearMarkers();

  // Find all entries for the selected book
  let bookEntries = bannedBooks.filter(entry => entry.Title === bookTitle);

  //declare variable to hold info from all the markers
  let markerInfo = [];
  
  console.log("Book entries:", bookEntries); // Debug output

  // Iterate over each entry and add markers for banned states
  bookEntries.forEach(entry => {
      let bannedStates = entry.State.split(", ");
      let popupContent = '';
      bannedStates.forEach(state => {
        popupContent += `<strong>${state}</strong><br>`;
        popupContent += `Banned:<br>`;
        if (entry['School Ban'] !==0)
        popupContent += `In Classrooms: ${entry['School Ban']}<br>`;
        if (entry['Library Ban'] !==0)
        popupContent += `In Libraries: ${entry['Library Ban']}<br>`;
        if (entry['Pending Investigation'] !==0)
        popupContent += `Pending Investigation: ${entry['Pending Investigation']}<br>`;
        popupContent += `Total: ${entry['Total Ban']}<br>`;
        addMarker(state, entry['Total Ban'], getColor(entry['Total Ban']), popupContent); // sends state, total bans, and color
        markerInfo.push(popupContent);
      });    
  });
  populateSidebar(markerInfo);

}
// ----------------------------------------------------------------------------------------------

// Function to add a marker on the map for a given state that a clicked book is banned in
function addMarker(state, totalBans, color, popupContent) {
  // Get coordinates for the given state
  var coordinates = getCoordinates(state);

  // Create a marker icon with the fa-number icon (from leaflet extra markers)
  // https://github.com/coryasilva/Leaflet.ExtraMarkers#properties
  var markerIcon = L.ExtraMarkers.icon({
    icon: 'fa-number',
    number: totalBans, 
    markerColor: color, // blue is placeholder for a color variable that will change based on count
    shape: 'star', // options: circle, square, star, penta, octagon
    prefix: 'fa' // specifies this marker will be using Font Awesome icons
  });

  // Create a marker with the custom icon and add it to the map
  var marker = L.marker(coordinates, {icon: markerIcon}).addTo(map);

  //bindPopup with info for each marker
  marker.bindPopup(popupContent) 
}

// ----------------------------------------------------------------------------------------------

// Function to clear all markers from the map
function clearMarkers() {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}

// ----------------------------------------------------------------------------------------------

// create sidebar on page
var sidebar = document.getElementById('markerList');

// function to populate sidebar with marker info
function populateSidebar(markerInfo) {
    // clear existing text in sidebar
    sidebar.innerHTML = ' ';

    //iterate through the markers
    markerInfo.forEach(function(marker) {
        // create list item for text
        var lineItem = document.createElement('li');

        // create paragrah for each 
        var newLine = document.createElement('p');
        newLine.innerHTML = marker;

        // Append the paragraph to the list item
        lineItem.appendChild(newLine);

        // Append the list item to the sidebar
        sidebar.appendChild(lineItem);
      }); 
}