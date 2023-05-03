

$( document ).ready(function() {
    console.log( "ready!" );
    setupPage();
});

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

    // TODO: Setup the City List
    const cityListR = document.createElement('div');
    cityListR.id = "cityListR";
    cityListR.classList.add("row");
    const cityList = document.createElement('div');
    cityList.id = "cityList";
    cityList.classList.add("col", "col-sm");
    searchSection.appendChild(cityList);
    setupCityButtons(cityList);

    // TODO: Finish formatting this
    const currnetConditionsSection = document.createElement('div')
    currnetConditionsSection.id = "currentConditions";
    currnetConditionsSection.classList.add('container', "col");
    currnetConditionsSection.innerHTML = "";
    bodyRow.appendChild(currnetConditionsSection);

    // TODO: Setup the 5 day forcast
    fiveDay(bodyContainer);
}

function fiveDay(parentDiv) {
    const fiveDay = document.createElement('div');
    fiveDay.id = "fiveDay";
    fiveDay.classList.add("row");
    fiveDay.innerHTML = "as;ddfhasjdf;laskljdf "
    parentDiv.appendChild(fiveDay);
}

function setupCityButtons(parentDiv) {
    parentDiv.innerHTML = "";
    const locationList = JSON.parse(localStorage.getItem("locations"));
    if (locationList) {
        for(i=0;i<locationList.length;i++) {
            const cityBtnDiv = document.createElement('div')
            cityBtnDiv.id = "cityBtnDiv"+i;
            cityBtnDiv.classList.add("row");
            parentDiv.appendChild(cityBtnDiv);
            cityBtnEl = createCityButton(locationList[i], cityBtnDiv);
            cityBtnEl.id = "cityBtn"+i;
        }
    }
    function createCityButton(location, parent) {
        
        const cityBtn = document.createElement('button');
        cityBtn.classList.add("btn", "btn-secondary");
        cityBtn.innerHTML = location.locationName;
        cityBtn.setAttribute("data-lon",location.longitude);
        cityBtn.setAttribute("data-lat", location.lattitude);
        cityBtn.setAttribute("data-citystate", location.locationName);
        cityBtn.addEventListener("click",cityButtonListener);
        parent.appendChild(cityBtn);
        return cityBtn;

    }
    console.log("Setting up City List");
}
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

function updateCurrentWeather(currentWeatherObj) {

    const currnetConditionsSection = document.getElementById("currentConditions");

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

    const weatherIcon = currentWeatherObj.weather[0].icon;
    const iconPath = "https://openweathermap.org/img/wn/"+weatherIcon+".png";
    let weatherData = [clouds, dewPoint, feelsLike, humidity, barometricPressure, temp, windSpeed];

    for(i=0;i<weatherData.length;i++){
        let nDiv = createWeatherDiv(weatherData[i]);
        currnetConditionsSection.appendChild(nDiv);
    }

    function createWeatherDiv(wObject) {
        const ldiv = document.createElement('div');
        ldiv.id = wObject.name;
        ldiv.classList.add("h3");
        ldiv.innerHTML = wObject.description+" : "+wObject.value+" "+wObject.units;
        return ldiv;
    }

    const dispweatherIcon = document.createElement('div');
    const dispWetherImage = document.createElement('img');
    dispWetherImage.setAttribute("src", iconPath);
    dispweatherIcon.appendChild(dispWetherImage);
    const cloudySection = document.getElementById("clouds");
    cloudySection.appendChild(dispweatherIcon)

    
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
    searchButton.addEventListener("click",searchAction)
    searchButton.id = "searchSubmitButton";
    searchForm.appendChild(searchButton);
    parentDiv.appendChild(searchForm);
}

function searchAction(e) {
    e.preventDefault();
    console.log("Searching...");
    console.log(e.target);
    let inputBox = document.getElementById("searchInputBox");
    let city = inputBox.value;
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
function update5Day(forcast) {
    const fiveDayDiv = document.getElementById("fiveDay");
    fiveDayDiv.innerHTML = "";

    // forcast comes in as an array of 8 elements
    // we only want the first five
    for(i=0;i<5;i++) {
        const date = dateConverter(forcast[i].dt);
        const temp = forcast[i].temp.day;
        const wind = forcast[i].wind_speed;
        const humidity = forcast[i].humidity;
        const weatherIcon = forcast[i].weather[0].icon;
        const iconPath = "https://openweathermap.org/img/wn/"+weatherIcon+".png";
        


        
        const dispweatherIcon = document.createElement('div');
        const dispWetherImage = document.createElement('img');
        //dispWetherImage.setAttribute("src", iconPath);


        const dayDiv = document.createElement('div');
        dayDiv.id = "fiveDay"+i;
        dayDiv.classList.add("col", "bg-secondary", "text-white");
        const dateDiv = document.createElement('h2');
        dateDiv.innerHTML = date;
        dayDiv.appendChild(dateDiv);
        const tempDiv = document.createElement("h5");
        tempDiv.innerHTML = "Temperature: "+ temp;
        dayDiv.appendChild(tempDiv);
        const windDiv = document.createElement("h5");
        windDiv.innerHTML = "Wind: " + wind;
        dayDiv.appendChild(windDiv);
        const humDiv = document.createElement("h5");
        humDiv.innerHTML = "Humidity: " + humidity;
        dayDiv.appendChild(humDiv);
 
        //dayDiv.appendChild(dispweatherIcon);
        fiveDayDiv.appendChild(dayDiv);

    }
}

function dateConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date;
    return time;
  }

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

function currentConditionsHeader(location) {
    const today = dayjs().format('MMMM D YYYY [at] h:m a');
    const currnetConditionsSection = document.getElementById("currentConditions");
    currnetConditionsSection.innerHTML = "";
    const condHeader = document.createElement('div');
    condHeader.id = "conditionsHeader";
    condHeader.classList.add("display-6");
    const headerText = location + " " + today;
    condHeader.innerHTML = headerText;
    currnetConditionsSection.appendChild(condHeader);
    console.log(today);
}



