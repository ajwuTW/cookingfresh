import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  RANK_FISH_FETCH_SUCCESS,
  RANK_FISH_FETCH_NEXT_SUCCESS,
  RANK_VEGETABLE_FETCH_SUCCESS,
  RANK_VEGETABLE_FETCH_NEXT_SUCCESS,
  DATA_LOGIN_STATE
} from './types';

export const loadRank_vegetable = (lastKnownVal) => {
  return (dispatch) => {
    var measure = null;
    var id = null;
    var isFirstPage = false;
    if(lastKnownVal){
      measure = lastKnownVal.measure;
      id = lastKnownVal.id;
    }else{
      isFirstPage = true;
    }

    firebase.database().ref(`/rank/vegetable`)
        .orderByChild('measure')
        .startAt(measure)
        .limitToFirst(10)
        .once('value')
        .then(function(snapshot) {
          var vegetable = [];
          var lastKnownVal = null;
          var isStart = false;
          snapshot.forEach(function(child) {
            lastKnownVal = child.val();
            if(isStart || isFirstPage ){
              vegetable.push(lastKnownVal);
            }
            if( id == lastKnownVal.id ){
              isStart = true;
            }
          });
          dispatch({
            type: RANK_VEGETABLE_FETCH_SUCCESS,
            payload: {
              vegetable, lastKnownVal
            }
          })
        });
  };
};

export const loadRank_fish = () => {
  return (dispatch) => {
  firebase.database().ref(`/rank/seafood`)
      .orderByChild('measure')
      .limitToFirst(10)
      .once('value')
      .then(function(snapshot) {
        var lastKnownVal = null;
        var fish = Object.keys(snapshot.val()).map(function(e) {
          lastKnownVal = snapshot.val();
          return lastKnownVal[e]
        });
        dispatch({
          type: RANK_FISH_FETCH_SUCCESS,
          payload: {
            fish, lastKnownVal
          }
        })
      });
  };
};

export const checkAuthState = () => {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged(function(user) {
      var isLogin = false;
      if (user) {
        isLogin = true;
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
