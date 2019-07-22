'use strict';

const requestDefaults = require('superagent-defaults');
const moment = require('moment-timezone');
const randomatic = require('randomatic');
const constants = require('../lib/constants.js');
const csvFilePath = '././data/orderPayload.csv';
const csv = require('csvtojson');



module.exports = {
    getRequest: async function getRequest(host, uri) {
        let agent = requestDefaults();

        agent.set("Content-Type", "application/json");

        let res = await agent.get(host + uri).ok(() => true);

        this.response = res;

        return res;
    },
    sendRequest: async function sendRequest(host, uri, httpMethod = constants.HTTP_METHOD.POST, data = null) {
        let agent = requestDefaults();
        let res;
        agent.set("Content-Type", "application/json");

        switch (httpMethod) {
            case constants.HTTP_METHOD.POST:
                res = await agent.post(host + uri).ok(() => true).
                    send(data);
                break;
            case constants.HTTP_METHOD.PUT:
                res = await agent.put(host + uri).ok(() => true);
                break;
        }

        this.response = res;

        return res;
    },


    generateRandomIntegerWithRange: function generateRandomIntegerWithRange(min, max) {
        const intermediate = Math.random() * (max + 1 - min);
        return Math.floor(min + intermediate).toString();
    },
    generateRandomIntegerWithLength: function generateRandomIntegerWithLength(length) {
        return parseInt(randomatic(constants.STRING_PATTERN.DIGIT, length));
    },

    generateRandomFloatWithRange: function generateRandomFloatWithRange(minValue, maxValue, precision) {
        return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision))
    },


    getDateTime: function getDateTime(date = constants.DATE.CURRENT) {
        let hour;
        switch (date) {
            case constants.DATE.PAST:
                date = moment().utc().year(moment().year() - 1);
                break;
            case constants.DATE.CURRENT:
                date = moment();
                break;
            case constants.DATE.FUTURE:
                date = moment().utc().year(moment().year() + 1);
                break;

            case constants.DATE.FUTURE_IN10TO5:
                date = moment().utc().year(moment().year() + 1);
                date = date.hour(this.generateRandomIntegerWithRange(13, 17));
                break;

            case constants.DATE.FUTURE_NOT10TO5:
                date = moment().utc().year(moment().year() + 1);
                date = date.hour(this.generateRandomIntegerWithRange(1, 4) || this.generateRandomIntegerWithRange(21, 23));
                break;

            default:
                throw new Error("Unhandled case");
        }
        return date.format();
    },

    getDataFromCSV: async function getDataFromCSV() {

        let CSV_DATA = [];
        if (CSV_DATA.length > 0) {
            return CSV_DATA;
        }
        CSV_DATA = await csv({
            colParser: {
                "lat": {
                    flat: true,
                    cellParser: "number"
                },
                "lng": {
                    flat: true,
                    cellParser: "number"
                }
            }
        }).fromFile(csvFilePath);

        return CSV_DATA;

    }




}