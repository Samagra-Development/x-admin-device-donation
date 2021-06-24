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
  SelectInput,
  NullableBooleanInput,
  Filter,
  SearchInput
} from 'react-admin';


import { Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import EditNoDeleteToolbar from '../components/EditNoDeleteToolbar';
import BackButton from '../components/BackButton';
import blueGrey from '@material-ui/core/colors/blueGrey';
import config from '@/components/config';

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
    margin: '1rem 4rem',    
    '& > div': {
      paddingLeft: 0, 
      backgroundColor: 'unset',
      '&:first-child > div': {
        backgroundColor: 'unset'
      },    
      '&:last-child > div': {
        backgroundColor: '#FFF',           
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
  grid: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridRowGap: '1ch',
    gridColumnGap: '1ch',
    margin: '1rem 0',    
    '& > td': theme.overrides.MuiTableCell.head,
    '& > span': {
      fontSize: '1.1rem'
    }
  },    
  fullWidthGrid: {
    gridTemplateColumns: '1fr',
    margin: '0 auto',
  },
  heading: {    
    fontSize: '1.4rem',
    lineHeight: '0.5rem',
    fontWeight: 700,
    fontVariant: 'all-small-caps'
  },
  select: {
    width: '30vw',
    alignSelf: 'center',
    '& > div > div': {
      fontSize: '1.1rem'
    }
  },
  warning: {
    margin: '0',
    padding: '0',
    paddingBottom: '1rem',
    textAlign: 'center',
    width: '100%',
    fontStyle: 'oblique'
  },
  grey: {
    color: blueGrey[300],
  }
}));

const DevicesFilter = (props) => {
  const classes = useStyles();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (<Filter {...props} className={classes.filter}>
    <SearchInput
      placeholder='Tracking ID'
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
      title='Donors list'
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
          <FunctionField label='District' render={(record) => 
            { if(record) {
              return record.district ? record.district : record.other_district
            }
          }}/>
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
  const classes = useStyles();  
  const Title = ({ record }) => {
    return (
      <span>Edit donor <span className={classes.grey}>#{record.device_tracking_key}</span></span>)
      ;
  }
  return (
  <div>
  <Edit {...props} title={<Title/>}>
    <SimpleForm toolbar={<EditNoDeleteToolbar />}>
      <BackButton history={props.history} />
      <span className={classes.heading}>Donor Details</span>
      <div className={classes.grid}>        
        <td>Name</td>
        <td>Phone Number</td>
        <td>State/UT</td>  
        <TextField label='Name' source='name' disabled variant='outlined' />      
        <TextField label='Phone Number' source='phone_number' disabled variant='outlined'/>   
        <TextField label='State/UT' source='state_ut' disabled variant='outlined'/> 
        <td>District</td>
        <td>Address</td>
        <td>Pincode</td>  
        <FunctionField label='District' render={(record) => 
          { if(record) {
            return record.district ? record.district : record.other_district
          }
        }}
        disabled variant='outlined'/>
        <TextField label='Address' source='address' disabled variant='outlined' />   
      </div>            
      <span className={classes.heading}>Device Details</span>                  
      <div className={classes.grid}>      
        <td>Company</td>
        <td>Model</td>
        <td>Screen Size</td>    
        <TextField label='Device Company' source='device_company' />   
        <FunctionField label='Device Model' render={(record) => 
          { if(record) {
            return record.device_model ? record.device_model : record.device_other_model
          }
        }}/> 
        <TextField label='Device Size' source='device_size'/> 
        <td>Condition</td>
        <td>Age (Years)</td>
        <td>WA Function</td>
        
        <TextField label='Device Condition' source='device_condition'/>           
        <TextField label='Device Age' source='device_age'/>
        <BooleanField source='wa_function' />
        <td>Call Function</td>
        <td>YT Function</td>   
        <td>Charger Avbl</td>
        <BooleanField source='call_function'/>   
        <BooleanField source='yt_function' />
        <BooleanField source='charger_available'/>                 
      </div>
      <span className={classes.heading}>Update Status</span>
      <div className={`${classes.grid} ${classes.fullWidthGrid} ${classes.select}`}>
        <SelectInput source='delivery_status' choices={config.statusChoices} label='Delivery Status' />
        <NullableBooleanInput source='is_device_delivered' />
      </div>
      <p className={classes.warning}>Changing status will trigger an SMS notification to the donor upon saving.</p>
    </SimpleForm>
  </Edit>
</div>)
};
