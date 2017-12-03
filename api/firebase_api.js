const URL = "http://fs.mis.kuas.edu.tw/~s1103137212/topic_project/";
import firebase from 'firebase';

export const getRankInVegetableByPageing = (measure, id, isFirstPage, page) => {

  return firebase.database().ref(`/rank/vegetable`)
      .orderByChild('measure')
      .startAt(measure)
      .limitToFirst(20)
      .once('value')
      .then(function(snapshot) {
        var vegetable_rank_data = [];
        var lastKnownVal = null;
        var isStart = false;
        var count = 0;
        snapshot.forEach(function(child) {
          lastKnownVal = child.val();
          if(isStart || isFirstPage ){
            count++;
            var value = lastKnownVal;
            value.key = lastKnownVal.id+(((page-1)*20)+count);
            console.log(value.key);
            vegetable_rank_data.push(value);
          }
          if( id == lastKnownVal.id ){
            isStart = true;
          }
        });
        return { vegetable_rank_data, lastKnownVal };
      });
};


export const getRankInSeafoodByPageing = (measure, id, isFirstPage, page) => {
  return firebase.database().ref(`/rank/seafood`)
      .orderByChild('measure')
      .startAt(measure)
      .limitToFirst(20)
      .once('value')
      .then(function(snapshot) {
        var seafood_rank_data = [];
        var lastKnownVal = null;
        var isStart = false;
        var count = 0;
        snapshot.forEach(function(child) {
          lastKnownVal = child.val();
          if(isStart || isFirstPage ){
            count++;
            var value = lastKnownVal;
            value.key = lastKnownVal.id+(((page-1)*20)+count);
            console.log(value.key);
            seafood_rank_data.push(value);
          }
          if( id == lastKnownVal.id ){
            isStart = true;
          }
        });
        return { seafood_rank_data, lastKnownVal };
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
