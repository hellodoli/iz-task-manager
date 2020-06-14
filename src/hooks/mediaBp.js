import { useTheme, useMediaQuery } from '@material-ui/core';

function useMediaBreakingPoint() {
  const theme = useTheme();
  const bp = theme.breakpoints;
  const uMQ = useMediaQuery; // instance useMediaQuery
  const result = {};
  for (let i = 0; i < bp.keys.length; i++) {
    const key = bp.keys[i];
    result[`is${key.toUpperCase()}`] = {
      down: uMQ(bp.down(key)),
      up: uMQ(bp.up(key)),
    };
  }
  return result;
}

export { useMediaBreakingPoint };
