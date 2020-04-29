import axios from 'axios';

import {url_get, proxy, key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {

        try {
            const res = await axios.get(`${proxy}${url_get}?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            alert(error);
        }
    };

    computeTime () {
        const numImg = this.ingredients.length;
        const periods = Math.ceil(numImg / 3);
        this.time = periods * 15;
    }

    computeServings () {
        this.servings = 4;
    }

    parseIngredients () {
        const fullUnits = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const shortUnits = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...shortUnits, 'kg', 'g']

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            fullUnits.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, shortUnits[i]); 
            })

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const IngredientsArray = ingredient.split(' ');
            const unitIndex = IngredientsArray.findIndex(el2 => units.includes(el2));

            let ingredientsObject;
            if (unitIndex > -1) {
                // There is a unit
                const arrCount = IngredientsArray.slice(0, unitIndex);

                let count; 
                if (arrCount.length === 1) {
                    count = eval(IngredientsArray[0].replace('-', '+'));
                } else {
                    count = eval(arrCount.join('+'));
                }

                ingredientsObject = {
                    count,
                    unit: IngredientsArray[unitIndex],
                    ingredient: IngredientsArray.slice(unitIndex + 1).join(' ')
                }


            } else if (parseInt(IngredientsArray[0], 10)) {
                // There is not Unit, but 1st element is a number
                ingredientsObject = {
                    count: parseInt(IngredientsArray[0], 10),
                    unit: '',
                    ingredient: IngredientsArray.slice(1).join(' ')
                }

            } else if ( unitIndex === -1) {
                // There is not a unit
                ingredientsObject = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return ingredientsObject;
        });
        this.ingredients = newIngredients;
    }

    modifyServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach( el => {
            el.count *= ( newServings / this.servings);
        });

        this.servings = newServings;
    };
}