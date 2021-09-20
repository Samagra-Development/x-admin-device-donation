import axios from "axios";
import sendLog from "./sendLog";

export const sendOTP = async (phoneNumber) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_API_URL}/sendOTP?phone_number=${phoneNumber}`,
    });
    if (response.data?.error) {
      sendLog(
        `⚠️ *samarth-device*\n :round_pushpin: \`${process.env.NEXT_PUBLIC_URL}\` \n :pager: SMS status update notification sending to *${phoneNumber}* failed`
      );
      return { error: response.data?.error, success: null };
    } else if (response.data?.success) {
      sendLog(
        `:white_check_mark: *samarth-device*\n :round_pushpin: \`${process.env.NEXT_PUBLIC_URL}\` \n :pager: SMS status update notification successfully sent to *${phoneNumber}*`
      );
      return { success: response.data?.success, error: null };
    }
  } catch (err) {
    return err;
  }
};

export const verifyOTP = async (phoneNumber,otp) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API_URL}/sendOTP`,
      data: {
        phone_number: phoneNumber,
        otp: otp,
      },
    });
    if (response.data?.error) {
      sendLog(
        `⚠️ *samarth-device*\n :round_pushpin: \`${process.env.NEXT_PUBLIC_URL}\` \n :pager: OTP successfully verified by *${phoneNumber}* failed`
      );
      return { error: response.data?.error, success: null };
    } else if (response.data?.success) {
      sendLog(
        `:white_check_mark: *samarth-device*\n :round_pushpin: \`${process.env.NEXT_PUBLIC_URL}\` \n :pager: OTP successfully verified by *${phoneNumber}*`
      );
      return { success: response.data?.success, error: null };
    }
  } catch (err) {
    return err;
  }
};