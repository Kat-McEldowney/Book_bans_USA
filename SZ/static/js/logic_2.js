//load data from json:

let bookData = []

d3.json('pen_13_most_banned.json').then(function(data) {
  bookData= data;
  addBookImages();
  console.log("Banned books data loaded:", bookData);
}).catch(function(error) {
    console.error("Error loading banned books data:", error);
});
  
  // Function to create hover effect for each book image
  function addHoverEffect(bookImage, bookData) {
    let hoverBox = document.createElement('div');
    hoverBox.classList.add('hover-box');
    hoverBox.innerHTML = `
        <p><strong>Title:</strong> ${bookData.Title}</p>
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
  
  //put grabbing book images into a function to call when loading book data
  function addBookImages() {
    let bookImages = document.querySelectorAll('.book-image');
    
    // Convert NodeList to array
    bookImages = Array.from(bookImages);
    
    // Loop through each book image
    bookImages.forEach((bookImage, index) => {
      // Get the book title
      let bookTitle = bookImage.getAttribute('alt');
      console.log('Book title:', bookTitle); // Check the value of bookTitle
      
      // Get the book data using the title
      let bookData = bookData[bookTitle];
      console.log('Book data:', bookData); // Check the value of bookData
    
      // Call the function to add hover effect
      addHoverEffect(bookImage, bookData);
     
  });
}
  
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
  
  let bannedBooks = []; // Store all banned book entries
  
  // Load the JSON data containing the ban information
  d3.json("pen_13_most_banned.json").then(function(data) {
    bannedBooks = data; // Store all the ban information
  });
  
  // When clicking on a book image (set up in html)
  function onBookImageClick(bookTitle) {
    handleBookClick(bookTitle);
  }
  
  // Function to handle book click event
  function handleBookClick(bookTitle) {
    // remove all the markers in one go
    clearMarkers();
  
    // Find all entries for the selected book
    let bookEntries = bannedBooks.filter(entry => entry.Title === bookTitle);

    //declare variable to hold info from all the markers
    let markerInfo = [];
  
    // Iterate over each entry and add markers for banned states and create pop up info
    bookEntries.forEach(entry => {
        let bannedStates = entry.State.split(", ");
        let popupContent = '';
        bannedStates.forEach(state => {
            popupContent += `State: ${state}<br>`;
            popupContent += `${entry['Type of Ban']}: ${entry['Count']}}<br>`;
          addMarker(state, popupContent);
          markerInfo.push(popupContent);
        });    
    });
    populateSidebar(markerInfo);
  }
  
  // Function to add a marker on the map for a given state
  function addMarker(state, popupContent) {
    // Get coordinates for the given state
    var coordinates = getCoordinates(state);
  
     // Create a marker and bind a popup with state information
    var marker = L.marker(coordinates).addTo(map); 
     //bindPopup with info for each marker
     marker.bindPopup(popupContent) 
  }
  
  // Function to clear all markers from the map
  function clearMarkers() {
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
  }

// create sidebar on page
var sidebar = document.getElementById('markerList');

// function to populate sidebar with marker info
function populateSidebar(markerInfo) {
    // clear existing text in sidebar
    sidebar.innerHTML = '';
    //iterate through the markers
    markerInfo.forEach(function(marker) {
        // create list item for text
        var lineItem = document.createElement('li');
        //iterate through text in the marker
        markerInfo.forEach(function(line) {
          // create paragrah for each 
          var newLine = document.createElement('p');
          newLine.innerHTML = line;
          lineItem.append(newLine);
        }); 
            sidebar.appendChild(lineItem);
        });
}
    // sidebar.innerHTML = sidebarText;


// /er information
// updateSidebar(initialMarkerData);

  
  // Add button that says all 13 books or something
  // circles based on count
  
  
  // oneTitle.forEach(function(row) {
  //   var state = row.State;
  //   var banType = row["Type of Ban"];
  //   var coordinates = stateCoord[state];
  //   var amount = row["Count"]
  
