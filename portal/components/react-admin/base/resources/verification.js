import React, { useState } from "react";
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
  Filter,
  SearchInput,
  FormDataConsumer,
  Labeled,
  useRecordContext,
} from "react-admin";

import { makeStyles, useMediaQuery } from "@material-ui/core";
import EditNoDeleteToolbar from "../components/EditNoDeleteToolbar";
import BackButton from "../components/BackButton";
import blueGrey from "@material-ui/core/colors/blueGrey";
import axios from "axios";
import Image from "next/image";

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
      fontSize: "1rem",
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
        placeholder="Verifier name"
        source="verifier_name"
        className={isSmall ? classes.smSearchBar : classes.searchBar}
        alwaysOn
      />
      <TextInput
        className={classes.textInput}
        label="Verifier Phone Number"
        source="verifier_phone_number"
      />
      {/* <SelectInput
        label="Delivery Status"
        source="delivery_status"
        className={classes.filterSelect}
        choices={config.statusChoices}
      /> */}
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
          tertiaryText={(record) =>
            record.device_tracking_key_individual ??
            record.device_tracking_key_corporate
          }
          linkType="edit"
        />
      ) : (
        <Datagrid rowClick="edit">
          <DateField label="Date" locales="en-IN" source="created_at" />
          <TextField label="Verifier name" source="verifier_name" />
          <TextField
            label="Verifier Phone Number"
            source="verifier_phone_number"
          />
          <BooleanField label="declaration" source="declaration" />
          <FunctionField
            label="Tracking ID"
            render={(record) => {
              if (record) {
                return record.device_tracking_key_individual
                  ? record.device_tracking_key_individual
                  : record.device_tracking_key_corporate;
              }
            }}
          />
        </Datagrid>
      )}
    </List>
  );
};

export const DeviceVerificationEdit = (props) => {
  const classes = useStyles();
  const [image, setImage] = useState(null);

  const ImageField = (props) => {
    const { source, label } = props;
    const record = useRecordContext(props);
    new getImage(record.photograph_url);
    const myLoader = ({ src }) => image;
    return (
      <div>
        {image ? (
          <Labeled label={label}>
            <a href={image ?? "/"} target="_blank" rel="noopener noreferrer">
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

  function getImage(name) {
    if (name && !image) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/fileUpload?name=${name}`)
        .then((re) => setImage(re.data?.url));
    }
  }

  const Title = ({ record }) => {
    return (
      <span>
        Edit device verification{" "}
        <span className={classes.grey}>
          #
          {record.device_tracking_key_individual ??
            record.device_tracking_key_corporate}
        </span>
      </span>
    );
  };
  return (
    <div>
      <Edit mutationMode={"pessimistic"} title={<Title />} {...props}>
        <SimpleForm toolbar={<EditNoDeleteToolbar />}>
          <BackButton history={props.history} />
          <span className={classes.heading}>Details</span>
          <div className={classes.grid}>
            <Labeled label="Verifier name">
              <TextField source="verifier_name" />
            </Labeled>
            <ImageField label="Upload photo" source="photograph_url" />
            <Labeled label="Verifier Phone Number">
              <TextField source="verifier_phone_number" />
            </Labeled>
            <Labeled label="Declaration">
              <TextField source="declaration" />
            </Labeled>
          </div>
          <div className={`${classes.grid}`}>
            <Labeled label="Tracking ID">
              <FormDataConsumer>
                {({ formData, ...rest }) =>
                  formData?.device_tracking_key_individual ? (
                    <TextField source="device_tracking_key_individual" />
                  ) : (
                    <TextField source="device_tracking_key_corporate" />
                  )
                }
              </FormDataConsumer>
            </Labeled>
            <Labeled label="Date">
              <DateField locales="en-IN" source="created_at" />
            </Labeled>
          </div>
        </SimpleForm>
      </Edit>
    </div>
  );
};
