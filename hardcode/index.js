import {
  SEASON_VEGETABLE
} from './season-vegetable';

export function getSeasonVegetable_NOW() {
  var month = new Date().getMonth();
  return SEASON_VEGETABLE[month];
}
