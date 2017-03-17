var streamToString = require('./streamToString')
var retrieveFileStreams = require('./retrieveFileStreams')
var uploadToS3 = require('./uploadToS3')
var Client = require('ssh2-sftp-client');

const SftptToS3 = {
  execute: function(config, callback) {
    const sftp = new Client()
    sftp.connect(config)
      .then(() => {
        return sftp.list(config.fileDownloadDir);
      })
      .then((fileList) => {
        return retrieveFileStreams(sftp, fileList, "sftp")
      })
      .then((fileStreams) => {
        return streamToString(fileStreams)
      })
      .then((dataArray) => {
        return uploadToS3.putBatch(config.bucket, dataArray)
      })
      .then((files) => {
        sftp.mkdir(config.completedDir, true)
        return sftp.list(config.fileDownloadDir);
      })
      .then((files) => {
        files.map((file) => {
          sftp.rename(file.name, config.completedDir + file.name);
        })
        console.log("upload finished")
        sftp.end()
        callback(null, "ftp files uploaded")
      })
      .catch( function(err) {
        console.error("Error", err);
        sftp.end()
        callback(err, null)
      })
  }
}

module.exports = BypassSFTP


  