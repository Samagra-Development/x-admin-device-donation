import React from 'react';
import {
  List,  
  SimpleList,
  Datagrid,
  TextField,
  BooleanField,
  FunctionField
} from 'react-admin';


import { Typography, makeStyles, useMediaQuery } from '@material-ui/core';

/**
 * Donate Device Request List
 * @param {*} props
 */
export const DonateDeviceRequestList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));  
  return (
    <List
      {...props}          
      bulkActionButtons={false}
      title='Donation Request List'
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => (record.district)}
          tertiaryText={(record) => record.address}          
          linkType='edit'
        />
      ) : (
        <Datagrid rowClick='edit'>
          <TextField label='Name' source='name' />          
          <TextField label='Phone Number' source='phone_number' />    
          <TextField label='District' source='district' />                    
          <BooleanField label='Call Function' source='call_function' />      
          <FunctionField label='Delivery Mode'  render={(record) => record.delivery_mode ? record.delivery_mode : record.delivery_mode_outside_HP}/>    
        </Datagrid>
      )}
    </List>
  );
};
