import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { connect } from 'react-redux';
import { Card, Button, ListItem, List } from 'react-native-elements';

import * as actions from '../../actions';
import * as apis from '../../api';

import FoodChart from '../../components/FoodChart';
import { CardSection } from '../../components/common';

class FoodChartScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      dataLoaded: false,
      isOpen: false,
      isClickRecipe: false,
      fadeAnim: new Animated.Value(0)
    }
    this._setFocusRecipe = this._setFocusRecipe.bind(this);
  }

  static navigationOptions = {
    title: '食材波動',
    headerTintColor: "#2c3e50",
    headerStyle: {
     backgroundColor:"#f1c40f"
   }
  };

  componentWillMount(){
    // console.log("params4");
    // console.log(this.props.navigation.state.params);
    const { category, foodId } = this.props.navigation.state.params;
    this.props.setFocusFoodId(category, foodId);
  }

  _setFocusRecipe(recipeId){
    this.props.navigation.navigate('RecipeDetail', { 'recipeId': recipeId })
  }

  renderReceiptList() {
      return this.props.recipeList.map(recipe =>
        <View key={recipe.RecipeID} >
          <TouchableOpacity
            onPress={() => this._setFocusRecipe(recipe.RecipeID)}
          >
            <CardSection style={{borderBottomWidth: 0}} >
              <Text>{recipe.RecipeName}</Text>
            </CardSection>
          </TouchableOpacity>
        </View>
    );
  }

  render() {
    if(this.props.isLoad){
      return(
        <ScrollView style={styles.container, {marginBottom: 20}}>
          <FoodChart/>
          <View style={{ marginTop: 30}}>
            <Card
              title='食譜'
              containerStyle={{padding: 10}}
            >
              {this.renderReceiptList()}
            </Card>
          </View>
        </ScrollView>
      );
    }else{
      return (
        <Image source={require('../../assets/gif/loading04.gif')} style={styles.loading} />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  italics: {
    fontStyle: 'italic'
  },
	chart: {
		height: 250,
    marginTop: 30
	},
  loading: {
    width: null,
    height: null,
    marginLeft: 100,
    marginRight: 100,
    resizeMode:'contain',
    flex: 1
  }
});


function mapStateToProps({ foodChart }){
  return {
    foodid: foodChart.foodid,
    chart: foodChart.chart,
    chartDay: foodChart.chartDay,
    recipeList: foodChart.recipeList,
    isLoad: foodChart.isLoad
   };
}

export default connect(mapStateToProps, actions)(FoodChartScreen);
