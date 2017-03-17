var streamToArray = require('stream-to-array')

module.exports = function (fileStreams) {
  return Promise.all(fileStreams.map((file) => {
    return fileToArray(file)
  }))
}

function fileToArray(fileStream) {
  return streamToArray(fileStream)
    .then((fileArray) => {
      return {data: fileArray, key: fileStream.path}
    })
    .catch((err) => {
      return err
    })
}