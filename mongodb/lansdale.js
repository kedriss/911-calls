const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/911-calls';


const countCallsByCategories = function (db) {
    const collection = db.collection('calls');

    const result = collection.find({
        location: {
            $geoWithin: {
                $centerSphere: [[40.241493, -75.283783], 0.310686 / 3963.2]
            }
        }
    }).count().then(
        res => {
            console.log(res);
            db.close();
        }
    );
};

MongoClient.connect(mongoUrl, (err, db) => {
    countCallsByCategories(db);
});
