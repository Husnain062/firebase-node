import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as _ from "underscore";

var cors = require('cors')



const now = admin.firestore.Timestamp.now();
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
 
const app = express();
app.use(cors())
const main = express(); 
main.use(cors())
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
 
export const webApi = functions.https.onRequest(main);

const authenticate = (req, res, next) => {
  return next();
};
 
app.use(authenticate);
 const addUser = require("./API/Users/addUser"); 

app.use("", addUser);

