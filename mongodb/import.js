const mongodb = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/911-calls';

const CallCategory = {
    EMS: 'EMS',
    Fire: 'Fire',
    Traffic: 'Traffic'
};

const findCallCategory = (title) => {
    if (title.startsWith(CallCategory.EMS)) {
        return CallCategory.EMS;
    } else if (title.startsWith(CallCategory.Fire)) {
        return CallCategory.Fire;
    } else if (title.startsWith(CallCategory.Traffic)) {
        return CallCategory.Traffic;
    } else {
        return null;
    }
};

const insertCalls = function (db, callback) {
    const collection = db.collection('calls');

    const calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {
            const call = {
                latitude: parseInt(data.lat),
                longitude: parseInt(data.lng),
                description: data.desc,
                zipCode: data.zip,
                category: findCallCategory(data.title),
                title: data.title,
                timestamp: data.timeStamp,
                area: data.twp,
                address: data.addr
            };
            calls.push(call);
        })
        .on('end', () => {
            collection.insertMany(calls, (err, result) => {
                callback(result)
            });
        });
};

MongoClient.connect(mongoUrl, (err, db) => {
    insertCalls(db, result => {
        console.log(`${result.insertedCount} calls inserted`);
        db.close();
    });
});
