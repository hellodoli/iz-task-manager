import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const muiTaskGeneral = makeStyles((theme) => {
  const typo = theme.typography;
  const palette = theme.palette;
  const checkDisplay = (isExpand, section) => {
    if (section === null) return 'block';
    return isExpand ? 'block' : 'none';
  };
  return {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: palette.text.primary,
      '& .MuiFab-root': {
        textTransform: 'capitalize',
      },
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    subHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerMgBottom: {
      marginBottom: typo.pxToRem(24),
    },
    headerMgBottomL: {
      marginBottom: typo.pxToRem(50),
    },
    headerTitle: {
      fontSize: typo.pxToRem(20),
      fontWeight: typo.fontWeightBold,
    },
    section: {
      '& + $section': {
        marginTop: typo.pxToRem(20),
      },
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      fontSize: typo.pxToRem(14),
      fontWeight: typo.fontWeightBold,
      textTransform: 'capitalize',
      paddingBottom: '.5em',
      borderBottom: `1px solid ${palette.divider}`,
      '& + $sectionBody': {
        marginTop: '1rem',
      },
    },
    sectionBody: {
      display: ({ isExpand, section }) => checkDisplay(isExpand, section),
      paddingLeft: (props) => !props.isEmpty && '.5rem',
    },
    wrapperAllSection: {},
    wrapperWeekRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& .MuiPaper-root': {
        width: '100%',
      },
    },
    wrapperUpcomingAddTask: {
      display: 'flex',
      alignItems: 'center',
      padding: `${typo.pxToRem(15)}`,
      border: `2px solid ${palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      '& .MuiTypography-root': {
        marginRight: typo.pxToRem(10),
      },
    },
    wrapperIconExpand: {
      cursor: 'pointer',
    },
  };
});

export const muiTaskItem = makeStyles((theme) => {
  const pxToRem = theme.typography.pxToRem;
  const palette = theme.palette;
  return {
    wrapperItem: {
      position: 'relative',
      // fontSize: pxToRem(14),
      padding: `${pxToRem(12)} ${pxToRem(16)}`,
      paddingLeft: pxToRem(45),
      border: `1px solid ${palette.divider}`,
      borderRadius: pxToRem(4),
      overflow: 'hidden',
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginBottom: pxToRem(20),
      },
      '&:hover': {
        boxShadow: theme.shadows[2],
        '& > $wrapperHidden': {
          opacity: 1,
          visibility: 'visible',
        },
      },
    },
    wrapperItemEmpty: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    wrapperHidden: {
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    },
    wrapperItemActive: {
      boxShadow: theme.shadows[2],
      '& > $wrapperItemAction': {
        opacity: 1,
        visibility: 'visible',
      },
    },
    wrapperItemEdit: {
      width: '100%',
      fontSize: pxToRem(14),
      color: theme.palette.text.primary,
      '& .MuiTextField-root': {
        marginBottom: pxToRem(10),
      },
    },
    buttonEditGroup: {
      '& .MuiButton-root:not(:last-child)': {
        marginRight: pxToRem(10),
      },
    },
    wrapperItemAction: {
      position: 'absolute',
      top: pxToRem(12),
      right: pxToRem(16),
      '& .MuiIconButton-root': {
        color: theme.palette.text.primary,
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.25rem',
      },
    },
    wrapperItemDetail: {
      display: 'flex',
      // fontSize: pxToRem(14),
      color: theme.palette.text.primary,
    },
    wrapperItemContentBottom: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: pxToRem(4),
    },
    itemDes: {},
    itemDueDay: {
      fontSize: pxToRem(14),
      color: (props) => props.color,
    },
    dragHandle: {
      position: 'absolute',
      left: '5px',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '5px',
      cursor: 'move',
    },
  };
});

export const muiModal = makeStyles((theme) => {
  const palette = theme.palette;
  return {
    gutterTopBottom: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    dialogDeleteTitle: {},
    borderDialogTitle: {
      borderBottom: `1px solid ${palette.divider}`,
    },
    deleteButton: {
      backgroundColor: red[700],
      color: palette.common.white,
      '&:hover': {
        backgroundColor: red[700],
        color: palette.common.white,
      },
    },
    modalRoot: {
      '& .MuiDialogContent-root': {
        overflowY: 'initial',
      },
    },
  };
});

// Overriding styles with classes
export const muiMenuItemModal = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiSvgIcon-root + span': {
      marginLeft: theme.typography.pxToRem(10),
    },
  },
}));

export const muiSelectSchedule = makeStyles((theme) => {
  const typo = theme.typography;
  return {
    root: {
      display: 'flex',
      '& > span': {
        display: 'none',
        marginLeft: typo.pxToRem(8),
      },
      '& .MuiSvgIcon-root + span': {
        marginLeft: typo.pxToRem(10),
      },
    },
  };
});
