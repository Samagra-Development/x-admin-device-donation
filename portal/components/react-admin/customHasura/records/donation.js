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
      verifier_name
      declaration
      photograph_url
    }
  }
`;