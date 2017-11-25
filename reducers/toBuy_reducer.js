import _ from 'lodash';
import {
  TO_BUY_LIST_FETCH_SUCCESS,
  TO_BUY_LIST_FETCH_EMPTY,
  TO_BUY_LIST_NOT_LOGIN,
  TO_BUY_LIST_FOOD_CHECKED_SUCCESS,
  TO_BUY_LIST_EXCEPTION_CHECKED_SUCCESS,
  TO_BUY_LIST_RECIPE_PLUS_SUCCESS,
  TO_BUY_LIST_RECIPE_MINUS_SUCCESS,
  TO_BUY_LIST_RECIPE_REMOVE_SUCCESS
} from '../actions/types';

const INITIAL_STATE ={
  isLoad: false,
  isLogin: true,
  description: {},
  food: [],
  list: [],
  exception: []
}

export default function (state = INITIAL_STATE , action) {
  switch( action.type ){
    case TO_BUY_LIST_FETCH_SUCCESS:
      return { ...state, food: action.payload.food,
                         list: action.payload.list,
                         exception: action.payload.exception,
                         isLoad: true,
                         isLogin: action.payload.isLogin
                       };
    case TO_BUY_LIST_FETCH_EMPTY:
      return { ...state, isLogin: action.payload.isLogin,
                         isLoad: true};
    case TO_BUY_LIST_NOT_LOGIN:
      return { ...state, isLogin: action.payload.isLogin,
                         isLoad: true};
    case TO_BUY_LIST_FOOD_CHECKED_SUCCESS:
      return { ...state};
    case TO_BUY_LIST_EXCEPTION_CHECKED_SUCCESS:
      return { ...state};
    case TO_BUY_LIST_RECIPE_PLUS_SUCCESS:
      return { ...state};
    case TO_BUY_LIST_RECIPE_MINUS_SUCCESS:
      return { ...state};
    case TO_BUY_LIST_RECIPE_REMOVE_SUCCESS:
      return { ...state};
    default:
      return state;
  }
}
