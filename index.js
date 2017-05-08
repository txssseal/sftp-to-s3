const Client = require('ssh2-sftp-client');
const streamToString = require('./lib/streamToString')
const retrieveFileStreams = require('./lib/retrieveFileStreams')
const uploadToS3 = require('./lib/uploadToS3')

const SftpToS3 = {
  batch: function(config) {
    const sftp = new Client()

    return new Promise( (resolve, reject) => {
      return sftp.connect(config.sftp)
        .then(() => {
          return sftp.list(config.fileDownloadDir);
        })
        .then((fileList) => {
          return retrieveFileStreams(sftp, config, fileList, "sftp")
        })
        .then((fileStreams) => {
          return streamToString(fileStreams)
        })
        .then((dataArray) => {
          return uploadToS3.putBatch(config.aws, dataArray)
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
          return resolve("ftp files uploaded")
        })
        .catch( function(err) {
          console.error("Error", err);
          sftp.end()
          return reject(err)
        })
    })
  }
}

module.exports = SftpToS3


  