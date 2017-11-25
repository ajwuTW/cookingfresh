import { AsyncStorage } from 'react-native';
const URL = "http://fs.mis.kuas.edu.tw/~s1103137212/topic_project/";


export const getFoodDescriptionByFoodId = (id) => {
  
  return fetch(URL+'recipe_3.php?id='+id)
        .then(function(response){
          return response.json();
        })
        .then(function(json){
          AsyncStorage.setItem('food-'+id, JSON.stringify(json[0]));
          return {
            description: json[0]
          }
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
};
