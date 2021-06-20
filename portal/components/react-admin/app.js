import { useState, useEffect } from "react";
import { Admin, ListGuesser, Resource } from 'react-admin';
import buildHasuraProvider from 'ra-data-hasura';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useSession } from "next-auth/client";
import customTheme from './theme';
import { DonateDeviceRequestList } from './base/resources/donate-device';

const App = () => {
    const [dataProvider, setDataProvider] = useState(null);
    const [session] = useSession();

    const authenticatedClient = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_HASURA_URL,
        cache: new InMemoryCache(),
        headers: {
          'Authorization': `Bearer ${session.jwt}`,
          'x-hasura-role': `${session.role}`
        },
      });
    console.log(customTheme);
    useEffect(() => {
        async function buildDataProvider() {                                  
            const hasuraProvider = await buildHasuraProvider({ client: authenticatedClient });
            setDataProvider(() => hasuraProvider);
        }
        buildDataProvider();
    }, [])

    if(!dataProvider) return null;
    return (<Admin theme={customTheme} dataProvider={dataProvider}>
        <Resource name={process.env.NEXT_PUBLIC_DONATE_DEVICE_ADMIN_PATH} list={DonateDeviceRequestList} />
    </Admin>
    );
}

export default App;