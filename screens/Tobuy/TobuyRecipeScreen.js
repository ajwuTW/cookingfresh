import React from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import _ from 'lodash';

import { connect } from 'react-redux';

import * as actions from '../../actions';
import * as apis from '../../api';

import Colors from '../../constants/Colors-theme';

import RecipeCheckBoxRow  from '../../components/RecipeCheckBoxRow';

class TobuyRecipeScreen extends React.Component {

  constructor(props) {
    super(props);
    this._plusRecipeQty = this._plusRecipeQty.bind(this);
    this._minusRecipeQty = this._minusRecipeQty.bind(this);
  }

  static navigationOptions = {
    title: '購物清單-食譜列表',
    headerTintColor: Colors.headerTintColor,
    headerStyle: {
     backgroundColor: Colors.headerColor
   }
  };

  componentWillMount(){
  }

  _plusRecipeQty(recipeId, description, food, exception){
    console.log(food);
      this.props.plusRecipeQty({recipeId, description, food, exception});
  }
  _minusRecipeQty(recipeId, count, description, food, exception){
    if(count==1){
      const { RecipeName } = description;
      Alert.alert(
        '是否刪除',
        RecipeName,
        [
          {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: '確認', onPress: () => this.props.removeRecipe({ recipeId, description, food, exception })},
        ],
        { cancelable: false }
      )
    }else{
      this.props.minusRecipeQty({recipeId, description, food, exception});
    }
  }

  // Tobuy Recipe List
  renderToBuyRecipeCheckBoxList(){
      return this.props.list.map(list =>{
        var uid= list.uid;
        var count = list.count;
        return(
          <View key={uid}
            style={styles.rowColor}>
            <RecipeCheckBoxRow
              uid={uid}
              count={count}
              onPlusPress={this._plusRecipeQty}
              onMinusPress={this._minusRecipeQty}
              onFocusRecipe={this.props.onSetFocusRecipe}
            ></RecipeCheckBoxRow>
          </View>
        );
      });
  }

  render() {
    return (
      <ScrollView>
        {this.renderToBuyRecipeCheckBoxList()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 3,
    backgroundColor: '#fff',
  },
  rowColor: {
    margin:8,
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
  },
});


function mapStateToProps({ toBuy, auth }){

  const list = _.map( toBuy.list ,(val, uid) => {
    return { ...val, uid };
  });
  return {
    list: list,
    isLoad: toBuy.isLoad,
    isLogin: auth.isLogin
   };
}


export default connect(mapStateToProps, actions)(TobuyRecipeScreen);
