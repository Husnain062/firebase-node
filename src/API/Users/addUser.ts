const express = require("express");
const router = express.Router();

const CONSTANTS_MESSAGES = require("../../ResponseMessages");
const CONSTANTS_CODES = require("../../ResponseCode");

const FIRESTORE = require('./Database')

router.post("/addUser", (req, res) => {

  var params = {
    requestBody: req.body,
    userId: req.user_decodedId, 
    firestoreObject: req.db
  }

  FIRESTORE.checkUserIfExists(params)
    .then(userData => {
      if (userData.exists) {
          let responseObject = {
            responseCode: CONSTANTS_CODES.NOTHING_CHANGE,
            message: CONSTANTS_MESSAGES.USER_EXIST_ALREADY,
            response: {}
          }
          sendResponse(res, responseObject)
      }
      else{
        FIRESTORE.addNewUser(params)
          .then( userData => {
      
            let responseObject = {
              responseCode: CONSTANTS_CODES.SUCCESS_CODE,
              message: CONSTANTS_MESSAGES.USER_SIGNUP,
              response: {}
            }
            sendResponse(res, responseObject) 
            
          })
          .catch(err=>{
            let responseObject = {
              responseCode: CONSTANTS_CODES.SERVER_ERROR,
              message: CONSTANTS_MESSAGES.SERVER_ERROR,
              response: {err}
            }
            sendResponse(res, responseObject)
          })
      }       
    })
    .catch(err=>{
      let responseObject = {
        responseCode: CONSTANTS_CODES.SERVER_ERROR,
        message: CONSTANTS_MESSAGES.SERVER_ERROR,
        response: {err}
      }
      sendResponse(res, responseObject)
    })
});



function sendResponse(res, responseObject) {
  res.status(CONSTANTS_CODES.SUCCESS_CODE).send({
    responseCode: responseObject.responseCode,
    message: responseObject.message,
    response: responseObject.response
  });
}

module.exports = router;
