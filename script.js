// fill out the city buttons.
let savedCities = {
    city0: "",
    city1: "",
    city2: "",
    city3: ""
};

let cityBtn;

// load data to page and fill API's
function updatePage() {

    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${$("#searchCity").val()}&appid=d12ac894951123eac7bf17e095f2120c&units=imperial`;

    console.log("---------------\nBasic URL: " + queryURL + "\n---------------");

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(weatherData) {

        // clear out forcast cards
        $("#fiveDayCards").empty();

        $("#mainCity").text(weatherData.name).append(` <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></img>`);

        $("#mainTemp").text("Temperature: " + weatherData.main.temp);

        $("#mainHumidity").text("Humidity: " + weatherData.main.humidity);

        $("#mainWind").text("Wind speed: " + weatherData.wind.speed);

        // UV API

        const UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=d12ac894951123eac7bf17e095f2120c`;

        console.log("---------------\nUV URL: " + UVQueryURL + "\n---------------");

        $.ajax({
            url: UVQueryURL,
            method: "GET"
        }).then(function(UVWeatherData) {

            $("#mainUV").text("UV Index: " + UVWeatherData.value);

            if (UVWeatherData.value > 4) {
                $("#mainUV").attr("class", "text-danger");
            } else {
                $("#mainUV").attr("class", "text-success");
            }

        });
    });

    // forcast API

    const forcastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${$("#searchCity").val()}&appid=d12ac894951123eac7bf17e095f2120c&units=imperial`;

    console.log("---------------\nForcast UV URL: " + forcastQueryURL + "\n---------------");

    $.ajax({
        url: forcastQueryURL,
        method: "GET"
    }).then(function(forcastWeatherData) {

        // print 5 day forcast cards
        for (let i = 0; i < 5; i++) {

            const fiveDayTemplate = `
      <div class="col">
        <div id="${'card' + i}" class="card bg-primary text-white p-2 mt-1 mb-1" style="width: 10rem;">
          <h4 id="${'date' + i}"></h4>
          <p id="${'icon' + i}"></p>
          <p id="${'temp' + i}">Temp: </p>
          <p id="${'humidity' + i}">Humidity: </p>
        </div>
      </div>
      `;

            $("#fiveDayCards").append(fiveDayTemplate);

        }

        // weather at noon for each day
        for (let i = 0; i < 5; i++) {

            let forcastDate = forcastWeatherData.list[i * 8 + 3].dt_txt;

            $(`${'#date' + i}`).text(forcastDate.slice(5, 10));

            $(`${'#icon' + i}`).append(`<img src="http://openweathermap.org/img/wn/${forcastWeatherData.list[i * 8 + 3].weather[0].icon}.png"></img>`);

            $(`${'#temp' + i}`).append(forcastWeatherData.list[i * 8 + 3].main.temp);

            $(`${'#humidity' + i}`).append(forcastWeatherData.list[i * 8 + 3].main.humidity);

        }

    });

    saveCities();

}

// load previously saved cities
function checkStorage() {
    let previously = JSON.parse(localStorage.getItem("cities"));
    if (previously) {
        savedCities = previously;
    } else {
        localStorage.setItem("cities", JSON.stringify(savedCities));
        $(".searchForm").val("Austin");
        updatePage();
    }
}

// save most recent search and move each item down one
function saveCities() {

    savedCities["city3"] = savedCities["city2"];
    savedCities["city2"] = savedCities["city1"];
    savedCities["city1"] = savedCities["city0"];
    savedCities["city0"] = $(".searchForm").val();

    localStorage.setItem("cities", JSON.stringify(savedCities));

    printCities();

}

// print cities from storage to the stage
function printCities() {

    $("#city0").text(savedCities.city0);
    $("#city1").text(savedCities.city1);
    $("#city2").text(savedCities.city2);
    $("#city3").text(savedCities.city3);

}

// when user enters city in textbox
$("#submit").on("click", function(event) {
    event.preventDefault();

    updatePage();

});

$("#submit").on("click", function(event) {
    event.preventDefault();

    cityBtn = $(this).text();

    console.log("---------------\nThis Buttom: " + cityBtn + "\n---------------");

    $("#searchForm").val(cityBtn);

    updatePage();

})

// check local storage
checkStorage();

printCities();