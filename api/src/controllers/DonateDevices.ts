
export class DonateDeviceRequest {   
    name?: string | null;
    phone_number?: string | null;
    created_at?: string | null;
    state_ut?: string | null;
    district?: string | null;
    other_district?: null;
    address?: string | null;
    landmark?: string | null;
    pincode?: number | null;
    delivery_mode?: string | null;
    declaration?: string | null;
    diet?: string | null;
    dietcourier?: string | null;
    deliverynonhp?: null;
    addressnonhp?: string | null;
    company?: string | null;
    companyother?: string | null;
    modelname?: string | null;
    screen?: string | null;
    years?: number | null;
    condition?: string | null;
    calls?: string | null;
    wa?: string | null;
    youtube?: string | null;
    charger?: string | null;
    finaldeclaration?: string | null;
    thanks?: string | null;
    instanceID?: string | null;

    operationsDoc = `
    mutation insertDonateDeviceRequest($device: donate_device_details_insert_input!) {
      insert_donate_device_details_one(object: $donate_request) {
        id
      }
    }
  `;
    variableName = `donate_request`;
    operationName = `insertDonateDeviceRequest`;

    constructor(data: any) {
        this.name = data?.name ?? null;
        this.phone_number = data.contact ?? null;
        this.created_at = data.submissionDate ?? null;
        this.state_ut = data.state_ut ?? null;
        this.district = data.district ?? null;
        this.other_district = data.otherdistrict ?? null;
        this.address = data.address ?? null;
        this.landmark = data.landmark ?? null;
        this.pincode = data.pincode ?? null;
        this.delivery_mode = data.delivery ?? null;
        this.declaration = data.declaration ?? null;
        this.diet = data.diet ?? null;
        this.dietcourier = data.dietcourier ?? null;
        this.deliverynonhp = data.deliverynonhp ?? null;
        this.addressnonhp = data.addressnonhp ?? null;
        this.company = data.company ?? null;
        this.companyother = data.companyother ?? null;
        this.modelname = data.modelname ?? null;
        this.screen = data.screen ?? null;
        this.years = data.years ?? null;
        this.condition = data.condition ?? null;
        this.calls = data.calls ?? null;
        this.wa = data.wa ?? null;
        this.youtube = data.youtube ?? null;
        this.charger = data.charger ?? null;
        this.finaldeclaration = data.finaldeclaration ?? null;
        this.thanks = data.thanks ?? null;
    
    }
  }
  