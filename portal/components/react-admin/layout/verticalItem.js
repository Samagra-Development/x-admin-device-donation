import React, { createElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import SchoolIcon from '@material-ui/icons/School'

const useStyles = makeStyles((theme) => ({
  sidebarItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: '16px',
    marginBottom: '2.5ch'
  },
  listItem: {
    fontSize: '1.2rem',
    lineHeight: '1em',
    textAlign: 'center',
    fontVariant: 'all-small-caps',
    marginLeft: '1rem',
    fontWeight: '600',
    color: theme.palette.grey[300],
  },
  sidebarIcon: {
    color: '#626D74',
    fontSize: '1.2rem'
  }
}));

const Icon = (props) => {
  if(props.type === 'smartphone') return <SmartphoneIcon className={props.className} />
  if(props.type === 'school') return <SchoolIcon className={props.className} />
  return <></>
}


const VerticalItem = (props) => {
  const { item, nestedLevel, activePath } = props;
  const classes = useStyles({
    itemPadding: nestedLevel > 0 ? 30 + nestedLevel * 16 : 24,
  });
  const { onMenuClick } = props;

  let sidebarItemName = item.name;
  if (item.options !== undefined && item.options.label !== undefined) {
    sidebarItemName = item.options.label;
  }
  return (
    <div className={classes.sidebarItem}>
      <Icon className={classes.sidebarIcon} type={item.icon} />
      <Link to={item.url} className={classes.listItem}>
        {sidebarItemName}
      </Link>
    </div>
  );
};

export default VerticalItem;
