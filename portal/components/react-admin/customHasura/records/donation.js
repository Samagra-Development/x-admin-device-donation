import gql from "graphql-tag";

export const EXTENDED_DONATION_RECORD = gql`
  {
    recipient_school {
      id
      udise
      name
      location {
        district
      }
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