import uniqid from 'uniqid';

export default class List {
    constructor () {
        this.items = [];
    }

    removeItem (id) {
        const deleted = this.items.splice(this.items.findIndex(el => el.id === id), 1);
        console.log(`The element ${deleted.ingredient} has been deleted`);
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };

        this.items.push(item);
        return item;
    }

    updateCount (id, newCount) {  
        this.items.find(el => el.id === id).count = newCount;
    }
};
