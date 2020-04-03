'use strict';
//declared as a global variable so both api's functions are able to refer to its value
const ingredient = $("#js-search-ingredient").val();

//functions related to the spoonacular Api
function formatQueryParams(ingredient, mealType, dietType, allergies) {
    // console.log('formatQueryParams()');
    let queryString = '';
    queryString += `query=${ingredient}&`;
    queryString += `type=${mealType}&`;
    queryString += `diet=${dietType}&`;
    queryString += `intolerances=${allergies}&`;
    // console.log(queryString)
    return queryString
}

function getRecipes(ingredient, mealType, dietType, allergies) {
    // console.log('getRecipes()');
    //both keys are valid, used as a back up in case of run out of Api calls, one key allows 150 calls per day only
    // const apiKeyspoonacular = "0a704e80601d4fbe8ef5821111aa6479";
    const apiKeyspoonacular = "006e4475b2c34b2ea02b8f008d4a3cef";
    const searchUrlSpoonacular = "https://api.spoonacular.com/recipes/complexSearch";
    const queryString = formatQueryParams(ingredient, mealType, dietType, allergies);
    const url = searchUrlSpoonacular + '?' + queryString + 'maxCalories=500&number=6&instructionsRequired=true&addRecipeInformation=true&apiKey=' + apiKeyspoonacular;
    // console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            // console.log(responseJson)
            displayResultsSpoonacular(responseJson, ingredient)
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResultsSpoonacular(responseJson, ingredient) {
    // console.log('displayResultsSpoonacular()');
    // console.log(`total results: ${responseJson.totalResults}`);
    $('#results-recipes-list').empty();
    $('#results-recipes-message').empty();

    if (responseJson.totalResults == 0) {
        $('#results-recipes-message').append(
            `<h2 class="message">Sorry, we couldn't find anything!</h2><i class="fas fa-bone"></i>
            <p class="sourcename">Spoonacular</p>`)
    } else {

        $('#results-recipes-message').append(
            `<h2 class="message">Smells good already!</h2>
            <h3>Recipes for "${ingredient}"</h3>`
        )
    }

    for (let i = 0; i < responseJson.results.length; i++) {
        $('#results-recipes-list').append(
            `<li>
                <p class="title"><a href="${responseJson.results[i].sourceUrl}">"${responseJson.results[i].title}"</a></p> 
                <p>${responseJson.results[i].diets}</p>
                <a href="${responseJson.results[i].sourceUrl}"><img class="recipe-image" src='${responseJson.results[i].image}' alt="recipe image"></a>
                <p class="summary">summary: ${responseJson.results[i].summary}</p>              
                <p class="sourcename">Source Name: "${responseJson.results[i].sourceName}."</p>
            </li>`
        )
    };
    $('#results-recipes').removeClass('hidden');
};


//functions related to the youtube Api
function formatQueryParamsYoutube() {
    // both keys are valid, used as a back up in case of run out of Api calls
    // const API_KEY = 'AIzaSyBslEsiJJgKJb6bak269C49LaArNjU4xxc';
    const API_KEY = 'AIzaSyDJv3_eVtLsls-B38vctoiwnhy0jG6gsZc';
    const ingredient = $("#js-search-ingredient").val();
    const mealType = $("#js-search-meal").val();
    const dietType = $("#js-search-diet").val();
    const allergies = $("#js-search-allergies").val();

    // console.log('formatQueryParamsYoutube()');
    let queryString = '';
    queryString += `key=${API_KEY}&`;
    queryString += `q=${ingredient}+${mealType}+${dietType}+${allergies}+recipe+low+calories&`;
    queryString += 'part=snippet&';
    queryString += 'maxResults=6';
    // console.log(queryString)
    return queryString
}

function getYouTubeVideos() {
    const searchURL = `https://www.googleapis.com/youtube/v3/search`;
    const queryStringYoutube = formatQueryParamsYoutube()
    const urlYouTube = searchURL + '?' + queryStringYoutube;
    // console.log(urlYouTube);

    fetch(urlYouTube)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson =>
            // console.log(responseJson))
            displayResultsYouTube(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function displayResultsYouTube(responseJson) {
    const ingredient = $("#js-search-ingredient").val();
    // console.log('displayResultsYouTube()');
    $('#results-videos-list').empty();
    $('#results-message').empty();
    $('#results-message').append(
        `<h2 class="message">Watch this!</h2>
            <h3>Videos for "${ingredient}"</h3>`
    )

    for (let i = 0; i < responseJson.items.length; i++) {
        // console.log(responseJson.items[i]);
        $('#results-videos-list').append(

            `<li>
                <p class="title"><a  href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target='_blank'>"${responseJson.items[i].snippet.title}"</a></p> 
                <a  href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target='_blank'>
                <img class="recipe-image" src='${responseJson.items[i].snippet.thumbnails.default.url}' alt="recipe video thumbnail"> 
                </a>
                <p class="sourcename">Source: <i class="fab fa-youtube"></i> YouTube.</p>
            </li>`
        )
    };
    $('#results-videos').removeClass('hidden');
};

//eventhandler for both spoonacular and you tube Apis
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        // console.log('watchForm()');
        const ingredient = $("#js-search-ingredient").val();
        const mealType = $("#js-search-meal").val();
        const dietType = $("#js-search-diet").val();
        const allergies = $("#js-search-allergies").val();
        const maxResults = $("#js-max-results").val();
        getRecipes(ingredient, mealType, dietType, allergies);
        // console.log(`${ingredient}`);
        getYouTubeVideos();
    });
}

$(function () {
    console.log('App loaded! Waiting for submit!');
    watchForm();
});