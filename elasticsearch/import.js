var elasticsearch = require('elasticsearch');
var csv = require('csv-parser');
var fs = require('fs');

var esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

var i = 0;
var calls=[];
fs.createReadStream('../911.csv')
    .pipe(csv())
    .on('data', data => {
      // TODO extract one line from CSV
if (i++==0)console.log(data.lat);
 	calls.push({ "index" : { "_index" : "calls", "_type" : "data" } });

	var i_call=
		{
		  lat: data.lat,
  		  lng: data.lng,
   		  desc: data.desc,
  		  zip: data.zip,
  		  title: data.title,
		  type: data.title?data.title.split(':')[0]:"UNDEFINED",
  		  timeStamp: data.timeStamp,
		  month: data.timeStamp?data.timeStamp.split('-')[1]+'/'+data.timeStamp.split('-')[0]:"01/0000",
  		  twp: data.twp,
              	  addr: data.addr,
  		  e:data.e
		};
	calls.push(i_call);
    })
    .on('end', () => {
      // TODO insert data to ES

	esClient.bulk({ 
			  body: calls
			},function(err,resp,status) {
			    console.log(resp);
			});


    });
