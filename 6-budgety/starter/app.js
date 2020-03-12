// BUDGET CONTROLLER START
var budgetController = (function() {// THis is an immediately invoked function expression

    //This is Expense  function constructor
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round(( this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    //This is Income  function constructor
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function (type){
        var sum = 0;

        data.allItems[type].forEach(element => {
            sum += element.value;
        });
        data.totals[type] = sum;
    }

    // This contains the total data of all inc and exp along with totals
    var data = {
        allItems : {
            exp : [],// Array of expense objects
            inc : [] //Array of income Objects
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget :0,
        percentage : -1
    };

    return{
        addItem : function(type, desc, val) {
            var newItem, ID;
            // Create New ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            }
            else {
                ID = 0;
            }

            // Create New Item based on inc or exp
            newItem = new Expense(ID, desc, val);

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },
        deleteItem  : function (type , id){
            var ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },
        calculateBudget : function () {

            // 1. Calculate Total Income and Expenses
            calculateTotal('exp')
            calculateTotal('inc')

            // 2. Calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // 3. Calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round(( data.totals.exp / data.totals.inc ) * 100);
            } else {
                data.percentage = -1;
            }
            

        },
        calculatePercentages : function () {
            data.allItems.exp.forEach(function (element){
                element.calcPercentage(data.totals.inc);
            })
        },
        getPercentages : function () {
            var allPerc = data.allItems.exp.map(function(element){
                return element.getPercentage();
            });
            return allPerc;            
        },
        getBudget : function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },
        testing : function (){
            console.log(data);
        }

    }

})();
// BUDGET CONTROLLER END
//====================================================================================================================================================




//====================================================================================================================================================
// UI CONTROLLER START
var UIController = (function() {

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expensePercentageLabel : '.item__percentage'
    }

    return {
        getinput : function () {
            return {
                 type : document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                 description : document.querySelector(DOMstrings.inputDescription).value,
                 value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };            
        },
        addListItem : function (obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type ==='exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
                
            // Replace placeholder text with actual data
             newHtml = html.replace('%id%', obj.id);
             newHtml = newHtml.replace('%description%', obj.description);  
             newHtml = newHtml.replace('%value%', obj.value);  

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem : function (selectorID) {
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },
        clearFileds : function (){
            var fields, fieldsArray;
            //querySelectorAll returns a List
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // Calling Array Slice method on List to get Array of elements
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArray[0].focus();

        },
        displayBudget : function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;     
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
        },
        displayPercentages : function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);

            var nodeListForEach = function(list, callback){
                for (var i = 0 ; i< list.length; i++){
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function (current, index) {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.texContent = '---';
                }
            });

        },
        getDOMStrings : function (){
            return DOMstrings;
        }
    }

})();
// UI CONTROLLER END
//====================================================================================================================================================




//=======================================================================================================================
// GLOBAL APP CONTROLLER START
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        
        // Retrieving the DOM Strings data from the UI conttoller
        var DOM = UIController.getDOMStrings();
        
        //EVENT LISTERNERS
        // 1. Button click event
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        // 2. Global Event Listener for return on enter key
        document.addEventListener('keypress', function (event) {

            // Filtering the event using keyCode property for keyboard input
            if (event.keyCode === 13 || event.which === 13){
                console.log("Enter was pressed");
                ctrlAddItem();
            }
        });    
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)

    }

    var updateBudget = function () {

        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget  = budgetCtrl.getBudget();

        //3. Display the budget on UI
        UICtrl.displayBudget(budget);
        
        
    }

    var updatePercentages = function () {

        // 1. Calcualte Percetage
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    }

    
    // To Add an element
    var ctrlAddItem = function (){
        var input, newItem;

        //1. Get the field input data
        input = UIController.getinput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UIController.addListItem(newItem, input.type);

            //4. Clear the Fileds
            UIController.clearFileds();

            //5. Calculate and Upadte Budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();
        }

    }

    // To Delete an element
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID =event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            

            // 1. delete the item from the data structre
            budgetCtrl.deleteItem(type, ID)

            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();
            
            //4. Calculate and update percentages
            updatePercentages();
        }
    }

    return {
        init : function() {
            console.log("Application has started");
            setupEventListeners();
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
        }
    }


})(budgetController, UIController);
// GLOBAL APP CONTROLLER END
//====================================================================================================================================================




//=======================================================================================================================
// Calling the init() function to start the application
controller.init()