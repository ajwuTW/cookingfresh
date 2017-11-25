import { combineReducers } from 'redux';

import auth from './auth_reducer';
import rank from './rank_reducer';
import foodChart from './foodChart_reducer';
import recipeDetail from './recipeDetail_reducer';
import toBuy from './toBuy_reducer';

export default combineReducers({
  auth, rank, foodChart, recipeDetail, toBuy
});
