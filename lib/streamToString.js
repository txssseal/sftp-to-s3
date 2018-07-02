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
    var zipEntries = zip.getEntries();
    for (zipEntry of zipEntries) {
        console.log(zipEntry.toString());
        if (zipEntry.name.endsWith('.xml') && !zipEntry.entryName.startsWith('__MACOSX')) {
            var text = zip.readAsText(zipEntry);
            console.log(text);
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