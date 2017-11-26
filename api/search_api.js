const URL = "http://fs.mis.kuas.edu.tw/~s1103137212/topic_project/";

export const getFoodListByFoodText = (foodText, page, pageSize) => {
  console.log(URL+`recipe_5.php?query=${foodText}&page=${page}&pageSize=${pageSize}`);
  return fetch(URL+`recipe_5.php?query=${foodText}&page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }})
        .then(function(response){
          return response.json();
        })
        .then(function(json){
          return json
        })
        .catch(function(error) {
          console.log('There has been a problem with your getFoodListByFoodText operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
};

export const getRecipeListByRecipeText = (recipeText, page, pageSize) => {
  return fetch(URL+`recipe_4.php?query=${recipeText}&page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }})
        .then(function(response){
          return response.json();
        })
        .then(function(json){
          return json
        })
        .catch(function(error) {
          console.log('There has been a problem with your getRecipeListByRecipeText operation: ' + error.message);
          // ADD THIS THROW error
          throw error;
        });
};
