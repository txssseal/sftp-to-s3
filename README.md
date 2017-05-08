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
  fileDownloadDir: "/",
  completedDir: '/completed-uploads/'
};

SftpToS3.batch(config)
  .then((success) => {
    console.log(success)
  })
  .catch((err) => {
    console.error(err)
  })
```

[for complete aws s3 config options go here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property "AWS S3 Config Doc")

[for complete sftp config options go here](https://github.com/jyu213/ssh2-sftp-client)
