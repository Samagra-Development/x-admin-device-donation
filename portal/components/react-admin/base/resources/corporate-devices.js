import React from "react";
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
  TextInput,
  SelectInput,
  Filter,
  SearchInput,
  useRedirect,
  useNotify,
  FormDataConsumer,
  AutocompleteInput,
  ReferenceInput,
  ReferenceField
} from "react-admin";

import { useSession } from "next-auth/client";
import { Typography, makeStyles, useMediaQuery } from "@material-ui/core";
import EditNoDeleteToolbar from "../components/EditNoDeleteToolbar";
import BackButton from "../components/BackButton";
import blueGrey from "@material-ui/core/colors/blueGrey";
import config from "@/components/config";
import sendSMS from "@/utils/sendSMS";
import buildGupshup from "@/utils/buildGupshup";

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
        placeholder="Tracking key"
        source="device_tracking_key"
        className={isSmall ? classes.smSearchBar : classes.searchBar}
        alwaysOn
      />
    </Filter>
  );
};

/**
 * Corporate Devices List
 * @param {*} props
 */
export const CorporateDevicesList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title="CorporateDevices list"
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
        <Datagrid rowClick="edit">
          <TextField label="Company Name" source="device_donation_corporate.company_name" />
          <TextField label="Name" source="device_donation_corporate.poc_name" />
          <TextField label="Email" source="device_donation_corporate.poc_email" />
          <TextField label="Phone Number" source="device_donation_corporate.poc_phone_number" />
          <TextField label="Tracking key" source="device_tracking_key" />
          <TextField label="Delivery status" source="delivery_status" />
          <DateField label="Date" locales="en-IN" source="created_at" />
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

  const getTemplateFromDeliveryStatus = (status) => {
    const obj = config.statusChoices.find((elem) => elem.id === status);
    return [obj?.template, obj?.templateId, obj?.variables];
  };

  const onSuccess = async ({ data }) => {
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
        redirect("list", props.basePath, data.id, data);
      }
    }
  };

  const Title = ({ record }) => {
    return (
      <span>
        Edit Corporate Devices{" "}
        <span className={classes.grey}>#{record.device_tracking_key}</span>
      </span>
    );
  };
  return (
    <div>
      <Edit
        onSuccess={onSuccess}
        mutationMode={"pessimistic"}
        title={<Title />}
        {...props}
      >
        <SimpleForm toolbar={<EditNoDeleteToolbar />}>
          <BackButton history={props.history} />
          <span className={classes.heading}>Corporate Details</span>
          <div className={classes.grid}>
            <td>Company Name</td>
            <td>Tracking key</td>
            <td>Phone Number</td>
            <ReferenceInput source="corporate_id" reference="device_donation_corporates">
                <SelectInput optionText="company_name" />
            </ReferenceInput>
            <TextField label="Tracking key" source="device_tracking_key" disabled variant="outlined" />
            <SelectInput
              source="delivery_status"
              choices={config.statusChoices}
              label="Delivery Status"
              disabled={!(session.role || session.applicationId === process.env.NEXT_PUBLIC_FUSIONAUTH_SCHOOL_APP_ID)}
            />
            <FormDataConsumer>
              {({ formData, ...rest }) =>
                formData?.delivery_status === "delivered-child" ? (
                  <>
                    <h2 className={classes.heading}>Recipient</h2>
                    <div className={!session.role ? classes.grid : null}>
                      <ReferenceInput
                        reference="school"
                        label="School"
                        source="recipient_school_id"
                        className={classes.fullWidth}
                        filterToQuery={(searchText) => ({
                          "name@_ilike": searchText,
                        })}
                      >
                        <AutocompleteInput
                          optionValue="id"
                          optionText="name"
                          disabled={!session.role}
                          {...rest}
                        />
                      </ReferenceInput>
                      {!session.role ? (
                        <>
                          <TextInput
                            label="Name"
                            className={classes.textInput}
                            source="recipient_name"
                          />
                          <SelectInput
                            label="Grade"
                            choices={config.gradeChoices}
                            className={classes.selectInput}
                            source="recipient_grade"
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )
              }
            </FormDataConsumer>
          </div>
        </SimpleForm>
      </Edit>
    </div>
  );
};