const Client = require('ssh2-sftp-client');
const retrieveFileStreams = require('./lib/retrieveFileStreams');
const uploadToS3 = require('./lib/uploadToS3');
const path = require('path');
const SftpToS3 = {
  batch: function (config) {
    const sftp = new Client();
    var numOfUploadedFiles = 0;

    return new Promise((resolve, reject) => {
      // handle path errors
      if (config.aws === undefined) {
        console.error("aws key is required for config");
        reject("malformed config, aws key is required for config");
        return;
      }

      if (config.aws.bucket === undefined) {
        console.error("aws bucket is require in aws key");
        reject("malformed config, aws bucket is required in aws key");
        return;
      }

      if (path.isAbsolute(config.fileDownloadDir) === false) {
        console.error("fileDownloadDir must be absolute");
        reject("malformed config, fileDownloadDir must be absolute");
        return;
      }

      if (path.isAbsolute(config.completedDir) === false) {
        console.error("completedDir must be absolute");
        reject("malformed config, completedDir must be absolute");
        return;
      }

      return sftp.connect(config.sftp)
        .then(() => {
          return sftp.list(config.fileDownloadDir);
        })
        .then((fileList) => {
          console.info("Original file list:", fileList);
          const filteredFiles = fileList.filter((file) => {
            // Filter out directories from the list, we only care about the files
            return file.type !== 'd';
          });
          numOfUploadedFiles = filteredFiles.length;
          console.info("Filtered file list:", filteredFiles);
          return retrieveFileStreams(sftp, config, filteredFiles, "sftp");
        })
        .then((dataArray) => {
          console.info("Files retrieved");
          return uploadToS3.putBatch(config, dataArray);
        })
        .then((files) => {
          console.info("S3 put finished");
          sftp.mkdir(config.completedDir, true)
          return sftp.list(config.fileDownloadDir);
        })
        .then((files) => {
          files.filter((file) => {
            // Filter out directories from the list, we only care about the files
            return file.type !== 'd';
          }).map((file) => {
            sftp.rename(file.name, config.completedDir + file.name);
            console.info("Moved " + file.name + " to completed");
          });
          console.info("upload finished, processed " + numOfUploadedFiles + " files");
          sftp.end();
          return resolve("ftp files uploaded");
        })
        .catch(function (err) {
          console.error("Error during sftp to s3 download: ", err);
          sftp.end();
          return reject(err);
        });
    })
  }
}

module.exports = SftpToS3


