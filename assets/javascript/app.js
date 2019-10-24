// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAqD-8vPER6P5gBzBGYaO6FKoOCyvcdq3E",
  authDomain: "bootcamp-project-1-d0094.firebaseapp.com",
  databaseURL: "https://bootcamp-project-1-d0094.firebaseio.com",
  projectId: "bootcamp-project-1-d0094",
  storageBucket: "bootcamp-project-1-d0094.appspot.com",
  messagingSenderId: "1061128339510",
  appId: "1:1061128339510:web:e27275aa9407ce877b1897",
  measurementId: "G-5G4EQWVG43"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

var searchCounter = 0;

var database = firebase.database();
var searchRef = database.ref("/searches");

function searchStats() {
  console.log("searchStats function called");
  // * grab a snapshot of the search results from DB
  return firebase
    .database()
    .ref("/searches")
    .once("value")
    .then(function(snapshot) {
      var numberOfRecords = snapshot.numChildren();

      var searchedArtistArray = [];
      // * Grabs snapshot of DB
      var searchStatsResults = snapshot.val();
      // * This grabs the db record IDs and puts into searchIds array
      var searchIds = Object.getOwnPropertyNames(searchStatsResults).sort();
      // * Loop through records..grabs Artist Name and put into searchedArtistArray
      for (var i = 0; i < searchIds.length; i++) {
        searchedArtistArray.push(
          searchStatsResults[searchIds[i]].itunesSearchResults.artistName
        );
      }
      searchedArtistArray.sort();
      var current = null;
      var counter = 0;
      for (var i = 0; i < searchedArtistArray.length; i++) {
        if (searchedArtistArray[i] != current) {
          if (counter > 0) {
            document.write(current + " comes --> " + counter + " times<br>");
          }
          current = searchedArtistArray[i];
          counter = 1;
        } else {
            counter++;
        }
      }
      if (counter > 0) {
        document.write(current + " comes --> " + counter + " times");
      }
    });
}
function updateFireBaseItunesData(resultsObj) {
  database.ref("/searches").push({
    itunesSearchResults: resultsObj,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
}
function callItunesApi(search) {
  var ituneSettings = {
    async: true,
    crossDomain: true,
    url: "https://itunes.apple.com/search?term=" + search + "&limit=3",
    method: "GET"
  };

  // * Ajax API call to itunes
  $.ajax(ituneSettings).done(function(response) {
    var itunesObj = {
      artistName: "",
      trackName: "",
      artistId: "",
      albumName: "",
      releaseDate: "",
      previewUrl: "",
      artworkUrl30: "",
      artworkUrl60: "",
      artworkUrl100: ""
    };

    var itunesObjArray = [];
    var responseObj = JSON.parse(response);

    resultCount = responseObj.resultCount;
    resultsArray = responseObj.results;

    // * loop through resultsArray and create itunesResultsArray
    // * using itunesObj
    for (var x = 0; x < resultCount; x++) {
      itunesObj.artistName = resultsArray[x].artistName;
      itunesObj.trackName = resultsArray[x].trackName;
      itunesObj.artistId = resultsArray[x].artistId;
      itunesObj.albumName = resultsArray[x].collectionName;
      itunesObj.releaseDate = resultsArray[x].releaseDate;
      itunesObj.previewUrl = resultsArray[x].previewUrl;
      itunesObj.artworkUrl30 = resultsArray[x].artworkUrl30;
      itunesObj.artworkUrl60 = resultsArray[x].artworkUrl60;
      itunesObj.artworkUrl100 = resultsArray[x].artworkUrl100;

      itunesObjArray.push(itunesObj);
      //   console.log(itunesObj.trackName);
      console.log(itunesObj);
      updateFireBaseItunesData(itunesObj);
    }
    // console.log(itunesObjArray[2]);
  });
}

// search_results = "Moe";

// callItunesApi(search_results);


function getSearchInfo() {
  console.log("clicked");
  event.preventDefault();
  var artistInput = $("#textarea1")
    .val()
    .trim();
  // var zipCode = $(".input-field2").val().trim();
  console.log(artistInput);
  callItunesApi(artistInput);
  // console.log(zipCode);
  // $("#textarea1").val("");
  var queryURL =
    "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&keyword=" +
    artistInput +
    "&apikey=VNUkdWcssRsgC8X8Vg617XiGSpQQYPfV";

  $.ajax({
    type: "GET",
    url: queryURL,
    async: true,
    dataType: "json",
    success: function(json) {
      console.log(json);


      $(".td").empty();
      for (var i = 0; i < json._embedded.events.length; i++) {
        if (i >= 5) {
          return;
        }
        console.log(json._embedded.events[i]._embedded.venues[0].name);
        console.log(json._embedded.events[i]._embedded.venues[0].city.name);
        console.log(json._embedded.events[i]._embedded.venues[0].state.name);
        console.log(json._embedded.events[i].dates.start.localDate);


        var tBody = $("tbody");
        var tRow = $("<tr>");
        // Methods run on jQuery selectors return the selector they we run on
        // This is why we can create and save a reference to a td in the same statement we update its text
        var venueNameDiv = $("<td>").text(
          json._embedded.events[i]._embedded.venues[0].name
        );
        var cityNameDiv = $("<td>").text(
          json._embedded.events[i]._embedded.venues[0].city.name
        );
        var stateNameDiv = $("<td>").text(
          json._embedded.events[i]._embedded.venues[0].state.name
        );
        var dateNameDiv = $("<td>").text(
          json._embedded.events[i].dates.start.localDate
        );
        // Append the newly created table data to the table row
        tRow.append(venueNameDiv, cityNameDiv, stateNameDiv, dateNameDiv);
        // Append the table row to the table body
        tBody.append(tRow);
      }
    }
  });
}
$(document).on("click", ".btn", getSearchInfo);



