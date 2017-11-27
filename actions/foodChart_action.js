import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  FOOD_ID_FETCHING,
  FOOD_ID_FETCH_SUCCESS_CHART,
  FOOD_ID_FETCH_SUCCESS_RECIPE
} from './types';

import * as api from '../api';

export const setFocusFoodId = (category, id) => {
  const { currentUser } = firebase.auth();
  return async (dispatch) => {
    dispatch({ type: FOOD_ID_FETCHING });
    var chartData = [];
    var chartDay = [];
    var chart = [];
    var count = 0;
    var categoryPath = '';
    if(category == 'vegetable'){
      categoryPath = 'vegetable';
    }else if(category == 'seafood'){
      categoryPath = 'meet/fish';
    }else if(category == 'chicken'){
      categoryPath = 'meet/chicken';
    }else if(category == 'egg'){
      categoryPath = 'meet/pork';
    }else if(category == 'pork'){
      categoryPath = 'meet/pork';
    }
    firebase.database().ref(`/data/${categoryPath}/${id}`)
        .limitToLast(30)
        .once('value')
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var tmp = 1*childSnapshot.val();
            chartDay.push({ value: childSnapshot.key});
            chart.push({ x: count, y: tmp });

            var data = childSnapshot.key;
            chartData.push({
                // x: data,
                x: new Date(data.substring(0,4)+'-'+data.substring(4,6)+'-'+data.substring(6,8)).getTime(),
                y: tmp
            });
            count++;
          });
          // Chart
          dispatch({ type: FOOD_ID_FETCH_SUCCESS_CHART, payload: { id, chart, chartDay, chartData } })

          // Food
          api.getFoodByFoodId(id)
          .then(({recipeList}) => {
            dispatch({ type: FOOD_ID_FETCH_SUCCESS_RECIPE, payload: { id, recipeList } })
          }).catch((error)=>{
             console.log("Api call error");
             alert(error.message);
          })
        });
  };
};
