export class Corporate {
  company_name?: string | null;
  poc_name?: string | null;
  poc_designation?: string | null;
  poc_phone_number?: string | null;
  poc_email?: string | null;
  delivery_initiated?: string | null;
  quantity_of_devices?: string | null;
  company_id?: string | null;

  operationsDoc = `
    mutation insertCorporate($corporate: device_donation_corporates_insert_input!) {
      insert_device_donation_corporates_one(object: $corporate) {
        poc_phone_number
        quantity_of_devices
        company_id
      }
    }
  `;
  
  variableName = `corporate`;
  operationName = `insertCorporate`;
  databaseOperationName = `insert_device_donation_corporates_one`;

  constructor(data: any) {
    this.company_name = data?.corp ?? null;
    this.poc_name = data?.name ?? null;
    this.poc_designation = data?.designation ?? null;
    this.poc_phone_number = data?.contact ?? null;
    this.poc_email = data?.email ?? null;
    this.quantity_of_devices = data?.number ?? null;
    this.delivery_initiated = data?.delivery ?? null;
    this.company_id = data?.instanceID ?? null;
  }

}
