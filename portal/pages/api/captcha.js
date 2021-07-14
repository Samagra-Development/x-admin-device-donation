import axios from "axios";
import { getSession, session } from "next-auth/client";

const handler = async (req, res) => {
	if (req.method === "POST") {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_CAPTCHA_URL}/verify`,{
      params: req.body,
    });
    const responseObject = response.data;
    if (responseObject) {
      res.status(200).json({ errors: null, success: responseObject });
    }
  }
};

export default handler;
