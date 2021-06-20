import axios from 'axios';
import { getSession, session } from 'next-auth/client'

export default async function handler(req, res) {
    const session = await getSession({ req });
    if(session) {
        if(req.method === 'POST') {
            const { msg, contactNumber } = req.body;
            const response = await axios({method: 'get',
            url: `http://enterprise.smsgupshup.com/GatewayAPI/rest?msg=${msg}&v=1.1&userid=${process.env.GUPSHUP_USERNAME}&password=${process.env.GUPSHUP_PASSWORD}&send_to=${contactNumber}&msg_type=text&method=sendMessage&format=JSON`
            });
                  
            const responseObject = response.data?.response;
            if(responseObject?.status === 'success') { 
                    res.status(200).json({error: null, success: 'Successfully sent!'})                 
            }
            else {
                res.status(500).json({error: `Error sending SMS - Provider error code ${responseObject.id}`, success: null})
            }
        }        
    }
    else res.status(401).json({error: 'Unauthorised access.', success: null })
}

