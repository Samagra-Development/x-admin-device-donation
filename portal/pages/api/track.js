import axios from 'axios';

export default async function handler(req, res) {    
      if(req.method === 'POST') {
          const { id } = req.body;          
          const responseObject = await startFetchTrackDevice(id);                             
          if(responseObject?.errors) { 
                res.status(500).json({error: responseObject?.errors?.[0]?.message, success: null})                                 
          }
          else if(responseObject?.data) {            
            if(responseObject?.data?.['device_donation_donor']?.length) {
              res.status(200).json({error: null, success: { data: maskPhoneNumber(responseObject.data['device_donation_donor'])}})
            }
            else res.status(200).json({error: 'No device found with this ID/ इस आईडी से कोई फ़ोन नहीं मिला!', success: null})
          }
      }                
}

function maskPhoneNumber(array){
  const obj = array[0];
  let { phone_number } = obj;
  phone_number = `******${phone_number.slice(6)}`
  obj.phone_number = phone_number;
  return obj;
}

async function fetchGraphQL(operationsDoc, operationName, variables) {    
    const result = await axios(      
      {
        method: "POST",
        headers: {
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
        url: process.env.HASURA_URL,
        data: {
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        }
      }      
    );
  
    return await result;
  }
  
  const operationsDoc = `
    query trackDevice($trackingKey: String) {
      device_donation_donor(where: {device_tracking_key: {_eq: $trackingKey}}) {
        is_device_delivered
        is_device_received
        phone_number
      }
    }
  `;
  
  function fetchTrackDevice(trackingKey) {    
    return fetchGraphQL(
      operationsDoc,
      "trackDevice",
      {"trackingKey": trackingKey}
    );
  }
  
  async function startFetchTrackDevice(trackingKey) {    
    const response = await fetchTrackDevice(trackingKey);
    
    return response.data;
  }
  
