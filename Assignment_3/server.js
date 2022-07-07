/*
	Name: Lo Tsz Yuk
	SID: 1155133625
*/


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const cors = require('cors');
app.use(
    cors({
        origin: '*',
        method: ["GET", "POST", "PUT", "DELETE"]
    })
)

mongoose.connect('mongodb+srv://stu107:p885556-@csci2720.m2qbq.mongodb.net/stu107');
const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console,
'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
    console.log("Connection is open...")});

const LocationSchema = mongoose.Schema({
    locId: { type: Number, required: true,unique: true },
    name: { type: String, required: true },
    quota: { type: Number }
});

const EventSchema = mongoose.Schema({
    eventId: { type: Number, required: true,unique: true },
    name: { type: String, required: true },
    loc: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    quota: { type: Number }
});

const Event = mongoose.model('Event',EventSchema);
const Location = mongoose.model('Location',LocationSchema);

//Q1
app.get('/event/:eventId', (req,res) => {
    Event.findOne(
        {eventId: req.params['eventId']})
        .populate()
       .exec((err, e) => {
            if (err) {
                res.send(err);
            }
            else{
                if (!e){
                    res.contentType('text/plain');
                    res.status(404).send('Cannot find event ID');    
                }
                else{
                res.contentType('text/plain');    
                res.send("{\n"+"\"eventId\": "+e.eventId+",\n" +
                "\"name\": \"" + e.name + "\",\n" +
                "\"loc\": \n" + 
                "{\n" + 
                "\"locId\": " + loc.locId + ",\n" +
                "\"name\": \"" + loc.name + "\"\n},\n" +
                "\"quota\": " + e.quota + "\n}")}};
    });
});
/*
app.get('/testevent', (req,res) => {
    Location.create({
        locId: 1,
        name: "SHB924",
        quota: 100
    })

    Event.create({
        eventId: 123,
        name: 'CSCI2720 Lab',
        loc: {
            locId:1,
            name:"SHB924",
            quota:100
        },
        quota: 2
    }, (err, e) => {
        if (err) res.send("failed");
        else res.send(e);
    });
});
*/

//Q2
app.post('/event', (req,res) => {
    //Find max event id and plus 1 afterwards
    let eId;
    let loc_name;
    let loc_quota;

    Event.find({}).sort([['eventId', -1]]).exec((err, results) => {
        if (err) results.send(err);
        else{
            eId=results[0].eventId;
            eId+=1;

            //find location name, location quota by locId
            Location.findOne({locId: req.body['locId']}, (err, result) => {
                if (err) result.send(err);
                else{
                    loc_name=result.name;
                    loc_quota=result.quota;
                    //Create with known info
                    Event.create({
                        eventId: eId,
                        name: req.body['name'],
                        loc: {
                            locId: req.body['locId'],
                            name: loc_name
                        },
                        quota: req.body['quota']
                    }, (err,e) => {
                        if (err) res.send(err);
                        else {
                            // if the quota doesn't match remove the record
                            if (loc_quota < req.body['quota']){
                                Event.remove({eventId:eId},(err, result) => {
                                    if (err) result.send(err);
                                    else
                                    res.send("The event cannot be created, the participants is more than the capacity of the venue.")
                                });
                            }else{
                                res.contentType('text/plain'); 
                                res.location('/event/'+ eId);   
                                res.status(201).send("{\n"+"\"eventId\": "+e.eventId+",\n" +
                                "\"name\": \"" + e.name + "\",\n" +
                                "\"loc\": \n" + 
                                "{\n" + 
                                "\"locId\": " + e.loc.locId + ",\n" +
                                "\"name\": \"" + e.loc.name + "\"\n},\n" +
                                "\"quota\": " + e.quota + "\n}")
                            }
                        }
                    });
                }           
            });
        }
    });
});

//Q3
app.delete('/event/:eventId', (req,res) => {
    Event.findOne(
        {eventId: req.params['eventId']},
        'eventId name loc quota',
        (err, e) => {
            if (err) {
                res.send(err);
            }
            else{
                if (!e){
                    res.status(404);
                    res.send("No such event Id found, cannot delete.");    
                }
                else{
                    Event.remove({eventId:req.params['eventId']},(err, result) => {
                        if (err) result.send(err);
                        else{
                            if (!result){
                                res.status(404);
                                res.send("No such event Id found, cannot delete.");
                            }else {
                                res.status(204)
                                res.send("Event removed");
                            };
                        }
                    });
                }};
        });  
});

//Q4
app.get('/event', (req,res) => {
    Event.find( (err, results) => {
        if (results.length > 0) {
            str="[<br>\n";
            for (let i = 0; i < results.length; i++) {
                str +=
                "{<br>\n"+"\"eventId\": "+results[i].eventId+",<br>\n" +
                "\"name\": \"" + results[i].name + "\",<br>\n" +
                "\"loc\": <br>\n" + 
                "{<br>\n" + 
                "\"locId\": " + results[i].loc.locId + ",<br>\n" +
                "\"name\": \"" + results[i].loc.name + "\"<br>\n},<br>\n" +
                "\"quota\": " + results[i].quota + "<br>\n}<br>\n"

                if (i != results.length-1) str+=",<br>\n"
            }
            str += "]"
            res.send(str);
        }
    });
});

//Q5
app.get('/loc/:locId', (req,res) => {
    Location.findOne(
        {locId: req.params['locId']},
        'locId name quota',
        (err, e) => {
            if (err) {
                res.send(err);
            }
            else{
                if (!e){
                    res.contentType('text/plain');
                    res.status(404).send('Error 404, can\'t find locId');    
                }
                else{
                res.contentType('text/plain');    
                res.send("{<br>\n"+"\"locId\": "+e.locId+",<br>\n" +
                "\"name\": \"" + e.name + "\",<br>\n" +
                "\"quota\": " + e.quota + "<br>\n}")}};
    });
});

//Q6 & Q7
app.get('/loc', (req,res) => {
    //Q6
    if (req.query.quota === undefined){
        Location.find( (err, results) => {
            if (err) res.send(err)
            else{
                if (results.length > 0) {
                    str="[<br>\n";
                    for (let i = 0; i < results.length; i++) {
                        str +=
                        "{<br>\n"+"\"locId\": "+results[i].locId+",<br>\n" +
                        "\"name\": \"" + results[i].name + "\",<br>\n" +
                        "\"quota\": " + results[i].quota + "\n}<br>\n"

                        if (i != results.length-1) str+=",<br>\n"
                    }
                    str += "]"
                    res.send(str);
                }
            }
        });
    }else{
        //Q7
        let empty_arr=[];
        Location.find({quota: { $gte: req.query.quota}},(err, results) => {
            
            if (err) res.send(err)
            else{
                if (results.length > 0) {
                    str="[<br>\n";
                    for (let i = 0; i < results.length; i++) {
                        str +=
                        "{<br>\n"+"\"locId\": "+results[i].locId+",<br>\n" +
                        "\"name\": \"" + results[i].name + "\",<br>\n" +
                        "\"quota\": " + results[i].quota + "\n}<br>\n"
    
                        if (i != results.length-1) str+=",<br>\n"
                    }
                    str += "]"
                    res.send(str);
                }else res.send(empty_arr); 
            }
        });
    }
});

/*Q8 */
app.put('/event/:eventId', (req,res) => {
    Event.findOne(
        {eventId: req.params['eventId']},
        'eventId name loc quota',
        (err, e) => {
            if (err) {
                res.send(err);
            }
            else{   
                if (!e){
                    res.contentType('text/plain');
                    res.status(404).send('Cannot find event ID');    
                }
                else{
                    //Get information from locID
                    let loc_name,loc_quota;
                    Location.findOne({ locId: req.query['locId'] }, (err, result) => {
                        loc_name=result.name;
                        loc_quota= result.quota;

                        e.name=req.query['name'];
                        e.loc={locId: req.query['locId'], name: loc_name, quota: loc_quota};
                        e.quota=req.query['quota'];
                        e.save();

                        res.contentType('text/plain');
                        res.send("{\n"+"\"eventId\": "+e.eventId+",\n" +
                        "\"name\": \"" + e.name + "\",\n" +
                        "\"loc\": \n" + 
                        "{\n" + 
                        "\"locId\": " + e.loc.locId + ",\n" +
                        "\"name\": \"" + e.loc.name + "\"\n},\n" +
                        "\"quota\": " + e.quota + "\n}")
                    });  
                }};
    });            
});

// handle ALL requests
app.all('/*', (req, res) => {
// send this to client
res.send("Hello World!");
});

// listen to port 3000
const server = app.listen(3000);
