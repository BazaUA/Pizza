
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = [];
var API = require('../API');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);
        $node.find(".buy-button-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });
        $node.find(".buy-button-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        

        $pizza_list.append($node);
    }
    
    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if(filter==="all"){
        var count = 0;
        Pizza_List.forEach(function(pizza){
            pizza_shown.push(pizza);
            count++;
            $(".pizza-count").text(count);
        });
    } 
    else {
        var count=0;
        Pizza_List.forEach(function(pizza){
            if(pizza.content.hasOwnProperty(filter)){
                pizza_shown.push(pizza);
                count++;
                $(".pizza-count").text(count);

            }
        });
    }
    showPizzaList(pizza_shown);

    }

    function initialiseMenu() {
    //Показуємо усі піци
        API.getPizzaList(function(err,data){
            if(err){
                Pizza_List = [];
            }else{
                Pizza_List=data;
                showPizzaList(Pizza_List);
            }
        });
        
        $("#all").click(function(){
            $(".count-tile").text("Усі піци");
            filterPizza("all");
        });
        $("#meat").click(function(){
            $(".count-tile").text("З м'ясом");
            filterPizza("meat");
        });
        $("#pineapple").click(function(){
            $(".count-tile").text("З ананасами");
            filterPizza("pineapple");
        });
        $("#ocean").click(function(){
            $(".count-tile").text("З морепродуктами");
            filterPizza("ocean");
        });
        $("#tomato").click(function(){
            $(".count-tile").text("вега");
            filterPizza("tomato");
        });
        $("#mushroom").click(function(){
            $(".count-tile").text("З грибами");
            filterPizza("mushroom");
        });
    
    }


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;