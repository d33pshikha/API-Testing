'use strict';

const util = require('../../lib/util.js');
const constants = require('./../order/constants.js');
const fs = require("fs");
const appJson = JSON.parse(fs.readFileSync("././data/application.json"));

module.exports = {
    createOrder: function createOrder(data) {
        return util.sendRequest(appJson.base.url, appJson.endpoints.placeOrder, constants.HTTP_METHOD.POST, data);

    },
    fetchOrder: function fetchOrder(orderID) {
        return util.getRequest(appJson.base.url, appJson.endpoints.fetchOrder + orderID);

    },

    takeOrder: function takeOrder(orderID) {
        return util.sendRequest(appJson.base.url, appJson.endpoints.fetchOrder + orderID + appJson.endpoints.takeOrder, constants.HTTP_METHOD.PUT);

    },

    completeOrder: function completeOrder(orderID) {
        return util.sendRequest(appJson.base.url, appJson.endpoints.fetchOrder + orderID + appJson.endpoints.completeOrder, constants.HTTP_METHOD.PUT);

    },

    cancelOrder: function cancelOrder(orderID) {
        return util.sendRequest(appJson.base.url, appJson.endpoints.fetchOrder + orderID + appJson.endpoints.cancelOrder, constants.HTTP_METHOD.PUT);

    },


    generateCreateOrderPayload: async function generateCreateOrderPayload(totalStops, date = null) {

        let obj = {};
        if (date != null) {
            obj.orderAt = date;
        }
        let myArray = await util.getDataFromCSV();
        let stops = [];
        for (let i = 0; i < totalStops; i++) {
            stops.push(
                myArray[i]
            );
        }

        obj.stops = stops;
        return obj;
    },

    generateInvalidLocationOrderPayload: function generateInvalidLocationOrderPayload(totalStops) {

        let obj = {};
        let stops = [];
        for (let i = 0; i < totalStops; i++) {
            stops.push({
                "lat": util.generateRandomFloatWithRange(10, 100, 6),
                "lng": util.generateRandomFloatWithRange(100, 400, 6)
            });
        }

        obj.stops = stops;
        return obj;


    },

    generateOrderPayloadFetchOrderID: async function generateOrderPayloadFetchOrderID(totalStops) {
        //Creating order payload
        let orderData = await this.generateCreateOrderPayload(totalStops);
        //Response
        let res = await this.createOrder(orderData);
        let orderID = res.body.id;
        return orderID;
    },




}