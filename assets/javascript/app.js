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

var searchCounter = 0;
var database = firebase.database();
var searchRef = database.ref("/searches");
var resultsTallyArray = [];

function compare(a,b) {
  const tallyA = a.timesSearched;
  const tallyB = b.timesSearched;

  let comparison = 0;
  if (tallyA > tallyB) {
    comparison = 1;
  } else if (tallyA < tallyB) {
    comparison = -1;
  }
  return comparison * -1;
}


function countTEST(myArray) {
  // array_elements = ["a", "b", "c", "d", "e", "a", "b", "c", "f", "g", "h", "h", "h", "e", "a"];

  myArray.sort();

  var current = null;
  var cnt = 0;
  for (var i = 0; i < myArray.length; i++) {
      if (myArray[i] != current) {
          if (cnt > 0) {
              document.write(current + ' comes --> ' + cnt/3 + ' times<br>');
          }
          current = myArray[i];
          cnt = 1;
      } else {
          cnt++;
      }
  }
  if (cnt > 0) {
      document.write(current + ' comes when --> ' + cnt/3 + ' times');
  }

}

function count(myArray) {
  console.log("in count");
  var counts = {};
  myArray.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  console.log(counts);


}

function searchStats() {
  console.log("searchStats function called");
  // * grab a snapshot of the search results from DB
  return firebase
    .database()
    .ref("/searches")
    .once("value")
    .then(function(snapshot) {
      var tempObj = {}; // ? do I really need this
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
      // * TODO calculate top 5 most searches and toss into array
      // * Loop through array and output to Recent Seaches - Artist Name | Number of Searches
      // * create an array of objects of top 5 searches
      searchedArtistArray.sort();
      count(searchedArtistArray);
      

      // * Tally Mode
      var current = null;
      var counter = 0;
      for (var i = 0; i < searchedArtistArray.length; i++) {
        var searchResultsTally = {
          name: "",
          timesSearched: 0
        };
        if (searchedArtistArray[i] != current) {
          if (counter > 0) {
            // document.write(current + " comes --> " + counter + " times<br>");
            // console.log("First If/Then " + current + " : " + counter + " times");
            searchResultsTally.name = current;
            searchResultsTally.timesSearched = counter;
            tempObj = searchResultsTally;
            // console.log(tempObj);
            resultsTallyArray.push(tempObj);
          }
          current = searchedArtistArray[i];
          searchResultsTally.name = current;
          searchResultsTally.timesSearched = counter;
          tempObj = searchResultsTally;
          resultsTallyArray.push(tempObj)


          counter = 1;
        } else {
          counter++;
        }
      }

      var sortedArray = resultsTallyArray.sort(compare);
  
      var topFiveArray = [];
      var pushedCounter = 0;
      
      // TODO need to address when starting w no data (sortedArray.length < 5)
      for (var i = 0; i < sortedArray.length; i++){ 
        key = Object.keys(sortedArray)[i];
        name = sortedArray[key].name;
        spacer = " searched " ;
        timesSearched = sortedArray[i].timesSearched;
        record = name + spacer + timesSearched + " times";
        console.log("record: " + record);
        
        

        var resultsObj = {
          name: name,
          timesSearched: timesSearched,
        }
        console.log(resultsObj)

        if (topFiveArray.includes(record)) {
          console.log(resultsObj.name + " is a duplicate");
        } else {
          topFiveArray.push(record);
          pushedCounter += 1;
        }

        if (pushedCounter === 5) {
          break;
        }
      }

      console.log("length of topFiveArray: " + topFiveArray.length);

      $(".topSearches").empty();
      for (var i = 0; i < topFiveArray.length; i++) {
        console.log(topFiveArray[i]);
        displayTopSearches(topFiveArray[i]);
      }

    });
}

function updateFireBaseItunesData(resultsObj) {
  database.ref("/searches").push({
    itunesSearchResults: resultsObj,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
}

function displayTopSearches(resultsObj) {
  // $(".iTunesPreview").empty();

  var tBody = $(".topSearches");
  var tRow = $("<tr>");

  var topSearchNameDiv = $("<td>").text(resultsObj);
  // var topSearchCountDiv = $("<td>").text(resultsObj.timesSearched)
 
  tRow.append(topSearchNameDiv);
  tBody.append(tRow);
}

function displayAlbumInfo(resultsObj) {
  // $(".iTunesPreview").empty();

  var tBody = $(".iTunesPreview");
  var tRow = $("<tr>");

  var trackNameDiv = $("<td>").text(resultsObj.trackName);
  var artWorkDiv = $("<img>").text(resultsObj.artworkUrl30);
  var previewUrlDiv = $("<td>").text(resultsObj.previewUrl);

  previewUrlDiv.addClass("songpreview");

  previewUrlDiv.html(
    '<a href="' + resultsObj.previewUrl + '">Click to Preview Song!</a>'
  );
  $("<a>").attr("target", "blank");
  artWorkDiv.attr("src", resultsObj.artworkUrl100);
  tRow.append(artWorkDiv, trackNameDiv, previewUrlDiv);
  tBody.append(tRow);
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
      console.log(itunesObj.trackName);
      updateFireBaseItunesData(itunesObj);
      displayAlbumInfo(itunesObj);
    }
  });
}

function getSearchInfo() {
  console.log("getSearchInfo function called");
  event.preventDefault();
  $(".iTunesPreview").empty(); // * clears out Album Info display on new search
  $(".topSearches").empty();
  var artistInput = $("#textarea1")
    .val()
    .trim();

  console.log(artistInput);
  callItunesApi(artistInput);
  searchStats();
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

     // Where we added changes
      // Checks is json._embedded is array or undefined
      if (json._embedded) {
        // array route
        console.log('has shows')
        // send array argument
        printShowsToPage(json._embedded)
      } else {
        // undefined route
        console.log('no shows')
        // sends false argument
        printShowsToPage(false);
      }
    }
  });
}
function printShowsToPage(shows) {
  if (!shows) {
    console.log('Array does not exist for shows - no upcoming shows');
    // print to screen no shows line
    $(".td").empty();
    var tBody = $(".td");
    var tRow = $("<tr>");
    var noShowsRow = $("<td>").text(
      'There are no upcoming shows for this artist'
    );
    tRow.append(noShowsRow);
    tBody.append(tRow);
  } else {
    // Got back expected show array
    
    console.log('print upcoming shows');
    $(".td").empty();
    for (var i = 0; i < shows.events.length; i++) {
      if (i >= 5) {
        return;
      }
      // console.log(shows.events[i]._embedded.venues[0].name);
      // console.log(shows.events[i]._embedded.venues[0].city.name);
      // console.log(shows.events[i]._embedded.venues[0].state.name);
      // console.log(shows.events[i].dates.start.localDate);
      var tBody = $(".td");
      var tRow = $("<tr>");
      var venueNameDiv = $("<td>").text(
        shows.events[i]._embedded.venues[0].name
      );
      var cityNameDiv = $("<td>").text(
        shows.events[i]._embedded.venues[0].city.name
      );
      var stateNameDiv = $("<td>").text(
        shows.events[i]._embedded.venues[0].state.name
      );
      var dateNameDiv = $("<td>").text(
        shows.events[i].dates.start.localDate
      );
      tRow.append(venueNameDiv, cityNameDiv, stateNameDiv, dateNameDiv);
      tBody.append(tRow);
    }
  }
}
$(document).on("click", ".btn", getSearchInfo);
