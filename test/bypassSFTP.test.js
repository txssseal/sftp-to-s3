'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const SftpToS3 = require('../index');
const retrieveFileStreams = require('../lib/retrieveFileStreams');
const Client = require('ssh2-sftp-client');
const uploadToS3 = require('../lib/uploadToS3');
const config = {test: "config", aws: {}};

describe("bypassSFTP", function() {
  it('should run succesfully', function(done) {
    sinon.stub(Client.prototype, 'connect').callsFake(function() {
      return Promise.resolve();
    });

    sinon.stub(Client.prototype, 'list').callsFake(function() {
      return Promise.resolve([{name: "meow", type: '-'}]);
    });

    sinon.stub(Client.prototype, 'get').callsFake(function() {
      return Promise.resolve('meow3');
    });

    sinon.stub(Client.prototype, 'mkdir');
    sinon.stub(Client.prototype, 'rename');
    sinon.stub(Client.prototype, 'end');

    sinon.stub(uploadToS3, 'putBatch').callsFake(function() {
      return Promise.resolve();
    });

    SftpToS3.execute(config)
      .then((success) => {
        sinon.assert.calledTwice(Client.prototype.list);
        sinon.assert.calledOnce(Client.prototype.mkdir);
        sinon.assert.calledOnce(Client.prototype.rename);
        sinon.assert.calledOnce(Client.prototype.end);
        expect(success).to.equal("ftp files uploaded");
        done()
      })
    sinon.assert.calledOnce(Client.prototype.connect);
  });

  it('should handle errors', function(done) {
    Client.prototype.connect.restore();
    Client.prototype.end.restore();

    sinon.stub(Client.prototype, 'connect').callsFake(function() {
      return Promise.reject("meowlure");
    });

    sinon.stub(Client.prototype, 'end');

    SftpToS3.execute(config)
      .catch((err) => {
        expect(err).to.equal("meowlure");
        done()
      })
    sinon.assert.calledOnce(Client.prototype.connect);
  });
});
