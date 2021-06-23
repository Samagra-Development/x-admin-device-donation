import axios from 'axios';

const sendSMS = async (msg, contactNumber) => {
    const response = await axios({
        method: 'get',
        url: `http://enterprise.smsgupshup.com/GatewayAPI/rest?msg=${msg}&v=1.1&userid=${process.env.GUPSHUP_USERNAME}&password=${process.env.GUPSHUP_PASSWORD}&send_to=${contactNumber}&msg_type=text&method=sendMessage&format=JSON`
    });

    const responseObject = response.data?.response;
    if (responseObject?.status === 'success') {
        return ({
            statusCode: 200,
            error: null,
            success: 'Successfully sent!'
        })
    }
    else {
        return ({
            statusCode: 500,
            error: `Error sending SMS - Provider error code ${responseObject.id}`,
            success: null
        });
    }
}

export default sendSMS;