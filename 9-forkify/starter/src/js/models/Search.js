import axios from 'axios';
// import proxy from '../config';
const proxy = 'https://cors-anywhere.herokuapp.com/';
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults (query) {
        try {
            const res = await axios(`${proxy}http://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result)
        } catch(err){
            alert(err);
            // console.log(err);
        }
    }
}




// forkify-api.herokuapp.com
//const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
//    const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);




