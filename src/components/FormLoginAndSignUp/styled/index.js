import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

export const FormWrapperFixedCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const FormWrapper = styled.div`
  position: relative;
`

export const FormWrapperHeader = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #50c1e9;
`

// Material css
export const formTabHeader = makeStyles({
  root: {
    minHeight: '55px'
  },
  indicator: {
    backgroundColor: '#75e2cf',
    boxShadow: '0 0 10px #75e2cf'
  }
});