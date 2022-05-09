import {
  DonateDeviceRequestEdit,
  DonateDeviceRequestList,
  DonateDeviceRequestShow,
} from "@/resources/donate-device";
import {
  RequestDeviceEdit,
  RequestDeviceList,
} from "@/resources/request-device";
import { CorporatesEdit, CorporatesList } from "@/resources/corporates";
import {
  CorporateDevicesEdit,
  CorporateDevicesList,
  CorporateDevicesShow,
} from "@/resources/corporate-devices";
import {
  DeviceVerificationList,
  DeviceVerificationEdit,
} from "@/resources/verification";

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
    show: DonateDeviceRequestShow,
    create: null,
    icon: "smartphone",
  },
  {
    name: "device_donation_corporates",
    list: null,
    edit: null,
    create: null,
  },
  {
    name: "corporate_donor_devices",
    label: "Corporate Donors",
    list: CorporateDevicesList,
    edit: CorporateDevicesEdit,
    show: CorporateDevicesShow,
    create: null,
    icon: "corporate",
  },
  {
    name: "device_verification_records",
    label: "Device verification",
    list: DeviceVerificationList,
    edit: DeviceVerificationEdit,
    create: null,
    icon: "corporate",
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
