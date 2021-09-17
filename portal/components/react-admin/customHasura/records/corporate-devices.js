import gql from "graphql-tag";

export const EXTENDED_CORPORATE_DEVICES_RECORD = gql`
{
  device_donation_corporate {
    company_id
    company_name
    delivery_initiated
    id
    poc_designation
    poc_email
    poc_name
    poc_phone_number
    quantity_of_devices
  }
  device_verification_record {
    udise
    verifier_name
    verifier_phone_number
    declaration
    photograph_url
  }
}
`;

export const EXTENDED_CORPORATE_DEVICES_UPDATE_RECORD = gql`
{
  device_donation_corporate {
    poc_phone_number
  }
  recipient_school {
    id
    udise
    name
    location {
      district
    }
  }
}
`;