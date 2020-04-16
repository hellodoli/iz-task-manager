import { makeStyles } from '@material-ui/core/styles';

export const muiTaskGeneral = makeStyles(theme => ({
  wrapperHeader: {
    color: theme.palette.text.primary
  },
  wrapperHeaderTitle: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold
  }
}));

export const muiTaskItem = makeStyles(theme => ({
  wrapperItem: {
    position: 'relative',
    padding: 0,
    borderRadius: theme.typography.pxToRem(3),
    cursor: 'pointer'
  },
  wrapperItemDetail: {
    display: 'flex',
    padding: `${theme.typography.pxToRem(10)} 0`
  },
  wrapperItemContent: {}
}));
