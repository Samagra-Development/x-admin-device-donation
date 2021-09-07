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
 * Device verifications List
 * @param {*} props
 */
export const DeviceVerificationList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <List
      {...props}
      bulkActionButtons={false}
      title="Device verifications List"
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
          <DateField label="Date" locales="en-IN" source="created_at" />
          <TextField label="Verifier name" source="verifier_name" />
          <TextField label="declaration" source="declaration" />
          <TextField label="Tracking ID" source="device_tracking_key" />
        </Datagrid>
      )}
    </List>
  );
};

export const DeviceVerificationEdit = (props) => {
  const classes = useStyles();

  const Title = ({ record }) => {
    return (
      <span>
        Edit device verification{" "}
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
      >
        <SimpleForm toolbar={<EditNoDeleteToolbar />}>
          <BackButton history={props.history} />
          <span className={classes.heading}>Details</span>
          <div className={classes.grid}>
            <td>Verifier name</td>
            <td>declaration</td>
            <td>Tracking ID</td>
            <TextField label="Verifier name" source="verifier_name" />
            <TextField label="declaration" source="declaration" />
            <TextField label="Tracking ID" source="device_tracking_key" />
          </div>
          <div className={`${classes.grid} ${classes.fullWidthGrid}`}>
            <td>Date</td>
            <DateField label="Date" locales="en-IN" source="created_at" />
          </div>
        </SimpleForm>
      </Edit>
    </div>
  );
};
