//                          <<....  SYSTEM IMPORTS  ....>>
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/ShoppingCart';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/shoppingCartView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader} from './views/base';

//* Variable specifying the current interaction user with the website.
const state = {};

//                          <<....  RECIPE CONTROLLER STARTS HERE ....>>
const controlRecipe = async () => {

    // To clear shopping list
    if (state.list) {
        const listId = state.list.items.map(el => el.id);
        listId.forEach( id => {
            state.list.removeItem(id);
            listView.removeItem(id);
        });
    }

    // Get Id from URL
    const id = window.location.hash.replace('#', '');

    if (id) {

        // Create new object for recipe 
        state.recipe = new Recipe(id);

        // Prepare UI for change
        recipeView.cleanRecipe();
        renderLoader(elements.recipe);

        // Highlight search active item
        if (state.search) {
            searchView.highlight(id);
        }
        
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            // Calculating the serving size and cooking time
            state.recipe.computeTime();
            state.recipe.computeServings();

            // Displaying recipe
            clearLoader(elements.recipe);
            recipeView.displayRecipe(state.recipe, state.likes ? state.likes.isLiked(id): false);
        } catch (error) {
            console.error('Error processing recipe!');
        }

    }

}

//                          <<....  SEARCH CONTROLLER STARTS HERE ....>>

const controlSearch = async (e) => {
    const form = e.target;

    // 1) Get Query from view
    const query = form.search.value;

    if (query) {
        // 2) Create new search object and add to state
        state.search = new Search(query);

        // 3) Handle UI for results
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // 4) Enable search for recipes
            await state.search.getResult();

            // 5) Clear search form & loader
            clearLoader(elements.searchResults);
            form.reset();

            // 6) Display results on UI
            searchView.displayResults(state.search.result);
        } catch (error) {
            clearLoader(elements.searchResults);
            console.error('Error receiving recipes');
        }

    }
}

//                          <<....  SHOPPING CART CONTROLLER STARTS HERE ....>>

export const controlList = () =>  {
    // Create a new list if there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to List and render UI
    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listView.displayItem(item);
    });
};

//                          <<....  LIKES CONTROLLER STARTS HERE ....>>

export const controlLike = () =>  {
    const recId = state.recipe.id;

    if (state.likes.isLiked(recId)) {
        // Remove from liked state
        state.likes.decreaseLike(recId);

        // Toggle button
        likesView.toggleButton(false);

        // Remove like from UI likes list
        likesView.decreaseLike(recId);

    } else {
        // Add to likes state
        const newLike = state.likes.increaseLike(state.recipe);

        // Toggle button
        likesView.toggleButton(true);

        // Add like to UI likes list
        likesView.renderLike(newLike);
    }
    likesView.toggleLikeMenu(state.likes.likesCount());
};

//                          <<....  EVENT HANDLER STARTS HERE ....>>

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.likesCount());

    state.likes.likes.forEach(el => likesView.renderLike(el));
});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch(e);
});

elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.displayResults(state.search.result, goToPage);
    }
});

//                          <<....  BUTTON CLICK HANDLER STARTS HERE ....>>

elements.recipe.addEventListener('click', e => {
    // Handle decrease button
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.modifyServings('dec');
            recipeView.modifyServings(state.recipe);
        }        

    // Handle increase button
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.modifyServings('inc');
        recipeView.modifyServings(state.recipe);

    // Handle add to shopping cart button
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();

    // Handle add favorite button
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }

});

elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete item
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state list
        state.list.removeItem(id);

        // Delete from UI
        listView.removeItem(id);
    
    // Handle count updates
    } else if (e.target.matches('.shopping__item-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);

    }
});

document.getElementById('btnClear').addEventListener('click', () => {
    const listId = state.list.items.map(el => el.id);
    listId.forEach( id => {
        state.list.removeItem(id);
        listView.removeItem(id);
    });
});



