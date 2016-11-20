
/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var localStorage = require('../LocalStorage');
var API = require('../API');
var PizzaOrder = require('./PizzaOrder');
var Liqpay= require('../liqpay.js');
var SAVED_PIZZA_KEY = "savedPizza";
var map;
var directionsDisplay;
var gBool;
var amount;
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

    $(".next-step-button").click(function(){
        gBool=true;
        haveNumber(form.name.value);
        number(form.phone.value);
        
        if(form.address.value.length==0){
            $(".address-help-block").css("display","block");
            bool=false;
        }else{
             $(".address-help-block").css("display","none");
        }
        var name = form.name.value;
        var phone = form.phone.value;
        var address =form.address.value; 
        var data	=	{
            Cart: Cart,
            name: name,
            phone:phone, 
            address: address
        };
        
        if(gBool){
            API.createOrder(data,function(err,data){
                if(err){
                    console.log("err")
                }else{
                    LiqPayCheckout.init({
                        data:	data.data,
                        signature:	data.signature,
                        embedTo:	"#liqpay",
                        mode:	"popup"	//	embed	||	popup
                    }).on("liqpay.callback",	function(data){
                        alert("Cтатус оплати "+data.status);
                    }).on("liqpay.ready",	function(data){
                        //	ready
                    }).on("liqpay.close",	function(data){
                        //	close
                    });
                }
            });
            
        }
    });

}

function	initialize()	{
    var markerHome;
    var point;
    //Тут починаємо працювати з картою
    var mapProp =	{
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom:	13
    };
    var html_element =	document.getElementById("googleMap");
    map =	new	google.maps.Map(html_element,	 mapProp);
    point	=	new	google.maps.LatLng(50.464379,30.519131);
    var marker	=	new	google.maps.Marker({
        position:	point,
        animation: google.maps.Animation.DROP,
        map:	map,
        icon:	"assets/images/map-icon.png"
    });
    google.maps.event.addListener(map,	'click',function(me){
        
        if(markerHome){
            markerHome.setMap(null);
            markerHome = null;
        }
        var coordinates	=	me.latLng;
        markerHome	=	new	google.maps.Marker({
            position:	coordinates,
            animation: google.maps.Animation.DROP,
            map:	map,
            icon:	"assets/images/home-icon.png"
        });
        geocodeLatLng(coordinates,	function(err,	adress){
            if(!err)	{
                $("#inputAdress").val(adress);
                $("#ad").text(adress);
              
            }
        })
        calculateRoute(point,	 me.latLng,	function(err, time){
           if(!err){
               $("#tm").text(time.duration.text);
             
           } 
        });	
    });
    
    $("#inputAdress").keypress(function(){
        if( $("#inputAdress").val().length>4){
            var coordinates;
            if(markerHome){
                markerHome.setMap(null);
                markerHome = null;
            }
            var address = $("#inputAdress").val();
            geocodeAddress(address, function(err, inputCoordinates){
                if(!err){
                    coordinates	=	inputCoordinates;
                    console.log(coordinates);
                    markerHome	=	new	google.maps.Marker({
                        position:	coordinates,
                        animation: google.maps.Animation.DROP,
                        map:	map,
                        icon:	"assets/images/home-icon.png"
                    });
                    geocodeLatLng(coordinates,	function(err,	adress){
                        if(!err)	{
                            console.log(address);
                            $("#ad").text(adress);
                        }
                    });
                    calculateRoute(point,	 coordinates,	function(err, time){
                        if(!err){
                            $("#tm").text(time.duration.text);

                        } 
                    });
                } 
            });
        }
    });
    
    
}

function	geocodeLatLng(latlng,	 callback){
        //Модуль за роботу з адресою
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'location':	latlng},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
                var adress =	results[1].formatted_address;
                callback(null,	adress) ;
            }	else	{
                callback(new	Error("Can't	find	adress"));
            }
        });
    }
    
    function	geocodeAddress(address,	 callback)	{
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'address':	address},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
                var coordinates	=	results[0].geometry.location;
               
                callback(null,	coordinates);
            }	else	{
                callback(new	Error("Can	not	find	the	adress"));
            }
        });
    }
    
    function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
        if(directionsDisplay){
            directionsDisplay.setMap(null);
            directionsDisplay=null;
        }
        directionsDisplay = new google.maps.DirectionsRenderer();
        var directionService =	new	google.maps.DirectionsService();
        directionService.route({
            origin:	A_latlng,
            destination:	B_latlng,
            travelMode:	google.maps.TravelMode["DRIVING"]
        },	function(response,	status)	{
            if	(	status	==	google.maps.DirectionsStatus.OK )	{
                directionsDisplay.setDirections(response);
                var leg	=	response.routes[	0	].legs[	0	];
                callback(null,	{
                    duration:	leg.duration
                });
            }	else	{
                callback(new	Error("Can'	not	find	direction"));
            } 
        });
        directionsDisplay.setMap(map);

    }



    //Коли сторінка завантажилась

    google.maps.event.addDomListener(window,	 'load',	initialize);

function haveNumber(input){
    var bool=true;
    var name=[];
    name=input;
    if(name.length==0){
        gBool=false;
        bool=false;
    }
    for(var int=0;int<name.length;int+=1){
        if (name[int].charCodeAt(0) >= 48 && name[int].charCodeAt(0)<=57) {
            bool=false;   
            gBool=false;
        }
    }
    
    if(bool){
         $(".name-help-block").css("display","none");
       
    }
    else{
         $(".name-help-block").css("display","block");
        
    }
}
function number(input){
   
    var bool=true;
    var name=[];
    name=input;
    if (!(name.length==10&&name[0]==0)&&!(name.length==13&&name[0]=='+'&&name[1]=='3'&&name[2]=='8'&&name[3]=='0')){
        gBool=false;
        bool=false;
    }
    for(var int=1;int<name.length;int+=1){
        if (!(name[int].charCodeAt(0) >= 48 && name[int].charCodeAt(0)<=57)) {
            bool=false;   
            gBool=false;
        }
    }
  
    if(bool){
         $(".phone-help-block").css("display","none");
       
    }
    else{
         $(".phone-help-block").css("display","block");
    }
}


exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;