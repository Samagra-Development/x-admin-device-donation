import axios from "axios";
import { getSession, session } from "next-auth/client";
import parser from "xml-js";
import { signIn } from "next-auth/client";
const Minio = require("minio");

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    let requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    const options = {
      headers: { Authorization: process.env.FUSIONAUTH_API_KEY },
    };
    const responseUser = await axios.post(
      `${process.env.FUSIONAUTH_DOMAIN}/api/login`,
      {
        loginId: process.env.UPLOAD_LOGIN_ID,
        password: process.env.UPLOAD_PASSWORD,
        applicationId: process.env.UPLOAD_APPLICATION_ID,
      },
      options
    );

    if (!responseUser.data || !responseUser.data.token) {
      res.status(200).json({ errors: "Error File ", success: null });
    }

    const token = responseUser.data.token;

    const response = await fetch(
      `https://cdn.samagra.io/minio/e-samwad/?Action=AssumeRoleWithWebIdentity&DurationSeconds=1234&WebIdentityToken=${token}&Version=2011-06-15`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) =>
        parser.xml2js(result, {
          compact: true,
        })
      )
      .catch((error) => console.log("error", error));
    if (response.ErrorResponse) {
      res
        .status(200)
        .json({ errors: "Error File upload - Provider error", success: null });
    }
    const responseObject =
      response.AssumeRoleWithWebIdentityResponse
        ?.AssumeRoleWithWebIdentityResult;
    if (!responseObject.Credentials) {
      res
        .status(200)
        .json({ errors: "Error File upload - Provider error", success: null });
    }
    const { AccessKeyId, SecretAccessKey, SessionToken } =
      responseObject.Credentials;
    const minioClient = new Minio.Client({
      endPoint: "cdn.samagra.io",
      useSSL: true,
      accessKey: AccessKeyId["_text"],
      secretKey: SecretAccessKey["_text"],
      sessionToken: SessionToken["_text"],
    });

    if (req.method === "POST") {
      try {
        const { file, name } = req.body;
        let newName = Date.now() + name;
        const myBuffer = Buffer.from(
          file.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
          "base64"
        );

        // Upload a buffer
        minioClient.putObject(
          "e-samwad",
          newName,
          myBuffer,
          "application/octet-stream",
          function (e, etag) {
            if (e) {
              res.status(200).json({
                error: `Error File upload - Provider error`,
                success: e,
              });
              return console.log(e);
            }
            res.status(200).json({
              error: null,
              success: "File uploaded successfully!",
              etag: newName,
            });
          }
        );
      } catch (e) {
        res.status(200).json({ erorr: e.message });
      }
    }
    if (req.method === "GET") {
      const { name } = req.query;
      if (name) {
        minioClient.presignedUrl(
          "GET",
          "e-samwad",
          name,
          7 * 24 * 60 * 60,
          function (err, presignedUrl) {
            if (err) return console.log(err);
            res.status(200).json({ url: presignedUrl });
          }
        );
      } else {
        res.status(200).json({
          error: `Error File upload - Provider error`,
          success: null,
        });
      }
    }
  } else res.status(401).json({ error: "Unauthorised access.", success: null });
};

export default handler;
