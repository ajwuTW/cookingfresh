import _ from 'lodash';
import {
  FOOD_ID_FETCHING,
  FOOD_ID_FETCH_SUCCESS_CHART,
  FOOD_ID_FETCH_SUCCESS_RECIPE,
  FOOD_CHART_SCREEN_INIT
} from '../actions/types';

const INITIAL_FOOD_STATE ={
  isLoad: false,
  recipeList: [{
    RecipeID: '',
    RecipePicture: '',
    RecipeName: '',
  }],
  foodid: '',
  chartData: {
    first: [],
    second: [],
    third: []
  }

}

export default function (state = INITIAL_FOOD_STATE , action) {
  switch( action.type ){
    case FOOD_ID_FETCH_SUCCESS_CHART:
      return { ...state, foodid: action.payload.id,
                         chartData: action.payload.chartData,
                         isLoad: true
                       };
    case FOOD_ID_FETCH_SUCCESS_RECIPE:
      return { ...state, recipeList: action.payload.recipeList,
                        isLoad: true
                      };
   case FOOD_ID_FETCHING:
     return { ...state, isLoad: false };
   case FOOD_CHART_SCREEN_INIT:
     return INITIAL_FOOD_STATE;
    default:
      return state;
  }
}
