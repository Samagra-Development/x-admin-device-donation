import gql from "graphql-tag";

const EXTENDED_CORPORATE_DEVICES_RECORD = gql`
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
}
`;
export default EXTENDED_CORPORATE_DEVICES_RECORD;