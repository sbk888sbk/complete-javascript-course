import Search from './models/Search';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements } from './views/base';
import { renderLoader } from './views/base';
import { clearLoader } from './views/base';
import recipe from './models/Recipe';
import Recipe from './models/Recipe';
import List from './models/List'
import Likes from './models/Like';

/** Global State of the app
* - Search Object
* - Current recipe object
* - Liked recipes
*/
const state = {};
window.state = state;
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
            
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
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


/**
 * List Controller
 * */

const controlList = () => {    
    //Create a new list IF ther is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}



// Handle delte and update list item events:
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Delete the item
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
      
        //Delete from the state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Handle the count update
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val);
    }
});


/**
 * Like  Controller
 * */


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

//User has not yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button 
        likesView.toggleLikeBtn(true)

        //Add like to UI list
        likesView.renderLike(newLike)
        

//User has  liked current recipe        
    }else{
        //Remove like from state
        state.likes.deleteLike(currentID);

        //Toggle the like button
        likesView.toggleLikeBtn(false)

        //Remobe the like from UI list
        likesView.deleteLike(currentID)
        

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restore like recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
});


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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to sgopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like Controller
        controlLike();
    }
});
