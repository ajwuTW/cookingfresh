import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  RANK_FISH_FETCH_SUCCESS,
  RANK_VEGETABLE_FETCH_SUCCESS,
  DATA_LOGIN_STATE
} from './types';

export const loadRank_vegetable = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {

  firebase.database().ref(`/rank/vegetable`)
      .orderByChild('measure')
      .limitToFirst(10)
      .once('value')
      .then(function(snapshot) {
        var vegetable = Object.keys(snapshot.val()).map(function(e) {
          return snapshot.val()[e]
        });
        dispatch({
          type: RANK_VEGETABLE_FETCH_SUCCESS,
          payload: {
            vegetable
          }
        })
      });
  };
};

export const loadRank_fish = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {

  firebase.database().ref(`/rank/meet/fish`)
      .orderByChild('measure')
      .limitToLast(10)
      .once('value')
      .then(function(snapshot) {
        var fish = Object.keys(snapshot.val()).map(function(e) {
          return snapshot.val()[e]
        });
        dispatch({
          type: RANK_FISH_FETCH_SUCCESS,
          payload: {
            fish
          }
        })
      });
  };
};

export const checkAuthState = () => {
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var isLogin = true;
      }else{
        var isLogin = false;
      }
      dispatch({
        type: DATA_LOGIN_STATE,
        payload: {
          isLogin
        }
      })
    });
  };
};
