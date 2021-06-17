import * as React from "react";

import { Admin, Resource, ListGuesser } from 'react-admin';
import lb4Provider from "ra-data-lb4";
import styles from '../../styles/Home.module.css'


const dataProvider = lb4Provider();


const App = () => { 
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="" list={ListGuesser} />
    </Admin>
);
}


export default App;