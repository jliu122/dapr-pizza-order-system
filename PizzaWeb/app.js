const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const axios = require('axios');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// dapr integration
// publish endpoint: http://localhost:<daprPort>/v1.0/publish/<pubsubname>/<topic>[?<metadata>]
const pubsubEndpoint = `http://localhost:3500/v1.0/publish/servicebus-pubsub/order`;

app.use(express.json({ type: ['application/json', 'application/*+json'] }));

app.post('/submitOrder', function(req, res){
    const order = {
        "orderId": JSON.parse(req.body["orderID"]),
        "cart": JSON.parse(req.body["cart"]),
        "status": "created",
    }
    axios.post(pubsubEndpoint, order)
        .then(function (response) {
            console.log("Created the order: " + order);
        })
        .catch(function (error) {
            console.log("failed to publish message." + error);
        });
});

module.exports = app;
