'use strict';

const expect = require('../../lib/expect.js');
const constants = require('./../order/constants.js');
const fs = require("fs");
const messagesJson = JSON.parse(fs.readFileSync("././data/messages.json"));

const PLACE_ORDER_RESPONSE = {
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "drivingDistancesInMeters": {
      "type": "array",
      "items": [
        {
          "type": "integer"
        }
      ]
    },
    "fare": {
      "type": "object",
      "items": [
        {
          "type": "array",
          "properties": {
            "amount": {
              "type": "number"
            },
            "currency": {
              "type": "string"
            }
          },
          "required": [
            "amount",
            "currency"
          ]
        }
      ]
    }
  },
  "required":
    [
      "id",
      "drivingDistancesInMeters",
      "fare"
    ]
};


const FETCH_ORDER_RESPONSE = {
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "stops": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "lat": {
              "type": "number"
            },
            "long": {
              "type": "number"
            }
          },
          "required": [
            "lat",
            "lng"
          ]
        }
      ]
    },
    "drivingDistancesInMeters": {
      "type": "array",
      "items": [
        {
          "type": "integer"
        }
      ]
    },
    "fare": {
      "type": "object",
      "items": [
        {
          "type": "array",
          "properties": {
            "amount": {
              "type": "number"
            },
            "currency": {
              "type": "string"
            }
          },
          "required": [
            "amount",
            "currency"
          ]
        }
      ]
    }
  },
  "status": {
    "type": "string"
  },
  "createdTime": {
    "type": "string"
  },
  "orderDateTime": {
    "type": "string"
  },
  "required": [
    "id",
    "drivingDistancesInMeters",
    "fare",
    "status",
    "createdTime",
    "orderDateTime"
  ]
};


const TAKE_ORDER_ENDPOINT_RESPONSE = {
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "status": {
      "type": "string"
    },
    "ongoingTime": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "status",
    "ongoingTime"
  ]
};

const COMPLETE_ORDER_RESPONSE = {
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "status": {
      "type": "string"
    },
    "completedAt": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "status",
    "completedAt"
  ]
};

const CANCEL_ORDER_RESPONSE = {
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "status": {
      "type": "string"
    },
    "cancelledAt": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "status",
    "cancelledAt"
  ]
};

const INVALID_ORDER_RESPONSE = {
  "type": "object",
  "properties": {
    "message": {
      "type": "string"
    }
  },
  "required": [
    "message"
  ]
};

module.exports = {
  placeOrderVerify: function placeOrderVerify(res, stopsCount) {
    expect(res.status).to.equal(constants.HTTP_CODE.CREATED);
    let body = res.body;
    expect(body).to.be.jsonSchema(PLACE_ORDER_RESPONSE);
    expect(body.id).not.be.null;
    expect(body.fare.amount).not.be.null;
    expect(body.fare.currency).to.equal(constants.CURRENCY);
    // verify the driving distances based on the stops
    let drivingDistance = body.drivingDistancesInMeters;
    expect(drivingDistance.length).to.equal(stopsCount - 1);


  },
  fare10To5Verify: function fare10To5Verify(res) {
    //verify the fare based on the order time i.e. between 9AM to 5PM
    let totalDistance = 0;
    let body = res.body;
    let drivingDistance = body.drivingDistancesInMeters;
    drivingDistance.forEach(function (td) {
      totalDistance = totalDistance + td;
    });
    let fare = (((totalDistance - constants.FIRST_KM) / constants.DISTANCE_AFTER_2KM) * constants.FARE_AFTER_2KM) + constants.FARE_2KM;
    fare = fare.toFixed(2);
    expect(body.fare.amount).to.equal(fare);

  },

  fareNot10To5Verify: function fareNot10To5Verify(res) {
    //verify the fare based on the order time i.e. not in between 9AM to 5PM
    let totalDistance = 0;
    let body = res.body;
    let drivingDistance = body.drivingDistancesInMeters;
    drivingDistance.forEach(function (td) {
      totalDistance = totalDistance + td;
    });
    let fare = (((totalDistance - constants.FIRST_KM) / constants.DISTANCE_AFTER_2KM)
      * constants.FARE_AFTER_2KM_NIGHT) + constants.FARE_2KM_NIGHT;
    fare = fare.toFixed(2);
    expect(body.fare.amount).to.equal(fare);

  },

  placeOrderInvalidJson: function placeOrderInvalidJson(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.SERVICE_UNAVAILABLE);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.serviceUnavailable);


  },

  placeOrderInvalidStopJson: function placeOrderInvalidStopJson(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.BAD_REQUEST);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.invalidStopsInvalidJson);
  },

  placeOrderPastTime: function placeOrderPastTime(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.BAD_REQUEST);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.pastDatePlaceOrder);

  },


  fetchOrderVerify: function fetchOrderVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.OK);
    let body = res.body;
    expect(body).to.be.jsonSchema(FETCH_ORDER_RESPONSE);
    expect(body.status == constants.ORDER_STATUS.ASSIGNING).to.be.true;
    expect(body.createdTime).not.be.null;
    expect(body.orderDateTime).not.be.null;

  },

  InvalidOrderIDVerify: function InvalidOrderIDVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.NOT_FOUND);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.invalidOrderID);
  },

  takeOrderVerify: function takeOrderVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.OK);
    let body = res.body;
    expect(body).to.be.jsonSchema(TAKE_ORDER_ENDPOINT_RESPONSE);
    expect(body.status == constants.ORDER_STATUS.ONGOING).to.be.true;
    expect(body.ongoingTime).not.be.null;

  },

  completeOrderVerify: function completeOrderVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.OK);
    let body = res.body;
    expect(body).to.be.jsonSchema(COMPLETE_ORDER_RESPONSE);
    expect(body.status == constants.ORDER_STATUS.COMPLETED).to.be.true;
    expect(body.completedAt).not.be.null;
  },


  orderViolatedFlowVerify: function orderViolatedFlowVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.UNPROCESSABLE_ENTITY);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.orderNotOnGoing);
  },

  cancelOrderVerify: function cancelOrderVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.OK);
    let body = res.body;
    expect(body).to.be.jsonSchema(CANCEL_ORDER_RESPONSE);
    expect(body.status == constants.ORDER_STATUS.CANCELLED).to.be.true;
    expect(body.cancelledAt).not.be.null;

  },

  orderCancelAfterCompletedVerify: function orderCancelAfterCompletedVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.UNPROCESSABLE_ENTITY);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.alreadyCompletedOrder);
  },

  orderOnGoingInvalidScenarioVerify: function orderOnGoingInvalidScenarioVerify(res) {
    expect(res.status).to.equal(constants.HTTP_CODE.UNPROCESSABLE_ENTITY);
    let body = res.body;
    expect(body).to.be.jsonSchema(INVALID_ORDER_RESPONSE);
    expect(body.message).to.equal(messagesJson.messages.orderNotAssigning);
  },




}