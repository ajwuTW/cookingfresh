const URL = "http://fs.mis.kuas.edu.tw/~s1103137212/topic_project/";

export const getFoodByFoodId = (id) => {
  return fetch(URL+'recipe_1.php?id='+id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }})
        .then(function(response){
          console.log(response);
          return response.json();
        })
        .then(function(json){
          return {
            recipeList: json
          }
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
};

export const getRecipeDetailByRecipeId = (id) => {
  return fetch(URL+'recipe_2_1.php?id='+id)
        .then(function(response){
          return response.json();
        })
        .then(function(json){
          return {
            recipeDetail: json
          }
        })
        .catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
};
