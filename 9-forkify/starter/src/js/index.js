import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements } from './views/base';
import { renderLoader } from './views/base';
import { clearLoader } from './views/base'
/** Global State of the app
* - Search Object
* - Current recipe object
* - Liked recipes
*/
const state = {};

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
        
        //4. Search for recipes
        await state.search.getResults(search);

        //5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        // console.log(`state result is :`,state.search.result)
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
})