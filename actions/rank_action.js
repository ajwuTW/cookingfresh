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
  const { currentUser } = firebase.auth();
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


      console.log('lastKnownVal');
        console.log(lastKnownVal);
          console.log('-----------');
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
            console.log('start');
          }

          console.log(lastKnownVal) // NOW THE CHILDREN PRINT IN ORDER
        });

        // var lastKnownVal = null;
        // var vegetable = Object.keys(snapshot.val()).map(function(e) {
        //   console.log(snapshot.val()[e]);
        //   lastKnownVal = snapshot.val()[e];
        //   return lastKnownVal
        // });
        // console.log(vegetable);
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
  const { currentUser } = firebase.auth();
  return (dispatch) => {

  firebase.database().ref(`/rank/meet/fish`)
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
