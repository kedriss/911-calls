const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/911-calls';


const countCallsByCategories = function (db, callback) {
    const collection = db.collection('calls');

    const result = collection.aggregate([
        {$group: {_id: "$category", total: {$sum: 1}}},
        {$sort: {_id: 1}}
    ]);

    callback(result);
};

MongoClient.connect(mongoUrl, (err, db) => {
    countCallsByCategories(db, result => {
        result.toArray((err, docs) => docs.forEach(row => console.log(`${row._id} : ${row.total}`)));
        db.close();
    });
});
