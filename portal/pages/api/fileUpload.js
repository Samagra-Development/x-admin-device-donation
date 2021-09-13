import axios from "axios";
import { getSession, session } from "next-auth/client";
import parser from "xml2json";

const Minio = require('minio')

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "POST") {
      try {
        const { file } = req.body;
        
        const myBuffer = Buffer.from(file, 'base64');
        let requestOptions = {
          method: 'POST',
          redirect: 'follow'
        };
        
        const response = await fetch(`https://cdn.samagra.io/minio/e-samwad/?Action=AssumeRoleWithWebIdentity&DurationSeconds=1234&WebIdentityToken=${process.env.UPLOAD_USER_TOKEN}&Version=2011-06-15`, requestOptions)
          .then(response => response.text())
          .then(result => parser.toJson(result,{object: true}))
          .catch(error => console.log('error', error));
          
        const responseObject = response.AssumeRoleWithWebIdentityResponse?.AssumeRoleWithWebIdentityResult;
        if (responseObject?.Credentials) {
          const {AccessKeyId , SecretAccessKey} = responseObject.Credentials;
          console.log(AccessKeyId , SecretAccessKey);
          const minioClient = new Minio.Client({
              endPoint: 'play.min.io',
              port: 9000,
              useSSL: true,
              accessKey: AccessKeyId,
              secretKey: SecretAccessKey
          });

          // Upload a buffer
          minioClient.putObject('e-samwad', 'my-objectname2', myBuffer, 'application/octet-stream', function(e) {
            if (e) {
              return console.log(e)
            }
            console.log("Successfully uploaded the buffer")
          })

          res.status(200).json({
            error: null,
            success: "File uploaded successfully!",
          });
        } else {
          res.status(200).json({
            error: `Error File upload - Provider error`,
            success: response,
          });
        }
      } catch(e) {
        res.status(200).json({erorr:e.message});
      }
    }
  } else res.status(401).json({ error: "Unauthorised access.", success: null });
};

export default handler;
