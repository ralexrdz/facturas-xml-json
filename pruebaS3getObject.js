var AWS = require('aws-sdk')

// AWS.config.update({region: 'US East (N. Virginia)'});
var s3 = new AWS.S3()

var bucketParams = {
  Bucket : 'sicoe-xmls-test',
  Key: 'AFL9904294P2/AFL9904294P2_283d34d9-8c80-4906-8028-06261efa83a1/3e5847e1-7a20-49a9-baa2-8470c8edc944.xml'
};

// Call S3 to obtain a list of the objects in the bucket
s3.getObject(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Body.toString());
  }
});
