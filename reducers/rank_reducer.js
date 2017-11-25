import _ from 'lodash';
import {
  RANK_FISH_FETCH_SUCCESS,
  RANK_VEGETABLE_FETCH_SUCCESS,
  DATA_LOGIN_STATE
} from '../actions/types';

const INITIAL_DATA_STATE ={
  isLoad: false,
  isLogin: false,
  results_vegetable: [],
  results_fish: [],
  results_chicken: [],
  results_pork: []
}

export default function (state = INITIAL_DATA_STATE , action) {
  switch( action.type ){
    case RANK_FISH_FETCH_SUCCESS:
      return { ...state,  results_fish: action.payload.fish,
                          //results_chicken: action.payload['chicken'],
                          //results_pork: action.payload['pork'],
                        };
    case RANK_VEGETABLE_FETCH_SUCCESS:
      return { ...state,  results_vegetable: action.payload.vegetable,
                          isLoad: true
                        };
    case DATA_LOGIN_STATE:
      return { ...state,  isLogin: action.payload.isLogin
                        };
    default:
      return state;
  }
}
