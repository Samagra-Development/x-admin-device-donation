import React from 'react';
import {
  List,  
  SimpleList,
  Datagrid,
  TextField,
  BooleanField,
  FunctionField,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  Filter,
  SearchInput
} from 'react-admin';


import { Typography, makeStyles, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  searchBar: {   
    '& > div': {    
      fontSize: '1rem'
    }
  },
  smSearchBar: {
    '& > div': {
      fontSize: '1.2rem',
    }
  },
  smList: {
    margin: '0rem 2rem',    
    '& > div': {
      paddingLeft: 0,
      '& > :last-child': {        
          boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'        
      }
    }
  },
  list: {
    margin: '0rem 2rem'
  },
  filter: {
    paddingLeft: 0
  },
}));


const DevicesFilter = (props) => {
  const classes = useStyles();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (<Filter {...props} className={classes.filter}>
    <SearchInput
      placeholder='Search by Tracking ID'
      source='device_tracking_key'     
      className={isSmall ? classes.smSearchBar : classes.searchBar}
      alwaysOn
    />
  </Filter>
  )
};

/**
 * Donate Device Request List
 * @param {*} props
 */
export const DonateDeviceRequestList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));  
  const classes = useStyles();
  return (
    <List
      {...props}          
      bulkActionButtons={false}
      title='Donation Request List'
      className={isSmall ? classes.smList : classes.list}
      filters={<DevicesFilter />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => (record.district)}
          tertiaryText={(record) => record.device_tracking_key}         
          linkType='edit'
        />
      ) : (
        <Datagrid rowClick='edit'>
          <TextField label='Name' source='name' />          
          <TextField label='Phone Number' source='phone_number' />    
          <TextField label='District' source='district' />          
          <TextField label='Tracking ID' source='device_tracking_key' />                        
          <FunctionField label='Delivery Mode'  render={(record) => record.delivery_mode ? record.delivery_mode : record.delivery_mode_outside_HP}/>   
          <BooleanField label='Call Function' source='call_function' />  
          <BooleanField label='WA Function' source='wa_function' />   
          <BooleanField label='YT Function' source='yt_function' />   
        </Datagrid>
      )}
    </List>
  );
};

export const DonateDeviceRequestEdit = (props) => {
  return (
  <div>
  <Edit {...props} title='Edit Donation Details'>
    <SimpleForm>
      <TextInput label='Name' source='name' disabled variant='outlined' />
      <TextInput label='Last Name' source='lastName' variant='outlined' />
      <TextInput label='Phone Number' source='phone_number' disabled />    
      <TextInput label='District' source='district' disabled />                    
      <BooleanInput label='Call Function' source='call_function' disabled />      
      <BooleanInput label='Received' source='is_device_received' />
      <BooleanInput label='Delivered' source='is_device_delivered' />
    </SimpleForm>
  </Edit>
</div>)
};
