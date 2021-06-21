import { useState, useEffect } from "react";
import { Admin, ListGuesser, Resource } from 'react-admin';
import buildHasuraProvider from 'ra-data-hasura';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useSession } from "next-auth/client";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import customTheme from "./theme";
import customLayout from "./layout/";
import { DonateDeviceRequestList, DonateDeviceRequestEdit } from './base/resources/donate-device';

const App = () => {
    const [dataProvider, setDataProvider] = useState(null);
    const [session] = useSession();

 
    useEffect(() => {
        const authenticatedClient = new ApolloClient({
            uri: process.env.NEXT_PUBLIC_HASURA_URL,
            cache: new InMemoryCache(),
            headers: {
              'Authorization': `Bearer ${session.jwt}`,
              'x-hasura-role': `${session.role}`
            },
          });    
        async function buildDataProvider() {                                  
            const hasuraProvider = await buildHasuraProvider({ client: authenticatedClient });
            setDataProvider(() => hasuraProvider);
        }
        buildDataProvider();
    }, [session]);

    if(!dataProvider) return null;    
    return (
        <MuiThemeProvider theme={createMuiTheme(customTheme)}>
            <Admin disableTelemetry loginPage={false} layout={customLayout} dataProvider={dataProvider}            
            >
                <Resource name={process.env.NEXT_PUBLIC_DONATE_DEVICE_ADMIN_PATH} 
                    list={DonateDeviceRequestList} 
                    edit={DonateDeviceRequestEdit}
                />
            </Admin>
        </MuiThemeProvider>
    );
}

export default App;