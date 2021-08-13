export class CorporateDevices {
  company_id?: string | null;
  device_tracking_key?: string | null;
  delivery_status?: string | null;

  operationsDoc = `
    mutation insertCorporateDevices($corporate_donor_devices: corporate_donor_devices_insert_input!) {
      insert_corporate_donor_devices_one(object: $corporate_donor_devices) {
        device_tracking_key
        company_id
      }
    }
  `;
  
  variableName = `corporate_donor_devices`;
  operationName = `insertCorporateDevices`;
  databaseOperationName = `insert_corporate_donor_devices_one`;

  constructor(data: any) {
    this.company_id = data?.companyId ?? null;
    this.device_tracking_key = data?.trackingKey ?? null;
    this.delivery_status = 'no-action-taken';
  }
}
