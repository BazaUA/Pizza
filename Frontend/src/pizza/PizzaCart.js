/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var localStorage = require('../LocalStorage');
var API = require('../API');
var SAVED_PIZZA_KEY = "savedPizza";
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];


//HTML едемент куди будуть додаватися піци
var $html_empty = $(".tmp").html();
var $cart = $("#cart");

function addToCart(pizza, size) {
       var bool = false;
    for(var i =0; i < Cart.length; i++){
        if(Cart[i].pizza.title===pizza.title&&Cart[i].size===size){Cart[i].quantity++;
            bool=true;
        }
    }
    if(!bool){
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    var html_card = Cart.indexOf(cart_item);
    Cart.splice(html_card,1);
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var savedPizza= localStorage.get("savedPizza");
    var number=parseInt($(".orders-count-span").text());
    if(savedPizza){
      Cart = savedPizza;      
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    var cost=0;
    var cost_one=0;
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
   
    localStorage.set(SAVED_PIZZA_KEY, Cart);        
     //Очищаємо старі піци в кошику
    $cart.html("");
    if(Cart.length==0){
        $cart.html($html_empty);
        $(".sum-number").text("0 грн");
    }
    
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);
        
        cost+=(cart_item.pizza[cart_item.size].price)*cart_item.quantity;
        cost_one=0;
        cost_one+=(cart_item.pizza[cart_item.size].price)*cart_item.quantity;

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            
            
            updateCart();
        });
        $node.find(".minus").click(function(){
            if(cart_item.quantity>1){
                cart_item.quantity--;
                
            updateCart();}
            else if(cart_item.quantity>0){
                removeFromCart(cart_item);
            }
           
            updateCart();
        });
        $node.find(".count-clear").click(function(){
            removeFromCart(cart_item);
            updateCart();
        });
        $(".clear-order").click(function(){
            Cart=[];
            cost=0;
            $(".sum-number").text(cost+"грн");
            updateCart();
        });
        
     
            $(".sum-number").text(cost+"грн");
        $node.find(".price").text(cost_one+"грн");
        
           
       
        $cart.append($node);
    }
    $(".orders-count-span").text(Cart.length);
    
    Cart.forEach(showOnePizzaInCart);

    $(".button-order").click(function(){    
        API.createOrder(Cart,function(){
            console.log("Data sent.");
        });
    });
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;