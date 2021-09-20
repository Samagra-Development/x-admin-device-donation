import axios from "axios";
import { getSession, session } from "next-auth/client";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "GET") {
      const { phone_number } = req.query;
      
      const response = await axios({
        method: "get",
        url: `${process.env.USER_SERVICE_URL}/user/sendOTP?phone=${phone_number}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`,
        },
      });

      const responseObject = response.data?.status;
      if (responseObject?.status === "success") {
        res.status(200).json({
          error: null,
          success: "Successfully sent SMS notification!",
        });
      } else {
        res.status(200).json({
          error: `Error sending SMS - Provider error code ${responseObject.id}`,
          success: null,
        });
      }
    } if (req.method === "POST") {
      const { phone_number, otp } = req.body;
      
      const response = await axios({
        method: "get",
        url: `http://139.59.46.189:3005/user/verifyOTP?phone=${phone_number}&&otp=${otp}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.jwt}`,
        },
      });

      const responseObject = response.data?.status;
      if (responseObject?.status === "success") {
        res.status(200).json({
          error: null,
          success: "Successfully sent SMS notification!",
        });
      } else {
        res.status(200).json({
          error: `Error sending SMS - Provider error code`,
          success: null,
        });
      }
    }
  } else res.status(401).json({ error: "Unauthorised access.", success: null });
};

export default handler;
