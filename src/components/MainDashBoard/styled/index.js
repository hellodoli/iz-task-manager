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
    pageBreakInside: 'avoid',
    padding: 0,
    position: 'relative',
    borderRadius: theme.typography.pxToRem(3),
    cursor: 'pointer',
    fontSize: theme.typography.pxToRem(14)
  },
  wrapperItemDetail: {
    display: 'flex',
    padding: `${theme.typography.pxToRem(10)} 0`,
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.text.secondary}`
  },
  wrapperItemContentBottom: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.typography.pxToRem(4)
  }
}));
