'use strict';

const httpConstants = require('http-constants');


const DATE = {
    PAST: "PAST",
    CURRENT: "CURRENT",
    FUTURE: "FUTURE",
    FUTURE_NOT10TO5: "FUTURE_NOT10TO5",
    FUTURE_IN10TO5: "FUTURE_IN10TO5",
};


const STRING_PATTERN = {
    DIGIT: '0',
    
};


module.exports = Object.freeze({
    
    DATE,
    HTTP_CODE: httpConstants.codes,
    HTTP_METHOD: httpConstants.methods,
    STRING_PATTERN
});