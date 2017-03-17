var AWS = require('aws-sdk')
AWS.config.setPromisesDependency(require('bluebird'));

function putBatch(config, files) {
  var s3 = new AWS.S3(config);
  // Make all the putObject calls immediately
  // Will return rejected promise if any requests fail
  return Promise.all(files.map((file) => {
    if (typeof file.key && file.data !== undefined) {
      var params = {
        Bucket: bucket,
        Key: file.key,
        Body: file.data.toString()
      };
      return s3.putObject(params).promise()
    }
  }));
};

function put (config, file) {
  var s3 = new AWS.S3(config);

  var params = {
    Bucket: bucket,
    Key: file.key,
    Body: file.data.toString()
  };

  return s3.putObject(params).promise()
}

module.exports = {
  putBatch: putBatch,
  put: put
}