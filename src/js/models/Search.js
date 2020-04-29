import axios from 'axios';

import { proxy, key, url_search} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResult() {

        try {
            const res = await axios.get(`${proxy}${url_search}?&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    };

}