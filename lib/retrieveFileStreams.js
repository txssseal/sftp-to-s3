function retrieveFileStreams (conn, config, fileStreamArray, client_type) {
  return Promise.all(fileStreamArray.map((file) => {
    // make sure we are using sftp library
    if (client_type === "sftp") {
      // make sure we are returning files and not directories
      if (file.type === "-") {
        return conn.get(config.fileDownloadDir + file.name, null, null).then((data) => {
            return {data: data, key: file.name};
        });
      }
    }
  }));
}

module.exports = retrieveFileStreams;