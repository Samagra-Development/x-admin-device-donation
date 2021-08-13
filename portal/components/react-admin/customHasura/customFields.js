import { buildFields } from "ra-data-hasura";
import gql from "graphql-tag";
/**
 * Extracts just the fields from a GraphQL AST.
 * @param {GraphQL AST} queryAst
 */
const extractFieldsFromQuery = (queryAst) => {
  return queryAst.definitions[0].selectionSet.selections;
};

// Define the additional fields that we want.
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

const customBuildFields = (type, fetchType) => {
  const resourceName = type.name;
  const defaultFields = buildFields(type, fetchType);

  if (resourceName === "device_donation_donor") {
    if (fetchType === "UPDATE") {
      const relatedEntities = extractFieldsFromQuery(EXTENDED_DONATION_RECORD);
      defaultFields.push(...relatedEntities);
    }
  } else if (resourceName === "corporate_donor_devices") {
    if (fetchType === "GET_LIST") {
      const relatedEntities = extractFieldsFromQuery(EXTENDED_CORPORATE_DEVICES_RECORD);
      defaultFields.push(...relatedEntities);
    }
  }

  return defaultFields;
};

export default customBuildFields;
