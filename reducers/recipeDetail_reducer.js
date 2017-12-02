import _ from 'lodash';
import {
  RECIPE_ID_FETCH_ING,
  RECIPE_ID_FETCH_SUCCESS,
  RECIPE_LIST_STATUS_RESET,
  RECIPE_TO_CAR_SUCCESS,
  RECIPE_TO_STATUS_RESET,
  RECIPE_ID_IS_NOT_EXISTS,
  RECIPE_ID_IS_EXISTS,
  RECIPE_DETAIL_SCREEN_INIT
} from '../actions/types';

const INITIAL_STATE ={
  isLoad: false,
  isSetToCar: false,
  isExists: true,
  recipeid: '',
  description: {},
  food: [],
  exception: [],
  step: []
}

export default function (state = INITIAL_STATE , action) {
  switch( action.type ){
    case RECIPE_ID_FETCH_ING:
      return { ...state, isLoad: false };
    case RECIPE_ID_FETCH_SUCCESS:
      return { ...state, food: action.payload.food,
                         recipeid: action.payload.id,
                         description: action.payload.description,
                         exception: action.payload.exception,
                         step: action.payload.step,
                         isLoad: action.payload.isLoad,
                       };
    case RECIPE_LIST_STATUS_RESET:
      return { ...state, isLoad: false };
    case RECIPE_TO_CAR_SUCCESS:
      return { ...state, isSetToCar: true, isExists: true };
    case RECIPE_TO_STATUS_RESET:
      return { ...state, isSetToCar: false };
    case RECIPE_ID_IS_NOT_EXISTS:
      return { ...state, isExists: false };
    case RECIPE_ID_IS_EXISTS:
      return { ...state, isExists: true };
    case RECIPE_DETAIL_SCREEN_INIT:
      return INITIAL_STATE;
    default:
      return state;
  }
}
