var AWS = require('aws-sdk')
AWS.config.setPromisesDependency(require('bluebird'));

function putBatch(config, files) {
  var s3 = new AWS.S3(config.aws);
  // Make all the putObject calls immediately
  // Will return rejected promise if any requests fail
  return Promise.all(files.map((file) => {
    if (typeof file.key && file.data !== undefined) {
      var params = {
        Bucket: config.aws.bucket,
        Key: file.key.replace(config.fileDownloadDir, ""),
        Body: file.data.toString()
      };
      return s3.putObject(params).promise()
    }
  }));
};

function put (config, file) {
  var s3 = new AWS.S3(config.aws);

  var params = {
    Bucket: config.aws.bucket,
    Key: file.key.replace(config.fileDownloadDir, ""),
    Body: file.data.toString()
  };

  return s3.putObject(params).promise()
}

module.exports = {
  putBatch: putBatch,
  put: put
}
