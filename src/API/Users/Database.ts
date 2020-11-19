import * as moment from "moment-timezone";
var momentDays = require("moment-business-days");

const CONSTANTS = require("./Constants");

const axios = require("axios");
const querystring =  require("querystring");
var request = require('request');


    const checkUserIfExists = (params) =>{

        return new Promise((resolve,reject)=>{
            params.firestoreObject.collection(CONSTANTS.COLLECTION_NAME).doc(params.userId)
            .get()
            .then(userData => {
                resolve(userData)
            })
            .catch(err =>{
                reject(err)
            })
        })  
    }
    const sendEmailToMailChimp = (params) =>{
        let user = {
            members:[
                {
                    email_address: params.requestBody.email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: CONSTANTS.FIRST_NAME,
                        LNAME: CONSTANTS.LAST_NAME
                    }
                }
            ]
        }

        return new Promise((resolve,reject)=>{

            request.post({url:'', form: {key:'value'}}, function(err,httpResponse,body){ /* ... */ })

            axios({
                method: CONSTANTS.METHOD_TYPE_POST,
                url: CONSTANTS.BASE_URL,
                data: querystring.stringify(user),
                  headers: { 
                      "Authorization": CONSTANTS.AUTHORIZATION,
                      "Content-Type": "application/json"
                    }
                
              })
                .then(response => {
                    resolve(response)
                })
                .catch(err => {
                    console.log("Errr",err)
                    reject(err)
                }); 
        
        })  
    }
    const addNewUser = async (params) => { 

        var date = new Date();

        momentDays.updateLocale(CONSTANTS.TIMEZONE_LANGUAGE, {
            workingWeekdays: CONSTANTS.WORKINGDAY_ARRAY
        });
        
        var currentDate = moment.tz(date, params.requestBody.timeZone);

        let getSubscriptionExpirtyDates = await getSubscriptionExpirtyDate(currentDate)

        var user = {
            email: params.requestBody.email,
            userId: params.userId,
            name: params.requestBody.name,
            accessToken: CONSTANTS.EMPTY_STRING,
            createdAt: date,
            updatedAt: date,
            subscriptionExpireAt : getSubscriptionExpirtyDates ,
            count: CONSTANTS.SUBSCRIBED_FACTS_LIMIT,
            subscription: CONSTANTS.SUBSCRIPTION_LIMIT,
            subscriptionStatus : CONSTANTS.STATUS_TRUE
        }

        return new Promise((resolve,reject)=>{
            params.firestoreObject.collection(CONSTANTS.COLLECTION_NAME).doc(params.userId)
            .set(user)
            .then(userData => {
                resolve(userData)
            })
            .catch(err =>{
                reject(err)
            })
        })  
    };
            
    const getSubscriptionExpirtyDate = (currentDate) =>{
        return momentDays(currentDate.format(CONSTANTS.DATE_FORMAT),CONSTANTS.DATE_FORMAT).businessAdd( 
            (currentDate.hour() >= CONSTANTS.HOURS)  ? CONSTANTS.NUMBER_OF_DAYS_THREE  : CONSTANTS.NUMBER_OF_DAYS_FOUR)._d
    }  

    module.exports = {
        addNewUser,
        checkUserIfExists,
        sendEmailToMailChimp
    }