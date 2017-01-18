const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/911-calls';


const search3highestMonth = function (db, callback) {
    const collection = db.collection('calls');

    const result = collection.aggregate([
        {
            $group: {
                _id: {month: {$month: "$timestamp"}, year: {$year: "$timestamp"}},
                total: {$sum: 1}
            }
        },
        {$sort: {total: -1}}, {$limit: 3}
    ]);

    callback(result);
};

MongoClient.connect(mongoUrl, (err, db) => {
    search3highestMonth(db, result => {
        result.toArray((err, docs) => docs.forEach(row => console.log(`month/year : ${row._id.month}/${row._id.year}`)));
        db.close();
    });
});
