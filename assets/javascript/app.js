function getSearchInfo () {
    $("#ticketinfo").empty();
    console.log("clicked");
    event.preventDefault();
    var artistInput = $(".input-field").val().trim();
    var zipCode = $(".input-field2").val().trim();
    console.log(artistInput);
    console.log(zipCode);
    $("#textarea1").val("");
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&keyword=" +
    artistInput + "&apikey=VNUkdWcssRsgC8X8Vg617XiGSpQQYPfV";
    
    $.ajax({
    type:"GET",
    url: queryURL,
    async: true,
    dataType: "json",
    success: function(json) {
                console.log(json);
  
    // console.log(json._embedded.events[0]._embedded.venues[0].name);
    // console.log(json._embedded.events[0]._embedded.venues[0].city.name);
    // console.log(json._embedded.events[0]._embedded.venues[0].state.name);
    // console.log(json._embedded.events[0].dates.start.localDate);
  
    // var venueNameDiv = $("<p>").text(json._embedded.events[0]._embedded.venues[0].name);
    // $("#ticketinfo" ).append(venueNameDiv);  
    // var cityNameDiv = $("<p>").text(json._embedded.events[0]._embedded.venues[0].city.name);
    // $("#ticketinfo" ).append(cityNameDiv);  
    // var stateNameDiv = $("<p>").text(json._embedded.events[0]._embedded.venues[0].state.name);
    // $("#ticketinfo" ).append(stateNameDiv);  
    // var dateNameDiv = $("<p>").text(json._embedded.events[0].dates.start.localDate);
    // $("#ticketinfo" ).append(dateNameDiv);  
    // },})});

    // var i;
      for (var i = 0; i < json._embedded.events.length ; i++) {
        if (i >= 5) {
          return 
        }
      console.log(json._embedded.events[i]._embedded.venues[0].name);
      console.log(json._embedded.events[i]._embedded.venues[0].city.name);
      console.log(json._embedded.events[i]._embedded.venues[0].state.name);
      console.log(json._embedded.events[i].dates.start.localDate);;
      
      // $("#outputArea" ).append(artistInput);
      var venueNameDiv = $("<p>").text(json._embedded.events[i]._embedded.venues[0].name);
      
      var cityNameDiv = $("<p>").text(json._embedded.events[i]._embedded.venues[0].city.name);
       
      var stateNameDiv = $("<p>").text(json._embedded.events[i]._embedded.venues[0].state.name);
      
      var dateNameDiv = $("<p>").text(json._embedded.events[i].dates.start.localDate);
      $(".ticketinfo").append(venueNameDiv,cityNameDiv, stateNameDiv, dateNameDiv);
    }}})};
    $(document).on("click", ".btn", getSearchInfo);