import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';
import firebase from 'firebase';

import {
  FACEBOOK_LOGIN_SUCCESS,
  FACEBOOK_LOGIN_FAIL,
  FACEBOOK_LOGOUT_SUCCESS
} from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem('fb_token', token);
// AsyncStorage.getItem('fb_token');

  export const fbLogin = () => async dispatch => {
    let token = await AsyncStorage.getItem('fb_token');
    if (token) {
      //Dispatch an action saying FB login is done
      const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`);
      var profile = await response.json();
      dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: {token, profile} });
    } else {
      //start Facebook Login process
      doFbLogin(dispatch);
    }
  }

  const doFbLogin = async dispatch => {
    let { type, token, name } = await Facebook.logInWithReadPermissionsAsync('1845575732377967', {
      permission: ['public_profile']
    });
    //get public_profile
    if (type === 'cancel') {
        return dispatch({ type: FACEBOOK_LOGIN_FAIL });
    }
    const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
    var profile = await response.json();
    authenticate_fb(token);
    await AsyncStorage.setItem('fb_token', token);
    dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: {token, profile} });
  }

  const authenticate_fb = (token) => {
    const provider = firebase.auth.FacebookAuthProvider
    const credential = provider.credential(token)
    firebase.auth().signInWithCredential(credential);
    const { currentUser } = firebase.auth();
  }

  export const checkTokenProfile = () => async dispatch => {
    let token = await AsyncStorage.getItem('fb_token');
    if (token) {
      //Dispatch an action saying FB login is done
      const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`);
      var profile = await response.json();
      dispatch({ type: FACEBOOK_LOGIN_SUCCESS, payload: {token, profile} });
    }
    dispatch({ type: FACEBOOK_LOGIN_FAIL });
  }

  export const fbLogout = () => async dispatch => {
    firebase.auth().signOut().then(function() {
      AsyncStorage.removeItem('fb_token');
    }, function(error) {
      console.log('Signout ERROR')
    });
    dispatch({ type: FACEBOOK_LOGOUT_SUCCESS });
  }
