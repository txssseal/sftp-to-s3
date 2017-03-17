# sftp-to-s3

#### example

```javascript
const SftpToS3 = require('sftp-to-s3');
const config = {
  host: process.env.hostname,
  username: process.env.user, 
  password: process.env.password, 
  aws: {
    bucket: "bucket_name", accessKeyId: 'AKID', secretAccessKey: 'SECRET', region: 'us-west-2'
  },
  fileDownloadDir: "./",
  completedDir: './completed-uploads/'
};

SftpToS3.batch(config)
  .then((success) => {
    console.log(success)
  })
  .catch((err) => {
    console.error(err)
  })
```

see `http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property` for complete aws config options
see `https://github.com/jyu213/ssh2-sftp-client` for complete sftp options
