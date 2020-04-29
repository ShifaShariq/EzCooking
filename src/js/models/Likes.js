export default class Likes {
    constructor() {
        this.likes = [];
    }

    increaseLike (recipe) {
        const like = {
            id: recipe.id,
            title: recipe.title,
            author: recipe.author,
            img: recipe.img
        };

        this.likes.push(like);

        this.syncData();
        return like;
    }

    decreaseLike (id) {
        this.likes.splice(this.likes.findIndex(el => el.id === id), 1);
        this.syncData();
    }

    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    likesCount () {
        return this.likes.length;
    }

    syncData () {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage () {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
};

