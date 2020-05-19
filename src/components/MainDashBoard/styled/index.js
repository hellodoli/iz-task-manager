import { makeStyles } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';

export const muiTaskGeneral = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.text.primary,
    '& .MuiFab-root': {
      textTransform: 'initial'
    }
  },
  headerMgBottom: {
    marginBottom: theme.typography.pxToRem(24)
  },
  headerMgBottomL: {
    marginBottom: theme.typography.pxToRem(50)
  },
  headerTitle: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: 0
  },
  section: {
    '& + $section': {
      marginTop: theme.typography.pxToRem(20)
    },
    '& .MuiExpansionPanelDetails-root': {
      display: 'block'
    }
  },
  sectionHeader: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'capitalize'
  },
  wrapperAllSection: {},
  wrapperQuickAddTask: {
    '$wrapperAllSection + &': {
      marginTop: theme.typography.pxToRem(15)
    }
  }
}));

export const muiTaskItem = makeStyles(theme => {
  const pxToRem = theme.typography.pxToRem;
  return {
    wrapperItem: {
      position: 'relative',
      fontSize: pxToRem(14),
      padding: `${pxToRem(12)} ${pxToRem(16)}`,
      border: `1px solid ${grey[400]}`,
      borderRadius: pxToRem(4),
      pageBreakInside: 'avoid',
      cursor: 'pointer',
      '&:not(:last-child)': {
        marginBottom: pxToRem(20)
      },
      '&:hover': {
        boxShadow: theme.shadows[2],
        '& > $wrapperItemAction': {
          opacity: 1,
          visibility: 'visible'
        }
      }
    },
    wrapperItemActive: {
      boxShadow: theme.shadows[2],
      '& > $wrapperItemAction': {
        opacity: 1,
        visibility: 'visible'
      }
    },
    wrapperItemEdit: {
      width: '100%',
      fontSize: pxToRem(14),
      color: theme.palette.text.primary,
      '& .MuiTextField-root': {
        marginBottom: pxToRem(10)
      }
    },
    buttonEditGroup: {
      '& .MuiButton-root:not(:last-child)': {
        marginRight: pxToRem(10)
      }
    },
    wrapperItemAction: {
      position: 'absolute',
      top: pxToRem(12),
      right: pxToRem(16),
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 195ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      '& .MuiIconButton-root': {
        color: theme.palette.text.primary
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.25rem'
      }
    },
    wrapperItemDetail: {
      display: 'flex',
      fontSize: pxToRem(14),
      color: theme.palette.text.primary
    },
    wrapperItemContentBottom: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: pxToRem(4)
    },
    itemDueDay: {
      fontSize: pxToRem(12),
      color: props => props.color
    }
  };
});

export const muiModal = makeStyles(theme => {
  return {
    gutterTopBottom: {
      paddingTop: 0,
      paddingBottom: 0
    },
    dialogDeleteTitle: {},
    textOptionWithIcon: {
      marginLeft: theme.typography.pxToRem(10)
    },
    textOptionWithIconI: {
      fontWeight: theme.typography.fontWeightBold
    },
    borderDialogTitle: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    deleteButton: {
      backgroundColor: red[700],
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: red[700],
        color: theme.palette.common.white
      }
    }
  };
});

export const muiDateTimePicker = makeStyles(theme => {
  return {
    staticWrapperRoot: {}
  };
});
