$(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyDRpk7ADMH_QbIhzpgUqpJF4h7EYeGW3vI",
    authDomain: "train-scheduler-13682.firebaseapp.com",
    databaseURL: "https://train-scheduler-13682.firebaseio.com",
    projectId: "train-scheduler-13682",
    storageBucket: "train-scheduler-13682.appspot.com",
    messagingSenderId: "673055671894",
    appId: "1:673055671894:web:7f4f3cf94ccbd5fe"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var db = firebase.database();

  var clearInputs = () => {
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
  };

  $("#train-btn").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name")
      .val()
      .trim();

    var destination = $("#destination")
      .val()
      .trim();

    var firstTrain = $("#first-train")
      .val()
      .trim();

    var frequency = $("#frequency")
      .val()
      .trim();

    var trainInfo = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };

    db.ref().push(trainInfo);

    alert("Train has been added to the scheduler");

    clearInputs();
  });

  db.ref().on("child_added", function(snap) {
    console.log(snap.val());

    // Store everything into a variable.
    var tName = snap.val().name;
    var tDestination = snap.val().destination;
    var tFrequency = snap.val().frequency;
    var tFirstTrain = snap.val().firstTrain;

    var firstTimeArray = tFirstTrain.split(":");
    var trainTime = moment()
      .hours(firstTimeArray[0])
      .minutes(firstTimeArray[1]);
    var maximumMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    // If the first train is later than the current time, sent arrival to the first train time
    if (maximumMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add each train's data into the table
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });
});
