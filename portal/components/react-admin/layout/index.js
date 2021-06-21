import React from 'react';
import { connect } from 'react-redux';
import {
  getResources,
  Notification,
  Sidebar,
  setSidebarVisibility,
} from 'react-admin';
// import CustomSidebar from '../e/layout/side-navigation/navbarWrapperLayout';
import AppBar from './customAppBar';
// import { MapView } from "../fuse-base/components/dashboard";

const CustomLayout = (props) => {
  const { children, classes, logout, open, title } = props;
  return (
    <div>
      <div>
        <main>
          {/* <Sidebar>
            <CustomSidebar />
          </Sidebar> */}
          <div>
            <AppBar title={title} open={open} logout={logout} />
            <div>{children}</div>
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
  (CustomLayout)
);
