const URL = "http://fs.mis.kuas.edu.tw/~s1103137212/topic_project/";
import firebase from 'firebase';

export const getRankInVegetableByPageing = (measure, id, isFirstPage) => {
  return firebase.database().ref(`/rank/vegetable`)
      .orderByChild('measure')
      .startAt(measure)
      .limitToFirst(20)
      .once('value')
      .then(function(snapshot) {
        var vegetable_rank_data = [];
        var lastKnownVal = null;
        var isStart = false;
        snapshot.forEach(function(child) {
          lastKnownVal = child.val();
          if(isStart || isFirstPage ){
            vegetable_rank_data.push(lastKnownVal);
          }
          if( id == lastKnownVal.id ){
            isStart = true;
          }
        });
        return { vegetable_rank_data, lastKnownVal };
      });
};


export const getRankInSeafoodByPageing = (measure, id, isFirstPage) => {
  return firebase.database().ref(`/rank/seafood`)
      .orderByChild('measure')
      .startAt(measure)
      .limitToFirst(20)
      .once('value')
      .then(function(snapshot) {
        var fish_rank_data = [];
        var lastKnownVal = null;
        var isStart = false;
        snapshot.forEach(function(child) {
          lastKnownVal = child.val();
          if(isStart || isFirstPage ){
            fish_rank_data.push(lastKnownVal);
          }
          if( id == lastKnownVal.id ){
            isStart = true;
          }
        });
        return { fish_rank_data, lastKnownVal };
      });
};

export const getVegetablePageConfig = () => {
  return firebase.database().ref(`/rank/page/vegetable`)
      .once('value')
      .then(function(snapshot) {
        var { pageTotal } = snapshot.val();
        return { pageTotal };
      });
};

export const getSeafoodPageConfig = () => {
  return firebase.database().ref(`/rank/page/seafood`)
      .once('value')
      .then(function(snapshot) {
        var { pageTotal } = snapshot.val();
        return { pageTotal };
      });
};
