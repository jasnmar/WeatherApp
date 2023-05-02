

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

    // TODO: Setup the current conditions
    const currnetConditionsSection = document.createElement('div')
    currnetConditionsSection.id = "currentConditions";
    currnetConditionsSection.classList.add('container', "col");
    currnetConditionsSection.innerHTML = "theialskdjjf as lsadj alsdk lskd jsfd jls js";
    bodyRow.appendChild(currnetConditionsSection);

    // TODO: Setup the 5 day forcast
}

function updateCurrentWeather(currentWeatherObj) {
    const currnetConditionsSection = document.getElementById("currentConditions");
    currnetConditionsSection.innerHTML = "";
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
        ldiv.classList.add("display-6");
        ldiv.innerHTML = wObject.description+" : "+wObject.value+" "+wObject.units;
        return ldiv;
    }
    // const dispClouds = document.createElement('div');
    // dispClouds.innerHTML = clouds
    // currnetConditionsSection.appendChild(dispClouds)
    // const dispdewPoint = document.createElement('div');
    // dispdewPoint.innerHTML = dewPoint;
    // currnetConditionsSection.appendChild(dispdewPoint)
    // const dispfeelsLike = document.createElement('div');
    // dispfeelsLike.innerHTML = feelsLike
    // currnetConditionsSection.appendChild(dispfeelsLike)
    // const disphumidity = document.createElement('div');
    // disphumidity.innerHTML = humidity;
    // currnetConditionsSection.appendChild(disphumidity)
    // const dispbarometricPressure = document.createElement('div');
    // dispbarometricPressure.innerHTML = barometricPressure;
    // currnetConditionsSection.appendChild(dispbarometricPressure)
    // const disptemp = document.createElement('div');
    // disptemp.innerHTML = temp;
    // currnetConditionsSection.appendChild(disptemp)
    // const dispwindSpeed = document.createElement('div');
    // dispwindSpeed.innerHTML = windSpeed;
    // currnetConditionsSection.appendChild(dispwindSpeed)
    const dispweatherIcon = document.createElement('div');
    const dispWetherImage = document.createElement('img');
    dispWetherImage.setAttribute("src", iconPath);
    dispweatherIcon.appendChild(dispWetherImage);
    currnetConditionsSection.appendChild(dispweatherIcon)

    
}

function searchArea(parentDiv) {
    const searchForm = document.createElement('form');
    searchForm.id = "searchForm";
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
const key = "623b76358baf32d74317202b7bbe02e8";

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
            const lat = data[0].lat;
            const lon = data[0].lon;
            let getWeatherUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&units=imperial"+"&appid="+key;
            fetch(getWeatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                updateCurrentWeather(data.current);

            })
        })
    }
}
