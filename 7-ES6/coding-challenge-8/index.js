/* -------------------------------------------------------- Town Management System -------------------------------------------------------- */

class TownAsset{
    constructor(name, builtYear){
        this.name = name;
        this.builtYear = builtYear;
    }
}

 class Park extends TownAsset{
     constructor(name, builtYear, noOfTrees, area){
     super(name, builtYear);
     this.noOfTrees = noOfTrees;
     this.area = area;
     this.age = new Date().getFullYear() - this.builtYear;
     this.density = this.noOfTrees / this.areea;
     }

     getParkAge = () => {
         return new Date().getFullYear() - this.builtYear;
     }

     getDenssity = () => {
         return this.noOfTrees / this.areea;
     }
 }

 class Street extends TownAsset{
     constructor(name, builtYear, length){
     super(name, builtYear);
     this.streetLength = length;
     }

    getCategory = () => {
        if (isNaN(this.streetLength)){
            return `normal`;
        } else if (this.streetLength < 3 ) {
            return `tiny`;    
        } else if (this.streetLength < 5 ) {
            return `normal`
        } else if (this.streetLength < 8) {
            return `large`
        } else{
            return `huge`
        }
    }
 }


 const park1 = new Park("Jim Corbett National Park", 1950, 10000, 1000);
 const park2 =  new Park("Indira Gandhi National Park", 1920, 100000, 10000);
 const park3 =  new Park("Sai Bala Krishna International Park", 2020, 1000, 2000);

 const street1 = new Street("MG Road", 1900, 5);
 const street2 = new Street("Bundar Road", 1950, 1);
 const street3 = new Street("BRTS Road", 2010, 10);
 const street4 = new Street("Kurmiah Street", 1970, 2)

//This contains all the assets of the town
let myTown = {
    parks :[park1, park2, park3],
    streets : [street1, street2, street3, street4]
}

//This Function displays ages of Each individual Park and density
myTown.parks.forEach(park => {
    console.log(` Age of ${park.name} is ${park.getParkAge()} years old and density is ${this.density}`)
    
});


//Function to display name of the park which has more than 1000 trees
for (const park of myTown.parks) {
    park.noOfTrees > 1000 ?  console.log(`${park.name} has more than 1000 trees`) : false ;
}

//Function to display street size category
let totalLength = 0;
for (const street of myTown.streets) {
    totalLength = totalLength + street.streetLength;
    console.log(`${street.name}'s category is ${street.getCategory()}`);
}

//Function to display ave\g length of the town's streets
console.log(` Average length of the town's street is ${totalLength / myTown.streets.length}`)