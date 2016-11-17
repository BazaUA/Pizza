/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var LIQPAY_PUBLIC_KEY = 'i56166407707';
        var LIQPAY_PRIVATE_KEY = 'Wsih6qojE5ZJftNkEiuAd34mgYiAlXOXh8LGoETB';
        var order	=	{
            version:	3,
            public_key:	LIQPAY_PUBLIC_KEY,
            action:	"pay",
            amount:	568.00,
            currency:	"UAH",
            description:	"Опис транзакції",
            order_id:	Math.random(),
            //!!!Важливо щоб було 1,	бо інакше візьме гроші!!!
            sandbox:	1
        };
        
        
        var data	=	Liqpay.base64(JSON.stringify(order));
        var signature	=	Liqpay.sha1(LIQPAY_PRIVATE_KEY	+	data	+	LIQPAY_PRIVATE_KEY);

    res.send({
        data: data,
        signature: signature
        
    });
};