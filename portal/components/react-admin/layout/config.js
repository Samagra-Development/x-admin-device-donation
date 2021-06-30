import {
  DonateDeviceRequestEdit,
  DonateDeviceRequestList,
} from "@/resources/donate-device";
import {
  RequestDeviceEdit,
  RequestDeviceList,
} from "@/resources/request-device";

export const resourceConfig = [
  {
    title: "Data",
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
    name: "school",
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
