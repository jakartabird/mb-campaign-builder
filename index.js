const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const express = require('express');
const { default: axios } = require('axios');
const app = express();
const { MongoClient } = require('mongodb');
const Bottleneck = require('bottleneck');

// Update with your config settings.
require('dotenv').config({path: '.env'});

global.__basedir = __dirname;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __basedir + '/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    } 
});

const csvFilter = function (req, file, cb) {
    if (file.mimetype.includes('csv')) {
        cb(null, true);
    } else {
        cb("Please only upload CSV file", false);
    }
}

const upload = multer({ storage: storage, fileFilter: csvFilter });

function transformData(data, totalVar, fieldNames, wafieldNames, channelId, namespaceId, templateName, languageCode, reportUrl, accessKey, trackId, callback) {
    let totalVariable = totalVar;
    let waField = wafieldNames;
    let language = String(languageCode);
    let _fieldNames = JSON.parse(fieldNames);

    let waNumber = data[waField];

    var text_variables = new Array();
    var i;
    for (i = 0 ; i < totalVariable ; i++){
        var fieldName = (_fieldNames[0].fieldName);
        var t1 = {"default": data[fieldName]};
        text_variables.push(t1);
    }

    let _data

    if(totalVariable > 0){
        _data = {
            "content": {
                "hsm": {
                "language": {
                    "code": language
                },
                    "namespace": namespaceId,
                    "params": text_variables,
                    "templateName": templateName
                }
            },
            "to": waNumber,
            "type": "hsm",
            "from": channelId,
            "channelId": channelId,
            "reportUrl": reportUrl,
            "trackId": trackId
        };
    } else {
        _data = {
            "content": {
                "hsm": {
                "language": {
                    "code": language
                },
                    "namespace": namespaceId,
                    "templateName": templateName
                }
            },
            "to": waNumber,
            "type": "hsm",
            "from": channelId,
            "channelId": channelId,
            "reportUrl": reportUrl,
            "trackId": trackId
        };
    }

    return _data
}

function transformDataImage(data, totalVar, fieldNames, wafieldNames, channelId, namespaceId, templateName, languageCode, reportUrl, accessKey, imageUrl, trackId, callback) {
    let totalVariable = totalVar;
    let waField = wafieldNames;
    let language = String(languageCode);
    let _fieldNames = JSON.parse(fieldNames);

    let waNumber = data[waField];

    var text_variables = new Array();
    var i;
    for (i = 0 ; i < totalVariable ; i++){
        var fieldName = (_fieldNames[i].fieldName);
        var t1 = {
            "type": "text",
            "text": data[fieldName]
          };
        text_variables.push(t1);
    }

    let _data

    if(totalVariable > 0){
        _data = {
            "from": channelId,
            "reportUrl": reportUrl,
            "trackId": trackId,
            "to": waNumber,
            "channelId": channelId,
            "type": "hsm",
            "content":{
            "hsm": {
              "namespace": namespaceId,
              "templateName": templateName,
              "language": {
                "policy": "deterministic",
                "code": language
              },
              "components": [
                {
                  "type": "header",
                  "parameters": [
                    {
                      "type": "image",
                      "image": {
                        "url": imageUrl
                      }
                    }
                  ]
                },
                {
                    "type": "body",
                    "parameters": text_variables
                }
              ]
            }
          }
        }
    } else {
        _data = {
            "from": channelId,
            "reportUrl": reportUrl,
            "trackId": trackId,
            "to": waNumber,
            "channelId": channelId,
            "type": "hsm",
            "content":{
            "hsm": {
              "namespace": namespaceId,
              "templateName": templateName,
              "language": {
                "policy": "deterministic",
                "code": languageCode
              },
              "components": [
                {
                  "type": "header",
                  "parameters": [
                    {
                      "type": "image",
                      "image": {
                        "url": imageUrl
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
    }

    return _data;
}

function transformDataVideo(data, totalVar, fieldNames, wafieldNames, channelId, namespaceId, templateName, languageCode, reportUrl, accessKey, videoUrl, trackId, callback) {
    let totalVariable = totalVar;
    let waField = wafieldNames;
    let language = String(languageCode);
    let _fieldNames = JSON.parse(fieldNames);

    let waNumber = data[waField];

    var text_variables = new Array();
    var i;
    for (i = 0 ; i < totalVariable ; i++){
        var fieldName = (_fieldNames[0].fieldName);
        var t1 = {
            "type": "text",
            "text": data[fieldName]
          };
        text_variables.push(t1);
    }

    let _data

    if(totalVariable > 0){
        _data = {
            "from": channelId,
            "reportUrl": reportUrl,
            "trackId": trackId,
            "to": waNumber,
            "channelId": channelId,
            "type": "hsm",
            "content":{
            "hsm": {
              "namespace": namespaceId,
              "templateName": templateName,
              "language": {
                "policy": "deterministic",
                "code": language
              },
              "components": [
                {
                  "type": "header",
                  "parameters": [
                    {
                      "type": "video",
                      "video": {
                        "url": videoUrl
                      }
                    }
                  ]
                },
                {
                    "type": "body",
                    "parameters": text_variables
                }
              ]
            }
          }
        }
    } else {
        _data = {
            "from": channelId,
            "reportUrl": reportUrl,
            "trackId": trackId,
            "to": waNumber,
            "channelId": channelId,
            "type": "hsm",
            "content":{
            "hsm": {
              "namespace": namespaceId,
              "templateName": templateName,
              "language": {
                "policy": "deterministic",
                "code": languageCode
              },
              "components": [
                {
                  "type": "header",
                  "parameters": [
                    {
                      "type": "image",
                      "image": {
                        "url": imageUrl
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
    }

    return _data;
}

app.post("/api/upload-text", upload.single("file"), (req, res) => {
    if(process.env.MIN_TIME === undefined || process.env.MIN_TIME === 0)
    {
        return res.status(500).send({message: "Configration fail"});
    }
    if(req.body.accessKey === undefined || req.body.accessKey === null) {
        return res.status(401).send({message: "Access key is required"});
    }

    if(req.body.namespaceId === undefined || req.body.namespaceId === null) {
        return res.status(400).send({message: "Namespace ID is required"});
    }

    if(req.body.channelId === undefined || req.body.channelId === null) {
        return res.status(400).send({message: "Channel ID is required"});
    }

    if(req.body.templateName === undefined || req.body.templateName === null) {
        return res.status(400).send({message: "Template Name is required"});
    }

    if(req.body.languageCode === undefined || req.body.languageCode === null) {
        return res.status(400).send({message: "Language Code is required"});
    }

    if(req.body.totalVariable === undefined || req.body.totalVariable === null) {
        return res.status(400).send({message: "Total Variable is required"});
    }

    if(req.body.fieldNames === undefined || req.body.fieldNames === null) {
        return res.status(400).send({message: "Field Names is required"});
    }

    if(req.body.waFieldName === undefined || req.body.waFieldName === null) {
        return res.status(400).send({message: "WA Field Names is required"});
    }

    let totalVariable = req.body.totalVariable ? req.body.totalVariable : 0;
    let fieldNames = (req.body.fieldNames);
    let waField = req.body.waFieldName;
    let channelId = req.body.channelId;
    let namespaceId = req.body.namespaceId;
    let templateName = req.body.templateName;
    let languageCode = req.body.languageCode;
    let reportUrl = req.body.reportUrl ? req.body.reportUrl : "";
    let accessKey = req.body.accessKey;
    let trackId = req.body.trackId ? req.body.trackId : "";
    // let dbType = req.body.dbtype;
    // let connectionString = req.body.connectionString;

    // Declare limiter for bottlenecking activity
    const limiter = new Bottleneck({
        maxConcurrent: 50,
        minTime: 25
    });

    let csvData = [];

    try {
        if(req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a file"
            });
        }

        
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({headers: true, delimiter: ',', trim: true, skipLines: 0, skipEmptyLines: true, trimHeaders: true}))
            .on('data', (row) => {
                try {
                    var data = transformData(row, totalVariable, fieldNames, waField, channelId, namespaceId, templateName, languageCode, reportUrl, accessKey, trackId);
                    csvData.push(data);
                  } finally {
                    //   Then
                    
                  }
            })
            .on('end', () => {

                if(req.body.connectionString === undefined || req.body.connectionString === null) {
                    csvData.forEach((line, index) => {
                        limiter.schedule(() => {
                            axios({
                                method: 'POST',
                                url: 'https://conversations.messagebird.com/v1/send',
                                headers: {'Authorization': 'AccessKey ' + accessKey},
                                data: line
                            })
                            .then(response => {
                                if(response.status > 200 && response.status < 300){
                                    // console.log(line)
                                    var data = {
                                        "id": index,
                                        "phone_number": line.to,
                                        "messageId": response.data.id,
                                        "status": response.data.status,
                                        "timestamp": new Date()
                                    }
                                    console.log(data)
                                }
                            })
                            .catch(error => {
                                console.log(error.response.status)
                                var data = {
                                    "id": index,
                                    "phone_number": line.to,
                                    "messageId": "",
                                    "status": "failed",
                                    "timestamp": new Date()
                                }
                                console.log(data)
                            })
                        })
                    })
                }else {
                    if(req.body.databaseName === undefined || req.body.databaseName === null) {
                        // If no database name is provided, ignore the data
                        return res.status(400).send({message: "If you type in the connection string, Database name is required"});
                    } else {
                        if(req.body.collectionName === undefined || req.body.collectionName === null) {
                            // If no collection name is provided, ignore the data
                            return res.status(400).send({message: "If you type in the connection string, Collection name is required"});
                        } else {
                            const client = new MongoClient(req.body.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true });

                            try {
                                client.connect(err => {
                                    const database = client.db(req.body.databaseName);
                                    const collection = database.collection(req.body.collectionName);

                                    csvData.forEach((line, index) => {
                                        limiter.schedule(() => {
                                            axios({
                                                method: 'POST',
                                                url: 'https://conversations.messagebird.com/v1/send',
                                                headers: {'Authorization': 'AccessKey ' + accessKey},
                                                data: line
                                            })
                                            .then(response => {
                                                if(response.status > 200 && response.status < 300){
                                                    var data = {
                                                        "id": index,
                                                        "phone_number": line.to,
                                                        "messageId": response.data.id,
                                                        "status": response.data.status,
                                                        "timestamp": new Date()
                                                    }
                                                    collection.insertOne(data, ((err, result) => {
                                                        console.log("result : masuk")
                                                        if(err) {
                                                            console.log(err)
                                                        }
                                                        client.close();
                                                    }));
                                                    console.log(data)
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error.response.status)
                                                var data = {
                                                    "id": index,
                                                    "phone_number": line.to,
                                                    "messageId": "",
                                                    "status": "failed",
                                                    "timestamp": new Date()
                                                }
                                                collection.insertOne(data, ((err, result) => {
                                                    console.log("result : masuk")
                                                    if(err) {
                                                        console.log(err)
                                                    }
                                                    client.close();
                                                }));
                                            })
                                        })
                                    })
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                }
            }) 

            return res.status(200).send({
                message: "Processing data... Please wait!"
            });

        } catch (error) {
            return res.status(500).send({
                message: "Error",
                error: error
            });
        }
});

app.post("/api/upload-image", upload.single("file"), (req, res) => {
    if(req.body.accessKey === undefined || req.body.accessKey === null) {
        return res.status(401).send({message: "Access key is required"});
    }

    if(req.body.namespaceId === undefined || req.body.namespaceId === null) {
        return res.status(400).send({message: "Namespace ID is required"});
    }

    if(req.body.channelId === undefined || req.body.channelId === null) {
        return res.status(400).send({message: "Channel ID is required"});
    }

    if(req.body.templateName === undefined || req.body.templateName === null) {
        return res.status(400).send({message: "Template Name is required"});
    }

    if(req.body.languageCode === undefined || req.body.languageCode === null) {
        return res.status(400).send({message: "Language Code is required"});
    }

    if(req.body.totalVariable === undefined || req.body.totalVariable === null) {
        return res.status(400).send({message: "Total Variable is required"});
    }

    if(req.body.fieldNames === undefined || req.body.fieldNames === null) {
        return res.status(400).send({message: "Field Names is required"});
    }

    if(req.body.waFieldName === undefined || req.body.waFieldName === null) {
        return res.status(400).send({message: "WA Field Names is required"});
    }

    if(req.body.imageUrl === undefined || req.body.imageUrl === null) {
        return res.status(400).send({message: "Image URL is required"});
    }

    let totalVariable = req.body.totalVariable ? req.body.totalVariable : 0;
    let fieldNames = (req.body.fieldNames);
    let waField = req.body.waFieldName;
    let channelId = req.body.channelId;
    let namespaceId = req.body.namespaceId;
    let templateName = req.body.templateName;
    let languageCode = req.body.languageCode;
    let reportUrl = req.body.reportUrl ? req.body.reportUrl : "";
    let imageUrl = req.body.imageUrl;
    let accessKey = req.body.accessKey;
    let trackId = req.body.trackId ? req.body.trackId : "";

    const limiter = new Bottleneck({
        maxConcurrent: 50,
        minTime: 25
    });

    let csvData = [];

    try {
        if(req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a file"
            });
        }

        
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({headers: true, delimiter: ',', trim: true, skipLines: 0, skipEmptyLines: true, trimHeaders: true}))
            .on('data', (row) => {
                try {
                    var data = transformDataImage(row, totalVariable, fieldNames, waField, channelId, namespaceId, templateName, languageCode, reportUrl, accessKey, imageUrl, trackId);
                    csvData.push(data);
                  } finally {
                    //   Then
                    
                  }
            })
            .on('end', () => {

                if(req.body.connectionString === undefined || req.body.connectionString === null) {
                    csvData.forEach((line, index) => {
                        limiter.schedule(() => {
                            axios({
                                method: 'POST',
                                url: 'https://conversations.messagebird.com/v1/send',
                                headers: {'Authorization': 'AccessKey ' + accessKey},
                                data: line
                            })
                            .then(response => {
                                if(response.status > 200 && response.status < 300){
                                    // console.log(line)
                                    var data = {
                                        "id": index,
                                        "phone_number": line.to,
                                        "messageId": response.data.id,
                                        "status": response.data.status,
                                        "timestamp": new Date()
                                    }
                                    console.log(data)
                                }
                            })
                            .catch(error => {
                                console.log(error.response.status)
                                var data = {
                                    "id": index,
                                    "phone_number": line.to,
                                    "messageId": "",
                                    "status": "failed",
                                    "timestamp": new Date()
                                }
                                console.log(data)
                            })
                        })
                    })
                }else {
                    if(req.body.databaseName === undefined || req.body.databaseName === null) {
                        // If no database name is provided, ignore the data
                        return res.status(400).send({message: "If you type in the connection string, Database name is required"});
                    } else {
                        if(req.body.collectionName === undefined || req.body.collectionName === null) {
                            // If no collection name is provided, ignore the data
                            return res.status(400).send({message: "If you type in the connection string, Collection name is required"});
                        } else {
                            const client = new MongoClient(req.body.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true });

                            try {
                                client.connect(err => {
                                    const database = client.db(req.body.databaseName);
                                    const collection = database.collection(req.body.collectionName);

                                    csvData.forEach((line, index) => {
                                        limiter.schedule(() => {
                                            axios({
                                                method: 'POST',
                                                url: 'https://conversations.messagebird.com/v1/send',
                                                headers: {'Authorization': 'AccessKey ' + accessKey},
                                                data: line
                                            })
                                            .then(response => {
                                                if(response.status > 200 && response.status < 300){
                                                    var data = {
                                                        "id": index,
                                                        "phone_number": line.to,
                                                        "messageId": response.data.id,
                                                        "status": response.data.status,
                                                        "timestamp": new Date()
                                                    }
                                                    collection.insertOne(data, ((err, result) => {
                                                        console.log("result : masuk")
                                                        if(err) {
                                                            console.log(err)
                                                        }
                                                        client.close();
                                                    }));
                                                    console.log(data)
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error.response.status)
                                                var data = {
                                                    "id": index,
                                                    "phone_number": line.to,
                                                    "messageId": "",
                                                    "status": "failed",
                                                    "timestamp": new Date()
                                                }
                                                collection.insertOne(data, ((err, result) => {
                                                    console.log("result : masuk")
                                                    if(err) {
                                                        console.log(err)
                                                    }
                                                    client.close();
                                                }));
                                            })
                                        })
                                    })
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                }

                return res.status(200).send({
                    message: "Processing data... Please wait!"
                });

            });
            } catch (error) {
                return res.status(500).send({
                    message: "Error",
                    error: error
                });
            }
});

app.post("/api/upload-video", upload.single("file"), (req, res) => {
    if(req.body.accessKey === undefined || req.body.accessKey === null) {
        return res.status(401).send({message: "Access key is required"});
    }

    if(req.body.namespaceId === undefined || req.body.namespaceId === null) {
        return res.status(400).send({message: "Namespace ID is required"});
    }

    if(req.body.channelId === undefined || req.body.channelId === null) {
        return res.status(400).send({message: "Channel ID is required"});
    }

    if(req.body.templateName === undefined || req.body.templateName === null) {
        return res.status(400).send({message: "Template Name is required"});
    }

    if(req.body.languageCode === undefined || req.body.languageCode === null) {
        return res.status(400).send({message: "Language Code is required"});
    }

    if(req.body.totalVariable === undefined || req.body.totalVariable === null) {
        return res.status(400).send({message: "Total Variable is required"});
    }

    if(req.body.fieldNames === undefined || req.body.fieldNames === null) {
        return res.status(400).send({message: "Field Names is required"});
    }

    if(req.body.waFieldName === undefined || req.body.waFieldName === null) {
        return res.status(400).send({message: "WA Field Names is required"});
    }

    if(req.body.videoUrl === undefined || req.body.videoUrl === null) {
        return res.status(400).send({message: "Video URL is required"});
    }

    let totalVariable = req.body.totalVariable ? req.body.totalVariable : 0;
    let fieldNames = (req.body.fieldNames);
    let waField = req.body.waFieldName;
    let channelId = req.body.channelId;
    let namespaceId = req.body.namespaceId;
    let templateName = req.body.templateName;
    let languageCode = req.body.languageCode;
    let reportUrl = req.body.reportUrl ? req.body.reportUrl : "";
    let videoUrl = req.body.videoUrl;
    let accessKey = req.body.accessKey;
    let trackId = req.body.trackId ? req.body.trackId : "";

    const limiter = new Bottleneck({
        maxConcurrent: 50,
        minTime: 25
    });

    let csvData = [];

    try {
        if(req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a file"
            });
        }

        
        let filePath = __basedir + '/uploads/' + req.file.filename;
        fs.createReadStream(filePath)
            .pipe(csv.parse({headers: true, delimiter: ',', trim: true, skipLines: 0, skipEmptyLines: true, trimHeaders: true}))
            .on('data', (row) => {
                try {
                    var data = transformDataVideo(row, totalVariable, fieldNames, waField, channelId, namespaceId, templateName, languageCode, reportUrl, accessKey, videoUrl, trackId);
                    csvData.push(data);
                  } finally {
                    //   Then
                    
                  }
            })
            .on('end', () => {

                if(req.body.connectionString === undefined || req.body.connectionString === null) {
                    csvData.forEach((line, index) => {
                        limiter.schedule(() => {
                            axios({
                                method: 'POST',
                                url: 'https://conversations.messagebird.com/v1/send',
                                headers: {'Authorization': 'AccessKey ' + accessKey},
                                data: line
                            })
                            .then(response => {
                                if(response.status > 200 && response.status < 300){
                                    // console.log(line)
                                    var data = {
                                        "id": index,
                                        "phone_number": line.to,
                                        "messageId": response.data.id,
                                        "status": response.data.status,
                                        "timestamp": new Date()
                                    }
                                    console.log(data)
                                }
                            })
                            .catch(error => {
                                console.log(error.response.status)
                                var data = {
                                    "id": index,
                                    "phone_number": line.to,
                                    "messageId": "",
                                    "status": "failed",
                                    "timestamp": new Date()
                                }
                                console.log(data)
                            })
                        })
                    })
                }else {
                    if(req.body.databaseName === undefined || req.body.databaseName === null) {
                        // If no database name is provided, ignore the data
                        return res.status(400).send({message: "If you type in the connection string, Database name is required"});
                    } else {
                        if(req.body.collectionName === undefined || req.body.collectionName === null) {
                            // If no collection name is provided, ignore the data
                            return res.status(400).send({message: "If you type in the connection string, Collection name is required"});
                        } else {
                            const client = new MongoClient(req.body.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true });

                            try {
                                client.connect(err => {
                                    const database = client.db(req.body.databaseName);
                                    const collection = database.collection(req.body.collectionName);

                                    csvData.forEach((line, index) => {
                                        limiter.schedule(() => {
                                            axios({
                                                method: 'POST',
                                                url: 'https://conversations.messagebird.com/v1/send',
                                                headers: {'Authorization': 'AccessKey ' + accessKey},
                                                data: line
                                            })
                                            .then(response => {
                                                if(response.status > 200 && response.status < 300){
                                                    var data = {
                                                        "id": index,
                                                        "phone_number": line.to,
                                                        "messageId": response.data.id,
                                                        "status": response.data.status,
                                                        "timestamp": new Date()
                                                    }
                                                    collection.insertOne(data, ((err, result) => {
                                                        console.log("result : masuk")
                                                        if(err) {
                                                            console.log(err)
                                                        }
                                                        client.close();
                                                    }));
                                                    console.log(data)
                                                }
                                            })
                                            .catch(error => {
                                                console.log(error.response.status)
                                                var data = {
                                                    "id": index,
                                                    "phone_number": line.to,
                                                    "messageId": "",
                                                    "status": "failed",
                                                    "timestamp": new Date()
                                                }
                                                collection.insertOne(data, ((err, result) => {
                                                    console.log("result : masuk")
                                                    if(err) {
                                                        console.log(err)
                                                    }
                                                    client.close();
                                                }));
                                            })
                                        })
                                    })
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    }
                }

                return res.status(200).send({
                    message: "Processing data... Please wait!"
                });

            });
            } catch (error) {
                return res.status(500).send({
                    message: "Error",
                    error: error
                });
            }
});

let server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
