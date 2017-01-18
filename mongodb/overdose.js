const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/911-calls';


const search3highestCity = function (db, callback) {
    const collection = db.collection('calls');

    const result = collection.aggregate([
        {$match: {title: {$regex: ".*OVERDOSE.*"}}},
        {$group: {_id: "$city", total: {$sum: 1}}},
        {$sort: {total: -1}}, {$limit: 3}
    ]);

    callback(result);
};

MongoClient.connect(mongoUrl, (err, db) => {
    search3highestCity(db, result => {
        result.toArray((err, docs) => docs.forEach(row => console.log(`${row._id} -> ${row.total}`)));
        db.close();
    });
});