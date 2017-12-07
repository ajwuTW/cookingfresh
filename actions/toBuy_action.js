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

    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/list/${recipeId}`);
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
        var Checked= false;
        var count = current_value.count;
        return { IngredientName, IngredientUnit , Checked, count};
      });
    }
    dispatch({
      type: TO_BUY_LIST_RECIPE_PLUS_SUCCESS
    })
  }
};


export const minusRecipeQty = ({recipeId, description, food, exception}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/list/${recipeId}`);

    updateToBuyList.transaction(function (current_value) {

      for (var f in food) {
        var { IngredientName, IngredientUnit, IngredientQty } = food[f];
        var updateToBuyFood = firebase.database().ref(`/users/${currentUser.uid}/toBuy/food/${IngredientName}`);
        updateToBuyFood.transaction(function (current_value) {
          var count, Checked= false;
          if (current_value === null) {
            count = 1;
          }else{
            count = current_value.count-1;
          }
          return { IngredientName, IngredientUnit , IngredientQty, Checked, count};
        });
      }
      for (var e in exception) {
        var { IngredientName, IngredientUnit } = exception[e];
        var updateToBuyException = firebase.database().ref(`/users/${currentUser.uid}/toBuy/exception/${IngredientName}`);
        updateToBuyException.transaction(function (current_value) {
          var Checked= false;
          var count = current_value.count;
          return { IngredientName, IngredientUnit, Checked, count};
        });
      }

      var count;
      if (current_value === null) {
        count = 1;
      }else{
        count = current_value.count-1;
      }

      return { count };
    });
    dispatch({
      type: TO_BUY_LIST_RECIPE_PLUS_SUCCESS
    })
  }
};


export const removeRecipe = ({recipeId, description, food, exception}) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    var updateToBuyList = firebase.database().ref(`/users/${currentUser.uid}/toBuy/list/${recipeId}`);

    updateToBuyList.transaction(function (current_value) {

      for (var f in food) {
        var { IngredientName, IngredientUnit, IngredientQty } = food[f];
        var updateToBuyFood = firebase.database().ref(`/users/${currentUser.uid}/toBuy/food/${IngredientName}`);
        updateToBuyFood.transaction(function (current_value) {
          var count, Checked= false;
          if (current_value.count === 1) {
            return null;
          }else{
            count = current_value.count-1;
            return { IngredientName, IngredientUnit , IngredientQty, Checked, count};
          }
        });
      }
      for (var e in exception) {
        var { IngredientName, IngredientUnit } = exception[e];
        var updateToBuyException = firebase.database().ref(`/users/${currentUser.uid}/toBuy/exception/${IngredientName}`);
        updateToBuyException.transaction(function (current_value) {
          var count, Checked= false;
          if (current_value.count === 1) {
            return null;
          }else{
            count = current_value.count-1;
            return { IngredientName, IngredientUnit , IngredientQty, Checked, count};
          }
        });
      }

      return null;
    });
    dispatch({
      type: TO_BUY_LIST_RECIPE_REMOVE_SUCCESS
    })
  }
};
