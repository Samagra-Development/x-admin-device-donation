import React, { useCallback, useState } from "react";
import {
  List,
  SimpleList,
  Datagrid,
  DateField,
  TextField,
  BooleanField,
  FunctionField,
  Edit,
  SimpleForm,
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
  TextInput,
  SelectInput,
  ImageField,
  BooleanInput,
  Filter,
  SearchInput,
  useRedirect,
  useNotify,
  AutocompleteInput,
  ReferenceInput,
  useMutation,
  required,
  maxLength,
  Toolbar,
  SaveButton,
  Labeled,
} from "react-admin";

import { useSession } from "next-auth/client";
import {
  Typography,
  makeStyles,
  useMediaQuery,
  Button,
} from "@material-ui/core";
import BackButton from "../components/BackButton";
import blueGrey from "@material-ui/core/colors/blueGrey";
import config from "@/components/config";
import sendSMS from "@/utils/sendSMS";
import buildGupshup from "@/utils/buildGupshup";
import axios from "axios";
import CustomFormDataConsumer from "../components/CustomFormDataConsumer";
import { sendOTP, verifyOTP } from "@/utils/sendOTP";

const useStyles = makeStyles((theme) => ({
  searchBar: {
    "& > div": {
      fontSize: "1rem",
    },
  },
  smSearchBar: {
    "& > div": {
      fontSize: "1.2rem",
    },
  },
  smList: {
    margin: "1rem 4rem",
    "& > div": {
      paddingLeft: 0,
      backgroundColor: "unset",
      "&:first-child > div": {
        backgroundColor: "unset",
      },
      "&:last-child > div": {
        backgroundColor: "#FFF",
        boxShadow:
          "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
      },
    },
  },
  list: {
    margin: "0rem 2rem",
  },
  filter: {
    paddingLeft: 0,
  },
  grid: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "1fr 1fr 1fr",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "1fr",
    },
    gridRowGap: "1ch",
    gridColumnGap: "1ch",
    margin: "1rem 0",
    "& > td": theme.overrides.MuiTableCell.head,
    "& > span": {
      fontSize: "1.1rem",
    },
  },
  fullWidthGrid: {
    gridTemplateColumns: "1fr",
    margin: "0 auto",
  },
  heading: {
    fontSize: "1.4rem",
    lineHeight: "0.5rem",
    fontWeight: 700,
    fontVariant: "all-small-caps",
  },
  select: {
    width: "30vw",
    alignSelf: "center",
    "& > div > div": {
      fontSize: "1.1rem",
      transform: "translate(12px 21px)",
    },
  },
  filterSelect: {
    width: "15vw",
    alignSelf: "center",
    "& > label": {
      opacity: "0.7",
      fontSize: "1.1rem",
    },
    "& > div": {
      transform: "translate(0 5px)",
    },
    " .MuiInputLabel-shrink": {
      transform: "translate(12px, 7px) scale(0.75)",
    },
  },
  textInput: {
    "& > label": {
      fontSize: "1.1rem",
    },
  },
  selectInput: {
    minWidth: "unset",
    "& > label": {
      fontSize: "1.1rem",
    },
    "& > div > div": {
      maxHeight: "1.1rem",
    },
  },
  warning: {
    margin: "0",
    padding: "0",
    paddingBottom: "1rem",
    textAlign: "center",
    width: "100%",
    fontStyle: "oblique",
  },
  fullWidth: {
    width: "100%",
  },
  grey: {
    color: blueGrey[300],
  },
}));

const getChoice = (choices, id) => {
  return choices?.find((elem) => elem.id === id);
};

const DevicesFilter = (props) => {
  const classes = useStyles();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Filter {...props} className={classes.filter}>
      <SearchInput
        placeholder="Tracking ID"
        source="device_tracking_key"
        className={isSmall ? classes.smSearchBar : classes.searchBar}
        alwaysOn
      />
      <SelectInput
        label="Delivery Type"
        source="delivery_mode"
        className={classes.filterSelect}
        choices={config.deliveryTypeChoices.filter((elem) => elem.filterable)}
      />
      <SelectInput
        label="Delivery Status"
        source="delivery_status"
        className={classes.filterSelect}
        choices={config.statusChoices}
      />
      <ReferenceInput
        reference="location"
        source="block"
        filterToQuery={(searchText) => ({ block: searchText })}
        filter={{ distinct_on: "block" }}
        sort={{ field: "block", order: "ASC" }}
      >
        <AutocompleteInput
          optionValue="block"
          optionText="block"
          className={classes.filterSelect}
        />
      </ReferenceInput>
    </Filter>
  );
};

/**
 * Donate Device Request List
 * @param {*} props
 */
export const DonateDeviceRequestList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const classes = useStyles();
  const postRowClick = (id, basePath, record) =>
    record.device_verification_record ? "show" : "edit";
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title="Donors list"
      className={isSmall ? classes.smList : classes.list}
      sort={{ field: "id", order: "DESC" }}
      filters={<DevicesFilter />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => record.district}
          tertiaryText={(record) => record.device_tracking_key}
          linkType="edit"
        />
      ) : (
        <Datagrid rowClick={postRowClick}>
          <DateField label="Date" locales="en-IN" source="created_at" />
          <TextField label="Name" source="name" />
          <TextField label="Phone Number" source="phone_number" />
          <TextField label="State/UT" source="state_ut" />
          <FunctionField
            label="District"
            render={(record) => {
              if (record) {
                return record.district !== "OTHER"
                  ? record.district
                  : record.other_district;
              }
            }}
          />
          <TextField label="Block" source="block" />
          <TextField label="Tracking ID" source="device_tracking_key" />
          <FunctionField
            label="Delivery Mode"
            render={(record) =>
              record.delivery_mode
                ? getChoice(config?.deliveryTypeChoices, record.delivery_mode)
                    ?.name
                : getChoice(
                    config?.deliveryTypeChoices,
                    record.delivery_mode_outside_HP
                  )?.name
            }
          />
          <FunctionField
            label="Delivery Staus"
            render={(record) =>
              getChoice(config?.statusChoices, record.delivery_status)?.name
            }
          />
        </Datagrid>
      )}
    </List>
  );
};

export const DonateDeviceRequestEdit = (props) => {
  const classes = useStyles();
  const notify = useNotify();
  const redirect = useRedirect();
  const [session] = useSession();
  const [mutate] = useMutation();
  const [otpGenerated, setOtpGenerated] = useState(false);

  const fileUpload = async (file) => {
    const newfile = await new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
    });

    const responseOtp = await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/fileUpload`,
      data: { file: newfile },
    });

    return responseOtp.data;
  };

  const getTemplateFromDeliveryStatus = (status) => {
    const obj = config.statusChoices.find((elem) => elem.id === status);
    return [obj?.template, obj?.templateId, obj?.variables];
  };

  const onSuccess = async (data) => {
    if (data) {
      notify(
        "ra.notification.updated",
        "info",
        { smart_count: 1 },
        props.mutationMode === "undoable"
      );
      const { delivery_status } = data;
      const [template, templateId, variables] =
        getTemplateFromDeliveryStatus(delivery_status);
      if (template && variables && session.role) {
        //get each variable (which could be a path, like "ab.cd"), and replace it with
        //the appropriate value from the data object
        let replacedVariables = variables.map((keys) =>
          //turn "ef" or "ab.cd" into ["ef"] and ["ab", "cd"] respectively
          //and then reduce that to a singular value
          keys.split(".").reduce((acc, key) => acc[key], data)
        );

        const message = buildGupshup(template, replacedVariables);
        const response = await sendSMS(message, templateId, data.phone_number);
        if (response?.success) notify(response.success, "info");
        else if (response?.error) notify(response.error, "warning");
      }
      redirect("list", props.basePath, data.id, data);
    }
  };

  const validateForm = async (values) => {
    const errors = {};

    if (values.delivery_status && values.delivery_status == "delivered-child") {
      if (!values.device_verification_record?.otp) {
        errors.device_verification_record = { otp: "The Otp is required" };
      }
      if (!values.device_verification_record?.verifier_phone_number) {
        errors.device_verification_record = {
          ...errors.device_verification_record,
          verifier_phone_number: "Verifier's phone number is required",
        };
      } else if (
        !values.device_verification_record.verifier_phone_number.match(
          "[0-9]{10}"
        )
      ) {
        errors.device_verification_record = {
          ...errors.device_verification_record,
          verifier_phone_number: "Enter a valid 10 digit mobile number.",
        };
      }
      if (!values.device_verification_record?.declaration) {
        errors.device_verification_record = {
          ...errors.device_verification_record,
          declaration: "Declaration is required.",
        };
      }
    }

    return errors;
  };

  const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const filtered = (raw, allowed, except = "only") => {
    return Object.keys(raw)
      .filter((key) =>
        except == "except" ? !allowed.includes(key) : allowed.includes(key)
      )
      .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
      }, {});
  };

  const save = useCallback(
    async (values) => {
      try {
        const recordData = filtered(
          values,
          ["device_verification_record"],
          "except"
        );
        const verificationData = values?.device_verification_record;
        if (verificationData.otp) {
          const responseOtpObject = await verifyOTP(
            verificationData.verifier_phone_number,
            verificationData.otp
          );
          if (responseOtpObject.error) {
            return {
              device_verification_record: { otp: "invalid otp" },
            };
          }
        }

        const response = await mutate(
          {
            type: "update",
            resource: "device_donation_donor",
            payload: { id: values.id, data: recordData },
          },
          { returnPromise: true }
        );
        const responseObject = response.data;
        if (
          verificationData.otp &&
          responseObject &&
          responseObject.delivery_status == "delivered-child"
        ) {
          let fileUrl = null;
          if (verificationData.photograph_url) {
            fileUrl = await fileUpload(
              verificationData.photograph_url?.rawFile
            );
          }
          const record = {
            ...verificationData,
            udise: session.username,
            transaction_id: uuidv4(),
            device_tracking_key_individual: responseObject.device_tracking_key,
            photograph_url: fileUrl,
          };
          const response = await mutate(
            {
              type: "create",
              resource: "device_verification_records",
              payload: { data: record },
            },
            { returnPromise: true }
          );
          setOtpGenerated(false);
        }
        onSuccess(responseObject);
      } catch (error) {
        if (error.body?.errors) {
          return error.body.errors;
        } else {
          return error.body;
        }
      }
    },
    [mutate]
  );

  const generateOtp = async (phone_number) => {
    if (phone_number && phone_number.length >= 10) {
      const responseObject = await sendOTP(phone_number);
      if (!responseObject.error) {
        setOtpGenerated(true);
      }
    }
  };

  const EditNoDeleteToolbar = (props) => {
    let { record } = props;
    let { device_verification_record } = record ? record : {};
    let verified =
      device_verification_record && device_verification_record.udise
        ? "none"
        : "block";
    return (
      <Toolbar {...props}>
        <SaveButton disabled={props.pristine} style={{ display: verified }} />
      </Toolbar>
    );
  };

  const Title = ({ record }) => {
    return (
      <span>
        Edit donor{" "}
        <span className={classes.grey}>#{record.device_tracking_key}</span>
      </span>
    );
  };

  return (
    <div>
      <Edit
        mutationMode={"pessimistic"}
        title={<Title />}
        {...props}
        actions={false}
      >
        <SimpleForm
          toolbar={<EditNoDeleteToolbar />}
          validate={validateForm}
          save={save}
        >
          <BackButton history={props.history} />
          <span className={classes.heading}>Donor Details</span>
          <div className={classes.grid}>
            <Labeled label="Name">
              <TextField source="name" />
            </Labeled>
            <Labeled label="Phone Number">
              <TextField source="phone_number" />
            </Labeled>
            <Labeled label="District">
              <FunctionField
                render={(record) => {
                  if (record) {
                    return record.district
                      ? record.district
                      : record.other_district;
                  }
                }}
              />
            </Labeled>
            <Labeled label="Address">
              <TextField source="address" />
            </Labeled>
            <Labeled label="Pincode">
              <TextField source="pincode" />
            </Labeled>
            <Labeled label="Delivery">
              <FunctionField
                render={(record) => {
                  if (record) {
                    return record.district
                      ? getChoice(
                          config.deliveryTypeChoices,
                          record.delivery_mode
                        )?.name
                      : getChoice(
                          config.deliveryTypeChoices,
                          record.delivery_mode_outside_HP
                        )?.name;
                  }
                }}
              />
            </Labeled>
          </div>
          <span className={classes.heading}>Device Details</span>
          <div className={classes.grid}>
            <Labeled label="Company">
              <TextField source="device_company" />
            </Labeled>
            <Labeled label="Model">
              <FunctionField
                render={(record) => {
                  if (record) {
                    return record.device_model
                      ? record.device_model
                      : record.device_other_model;
                  }
                }}
              />
            </Labeled>
            <Labeled label="Screen Size">
              <TextField source="device_size" />
            </Labeled>
            <Labeled label="Condition">
              <TextField source="device_condition" />
            </Labeled>
            <Labeled label="Age (Years)">
              <TextField source="device_age" />
            </Labeled>
            <Labeled label="WhatsApp Function">
              <BooleanField source="wa_function" />
            </Labeled>
            <Labeled label="Call Function">
              <BooleanField source="call_function" />
            </Labeled>
            <Labeled label="YouTube Function">
              <BooleanField source="yt_function" />
            </Labeled>
            <Labeled label="Charger Avbl">
              <BooleanField source="charger_available" />
            </Labeled>
          </div>
          <CustomFormDataConsumer
            otpGenerated={otpGenerated}
            sendOtp={generateOtp}
          />
        </SimpleForm>
      </Edit>
    </div>
  );
};

export const DonateDeviceRequestShow = (props) => {
  const classes = useStyles();
  const [session] = useSession();

  const Title = ({ record }) => {
    return (
      <span>
        Show donor{" "}
        <span className={classes.grey}>#{record.device_tracking_key}</span>
      </span>
    );
  };

  return (
    <div>
      <Show title={<Title />} {...props} actions={false}>
        <>
          <BackButton history={props.history} />
          <TabbedShowLayout syncWithLocation={false}>
            <Tab label="Donor Details">
              <TextField label="Name" source="name" variant="outlined" />
              <TextField
                label="Phone Number"
                source="phone_number"
                variant="outlined"
              />
              <FunctionField
                label="District"
                render={(record) => {
                  if (record) {
                    return record.district
                      ? record.district
                      : record.other_district;
                  }
                }}
                variant="outlined"
              />
              <TextField
                label="Address"
                source="address"
                disabled
                variant="outlined"
              />
              <TextField
                label="Pincode"
                source="pincode"
                disabled
                variant="outlined"
              />
              <FunctionField
                label="Delivery"
                render={(record) => {
                  if (record) {
                    return record.district
                      ? getChoice(
                          config.deliveryTypeChoices,
                          record.delivery_mode
                        )?.name
                      : getChoice(
                          config.deliveryTypeChoices,
                          record.delivery_mode_outside_HP
                        )?.name;
                  }
                }}
                disabled
                variant="outlined"
              />
            </Tab>
            <Tab label="Device Details">
              <TextField label="Device Company" source="device_company" />
              <FunctionField
                label="Device Model"
                render={(record) => {
                  if (record) {
                    return record.device_model
                      ? record.device_model
                      : record.device_other_model;
                  }
                }}
              />
              <TextField label="Device Size" source="device_size" />
              <TextField label="Device Condition" source="device_condition" />
              <TextField label="Device Age" source="device_age" />
              <BooleanField source="wa_function" />
              <BooleanField source="call_function" />
              <BooleanField source="yt_function" />
              <BooleanField source="charger_available" />
            </Tab>
            <Tab label="Update Status">
              <FunctionField
                label="Delivery Staus"
                render={(record) =>
                  getChoice(config?.statusChoices, record.delivery_status)?.name
                }
              />
            </Tab>
            <Tab label="Recipient">
              <TextField
                label="School"
                className={classes.textInput}
                source="recipient_school_id"
              />
              <TextField
                label="Name"
                className={classes.textInput}
                source="recipient_name"
              />
              <TextField
                label="Grade"
                choices={config.gradeChoices}
                className={classes.selectInput}
                source="recipient_grade"
              />
              <TextField
                label="Student ID"
                className={classes.textInput}
                source="recipient_student_id"
                validate={[required(), maxLength(8)]}
              />
            </Tab>
            <Tab label="Verification">
              <TextField
                label="Verifier Name"
                className={classes.textInput}
                source="device_verification_record.verifier_name"
              />
              {/* <ImageInput
            label="Upload photo"
            className={classes.textInput}
            source="device_verification_record.photograph_url"
          >
            <ImageField source="photograph_url" />
          </ImageInput> */}
              <TextField
                label="Verifier's Phone Number"
                className={classes.textInput}
                source="device_verification_record.verifier_phone_number"
              />
              <BooleanField
                source="device_verification_record.declaration"
                label="Yes, I agree with the above declaration हां, मैं उपरोक्त घोषणा से सहमत हूं"
                className={classes.fullWidth}
              />
            </Tab>
          </TabbedShowLayout>
        </>
      </Show>
    </div>
  );
};
