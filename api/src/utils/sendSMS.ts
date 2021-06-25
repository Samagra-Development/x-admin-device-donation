import axios from 'axios';
import sendLog from './adminLogger';

const sendSMS = async (msg:string, trackingKey: string, contactNumber:string) => {
        
    const response = await axios({
        method: 'get',
        url: `http://enterprise.smsgupshup.com/GatewayAPI/rest?msg=${msg}&v=1.1&userid=${process.env.GUPSHUP_USERNAME}&password=${process.env.GUPSHUP_PASSWORD}&send_to=${contactNumber}&msg_type=text&method=sendMessage&format=JSON&principalEntityId=${process.env.GUPSHUP_PRINCIPAL_ENTITY_ID}&dltTemplateId=1007434778563689331`
    });    
    const responseObject = response.data?.response;       
    if (responseObject?.status === 'success') {
        sendLog(`*samarth-device*: SMS message successfully sent to _${contactNumber}_ with Tracking ID: *${trackingKey}*`, 'C017PG3BBT2');
        return ({
            statusCode: 200,
            error: null,
            success: 'Successfully sent!'
        })
    }
    else {
        sendLog(`samarth-device: SMS message sending failed to ${contactNumber}`, 'C017PG3BBT2');
        return ({
            statusCode: 500,
            error: `Error sending SMS - Provider error code ${responseObject.id}`,
            success: null
        });
    }
}

export default sendSMS;