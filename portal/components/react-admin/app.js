import { useState, useEffect } from "react";
import { Admin, Resource } from 'react-admin';
import buildHasuraProvider from 'ra-data-hasura';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useSession } from "next-auth/client";
import { StudentList, StudentEdit } from './base/resources/Student';

const App = () => {
    const [dataProvider, setDataProvider] = useState(null);
    const [session] = useSession();

    const authenticatedClient = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_HASURA_URL,
        cache: new InMemoryCache(),
        headers: {
          'Authorization': `Bearer ${session.jwt}`,
        },
      });

    useEffect(() => {
        async function buildDataProvider() {                                  
            const hasuraProvider = await buildHasuraProvider({ client: authenticatedClient });
            setDataProvider(() => hasuraProvider);
        }
        buildDataProvider();
    }, [])
    if(!dataProvider) return null;
    return (<Admin dataProvider={dataProvider}>
        <Resource name="student" list={StudentList} edit={StudentEdit} />
    </Admin>
    );
}

export default App;