const URL = "http://fs.mis.kuas.edu.tw/~s1103137212/topic_project/";
import firebase from 'firebase';

export const getRankInVegetableByPageing = (measure, id, isFirstPage) => {
  return firebase.database().ref(`/rank/vegetable`)
      .orderByChild('measure')
      .startAt(measure)
      .limitToFirst(10)
      .once('value')
      .then(function(snapshot) {
        var vegetable = [];
        var lastKnownVal = null;
        var isStart = false;
        snapshot.forEach(function(child) {
          lastKnownVal = child.val();
          if(isStart || isFirstPage ){
            vegetable.push(lastKnownVal);
          }
          if( id == lastKnownVal.id ){
            isStart = true;
          }
        });
        return { vegetable, lastKnownVal };
      });
};


export const getRankInFishByPageing = (measure, id, isFirstPage) => {
  return firebase.database().ref(`/rank/meet/fish`)
      .orderByChild('measure')
      .startAt(measure)
      .limitToFirst(10)
      .once('value')
      .then(function(snapshot) {
        var fish = [];
        var lastKnownVal = null;
        var isStart = false;
        snapshot.forEach(function(child) {
          lastKnownVal = child.val();
          if(isStart || isFirstPage ){
            fish.push(lastKnownVal);
          }
          if( id == lastKnownVal.id ){
            isStart = true;
          }
        });
        return { fish, lastKnownVal };
      });
};
