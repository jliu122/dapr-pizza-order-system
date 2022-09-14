var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const app = express();
const axios = require('axios');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// dapr integration
// publish endpoint: http://localhost:<daprPort>/v1.0/publish/<pubsubname>/<topic>[?<metadata>]
const pubsubEndpoint = `http://localhost:3500/v1.0/publish/servicebus-pubsub/order`;

//TODO: add Dapr integration for sending order and price in req.body to event broker
app.use(express.json({ type: ['application/json', 'application/*+json'] }));

app.post('/submitOrder', function(req, res){
    var cart = JSON.parse(req.body["cart"]);
    var orderId = JSON.parse(req.body["orderID"]);

    cartToSend = [];

    cartToSend.push({"orderId": orderId});

    cart.forEach(element => {
        cartToSend.push({"name":element.name, "price": element.price, "count": element.count});
    });

    console.log(JSON.parse(req.body["orderID"]));
    console.log(JSON.parse(req.body["cart"]));
    console.log("body is : "+ JSON.stringify(req.body))
    order = {
        "orderId": orderId,
        "cart": cart
    }
    console.log("print order:" + JSON.stringify(order))
    //TODO: send JSON.stringify(cartToSend) to the pub/sub event bus
    axios.post(pubsubEndpoint, JSON.stringify(order))
        .then(function (response) {
            console.log("Published data: " + response.config.data);
        })
        .catch(function (error) {
            console.log("failed to publish message." + error);
        });
    console.log(JSON.stringify(cartToSend));
});

module.exports = app;
