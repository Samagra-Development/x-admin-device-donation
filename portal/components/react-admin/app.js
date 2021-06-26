import { useState, useEffect } from "react";
import { Admin, Resource } from "react-admin";
import buildHasuraProvider, { buildFields } from "ra-data-hasura";
import gql from "graphql-tag";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useSession } from "next-auth/client";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import customTheme from "./theme";
import customLayout from "./layout/";
import customFields from "./customHasura/customFields";
import customVariables from "./customHasura/customVariables";
import {
  DonateDeviceRequestList,
  DonateDeviceRequestEdit,
} from "./base/resources/donate-device";
import {
  RequestDeviceList,
  RequestDeviceEdit,
} from "./base/resources/request-device";

const App = () => {
  const [dataProvider, setDataProvider] = useState(null);
  const [session] = useSession();

  useEffect(() => {
    const authenticatedClient = new ApolloClient({
      uri: process.env.NEXT_PUBLIC_HASURA_URL,
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${session.jwt}`,
        "x-hasura-role": `${session.role}`,
      },
    });
    async function buildDataProvider() {
      const hasuraProvider = await buildHasuraProvider(
        { client: authenticatedClient },
        {
          buildFields: customFields,
        },
        customVariables
      );
      setDataProvider(() => hasuraProvider);
    }
    buildDataProvider();
  }, [session]);

  if (!dataProvider) return null;
  return (
    <MuiThemeProvider theme={createMuiTheme(customTheme)}>
      <Admin
        disableTelemetry
        loginPage={false}
        layout={customLayout}
        dataProvider={dataProvider}
      >
        <Resource
          name={process.env.NEXT_PUBLIC_DONATE_DEVICE_ADMIN_PATH}
          list={DonateDeviceRequestList}
          edit={DonateDeviceRequestEdit}
        />
        <Resource
          name={process.env.NEXT_PUBLIC_REQUEST_DEVICE_ADMIN_PATH}
          list={RequestDeviceList}
          edit={RequestDeviceEdit}
        />
        <Resource name="school" />
      </Admin>
    </MuiThemeProvider>
  );
};

export default App;
