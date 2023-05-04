

$( document ).ready(function() {
    console.log( "ready!" );
    setupPage();
});


// Just for the license key for OpenWeather.
// Running a local express server to get the key so it isn't stored in code anywhere.
let key = ""
const localURL = "http://localhost:3000"
fetch(localURL)
.then(function (response) {
    return response.json();
})
.then(function (data) {
    key = data.key;
})

function setupPage() {
    // Get the "main" section of the body
    const mainArea = document.getElementById("main");
    const bodyContainer = document.createElement('div');
    bodyContainer.classList.add("container");
    bodyContainer.id = "bodyContainer";
    const bodyRow = document.createElement('div');
    bodyRow.id = "bodyRow";
    bodyRow.classList.add("row");
    bodyContainer.appendChild(bodyRow);
    mainArea.appendChild(bodyContainer);
    // Setup the search area -- Donefor now
    const searchSection = document.createElement('div');
    searchSection.id = "searchSection";
    searchSection.classList.add("container", "col", "col-md-4")
    const searchDivR = document.createElement('div');
    searchDivR.id = "searchDivRow";
    searchDivR.classList.add("row");
    searchSection.appendChild(searchDivR);
    const searchDivC = document.createElement('div')
    searchDivC.id = "searchDivColumn";
    searchDivC.classList.add("col");
    searchDivR.appendChild(searchDivC);
    searchArea(searchDivC);
    bodyRow.appendChild(searchSection);

    // Set up the City Buttons
    const cityListR = document.createElement('div');
    cityListR.id = "cityListR";
    cityListR.classList.add("row");
    const cityList = document.createElement('div');
    cityList.id = "cityList";
    cityList.classList.add("col", "col-sm");
    searchSection.appendChild(cityList);
    setupCityButtons(cityList);

    // Current Conditions
    const currnetConditionsSection = document.createElement('div')
    currnetConditionsSection.id = "currentConditions";
    currnetConditionsSection.classList.add('container', "col");
    currnetConditionsSection.innerHTML = "";
    bodyRow.appendChild(currnetConditionsSection);

    // TODO: Format this better
    fiveDay(bodyContainer);
}

function fiveDay(parentDiv) {
    const fiveDay = document.createElement('div');
    fiveDay.id = "fiveDay";
    fiveDay.classList.add("row", "my-3");
    fiveDay.innerHTML = ""
    parentDiv.appendChild(fiveDay);
}

// Sets up the City buttons based on the information in local storage
// Also gets run when a new city is added. Just destroy and create the 
// entire list.
function setupCityButtons(parentDiv) {
    console.info("Setting up City List");
    parentDiv.innerHTML = "";
    const locationList = JSON.parse(localStorage.getItem("locations"));
    if (locationList) {
        for(i=0;i<locationList.length;i++) {
            const cityBtnDiv = document.createElement('div')
            cityBtnDiv.id = "cityBtnDiv"+i;
            cityBtnDiv.classList.add("row", "mx-0", "my-1");
            parentDiv.appendChild(cityBtnDiv);
            cityBtnEl = createCityButton(locationList[i], cityBtnDiv);
            cityBtnEl.id = "cityBtn"+i;
        }
    }
    // This creates the buttons themselves, based on the array stored in 
    // local storage above. 
    // I put the lon and lat in the buttons themselves to save a call to the
    // geo API for cities that we've already looked up. The listener just 
    // gets the lat and lon from the button itself. 
    function createCityButton(location, parent) {
        const cityBtn = document.createElement('button');
        cityBtn.classList.add("btn", "btn-secondary", "btn-sm");
        cityBtn.innerHTML = location.locationName;
        cityBtn.setAttribute("data-lon",location.longitude);
        cityBtn.setAttribute("data-lat", location.lattitude);
        cityBtn.setAttribute("data-citystate", location.locationName);
        cityBtn.addEventListener("click",cityButtonListener);
        parent.appendChild(cityBtn);
        return cityBtn;

    }
    
}

// Event listender that works on the City buttons under the search
// (saved searches). This calls the get weather data function directly,
// without going throught the geo lookup.
function cityButtonListener(e) {
    e.preventDefault();
    console.log(e.target);
    const cityButton = e.target;
    const lat = cityButton.getAttribute("data-lat");
    const lon = cityButton.getAttribute("data-lon");
    const cityState = cityButton.getAttribute("data-citystate");
    currentConditionsHeader(cityState);
    getWeatherData(lat, lon);

}

// Updates the current weather portion of the page, based on 
// a current weather object being passed in.
function updateCurrentWeather(currentWeatherObj) {
    // Current weather object is expected to be an object
    // That represents the current weather section as described
    // In https://openweathermap.org/api/one-call-3

    const currnetConditionsSection = document.getElementById("currentConditions");

    // I used this to deconstruct the weather object and add 
    // a description, a name, and some units to the raw values
    // that are in the object that get passed in.
    const clouds = {
        description: "Conditions",
        value: currentWeatherObj.weather[0].description,
        name: "clouds",
        units: ""
    }
    const dewPoint =  {
        description: "Dew Point",
        value: currentWeatherObj.dew_point,
        name: "dewPoint",
        units: "\u00B0F"
    }
    const feelsLike = {
        description: "Feels Like Temperature",
        value: currentWeatherObj.feels_like,
        name: "feelsLike",
        units: "\u00B0F"
    }
    const humidity = {
        description: "Humidity",
        value: currentWeatherObj.humidity,
        name: "humidity",
        units: "%"
    }
    const barometricPressure = {
        description: "Barometric Pressure",
        value: currentWeatherObj.pressure,
        name: "barometricPressure",
        units: "millibars"
    }
    const temp = {
        description: "Temperature",
        value: currentWeatherObj.temp,
        name: "temp",
        units: "\u00B0F"
    }
    const windSpeed = {
        description: "Wind Speed",
        value: currentWeatherObj.wind_speed,
        name: "windSpeed",
        units: "MPH"
    }
    // Gets the icon from the weather object, looks it up and inserts it
    // as an image. I do this in a couple places and it should probably be generalized
    // TODO: Generalize this code and call it from the weather and 5 day portions
    const weatherIcon = currentWeatherObj.weather[0].icon;
    const iconPath = "https://openweathermap.org/img/wn/"+weatherIcon+".png";
    const dispweatherIcon = document.createElement('div');
    const dispWeatherImage = document.createElement('img');
    dispWeatherImage.setAttribute("src", iconPath);
    dispweatherIcon.appendChild(dispWeatherImage);
    currnetConditionsSection.appendChild(dispweatherIcon);

    // Combine all of the weather info into an array
    let weatherData = [clouds, dewPoint, feelsLike, humidity, barometricPressure, temp, windSpeed];

    // Iterate throught the weather array.
    for(i=0;i<weatherData.length;i++){
        let nDiv = createWeatherDiv(weatherData[i]);
        currnetConditionsSection.appendChild(nDiv);
    }

    // Create divs for each of the items in the weather array
    function createWeatherDiv(wObject) {
        const ldiv = document.createElement('div');
        ldiv.id = wObject.name;
        ldiv.classList.add("h4");
        ldiv.innerHTML = wObject.description+" : "+wObject.value+" "+wObject.units;
        return ldiv;
    }
}


// Builds out the "Search for a City" portion of the UI.
function searchArea(parentDiv) {
    const searchForm = document.createElement('form');
    searchForm.id = "searchForm";
    searchForm.classList.add("form-group");
    const searchLabel = document.createElement('h3');
    searchLabel.id = "searchLabel";
    searchLabel.textContent = "Search for a City";
    searchForm.appendChild(searchLabel);
    const searchInput = document.createElement('input');
    searchInput.setAttribute("type","search");
    searchInput.id = "searchInputBox";
    searchInput.setAttribute("placeholder", "Oklahoma City");
    searchForm.appendChild(searchInput);
    const searchButton = document.createElement('input');
    searchButton.setAttribute("type", "submit");
    searchButton.setAttribute("value", "Submit");
    searchButton.classList.add("btn-primary");
    searchButton.addEventListener("click",searchAction)
    searchButton.id = "searchSubmitButton";
    searchForm.appendChild(searchButton);
    parentDiv.appendChild(searchForm);
}

// This runs when the submit button is clicked (or when someone
// presses enter on the input button)
function searchAction(e) {
    e.preventDefault();
    console.log("Searching...");
    console.log(e.target);
    let inputBox = document.getElementById("searchInputBox");
    let city = inputBox.value;
    // TODO: This could be made something better than an alert
    // This was quick to get to MVP. A real dialog would provide
    // a better UX, but wasn't neccessary right now
    if(!city) {
        alert("Sorry, you must specify a city");
    } else {
        // This just gets the lat and lon based on the city
        let getCityUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid="+key;
        fetch(getCityUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        
            // I dont actually know if this can return more than 1 city
            // for now we're just going to pick the first one.
            let cityObj = data[0];
            // TODO: Some better error messaging would be nice
            if(!cityObj) {
                alert("City not found, try again");
                return;
            }
            const lat = data[0].lat;
            const lon = data[0].lon;
            const cityState = data[0].name + ", " + data[0].state;
            currentConditionsHeader(cityState);
            storeLocation(cityState, lat, lon);
            getWeatherData(lat, lon);
        })
    }
}


// Given a lat and long this retrieves the weather data, then updates
// The current weather, as well as the 5 day forcast.
function getWeatherData(lat, lon) {
    let getWeatherUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&units=imperial"+"&appid="+key;
    fetch(getWeatherUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        updateCurrentWeather(data.current);
        update5Day(data.daily);

    })
}

// Updates the 5 day forcast, based on an 8 day forcast being passed in
function update5Day(forcast) {
    const fiveDayDiv = document.getElementById("fiveDay");
    fiveDayDiv.innerHTML = "";

    // forcast comes in as an array of 8 elements
    // we only want the first five
    for(i=0;i<5;i++) {

        // Set up the div for a single day
        const dayDiv = document.createElement('div');
        dayDiv.id = "fiveDay"+i;
        dayDiv.classList.add("col", "bg-secondary", "text-white", "mx-1");

        // Add the date
        const date = dateConverter(forcast[i].dt);
        const dateDiv = document.createElement('h2');
        dateDiv.innerHTML = date;
        dayDiv.appendChild(dateDiv);

        const temp = forcast[i].temp.day;
        const wind = forcast[i].wind_speed;
        const humidity = forcast[i].humidity;
        const weatherIcon = forcast[i].weather[0].icon;
        const iconPath = "https://openweathermap.org/img/wn/"+weatherIcon+".png";


        
        const dispWeatherIcon = document.createElement('div');
        dispWeatherIcon.id = "5dWIcon";
        const dispWeatherImage = document.createElement('img');
        dispWeatherIcon.appendChild(dispWeatherImage);
        console.log(dispWeatherImage);
        dispWeatherImage.setAttribute("src", iconPath);
        dayDiv.appendChild(dispWeatherIcon);


        



        const tempDiv = document.createElement("h5");
        tempDiv.innerHTML = "Temperature: "+ temp;
        dayDiv.appendChild(tempDiv);
        const windDiv = document.createElement("h5");
        windDiv.innerHTML = "Wind: " + wind;
        dayDiv.appendChild(windDiv);
        const humDiv = document.createElement("h5");
        humDiv.innerHTML = "Humidity: " + humidity;
        dayDiv.appendChild(humDiv);
 
        
        fiveDayDiv.appendChild(dayDiv);

    }
}

// This just converts UXIX dates to human readable dates for the 5 day forcast.
// right now all that is needed is the "day" part of the date, the time is just dropped
function dateConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date;
    return time;
  }

// This adds to localstorage when a new city is searched for
// The new item is added to the top of the list every time
// The list is constrained to 10 items.
// TODO: I should check for duplicate items before adding a new one to the list.
function storeLocation(location, lat, lon) {
    let locationList = JSON.parse(localStorage.getItem("locations"));
    const lObject = {
        locationName: location,
        lattitude: lat,
        longitude: lon
    };
    if(locationList) {
        if(locationList.length>10) {
            locationList.pop();
        }
        let nLocationList = [lObject];
        locationList = nLocationList.concat(locationList); 
    } else {
        locationList = [lObject];
    }
    localStorage.setItem("locations", JSON.stringify(locationList));
    const cityDiv = document.getElementById("cityList");
    setupCityButtons(cityDiv);
}

// This sets up the "header" part of the current condictions section with the 
// City and Date 
function currentConditionsHeader(location) {
    const today = dayjs().format('MMMM D YYYY [at] h:m a');
    const currnetConditionsSection = document.getElementById("currentConditions");
    currnetConditionsSection.innerHTML = "";
    const cityText = document.createElement('div');
    cityText.id = "conditionsHeader";
    cityText.classList.add("display-6");
    cityText.innerHTML = location;
    currnetConditionsSection.appendChild(cityText);
    const dateText = document.createElement('div');
    dateText.id = "cConditionsDate";
    dateText.classList.add("h3");
    dateText.innerHTML = today;
    currnetConditionsSection.appendChild(dateText);
    
    
    console.log(today);
}

