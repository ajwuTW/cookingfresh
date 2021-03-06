import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  RECIPE_ID_FETCH_ING,
  RECIPE_ID_FETCH_SUCCESS,
  RECIPE_LIST_STATUS_RESET,
  RECIPE_TO_CAR_SUCCESS,
  RECIPE_TO_STATUS_RESET,
  RECIPE_ID_IS_NOT_EXISTS,
  RECIPE_ID_IS_EXISTS,
  RECIPE_DETAIL_SCREEN_INIT
} from './types';
import * as api from '../api';
import * as util from '../util';

export const setFocusRecipeId = (id, isLogin, uid) => {
  return (dispatch) => {
      dispatch({ type: RECIPE_ID_FETCH_ING });
      if (isLogin) {
        // var isLogin = true;
        //確認此 RecipeID 是否已在 tobulist
        firebase.database().ref(`/users/${uid}/toBuy/list/${id}`)
            .on('value', function(snapshot) {
              if( snapshot.exists() ){
                dispatch({ type: RECIPE_ID_IS_EXISTS });
              }else{
                dispatch({ type: RECIPE_ID_IS_NOT_EXISTS });
              }
            });
      }
      // Food
      api.getRecipeDetailByRecipeId(id)
        .then(({recipeDetail}) => {
          var description = recipeDetail.description[0];
          var food = recipeDetail.ingredient;
          var exception = recipeDetail.exception;
          var step = recipeDetail.step;
          dispatch({
            type: RECIPE_ID_FETCH_SUCCESS,
            payload: { id, description, food, exception, step, isLoad: true }
          })
        }).catch((error)=>{
           console.log("Api call error");
           console.log(error.message);
        })


  };
};


export const setRecipeListStatusReset = () => {
  return (dispatch) => {
    dispatch({
      type: RECIPE_LIST_STATUS_RESET
    })
  }
};


export const setRecipeToCar = ({ recipeid, description, food, exception, step }) => {
  return (dispatch) => {
    AsyncStorage.getItem('recipe-'+recipeid)
      .then((item) => {
           if (item) {
             console.log(item);
           }else {
             var recipe = { description, food, exception, step }
             AsyncStorage.setItem('recipe-'+recipeid, JSON.stringify(recipe));
           }
      });

    const { currentUser } = firebase.auth();
    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/`);

    updateToBuyList.transaction(function (personal_toBuy) {
      var listdata={...personal_toBuy.list};
      var foodData={...personal_toBuy.food};
      var exceptionData={...personal_toBuy.exception};
      var lastLoginData = { datetime: new Date()+""};
      
      if (personal_toBuy.list !== undefined
        && personal_toBuy.list[recipeid] !== undefined) {
          listdata[recipeid].count = listdata[recipeid].count+1;
      }else{
          listdata[recipeid]={ count: 1};
      }
      for (var f in food) {
        foodData = util.formatPlusData(food[f], personal_toBuy.food);
      }
      for (var e in exception) {
        exceptionData = util.formatPlusData_Exception(exception[e], personal_toBuy.exception);
      }
      return {
        lastLoginDate: lastLoginData,
        list: listdata,
        food: foodData,
        exception: exceptionData
      };
    });

    dispatch({
      type: RECIPE_TO_CAR_SUCCESS
    })
  }
};

export const setRecipeToCarStatusReset = () => {
  return (dispatch) => {
    dispatch({
      type: RECIPE_TO_STATUS_RESET
    })
  }
};

export const initRecipeDetailScreen = () => {
  return (dispatch) => {
    dispatch({
      type: RECIPE_DETAIL_SCREEN_INIT
    })
  }
};
