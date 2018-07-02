var streamToArray = require('stream-to-array');
var AdmZip = require('adm-zip');

module.exports = function (fileStreams) {
  return Promise.all(fileStreams.map((file) => {
    return fileToArray(file)
  }))
}

function fileToArray(fileStream) {
  if (fileStream && fileStream.path && fileStream.path.endsWith('.zip')) {
    var zip = new AdmZip(fileStream);
    var buffer = zip.toBuffer();
    return {data: buffer, key: fileStream.path}
  } else {
    return streamToArray(fileStream)
    .then((fileArray) => {
      return {data: fileArray, key: fileStream.path}
    })
    .catch((err) => {
      return err
    })
  }
}