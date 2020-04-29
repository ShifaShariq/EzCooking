import {elements} from './base';

export const removeItem = id => {
    const item = elements.shoppingList.querySelector(`[data-itemid="${id}"]`);
    if (item) item.remove();
};

export const displayItem = (item) =>  {
  const markup = `
    <li class="shopping__item" data-itemid="${item.id}">
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__item-value" min="0">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
  `;
  
  elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};


