import gql from "graphql-tag";

const EXTENDED_DONATION_RECORD = gql`
  {
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

export default EXTENDED_DONATION_RECORD;