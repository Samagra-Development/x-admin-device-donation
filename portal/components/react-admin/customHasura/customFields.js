import { buildFields } from "ra-data-hasura";
import { EXTENDED_DONATION_RECORD, EXTENDED_CORPORATE_DEVICES_RECORD, EXTENDED_CORPORATE_DEVICES_UPDATE_RECORD } from './records';
/**
 * Extracts just the fields from a GraphQL AST.
 * @param {GraphQL AST} queryAst
 */
const extractFieldsFromQuery = (queryAst) => {
  return queryAst.definitions[0].selectionSet.selections;
};

const customBuildFields = (type, fetchType) => {
  const resourceName = type.name;
  const defaultFields = buildFields(type, fetchType);

  if (resourceName === "device_donation_donor") {
    if (['GET_ONE','UPDATE','GET_LIST'].includes(fetchType)) {
      const relatedEntities = extractFieldsFromQuery(EXTENDED_DONATION_RECORD);
      defaultFields.push(...relatedEntities);
    }
  } else if (resourceName === "corporate_donor_devices") {
    if (['GET_ONE','GET_LIST'].includes(fetchType)) {
      const relatedEntities = extractFieldsFromQuery(EXTENDED_CORPORATE_DEVICES_RECORD);
      defaultFields.push(...relatedEntities);
    } else if (fetchType === "UPDATE") {
      const relatedEntities = extractFieldsFromQuery(EXTENDED_CORPORATE_DEVICES_UPDATE_RECORD);
      defaultFields.push(...relatedEntities);
    }
  }

  return defaultFields;
};

export default customBuildFields;
