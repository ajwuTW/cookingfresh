import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_LOGOUT_SUCCESS
} from '../actions/types';
const INITIAL_STATE ={
  token: null,
  profile:{
      name: '',
      id: ''
  }
}

export default function (state = INITIAL_STATE , action) {
  switch( action.type ){
    case FACEBOOK_LOGIN_SUCCESS:
      console.log(action.payload.token);
      return { ...state,  token: action.payload.token,
                          profile: action.payload.profile
      };
    case FACEBOOK_LOGIN_FAIL:
      return {
        ...state};
    case FACEBOOK_LOGOUT_SUCCESS:
      return {INITIAL_STATE};
    default:
      return state;
  }

}
