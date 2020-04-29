import {elements} from './base';

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`
const displayButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Button go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both bottons        
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;

    } else if (page === pages && pages > 1) {
        // Botton go to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPage.insertAdjacentHTML('afterbegin', button);
}

export const clearResults = () => {
    elements.resultList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
}

export const highlight = id => {
    const actives = Array.from(document.getElementsByClassName('results__link--active'));
    actives.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

const displayRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.resultList.insertAdjacentHTML('beforeend', markup);
}


const limitTitle = (title, limit = 20) => {
    return title.length > limit ? title.slice(0, limit) + '...' : title;
};

export const displayResults = (recipes, page = 1, resPerPage = 10) => {
    
    // Render results
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(displayRecipe);

    // Render pagination
    displayButtons(page, recipes.length, resPerPage);
}