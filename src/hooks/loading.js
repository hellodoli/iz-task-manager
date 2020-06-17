import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../actions/loading';

const useLoading = () => {
  const defaultIsLoading = useSelector((state) => state.isLoading);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(defaultIsLoading);

  const setLoading = (type) => {
    if (type === true) dispatch(showLoading());
    else dispatch(hideLoading());
    setIsLoading(type);
  };

  return [isLoading, setLoading];
};

export { useLoading };
