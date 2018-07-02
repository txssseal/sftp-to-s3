var streamToArray = require('stream-to-array');
var AdmZip = require('adm-zip');

module.exports = function (fileStreams) {
  return Promise.all(fileStreams.map((file) => {
    return fileToArray(file)
  }))
}

function fileToArray(fileStream) {
  if (fileStream && fileStream.path && fileStream.path.endsWith('.zip')) {
    let zip = new AdmZip(fileStream);
    let zipEntries = zip.getEntries();
    for (zipEntry of zipEntries) {
        if (zipEntry.name.endsWith('.xml') && !zipEntry.entryName.startsWith('__MACOSX')) {
            let text = zip.readAsText(zipEntry);
            return {data: text, key: zipEntry.name}
        }
    }
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