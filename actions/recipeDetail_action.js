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
  RECIPE_ID_IS_EXISTS
} from './types';
import * as api from '../api';

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
            payload: { id, description, food, exception, step }
          })
        }).catch((error)=>{
           console.log("Api call error");
           alert(error.message);
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
             console.log('item');
             console.log(item);
           }else {
             var recipe = { description, food, exception, step }
             AsyncStorage.setItem('recipe-'+recipeid, JSON.stringify(recipe));
           }
      });

        const { currentUser } = firebase.auth();
    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/list/${recipeid}`);

    updateToBuyList.transaction(function (current_value) {
      var count;
      if (current_value === null) {
        count = 1;
      }else{
        count = current_value.count+1;
      }
      return { count };
    });

    for (var f in food) {
      var { IngredientName, IngredientUnit, IngredientQty } = food[f];
      var updateToBuyFood = firebase.database().ref(`/users/${currentUser.uid}/toBuy/food/${IngredientName}`);
      updateToBuyFood.transaction(function (current_value) {
        var count, Checked= false;
        if (current_value === null) {
          count = 1;
        }else{
          count = current_value.count+1;
        }
        return { IngredientName, IngredientUnit , IngredientQty, Checked, count};
      });
    }

    for (var e in exception) {
      var { IngredientName, IngredientUnit } = exception[e];
      var updateToBuyException = firebase.database().ref(`/users/${currentUser.uid}/toBuy/exception/${IngredientName}`);
      updateToBuyException.transaction(function (current_value) {
        var count, Checked= false;
        if (current_value === null) {
          count = 1;
        }else{
          count = current_value.count+1;
        }
        return { IngredientName, IngredientUnit, Checked, count};
      });
    }

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
