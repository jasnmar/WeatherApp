

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

function searchAction(e) {
    e.preventDefault();
    console.log("Searching...");
    console.log(e.target);
    
    http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
}