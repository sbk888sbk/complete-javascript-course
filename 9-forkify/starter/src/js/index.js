import Search from './models/Search';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements } from './views/base';
import { renderLoader } from './views/base';
import { clearLoader } from './views/base';
import recipe from './models/Recipe';
import Recipe from './models/Recipe';
import List from './models/List'
/** Global State of the app
* - Search Object
* - Current recipe object
* - Liked recipes
*/
const state = {};

/**
         Search Controller  
 **/
const controlSearch = async () => {
    //1. Get query from the view
    const query = searchView.getInput();



    if(query){
        // 2. New Search object and add it to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //4. Search for recipes
            await state.search.getResults(search);
            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            // console.log(`state result is :`,state.search.result)
        } catch(e){
            console.log('Somethong went wrong');
            clearLoader();
        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



const search = new Search('pizza');

// console.log(search);

// Using event delegation concept
elements.searchResPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline')
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage);
    }
});

/**
         Recipe  Controller  
 **/

 const controlRecipe = async () => {
    // Get ID from the url 
    const id = window.location.hash.replace('#','');
    //  console.log(id);

     if(id){
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)
        // Create anew Recipe Object
        state.recipe = new Recipe(id);

        //Highlight selected search item
        if(state.search){
            searchView.highlghtSelected(id);
        }
        

        try {
            // Get recipe data and parse the ingredients 
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            

            // Render the recipe
            clearLoader()
            console.log(state.recipe)
            recipeView.renderRecipe(state.recipe);
            // console.log(state.recipe)  
        } catch(e){
            console.log(e)
            alert('Error in getting recipe index');
        }

     }
 }

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// Handling recipe button clicks :
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('desc');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        // Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
});

window.l = new List();