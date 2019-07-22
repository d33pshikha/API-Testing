'use strict';

const withThese = require('mocha-each');
const helpers = require('./../order/helpers.js');
const validate = require('./../order/validate.js');
const util = require('../../lib/util.js');
const constants = require('./../order/constants.js');
let totalStops = util.generateRandomIntegerWithRange(2, 4);

describe('Place Order - POST /v1/orders @APIAutomation', () => {

    withThese(constants.INVALID_STOPS).
        describe('Place Order @APIAutomation', (stops) => {

            it('should not create order for invalid ' + stops + ' stops ', async function () {
                //Creating order payload
                let orderData = await helpers.generateCreateOrderPayload(stops);
                //Response
                let res = await helpers.createOrder(orderData);
                validate.placeOrderInvalidStopJson(res);
            });

        });

    withThese(constants.NO_OF_STOPS).
        describe('Place Order @APIAutomation', (stops) => {


            it('should not create order for past order Date with ' + stops + ' stops ', async function () {
                //Creating order payload
                let orderData = await helpers.generateCreateOrderPayload(stops, util.getDateTime(constants.DATE.PAST));
                //Response
                let res = await helpers.createOrder(orderData);
                validate.placeOrderPastTime(res);
            });


            it('should create order for future order Date in 10AM to 5PM time with ' + stops + ' stops ', async function () {
                //Creating order payload
                let orderData = await helpers.generateCreateOrderPayload(stops, util.getDateTime(constants.DATE.FUTURE_IN10TO5));
                let stopsCount = orderData.stops.length;
                //Response
                let res = await helpers.createOrder(orderData);
                validate.placeOrderVerify(res, stopsCount);
                validate.fare10To5Verify(res);
            });


            it('should create order with ' + stops + ' stops ', async function () {
                //Creating order payload
                let orderData = await helpers.generateCreateOrderPayload(stops);
                let stopsCount = orderData.stops.length;
                //Response
                let res = await helpers.createOrder(orderData);
                validate.placeOrderVerify(res, stopsCount);

            });


            it('should create order for future order Date not in 10AM to 5PM time with ' + stops + ' stops ', async function () {
                //Creating order payload
                let orderData = await helpers.generateCreateOrderPayload(stops, util.getDateTime(constants.DATE.FUTURE_NOT10TO5));
                let stopsCount = orderData.stops.length;
                //Response
                let res = await helpers.createOrder(orderData);
                validate.placeOrderVerify(res, stopsCount);
                validate.fareNot10To5Verify(res);
            });

            it('should not create order for invalid location', async function () {
                //Creating order payload
                let orderData = helpers.generateInvalidLocationOrderPayload(stops);
                //Response
                let res = await helpers.createOrder(orderData);
                validate.placeOrderInvalidJson(res);
            });


        });

        it('should not create order for invalid json', async function () {
            //Creating order payload
            let orderData = {};
            //Response
            let res = await helpers.createOrder(orderData);
            validate.placeOrderInvalidStopJson(res);
        });
});

describe('Fetch Order - GET /v1/orders/{orderID} @APIAutomation', () => {

    withThese(constants.NO_OF_STOPS).
        describe('Fetch Order @APIAutomation', (stops) => {

            it('should fetch order details with ' + stops + ' stops ', async function () {
                let orderID = await helpers.generateOrderPayloadFetchOrderID(stops);
                let res = await helpers.fetchOrder(orderID);
                validate.fetchOrderVerify(res);

            });


            it('should fetch order details for future order with ' + stops + ' stops ', async function () {

                let orderID = await helpers.generateOrderPayloadFetchOrderID(stops, util.getDateTime(constants.DATE.FUTURE))
                let res = await helpers.fetchOrder(orderID);
                validate.fetchOrderVerify(res);
            });
        });



    it('should not fetch order details for invalid order ID', async function () {
        let orderID = util.generateRandomIntegerWithLength(10);
        //Response
        let res = await helpers.fetchOrder(orderID);
        validate.InvalidOrderIDVerify(res);

    });

});

describe('Take Order to Endpoint - PUT /v1/orders/{orderID}/take @APIAutomation', () => {


    it('driver to Take the Order to endpoint', async function () {
        let orderID = await helpers.generateOrderPayloadFetchOrderID(totalStops, util.getDateTime(constants.DATE.FUTURE))
        let res = await helpers.takeOrder(orderID);
        validate.takeOrderVerify(res);
    });


    it('should not take order to endpoint for invalid order ID', async function () {
        let orderID = util.generateRandomIntegerWithLength(10);
        //Response
        let res = await helpers.takeOrder(orderID);
        validate.InvalidOrderIDVerify(res);

    });

});

describe('Complete Order - PUT /v1/orders/{orderID}/complete @APIAutomation', () => {
    describe('Complete Order @APIAutomation', () => {
        let orderID = "";
        beforeEach(async function () {

            orderID = await helpers.generateOrderPayloadFetchOrderID(totalStops);
        });

        it('driver to Complete the Order endpoint', async function () {
            await helpers.takeOrder(orderID);
            let res = await helpers.completeOrder(orderID);
            validate.completeOrderVerify(res);

        });

        it('order should not be onGoing from completed status', async function () {

            await helpers.takeOrder(orderID);
            await helpers.completeOrder(orderID);
            let res = await helpers.takeOrder(orderID);
            validate.orderOnGoingInvalidScenarioVerify(res);

        });

        it('order should not be completed from cancelled status', async function () {
            await helpers.cancelOrder(orderID);
            let res = await helpers.completeOrder(orderID);
            validate.orderViolatedFlowVerify(res);

        });

        it('order should not be completed from assigning status', async function () {
            let res = await helpers.completeOrder(orderID);
            validate.orderViolatedFlowVerify(res);

        });

    });

    it('should not complete order for invalid order ID', async function () {
        let orderID = util.generateRandomIntegerWithLength(10);
        //Response
        let res = await helpers.completeOrder(orderID);
        validate.InvalidOrderIDVerify(res);


    });

});

describe('Cancel Order - PUT /v1/orders/{orderID}/cancel @APIAutomation', () => {


    describe('Cancel Order @APIAutomation', () => {
        let orderID = "";

        beforeEach(async function () {
            //generate orderID
            orderID = await helpers.generateOrderPayloadFetchOrderID(totalStops);
        });


        it('driver to cancel the Order after assigning status', async function () {
            let res = await helpers.cancelOrder(orderID);
            validate.cancelOrderVerify(res);

        });


        it('driver to cancel the Order after ongoing status', async function () {
            await helpers.takeOrder(orderID);
            let res = await helpers.cancelOrder(orderID);
            validate.cancelOrderVerify(res);

        });

        it('driver to change the Order status to onGoing after cancel status', async function () {
            await helpers.takeOrder(orderID);
            await helpers.cancelOrder(orderID);
            let res = await helpers.takeOrder(orderID);
            validate.orderOnGoingInvalidScenarioVerify(res);

        });

        it('order should not be cancelled from completed status', async function () {
            await helpers.takeOrder(orderID);
            await helpers.completeOrder(orderID);
            let res = await helpers.cancelOrder(orderID);
            validate.orderCancelAfterCompletedVerify(res);

        });

    });

    it('should not cancel order for invalid order ID', async function () {
        let orderID = util.generateRandomIntegerWithLength(10);
        //Response
        let res = await helpers.cancelOrder(orderID);
        validate.InvalidOrderIDVerify(res);

    });
});

