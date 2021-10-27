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
  ImageInput,
  BooleanInput,
  Filter,
  SearchInput,
  useRedirect,
  useNotify,
  FormDataConsumer,
  AutocompleteInput,
  ReferenceInput,
  useMutation,
  required,
  maxLength,
  Toolbar,
  SaveButton,
  ReferenceManyField,
  Labeled,
  useRecordContext,
} from "react-admin";

import Image from "next/image";
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
import purple from "@material-ui/core/colors/purple";
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
    [theme.breakpoints.up("xs")]: {
      gridTemplateColumns: "1fr",
    },
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "1fr 1fr 1fr",
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
        label="Delivery Status"
        source="delivery_status"
        className={classes.filterSelect}
        choices={config.statusChoices}
      />
    </Filter>
  );
};

/**
 * Corporate Donors List
 * @param {*} props
 */
export const CorporateDevicesList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const classes = useStyles();
  const postRowClick = (id, basePath, record) =>
    record.device_verification_record ? "show" : "edit";
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title="Corporate Donors List"
      className={isSmall ? classes.smList : classes.list}
      sort={{ field: "id", order: "DESC" }}
      filters={<DevicesFilter />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          tertiaryText={(record) => record.device_tracking_key}
          linkType="edit"
        />
      ) : (
        <Datagrid rowClick={postRowClick}>
          <DateField label="Date" locales="en-IN" source="created_at" />
          <TextField
            label="Company Name"
            source="device_donation_corporate.company_name"
          />
          <TextField label="Name" source="device_donation_corporate.poc_name" />
          <TextField
            label="Email"
            source="device_donation_corporate.poc_email"
          />
          <TextField
            label="Phone Number"
            source="device_donation_corporate.poc_phone_number"
          />
          <TextField label="Tracking ID" source="device_tracking_key" />
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

export const CorporateDevicesEdit = (props) => {
  const classes = useStyles();
  const notify = useNotify();
  const redirect = useRedirect();
  const [session] = useSession();
  const [coreMutate] = useMutation();
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
      data: { file: newfile, name: file.name },
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
        const response = await sendSMS(
          message,
          templateId,
          data.device_donation_corporate?.poc_phone_number
        );
        if (response?.success) notify(response.success, "info");
        else if (response?.error) notify(response.error, "warning");
      }
      redirect("list", props.basePath, data.id, data);
    }
  };

  const validateForm = async (values) => {
    const errors = {};
    if (
      values.delivery_status &&
      values.delivery_status == "delivered-child" &&
      session.role === "school"
    ) {
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

  const mutate = async (type, resource, record) => {
    return coreMutate(
      {
        type: type,
        resource: resource,
        payload: record,
      },
      { returnPromise: true }
    );
  };

  const save = useCallback(
    async (values) => {
      try {
        if (session.role !== "school") {
          const response = await mutate("update", "corporate_donor_devices", {
            id: values.id,
            data: values,
          });
          const responseObject = response.data;
          onSuccess(responseObject);
        } else {
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
          const recordData = filtered(
            values,
            ["device_verification_record"],
            "except"
          );
          const response = await mutate("update", "corporate_donor_devices", {
            id: values.id,
            data: recordData,
          });
          const responseObject = response.data;
          if (
            verificationData.otp &&
            responseObject &&
            responseObject.delivery_status == "delivered-child"
          ) {
            let fileUrl = null;
            if (verificationData.photograph_url) {
              const { etag } = await fileUpload(
                verificationData.photograph_url?.rawFile
              );
              fileUrl = etag;
            }

            const record = {
              ...verificationData,
              udise: session.username,
              transaction_id: uuidv4(),
              device_tracking_key_corporate: responseObject.device_tracking_key,
              photograph_url: fileUrl,
            };
            const response = await mutate(
              "create",
              "device_verification_records",
              { data: record }
            );
            setOtpGenerated(false);
          }
          onSuccess(responseObject);
        }
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
        Edit Corporate Donor{" "}
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
          <span className={classes.heading}>Corporate Details</span>
          <div className={classes.grid}>
            <Labeled label="Company Name">
              <TextField source="device_donation_corporate.company_name" />
            </Labeled>
            <Labeled label="Name">
              <TextField source="device_donation_corporate.poc_name" />
            </Labeled>
            <Labeled label="Phone Number">
              <TextField source="device_donation_corporate.poc_phone_number" />
            </Labeled>
          </div>
          <div className={classes.grid}>
            <Labeled label="Designation">
              <TextField source="device_donation_corporate.poc_designation" />
            </Labeled>
            <Labeled label="Tracking ID">
              <TextField source="device_tracking_key" />
            </Labeled>
            <Labeled label="Date">
              <DateField locales="en-IN" source="created_at" />
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

export const CorporateDevicesShow = (props) => {
  const classes = useStyles();
  const [session] = useSession();
  const [image, setImage] = useState(null);

  const ImageField = (props) => {
    const { source, label } = props;
    const record = useRecordContext(props);
    getImage(record.device_verification_record.photograph_url);
    const myLoader = ({ src }) => image;
    return (
      <div>
        {image ? (
          <Labeled label={label}>
            <a href={image} target="_blank" rel="noopener noreferrer">
              <Image
                loader={myLoader}
                width="100"
                height="100"
                src={image}
                alt={label}
              />
            </a>
          </Labeled>
        ) : (
          <>
            <Labeled label={label} />
          </>
        )}{" "}
      </div>
    );
  };

  const getImage = (name) => {
    if (name && !image) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/fileUpload?name=${name}`)
        .then((re) => setImage(re.data?.url));
    }
  };

  const Title = ({ record }) => {
    return (
      <span>
        Show Corporate Donor{" "}
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
            <Tab label="Corporate Details">
              <TextField
                label="Company Name"
                source="device_donation_corporate.company_name"
                disabled
                variant="outlined"
              />
              <TextField
                label="Name"
                source="device_donation_corporate.poc_name"
                disabled
                variant="outlined"
              />
              <TextField
                label="Phone Number"
                source="device_donation_corporate.poc_phone_number"
                disabled
                variant="outlined"
              />
              <TextField
                label="Designation"
                source="device_donation_corporate.poc_designation"
                disabled
                variant="outlined"
              />
              <TextField
                label="Tracking ID"
                source="device_tracking_key"
                disabled
                variant="outlined"
              />
              <DateField label="Date" locales="en-IN" source="created_at" />
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
              <ImageField
                label="Upload photo"
                source="device_verification_record.photograph_url"
              />
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
