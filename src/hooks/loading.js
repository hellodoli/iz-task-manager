import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../actions/loading';

const useLoading = () => {
  const isLoading = useSelector((state) => state.isLoading);
  const dispatch = useDispatch();

  const setLoading = (type) => {
    if (type === true) dispatch(showLoading());
    else dispatch(hideLoading());
  };

  return [isLoading, setLoading];
};

export { useLoading };
