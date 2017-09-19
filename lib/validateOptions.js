var path = require('path');

module.exports = function validateOptions(options) {
  var isValid = true;

  if (typeof options !== "object" || options === null) {
    console.error('Config param required');
    isValid = false;
  }
  
  if (path.isAbsolute(options.fileDownloadDir) === false) {
    console.error("fileDownloadDir must be absolute");
    isValid = false
  }

  if (path.isAbsolute(options.completedDir) === false) {
    console.error("completedDir must be absolute");
    isValid = false
  }

  return isValid;
}