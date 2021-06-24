import React from 'react';
import { Toolbar, SaveButton } from 'react-admin';

const EditNoDeleteToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

export default EditNoDeleteToolbar;
