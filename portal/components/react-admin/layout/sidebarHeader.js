import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sidebarHeader: {
    gridColumn: '1 / 2',
    gridRow: '1 / 2',
    height: '8vh',
    textAlign: 'center'
  },
  sidebarHeaderLogo: {
    marginTop: '1ch',
    [theme.breakpoints.down('sm')]: {     
      width: '25%',
      height: '7vh'      
    },
    [theme.breakpoints.up('sm')]: {
      width: '20%'
    },    
  }
}));
 

const UserNavbarHeader = () => {
  const classes = useStyles(); 
  return (    
        <div className={classes.sidebarHeader}>
          <img
            className={classes.sidebarHeaderLogo}          
            src='/govt_of_hp_logo.png'
            alt='logo'          
          />  
        </div>        
  );
};

export default UserNavbarHeader;
