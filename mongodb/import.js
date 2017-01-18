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

const getBoundedCoordinate = coord => {
    let bounded = coord;

    if (bounded > 90) bounded = 90;
    if (bounded < -90) bounded = -90;

    return bounded;
};

const insertCalls = function (db, callback) {
    const collection = db.collection('calls');

    const calls = [];
    fs.createReadStream('../911.csv')
        .pipe(csv())
        .on('data', data => {

            const latitude = getBoundedCoordinate(parseFloat(data.lat));
            const longitude = getBoundedCoordinate(parseFloat(data.lng));

            const call = {
                location: {
                    type: "Point",
                    coordinates: [latitude, longitude]
                },
                description: data.desc,
                zipCode: data.zip,
                city: data.desc.split(';')[1].trim(),
                category: findCallCategory(data.title),
                title: data.title,
                timestamp: new Date(data.timeStamp),
                area: data.twp,
                address: data.addr
            };

            calls.push(call);
        })
        .on('end', () => {
            collection.insertMany(calls, (err, result) => {
                collection.createIndex({loc: "2dsphere"});
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
