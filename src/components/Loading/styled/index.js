import { makeStyles } from '@material-ui/core/styles';

const fullScreenContainer = {
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const inlineContainer = {
  display: 'inline-flex',
  width: 'auto',
};

const container = (isFullScreen) =>
  isFullScreen ? fullScreenContainer : inlineContainer;

const background = (isShowBg, theme) => ({
  backgroundColor: isShowBg ? theme.palette.background.paper : {},
});

export const muiLoading = makeStyles((theme) => ({
  root: ({ fullScreen, showBg }) => ({
    ...container(fullScreen),
    ...background(showBg, theme),
    zIndex: theme.zIndex.modal,
  }),
}));
