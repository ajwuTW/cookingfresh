import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_NONE,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_LOGOUT_SUCCESS
} from '../actions/types';
const INITIAL_STATE ={
  firebase: {
    uid: null
  },
  profile:{
      displayName: '',
      photoURL: '',
      uid: ''
  },
  isLogin: false
}

export default function (state = INITIAL_STATE , action) {
  switch( action.type ){
    case FACEBOOK_LOGIN_SUCCESS:
      return { ...state,
        firebase: action.payload.firebase,
        profile: action.payload.profile,
        isLogin: true
      };
    case FACEBOOK_LOGIN_NONE:
      return INITIAL_STATE;
    case FACEBOOK_LOGIN_FAIL:
      return INITIAL_STATE;
    case FACEBOOK_LOGOUT_SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }

}
