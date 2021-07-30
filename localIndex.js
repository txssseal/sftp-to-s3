const Client = require('ssh2-sftp-client');
const retrieveFileStreams = require('./lib/retrieveFileStreams');
const uploadToS3 = require('./lib/uploadToS3');
const path = require('path');
const fs = require('fs');
const SftpToS3 = {
  batch: function () {
    const sftp = new Client();
    var numOfUploadedFiles = 0;

    /*update here with path to your secret key*/
    var config = {
        sftp: {
            host: "sftp3.urjanet.com",
            username: "maintenance@aquicore.com",
            port: 22,
            privateKey: fs.readFileSync('/Users/kaelanholic/Desktop/dataEngineering/sftp-to-s3/urjanet')
        },
        aws: {
            bucket: "urjanet-raw-files-dev"
        },
        fileDownloadDir: "/sftp/completed-uploads/",
        completedDir: "/sftp/completed-uploads/"
    };

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
          numOfUploadedFiles = fileList.length;
          const filesFiltered = fileList.filter(file => file.name === 'Aquicore_07_26_21_04_32.zip');
          return retrieveFileStreams(sftp, config, filesFiltered, "sftp");
        })
        .then((dataArray) => {
          return uploadToS3.putBatch(config, dataArray);
        })
        .then((files) => {
          sftp.mkdir(config.completedDir, true)
          return sftp.list(config.fileDownloadDir);
        })
        .then((files) => {
          files.map((file) => {
            sftp.rename(file.name, config.completedDir + file.name);
          });
          console.dir("upload finished, processed " + numOfUploadedFiles + " files");
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

SftpToS3.batch();

module.exports = SftpToS3


