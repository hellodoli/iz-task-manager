import { makeStyles } from '@material-ui/core/styles';
import { blue, green, purple } from '@material-ui/core/colors';

function checkColorIcons(name) {
  let typeIcon = purple[500];
  if (name === 'today') {
    typeIcon = blue[500];
  } else if (name === 'other') {
    typeIcon = green[500];
  }
  return typeIcon;
}

export const muiFilterMenu = makeStyles(theme => ({
  wrapperFilterMenuLeft: {
    margin: 0,
    padding: 0,
    '& > li': {
      listStyle: 'none',
      '& > a': {
        display: 'flex',
        alignItems: 'center',
        //fontSize: '.875rem',
        fontWeight: 400,
        color: theme.palette.text.primary,
        minHeight: '24px',
        padding: '.5rem',
        paddingRight: '1rem',
        borderRadius: '.15rem',
        '&.selected': {
          fontWeight: theme.typography.fontWeightBold
        }
      }
    }
  }
}));

export const muiFilterMenuIcon = makeStyles(theme => ({
  wrapperIcon: {
    marginRight: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    color: props => checkColorIcons(props.name)
  }
}));
