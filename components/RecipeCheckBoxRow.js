import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Button, Card, Badge, Icon } from 'react-native-elements';

import * as apis from '../api';

import Colors from '../constants/Colors-theme';

const SCREEN = Dimensions.get('window');

class RecipeCheckBoxRow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: {
        RecipeName: '',
        RecipeUnit: ''
      },
      food: {},
      exception: {},
      isLoad: false
    }
  }
  componentWillMount(){
    var id = this.props.uid;
    var count = this.props.count;
    AsyncStorage.removeItem('recipe-'+id)
    AsyncStorage.getItem('recipe-'+id)
      .then((item) => {
           if (item) {
             var item = JSON.parse(item);
             var description = item.description[0];
             var food = item.ingredient;
             var exception = item.exception;
             this.setState({
               description, food, exception,
               isLoad: true
             });
           }else {
             apis.getRecipeDetailByRecipeId(id)
               .then(({recipeDetail}) => {
                AsyncStorage.setItem('recipe-'+id, JSON.stringify(recipeDetail));
                var description = recipeDetail.description[0];
                var food = recipeDetail.ingredient;
                var exception = recipeDetail.exception;
                this.setState({
                 description, food, exception,
                 isLoad: true
                });
             }).catch((error)=>{
                console.log("Api call error");
                console.log(error.message);
             })
           }
      });
  }


  render() {
    var recipeId = this.props.uid;
    var count = this.props.count;
    if(this.state.isLoad){
      var { description, food, exception } = this.state;
      var RecipeName = description.RecipeName;
      var RecipeUnit = description.RecipeUnit;
      var total = count * RecipeUnit;
      return (
        <View
          key={recipeId} style={styles.rowWrapper}>
          <View  style={styles.recipeText} >
            <View style={styles.textMainContent}>
              <Icon
                name='assignment'
                color={Colors.headerColors}
                onPress={() => this.props.onFocusRecipe(recipeId)}
              />
                <Text style={styles.textMainColor}>
                  {RecipeName}
                </Text>
            </View>
            <Text style={ styles.textSubColor}>
              {' '+RecipeUnit+' 人份'}
            </Text>
            <Badge
              value={total+' 人份'}
              containerStyle={{ backgroundColor: Colors.headerTintColor, width:SCREEN.width/5 }}
              textStyle={{ color: Colors.headerColor }}
              wrapperStyle={{padding:3}}
            />
          </View>
          <View style={styles.recipePlusMinus} >
            <Icon
              name='plus'
              type='font-awesome'
              color={Colors.elementeTintColor}
              iconStyle={{padding:2}}
              onPress={()=>this.props.onPlusPress(recipeId, description, food, exception)} />
            <Icon
              name='minus'
              type='font-awesome'
              color={Colors.elementeTintColor}
              iconStyle={{padding:2}}
              onPress={()=>this.props.onMinusPress(recipeId, count, description, food, exception)} />
          </View>
        </View>
      );
    }else{
      return (
        <View
          key={'none'} style={styles.rowWrapper}>
          <View  style={styles.recipeText} >
            <Text style={{padding:3, width:160}}>
              {'載入中'}
            </Text>
          </View>
        </View>
      );
    }

  }
}

const styles = {
  rowWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10
  },
  recipeText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 0,
    margin:2
  },
  recipePlusMinus: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding:2
  },
  textMainColor: {
    color: Colors.textMainColor
  },
  textMainContent: {
    margin: 1,
    width:SCREEN.width/2.5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  textSubColor: {
    color: Colors.textSubColor,
    width: SCREEN.width/7
  },
}

export default RecipeCheckBoxRow;
