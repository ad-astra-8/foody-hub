'use strict';

//functions for the spoonacular Api
function formatQueryParams(ingredient, mealType, dietType, allergies) {
    console.log('formatQueryParams()');
    let queryString = '';
    queryString += `query=${ingredient}&`;
    queryString += `type=${mealType}&`;
    queryString += `diet=${dietType}&`;
    queryString += `intolerances=${allergies}&`;
    // console.log(queryString)
    return queryString
}

function getRecipes(ingredient, mealType, dietType, allergies) {
    console.log('getRecipes()');
    const apiKeyspoonacular = "0a704e80601d4fbe8ef5821111aa6479";
    const searchUrlSpoonacular = "https://api.spoonacular.com/recipes/complexSearch";

    const queryString = formatQueryParams(ingredient, mealType, dietType, allergies);
    const url = searchUrlSpoonacular + '?' + queryString + 'maxCalories=500&number=20&instructionsRequired=true&addRecipeInformation=true' + `&apiKey=${apiKeyspoonacular}`;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson =>
            // console.log(responseJson))
            displayResultsSpoonacular(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}


function displayResultsSpoonacular(responseJson) {
    console.log('displayResultsSpoonacular()');
    $('#results-recipes-list').empty();

    for (let i = 0; i < responseJson.results.length; i++) {
        console.log(responseJson.results[i]);
        $('#results-recipes-list').append(
            `<li>
                <p>Weight Watcher smart points: "${responseJson.results[i].weightWatcherSmartPoints}"</p>
                 <p>Url: <a  href="${responseJson.results[i].sourceUrl}">"${responseJson.results[i].sourceUrl}"</a></p>
                 <p>Sourcename: "${responseJson.results[i].sourceName}"</p>
                <p>title: "${responseJson.results[i].title}"</p>
                 <p>image: "${responseJson.results[i].image}"</p>
                 <p>summary: "${responseJson.results[i].summary}"</p>
            </li>`
        )
    };
    $('#results-recipes').removeClass('hidden');
};

//<p>summary: "${responseJson.diets[i]}"</p>






//functions for the youtube Api

function formatQueryParamsYoutube() {
    const API_KEY = 'AIzaSyBslEsiJJgKJb6bak269C49LaArNjU4xxc';
    const ingredient = $("#js-search-ingredient").val();
    const mealType = $("#js-search-meal").val();
    const dietType = $("#js-search-diet").val();
    const allergies = $("#js-search-allergies").val();


    console.log('formatQueryParamsYoutube()');
    let queryString = '';
    queryString += `key=${API_KEY}&`;
    queryString += `q=${ingredient}+${mealType}+${dietType}+${allergies}+recipe&`;
    queryString += 'part=snippet&';
    queryString += 'maxResults=6';
    // console.log(queryString)
    return queryString
}

function getYouTubeVideos() {
    // const searchURL = `https://www.googleapis.com/youtube/v3/search?q=${ingredient}+recipe&`;
    const searchURL = `https://www.googleapis.com/youtube/v3/search`;
    // const searchURL = 'https://www.googleapis.com/youtube/v3/search?q=strawberry+recipies&';
    // GET https://www.googleapis.com/youtube/v3/search?part=snippet&q=strawberry%20recipe&key=[YOUR_API_K;

    // const params = {
    //     key: API_KEY,
    //     q: `${ingredient}`,
    //     part: 'snippet',
    //     maxResults: 10
    // };

    // function formatQueryParamsYoutube(params) {
    //     const queryItems = Object.keys(params)
    //         .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    //     return queryItems.join('&');
    // }

    const queryStringYoutube = formatQueryParamsYoutube()
    const urlYouTube = searchURL + '?' + queryStringYoutube;
    console.log(urlYouTube);

    fetch(urlYouTube)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson =>
            console.log(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}


//eventhandler for both spoonacular and yelp Apis
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        console.log('watchForm()');
        const ingredient = $("#js-search-ingredient").val();
        const mealType = $("#js-search-meal").val();
        const dietType = $("#js-search-diet").val();
        const allergies = $("#js-search-allergies").val();
        // const videos = $("#js-search-ingredient").val();
        const maxResults = $("#js-max-results").val();
        getRecipes(ingredient, mealType, dietType, allergies);
        console.log(`${ingredient}`);
        getYouTubeVideos();
    });
}

$(function () {
    console.log('App loaded! Waiting for submit!');
    watchForm();
});