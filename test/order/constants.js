'use strict';

const commonConstants = require('../../lib/constants.js');

const NO_OF_STOPS = [2, 3, 4];
const INVALID_STOPS = [0, 1];
const CURRENCY = "HKD";
const FIRST_KM = 2000;
const DISTANCE_AFTER_2KM = 200;
const FARE_2KM = 20;
const FARE_AFTER_2KM = 5;
const FARE_2KM_NIGHT = 30;
const FARE_AFTER_2KM_NIGHT = 8;


const ORDER_STATUS = {
    ASSIGNING: "ASSIGNING",
    CANCELLED: "CANCELLED",
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED"
};


module.exports = Object.freeze(
    Object.assign({
        NO_OF_STOPS,
        INVALID_STOPS,
        ORDER_STATUS,
        CURRENCY,
        FIRST_KM,
        DISTANCE_AFTER_2KM,
        FARE_2KM,
        FARE_AFTER_2KM,
        FARE_2KM_NIGHT,
        FARE_AFTER_2KM_NIGHT
    }, commonConstants)
);