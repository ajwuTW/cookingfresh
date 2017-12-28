
export const formatPlusData = ({ IngredientName, IngredientUnit, IngredientQty }, orgData) => {
  var count=1, Checked= false, tmpData={};
  if (orgData !== undefined
    && orgData[IngredientName] !== undefined) {
      count = orgData[IngredientName].count+1;
  }
  tmpData[IngredientName] = {
    IngredientName, IngredientUnit, IngredientQty,
    Checked, count
  }
  return tmpData;
};


export const formatPlusData_Exception = ({ IngredientName, IngredientUnit }, orgData) => {
  var count=1, Checked= false, tmpData={};
  if (orgData !== undefined
    && orgData[IngredientName] !== undefined) {
      count = orgData[IngredientName].count+1;
  }
  tmpData[IngredientName] = {
    IngredientName, IngredientUnit,
    Checked, count
  }
  return tmpData;
};

export const formatMinusData = ({ IngredientName, IngredientUnit, IngredientQty }, orgData) => {
  var count=1, Checked= false, tmpData={};
  if (orgData !== undefined
    && orgData[IngredientName] !== undefined) {
      if(orgData[IngredientName].count === 1){
        tmpData[IngredientName] = null;
        return tmpData;
      }else{
        count = orgData[IngredientName].count-1;
      }
  }
  tmpData[IngredientName] = {
    IngredientName, IngredientUnit, IngredientQty,
    Checked, count
  }
  return tmpData;
};

export const formatMinusData_Exception = ({ IngredientName, IngredientUnit }, orgData) => {
  var count=1, Checked= false, tmpData={};
  if (orgData !== undefined
    && orgData[IngredientName] !== undefined) {
      if(orgData[IngredientName].count === 1){
        tmpData[IngredientName] = null;
        return tmpData;
      }else{
        count = orgData[IngredientName].count-1;
      }
  }
  tmpData[IngredientName] = {
    IngredientName, IngredientUnit,
    Checked, count
  }
  return tmpData;
};
