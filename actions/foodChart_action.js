import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  FOOD_ID_FETCHING,
  FOOD_ID_FETCH_SUCCESS_CHART,
  FOOD_ID_FETCH_SUCCESS_RECIPE,
  FOOD_CHART_SCREEN_INIT
} from './types';

import * as api from '../api';

export const setFocusFoodId = (category, id) => {
  return async (dispatch) => {
    dispatch({ type: FOOD_ID_FETCHING });
    var chartData = {
      first: [],
      second: [],
      third: []
    };
    var count = 0;
    var categoryPath = '';
    if(category == 'vegetable'){
      categoryPath = 'vegetable';
    }else if(category == 'seafood'){
      categoryPath = 'seafood';
    }else if(category == 'chicken'){
      categoryPath = 'others';
    }else if(category == 'egg'){
      categoryPath = 'others';
    }else if(category == 'pork'){
      categoryPath = 'others';
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) { dd = '0'+dd; }
    if(mm<10) { mm = '0'+mm; }

    var currentToday = yyyy+''+mm+''+dd;
    firebase.database().ref(`/data/${categoryPath}/${id}`)
        .orderByKey()
        .startAt((currentToday-30000)+'')
        .once('value')
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var tmp = 1*childSnapshot.val();
            var date = childSnapshot.key;
            var dot = [];
            if((currentToday-date)<=10000){
              dot = [
                  Date.UTC(date.substring(0,4)-46, date.substring(4,6)-1, date.substring(6,8)),
                  tmp
              ];
              chartData['first'].push(dot);
            }else if((currentToday-date)<=20000){
              dot = [
                  Date.UTC(date.substring(0,4)-45, date.substring(4,6)-1, date.substring(6,8)),
                  tmp
              ];
              chartData['second'].push(dot);
            }else if((currentToday-date)<=30000){
              dot = [
                  Date.UTC(date.substring(0,4)-44, date.substring(4,6)-1, date.substring(6,8)),
                  tmp
              ];
              chartData['third'].push(dot);
            }
            count++;
          });
          // Chart
          dispatch({ type: FOOD_ID_FETCH_SUCCESS_CHART, payload: { id, chartData } })

          // Food
          api.getFoodByFoodId(id)
          .then(({recipeList}) => {
            dispatch({ type: FOOD_ID_FETCH_SUCCESS_RECIPE, payload: { id, recipeList } })
          }).catch((error)=>{
             console.log("Api call error");
             console.log(error.message);
          })
        });
  };
};


export const initFoodChartScreen = () => {
  return (dispatch) => {
    dispatch({
      type: FOOD_CHART_SCREEN_INIT
    })
  };
};
