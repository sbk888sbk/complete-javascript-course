import axios from 'axios';
// import proxy from '../config.js'

const proxy = 'https://cors-anywhere.herokuapp.com/';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe (){
        try {
            const res = await axios(`${proxy}http://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res)
        } catch(e){
            console.log(e);
            alert("Something went wrong :(");
        }

    }

    calcTime () {
        //Assuming we need 15 min for every 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 2);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort, 'kg', 'g' ];

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // 2. Remove parenthasis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if(unitIndex > -1){
                // There is a unit
                // Ex 4 1/2 cups, arrCount is [4, 1/2]
                // Ex 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredient : arrIng.slice(unitIndex + 1).join(' ')
                }
                
            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit but the 1st element is 
                objIng = {
                    count : parseInt(arrIng[0], 10),
                    unit : '',
                    ingredient :arrIng.slice(1).join(' ')
                };

            } else if ( unitIndex === -1){
                // There is no unit and no number in 1st position

                objIng = {
                    count : 1,
                    unit :'',
                    ingredient
                }
            }
            // console.log("Inside recipe ingredients object ", objIng)
            return objIng;

        });
        this.ingredients = newIngredients;
        // console.log("Inside recipe this.ingredients object ", newIngredients)
    }

    updateServings(type) {
        // Servings 
        const newServings = type === 'desc'? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(el => {
            el.count *= (newServings /  this.servings);
        });
        this.servings = newServings;
    }   
}
