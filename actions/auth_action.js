import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import firebase from 'firebase';

import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_NONE,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_LOGOUT_SUCCESS
} from './types';


// How to use AsyncStorage:
// AsyncStorage.setItem('fb_token', token);
// AsyncStorage.getItem('fb_token');

  export const fbLogin = () => async dispatch => {
    let token = await AsyncStorage.getItem('fb_token');
    if (token) {
      checkTokenProfile();
    } else {
      //start Facebook Login process
      doFbLogin(dispatch);
    }
  }

  export const fbLogout = () => async dispatch => {
    firebase.auth().signOut().then(function() {
        return dispatch({ type: FACEBOOK_LOGOUT_SUCCESS });
    }, function(error) {
      console.log('Signout ERROR')
    });
  }

  const doFbLogin = async dispatch => {
    let { type, token, name } = await Facebook.logInWithReadPermissionsAsync('1845575732377967', {
      permission: ['public_profile']
    });
    //get public_profile
    if (type === 'cancel') {
        return dispatch({ type: FACEBOOK_LOGIN_FAIL });
    }
    authenticate_fb(token);
    checkTokenProfile();
  }

  const authenticate_fb = (token) => {
    const provider = firebase.auth.FacebookAuthProvider
    const credential = provider.credential(token)
    firebase.auth().signInWithCredential(credential);
    const { currentUser } = firebase.auth();
  }

  export const checkTokenProfile = () => dispatch => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const { uid, providerData } = user;
        dispatch({
          type: FACEBOOK_LOGIN_SUCCESS,
          payload: {
            firebase: {
              uid: uid
            },
            profile: providerData[0]
          }
        });
      }else{
        dispatch({ type: FACEBOOK_LOGIN_NONE });
      }
    });
  }
