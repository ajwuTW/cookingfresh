import _ from 'lodash';
import firebase from 'firebase';
import axios from 'axios';
import {
  TO_BUY_LIST_INIT,
  TO_BUY_LIST_FETCH_SUCCESS,
  TO_BUY_LIST_FETCH_EMPTY,
  TO_BUY_LIST_FOOD_CHECKED_SUCCESS,
  TO_BUY_LIST_EXCEPTION_CHECKED_SUCCESS,
  TO_BUY_LIST_RECIPE_PLUS_SUCCESS,
  TO_BUY_LIST_RECIPE_MINUS_SUCCESS,
  TO_BUY_LIST_RECIPE_REMOVE_SUCCESS,
  TO_BUY_LIST_CLEAN_SUCCESS
} from './types';
import * as util from '../util';

export const initToBuyList = () => {
  return (dispatch) => {
    dispatch({
      type: TO_BUY_LIST_INIT
    })
  };
};

export const getToBuyList = (isLogin, uid) => {
  return (dispatch) => {
    if(isLogin){
      firebase.database().ref(`/users/${uid}/toBuy`)
          .on('value', function(snapshot) {
            if( snapshot.val() === null ){
              dispatch({ type: TO_BUY_LIST_FETCH_EMPTY })
            }else{
              var { food, list, exception } = snapshot.val();
              dispatch({
                type: TO_BUY_LIST_FETCH_SUCCESS,
                payload: {
                  food, list, exception
                }
              })
            }
          });
    }
  };
};

export const cleanTobuyList = () => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    var removeNode = { '/exception': null, '/food': null, '/list': null};
    firebase.database().ref(`/users/${currentUser.uid}/toBuy`)
        .update(removeNode);
    dispatch({
      type: TO_BUY_LIST_CLEAN_SUCCESS
    })
  }
};

export const setFoodChecked = ({uid, Checked}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/toBuy/food/${uid}`)
        .update({Checked});
    dispatch({
      type: TO_BUY_LIST_FOOD_CHECKED_SUCCESS
    })
  }
};

export const setExceptionChecked = ({uid, Checked}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    firebase.database().ref(`/users/${currentUser.uid}/toBuy/exception/${uid}`)
        .update({Checked});
    dispatch({
      type: TO_BUY_LIST_EXCEPTION_CHECKED_SUCCESS
    })
  }
};

export const plusRecipeQty = ({recipeId, description, food, exception}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();

    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/`);

    updateToBuyList.transaction(function (personal_toBuy) {
      var listdata={...personal_toBuy.list};
      var foodData={...personal_toBuy.food};
      var exceptionData={...personal_toBuy.exception};
      var lastLoginData = { datetime: new Date()+""};
      var count;
      if (personal_toBuy.list !== undefined
        && personal_toBuy.list[recipeId] !== undefined) {
          listdata[recipeId].count = listdata[recipeId].count+1;
      }else{
          listdata[recipeId]={ count: 1};
      }
      for (var f in food) {
        foodData = util.formatPlusData(food[f], personal_toBuy.food)
      }
      for (var e in exception) {
        exceptionData = util.formatPlusData_Exception(exception[f], personal_toBuy.exception)
      }
      return {
        lastLoginDate: lastLoginData,
        list: listdata,
        food: foodData,
        exception: exceptionData
      };
    });
    dispatch({
      type: TO_BUY_LIST_RECIPE_PLUS_SUCCESS
    })
  }
};


export const minusRecipeQty = ({recipeId, description, food, exception}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/`);

    updateToBuyList.transaction(function (personal_toBuy) {
      var listdata={...personal_toBuy.list};
      var foodData={...personal_toBuy.food};
      var exceptionData={...personal_toBuy.exception};
      var lastLoginData = { datetime: new Date()+""};
      var count;
      if (personal_toBuy.list !== undefined
        && personal_toBuy.list[recipeId] !== undefined) {
          listdata[recipeId].count = listdata[recipeId].count-1;
      }else{
          listdata[recipeId]={ count: 1};
      }
      for (var f in food) {
        foodData = util.formatMinusData(food[f], personal_toBuy.food)
      }
      for (var e in exception) {
        exceptionData = util.formatMinusData_Exception(exception[f], personal_toBuy.exception)
      }
      return {
        lastLoginDate: lastLoginData,
        list: listdata,
        food: foodData,
        exception: exceptionData
      };
    });
    dispatch({
      type: TO_BUY_LIST_RECIPE_PLUS_SUCCESS
    })
  }
};


export const removeRecipe = ({recipeId, description, food, exception}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/`);

    updateToBuyList.transaction(function (personal_toBuy) {
      var listdata={...personal_toBuy.list};
      var foodData={...personal_toBuy.food};
      var exceptionData={...personal_toBuy.exception};
      var lastLoginData = { datetime: new Date()+""};
      var count;
      listdata[recipeId] = null ;
      for (var f in food) {
        foodData = util.formatMinusData(food[f], personal_toBuy.food)
      }
      for (var e in exception) {
        exceptionData = util.formatMinusData_Exception(exception[f], personal_toBuy.exception)
      }
      return {
        lastLoginDate: lastLoginData,
        list: listdata,
        food: foodData,
        exception: exceptionData
      };
    });
    dispatch({
      type: TO_BUY_LIST_RECIPE_REMOVE_SUCCESS
    })
  }
};
