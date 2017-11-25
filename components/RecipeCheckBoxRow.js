import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Button, Card, Badge, Icon } from 'react-native-elements';
import * as apis from '../api';


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
    AsyncStorage.removeItem('recipe-'+id);
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
                alert(error.message);
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
            <Text style={{padding:3}}>
              {RecipeName}
            </Text>
            <Text style={{padding:3}}>
              {' '+RecipeUnit+' 人份'}
            </Text>
            <Badge
              value={total+' 人份'}
              textStyle={{ color: 'orange' }}
              wrapperStyle={{padding:3}}
            />
          </View>
          <View style={styles.recipePlusMinus} >
            <Icon
              name='plus'
              type='font-awesome'
              color='#f50'
              iconStyle={{padding:3}}
              onPress={()=>this.props.onPlusPress(recipeId, description, food, exception)} />
            <Icon
              name='minus'
              type='font-awesome'
              color='#f50'
              iconStyle={{padding:3}}
              onPress={()=>this.props.onMinusPress(recipeId, count, description, food, exception)} />
          </View>
        </View>
      );
    }else{
      return (
        <Card
          image={require('../assets/gif/card-loading.gif')} >
          <View style={styles.detailWrapper}>
          </View>
        </Card>
      );
    }

  }
}

const styles = {
  detailWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  rowWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
      width: SCREEN.width
  },
  recipeText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    padding:2
  },
  recipePlusMinus: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
    padding:2
  }
}

export default RecipeCheckBoxRow;
