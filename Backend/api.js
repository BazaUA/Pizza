/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var Liqpay= require('./liqpay.js');
exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var dataInput	=	req.body;
    console.log(dataInput);
    console.log(dataInput.Cart);
    var allPiza="";
    var amount=0;
    for(var i=0;i<dataInput.Cart.length;i+=1){
        allPiza+=dataInput.Cart[i].quantity+" "+dataInput.Cart[i].size+" "+dataInput.Cart[i].pizza.title+", ";
        amount+=(dataInput.Cart[i].pizza[dataInput.Cart[i].size].price)*dataInput.Cart[i].quantity;
    }
    console.log(amount);
    var LIQPAY_PUBLIC_KEY = 'i56166407707';
        var LIQPAY_PRIVATE_KEY = 'Wsih6qojE5ZJftNkEiuAd34mgYiAlXOXh8LGoETB';
        var order	=	{
            version:	3,
            public_key:	LIQPAY_PUBLIC_KEY,
            action:	"pay",
            amount:	amount,
            currency:	"UAH",
         description:	dataInput.name+", Адреса доставки: "+dataInput.address+", номер телефону: "+dataInput.phone+". "+allPiza+"Разом: "+amount+" грн",
            order_id:	Math.random(),
            //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
            sandbox:	1
        };
        
        
        var data	=	Liqpay.base64(JSON.stringify(order));
        var signature	=	Liqpay.sha1(LIQPAY_PRIVATE_KEY	+	data	+	LIQPAY_PRIVATE_KEY);
    
    res.send({
        success: true,
        data: data,
        signature: signature
    });
};