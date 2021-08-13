import axios from "axios";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { captcha, captchaToken } = req.body;
      const responseObjectCaptcha = await captchaVerify(captcha, captchaToken);
      const { id, type } = req.body;
      const responseObject = await startFetchTrackDevice(id,type);
      if (responseObject?.errors) {
        res
          .status(500)
          .json({ error: responseObject?.errors?.[0]?.message, success: null });
      } else if (responseObject?.data) {
        if (responseObject?.data?.["device_donation_donor"]?.length) {
          res.status(200).json({
            error: null,
            success: {
              data: maskPhoneNumber(
                responseObject.data["device_donation_donor"]
              ),
            },
          });
        } else if (responseObject?.data?.["corporate_donor_devices"]?.length) {
          res.status(200).json({
            error: null,
            success: {
              data: maskPhoneNumber(
                responseObject.data["corporate_donor_devices"]
              ),
            },
          });
        } else
          res.status(200).json({
            error:
              "No device found with this ID/ इस आईडी से कोई फ़ोन नहीं मिला!",
            success: null,
          });
      }
    } catch (e) {
      res
        .status(200)
        .json({ error: "Incorect Captcha/ Captcha कोड गलत है!", success: e });
    }
  }
};

function maskPhoneNumber(array) {
  let modifiyData = array.map(element => element.delivery_status);
  let obj = {allStatus:modifiyData};
  let { phone_number, device_donation_corporate, name } = array[0];
  if(phone_number) {
    phone_number = `******${phone_number.slice(6)}`;
    obj.phone_number = phone_number;
    obj.name = name;
  } else if(device_donation_corporate.poc_phone_number) {
    phone_number = `******${device_donation_corporate.poc_phone_number.slice(6)}`;
    obj.name = device_donation_corporate.poc_name;
    obj.phone_number = phone_number;
  }
  return obj;
}

async function captchaVerify(captcha, captchaToken) {
  const result = await axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_CAPTCHA_URL}`,
    data: {
      captcha: captcha,
      token: captchaToken,
    },
  });

  return result;
}

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await axios({
    method: "POST",
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
    },
    url: process.env.HASURA_URL,
    data: {
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    },
  });

  return await result;
}

const operationsIndividualDoc = `
    query trackDevice($trackingKey: String) {
      device_donation_donor(where: {device_tracking_key: {_eq: $trackingKey}}) {
        delivery_status
        phone_number
        name
        recipient_school {
          udise
        }
      }
    }
  `;

const operationsCorporateDoc = `
  query trackDevice($trackingKey: String) {
    corporate_donor_devices(where: {company_id: {_eq: $trackingKey}}) {
      id
      delivery_status
      device_donation_corporate {
        poc_phone_number
        poc_name
      }
    }
  }
`;

function fetchTrackDevice(trackingKey,type) {
  if(type == "Individual") {
    return fetchGraphQL(operationsIndividualDoc, "trackDevice", {
      trackingKey: trackingKey,
    });
  } else if(type == "Corporate") {
    return fetchGraphQL(operationsCorporateDoc, "trackDevice", {
      trackingKey: trackingKey,
    });
  }
}

async function startFetchTrackDevice(trackingKey,type) {
  const response = await fetchTrackDevice(trackingKey,type);

  return response.data;
}

export default handler;
