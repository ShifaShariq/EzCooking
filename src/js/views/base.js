export const elements = {
    searchForm: document.querySelector('.search'),
    searchResults: document.querySelector('.results'),
    resultList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

export const elementString = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = parent => {
    const loader = parent.querySelector(`.${elementString.loader}`);
    if (loader) parent.removeChild(loader);
}