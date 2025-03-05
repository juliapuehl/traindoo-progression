import {useDispatch} from 'react-redux';
import {useFirebase} from 'react-redux-firebase';
import {useNavigate} from 'react-router-dom';
import {USER_LOGOUT} from '../store/store';

export const useLogout = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async () => {
    // restart IC to clean current session before creating new user or logging in
    Intercom('shutdown');

    // Clear redux store
    dispatch(USER_LOGOUT);
    navigate('/');
    firebase.logout();
  };
};
