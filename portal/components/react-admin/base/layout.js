import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getResources,
  Notification,
  Sidebar,
  setSidebarVisibility,
} from 'react-admin';
import CustomSidebar from '../e/layout/side-navigation/navbarWrapperLayout';
import AppBarCustom from '../fuse-base/components/material-ui/app-bar/appbar.custom';
// import { MapView } from "../fuse-base/components/dashboard";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
  },
  appFrame: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
  },
  contentWithSidebar: {
    display: 'flex',
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    flexGrow: 2,
    padding: 0,
  },
  innerContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 2,
    padding: theme.spacing.unit * 3,
    paddingLeft: 5,
  },
});

const CustomLayout = (props) => {
  const { children, classes, logout, open, title } = props;
  return (
    <div className={classes.root}>
      <div className={classes.appFrame}>
        <main className={classes.contentWithSidebar}>
          <Sidebar>
            <CustomSidebar />
          </Sidebar>
          <div className={classes.content}>
            <AppBarCustom title={title} open={open} logout={logout} />
            <div className={classes.innerContent}>{children}</div>
          </div>
        </main>
        <Notification />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.admin.loading > 0,
  resources: getResources(state),
});
export default connect(mapStateToProps, { setSidebarVisibility })(
  withStyles(styles)(CustomLayout)
);
