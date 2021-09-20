import React from "react";
import {
  TextInput,
  SelectInput,
  ImageField,
  BooleanInput,
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
} from "react-admin";
import { useSession } from "next-auth/client";

import { makeStyles, Button } from "@material-ui/core";
import blueGrey from "@material-ui/core/colors/blueGrey";
import config from "@/components/config";

const useStyles = makeStyles((theme) => ({
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

export default function CustomFormDataConsumer({ otpGenerated, sendOtp }) {
  const classes = useStyles();
  const [session] = useSession();
  return (
    <FormDataConsumer>
      {({ formData, ...rest }) => {
        let { device_verification_record, delivery_status } = formData;
        let verified =
          device_verification_record && device_verification_record.udise
            ? false
            : true;
        return (
          <>
            <span className={classes.heading}>Update Status</span>
            <div className={`${classes.grid} ${classes.fullWidthGrid}`}>
              <SelectInput
                source="delivery_status"
                choices={config.statusChoices}
                label="Delivery Status"
                disabled={
                  !(
                    session.role !== "school" ||
                    (session.applicationId ===
                      process.env.NEXT_PUBLIC_FUSIONAUTH_SCHOOL_APP_ID &&
                      verified)
                  )
                }
              />
              {delivery_status && delivery_status === "delivered-child" ? (
                <>
                  <h2 className={classes.heading}>Recipient</h2>
                  <div
                    className={session.role === "school" ? classes.grid : null}
                  >
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
                        disabled={session.role === "school"}
                        {...rest}
                      />
                    </ReferenceInput>
                    {/* Visible if session does not have role  */}
                    {session.role === "school" ? (
                      <>
                        <TextInput
                          label="Name"
                          className={classes.textInput}
                          source="recipient_name"
                          disabled={!verified}
                        />
                        <SelectInput
                          label="Grade"
                          choices={config.gradeChoices}
                          className={classes.selectInput}
                          source="recipient_grade"
                          disabled={!verified}
                        />
                        <TextInput
                          label="Student ID"
                          className={classes.textInput}
                          source="student_id"
                          validate={[required(), maxLength(8)]}
                          disabled={!verified}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <h2 className={classes.heading}>Verification</h2>
                  <div
                    className={session.role === "school" ? classes.grid : null}
                  >
                    <TextInput
                      label="Verifier Name"
                      className={classes.textInput}
                      source="device_verification_record.verifier_name"
                      disabled={!verified}
                    />
                    {/* <ImageInput
                  label="Upload photo"
                  className={classes.textInput}
                  source="device_verification_record.photograph_url"
                >
                  <ImageField source="photograph_url" />
                </ImageInput> */}
                    {verified ? (
                      <>
                        <TextInput
                          label="Verifier's Phone Number"
                          className={classes.textInput}
                          source="device_verification_record.verifier_phone_number"
                          InputProps={{
                            endAdornment: (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  sendOtp(
                                    device_verification_record?.verifier_phone_number
                                  )
                                }
                              >
                                Get OTP
                              </Button>
                            ),
                          }}
                        />
                        <TextInput
                          label="Enter OTP"
                          className={classes.textInput}
                          source="device_verification_record.otp"
                          disabled={!otpGenerated}
                        />
                        <BooleanInput
                          source="device_verification_record.declaration"
                          label="Yes, I agree with the above declaration हां, मैं उपरोक्त घोषणा से सहमत हूं"
                          className={classes.fullWidth}
                        />
                      </>
                    ) : (
                      <>
                        <TextInput
                          label="Verifier's Phone Number"
                          className={classes.textInput}
                          source="device_verification_record.verifier_phone_number"
                          disabled={!verified}
                        />
                      </>
                    )}
                  </div>
                  {verified ? (
                    <p className={classes.warning}>
                      Changing status will trigger an SMS notification to the
                      donor upon saving.
                    </p>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </>
        );
      }}
    </FormDataConsumer>
  );
}
