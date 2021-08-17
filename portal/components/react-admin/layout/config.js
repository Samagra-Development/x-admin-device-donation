import {
  DonateDeviceRequestEdit,
  DonateDeviceRequestList,
} from "@/resources/donate-device";
import {
  RequestDeviceEdit,
  RequestDeviceList,
} from "@/resources/request-device";
import {
  CorporatesEdit,
  CorporatesList,
} from "@/resources/corporates";
import {
  CorporateDevicesEdit,
  CorporateDevicesList,
} from "@/resources/corporate-devices";

export const resourceConfig = [
  {
    label: "Data",
    title: true,
  },
  {
    name: "device_donation_donor",
    label: "Donors",
    list: DonateDeviceRequestList,
    edit: DonateDeviceRequestEdit,
    create: null,
    icon: "smartphone",
  },
  {
    name: "device_donation_corporates",
    label: "Corporates",
    list: CorporatesList,
    edit: CorporatesEdit,
    create: null,
    icon: "smartphone",
  },
  {
    name: "corporate_donor_devices",
    label: "Corporate Devices",
    list: CorporateDevicesList,
    edit: CorporateDevicesEdit,
    create: null,
    icon: "smartphone",
  },
  {
    name: "school",
    list: null,
    edit: null,
    create: null,
  },
  {
    name: "location",
    list: null,
    edit: null,
    create: null,
  },
  {
    name: "device_demand_response",
    list: RequestDeviceList,
    edit: RequestDeviceEdit,
    create: null,
    label: "School Level Demand",
    icon: "school",
  },
];
