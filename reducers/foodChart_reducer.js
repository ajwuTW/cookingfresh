import _ from 'lodash';
import {
  FOOD_ID_FETCH_SUCCESS_CHART,
  FOOD_ID_FETCH_SUCCESS_RECIPE
} from '../actions/types';

const INITIAL_FOOD_STATE ={
  isLoad: false,
  recipeList: [{
    RecipeID: '',
    RecipePicture: '',
    RecipeName: '',
  }],
  chart: [{"x":0,"y":50.4}, {"x":0,"y":50.4}],
  foodid: '',
  chartDay: [
    {value:'name1'},
    {value:'name2'}],
  chartData: []

}

export default function (state = INITIAL_FOOD_STATE , action) {
  switch( action.type ){
    case FOOD_ID_FETCH_SUCCESS_CHART:
      return { ...state, chart: action.payload.chart,
                         foodid: action.payload.id,
                         chartDay: action.payload.chartDay,
                         chartData: action.payload.chartData,
                         isLoad: true
                       };
    case FOOD_ID_FETCH_SUCCESS_RECIPE:
      return { ...state, recipeList: action.payload.recipeList,
                        isLoad: true
                      };
    default:
      return state;
  }
}
