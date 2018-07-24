var AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));

function putBatch(config, files) {
  var s3 = new AWS.S3(config.aws);
  // Make all the putObject calls immediately
  // Will return rejected promise if any requests fail
  return Promise.all(
    files.map(file => {
      let ftpPath = file.key.split("/"),
        fileName = ftpPath[ftpPath.length - 1].split("_");
      docType = fileName[fileName.length - 1].split(".");

      if (typeof file.key && file.data !== undefined) {
        var params = {
          Bucket: config.aws.bucket,
          Key:
            fileName[0] + "/" + docType[0] + "/" + ftpPath[ftpPath.length - 1],
          Body: file.data.toString()
        };
        return s3.putObject(params).promise();
      }
    })
  );
}

function put(config, file) {
  var s3 = new AWS.S3(config.aws);
  let ftpPath = file.key.split("/"),
    fileName = ftpPath[ftpPath.length - 1].split("_");
  docType = fileName[fileName.length - 1].split(".");
  var params = {
    Bucket: config.aws.bucket,
    Key: fileName[0] + "/" + docType[0] + "/" + ftpPath[ftpPath.length - 1],

    Body: file.data.toString()
  };

  return s3.putObject(params).promise();
}

module.exports = {
  putBatch: putBatch,
  put: put
};
