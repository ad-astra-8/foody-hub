'use strict';

// urls and api-keys of both Apis
const apiKeyspoonacular = "0a704e80601d4fbe8ef5821111aa6479";
const searchUrlSpoonacular = "https://api.spoonacular.com/recipes/complexSearch";

const apiKeyYelp = 'AuZRmmpJYgg6UylAgbTMRLnQHly1vo6kcPe3SQzFd-3eEfxrRVGcbmSTT8AlCnsomgPjvfSP7_jM7uNCpDtbNQAK30Bo4Z_l1P6DlqmavIlGyWo6MnO51nFmstd7XnYx';
const API_KEY = apiKeyYelp;
const urlYelp = `https://api.yelp.com/v3/businesses/search?location=${location}`;


//functions for the spoonacular Api
function formatQueryParams(ingredient, mealType, dietType, allergies) {
    console.log('formatQueryParams()');
    let queryString = '';
    queryString += `query=${ingredient}&`;
    queryString += `type=${mealType}&`;
    queryString += `diet=${dietType}&`;
    queryString += `intolerances=${allergies}&`;
    console.log(queryString)
    return queryString
}

function getRecipes(ingredient, mealType, dietType, allergies) {
    console.log('getRecipes()');

    const queryString = formatQueryParams(ingredient, mealType, dietType, allergies);
    const url = searchUrlSpoonacular + '?' + queryString + 'maxCalories=500&number=20&instructionsRequired=true&addRecipeInformation=true' + `&apiKey=${apiKeyspoonacular}`;
    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(responseJson => console.log(responseJson));
}

//functions for the yelp Api
function getRestaurants() {
    console.log('getRestaurants()');

    const options = {
        headers: new Headers({
            Authorization: 'Bearer API_KEY'
        })
    };

    fetch(urlYelp, options)
        .then(response => response.json())
        .then(responseJson => console.log(responseJson));
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
        const location = $("#js-location").val();
        getRecipes(ingredient, mealType, dietType, allergies);
        console.log(ingredient, mealType, dietType, allergies);
        getRestaurants();
        console.log(location);
    });
}

$(function () {
    console.log('App loaded! Waiting for submit!');
    watchForm();
});