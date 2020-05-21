import { createMuiTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';

export const muiTaskGeneral = makeStyles(theme => {
  const typo = theme.typography;
  const palette = theme.palette;
  return {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: palette.text.primary,
      '& .MuiFab-root': {
        textTransform: 'initial'
      }
    },
    headerMgBottom: {
      marginBottom: typo.pxToRem(24)
    },
    headerMgBottomL: {
      marginBottom: typo.pxToRem(50)
    },
    headerTitle: {
      fontSize: typo.pxToRem(20),
      fontWeight: typo.fontWeightBold,
      marginBottom: 0
    },
    section: {
      '& + $section': {
        marginTop: typo.pxToRem(20)
      },
      '& .MuiExpansionPanelDetails-root': {
        display: 'block'
      }
    },
    sectionHeader: {
      fontSize: typo.pxToRem(14),
      fontWeight: typo.fontWeightBold,
      textTransform: 'capitalize'
    },
    wrapperAllSection: {},
    wrapperQuickAddTask: {
      '$wrapperAllSection + &': {
        marginTop: typo.pxToRem(15)
      }
    },
    todayButton: {
      marginLeft: typo.pxToRem(10)
    },
    wrapperWeekRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& .MuiPaper-root': {
        width: '100%'
      }
    },
    wrapperUpcomingAddTask: {
      display: 'flex',
      alignItems: 'center',
      padding: `${typo.pxToRem(15)}`,
      border: `2px solid ${palette.primary.main}`,
      borderRadius: theme.shape.borderRadius,
      '& .MuiTypography-root': {
        marginRight: typo.pxToRem(10)
      }
    }
  };
});

export const muiTaskItem = makeStyles(theme => {
  const pxToRem = theme.typography.pxToRem;
  return {
    wrapperItem: {
      position: 'relative',
      // fontSize: pxToRem(14),
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
      // fontSize: pxToRem(14),
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
  const typo = theme.typography;
  const palette = theme.palette;
  return {
    gutterTopBottom: {
      paddingTop: 0,
      paddingBottom: 0
    },
    dialogDeleteTitle: {},
    textOptionWithIcon: {
      marginLeft: typo.pxToRem(10)
    },
    textOptionWithIconI: {
      fontWeight: typo.fontWeightBold
    },
    borderDialogTitle: {
      borderBottom: `1px solid ${palette.divider}`
    },
    deleteButton: {
      backgroundColor: red[700],
      color: palette.common.white,
      '&:hover': {
        backgroundColor: red[700],
        color: palette.common.white
      }
    }
  };
});

// Overriding styles with classes

export const muiMenuItemModal = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiSvgIcon-root + span': {
      marginLeft: theme.typography.pxToRem(10)
    }
  }
}));

export const muiSelectSchedule = makeStyles(theme => {
  const typo = theme.typography;
  return {
    root: {
      display: 'flex',
      '& > span': {
        display: 'none',
        marginLeft: typo.pxToRem(8)
      },
      '& .MuiSvgIcon-root + span': {
        marginLeft: typo.pxToRem(10)
      }
    }
  };
});

// Overriding styles with createMuiTheme
export const muiDateTimePicker = createMuiTheme({
  overrides: {
    /*MuiTypography: {
      h4: {
        fontSize: '1.5rem'
      },
      subtitle1: {
        fontSize: '0.75rem'
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        height: '80px'
      }
    },*/
    MuiPickersBasePicker: {
      pickerView: {
        width: '100%',
        margin: '0 auto',
        maxWidth: 'initial'
      }
    },
    MuiPickersDay: {
      /*day: {
        width: '40px',
        height: '40px'
      }*/
    }
    /*MuiPickersToolbarText: {
      toolbarTxt: {
        fontSize: '1.5rem'
      }
    }*/
  }
});
