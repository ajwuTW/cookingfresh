import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  View,
  TouchableOpacity,
  Text,
  AsyncStorage
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { connect } from 'react-redux';
import { Card, Button, ListItem, List } from 'react-native-elements';
import ChartView from 'react-native-highcharts';

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
      fadeAnim: new Animated.Value(0),
      foodId: null,
      description: {
        IngredientName: '',
        IngredientOriginName: ''
      },
    }
    this._setFocusRecipe = this._setFocusRecipe.bind(this);
    this._getConf = this._getConf.bind(this);
    this._getOptions = this._getOptions.bind(this);

  }

  static navigationOptions = {
    title: '食材波動',
    headerTintColor: "#2c3e50",
    headerStyle: {
     backgroundColor:"#f1c40f"
   }
  };

  componentWillMount(){
    const { category, foodId } = this.props.navigation.state.params;
    AsyncStorage.getItem('food-'+foodId)
      .then((item) => {
           if (item) {
             this.setState({
               description: JSON.parse(item),
               isLoad: true,
               foodId
             });
           }else {
             apis.getFoodDescriptionByFoodId(foodId).then(({description}) => {
               AsyncStorage.setItem('food-'+foodId, JSON.stringify(description));
               this.setState({
                 description: description,
                 isLoad: true,
                 foodId
               });
               // this.updateData();
             }).catch((error)=>{
                console.log("Api call error");
                alert(error.message);
             })
           }
      });
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
  _getConf = (chartData) => {
    var Highcharts='Highcharts';
    return {
      chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10
      },
      title: {
          text: this.state.description.IngredientOriginName
      },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
      },
      yAxis: {
          title: {
              text: '價格'
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  Highcharts.dateFormat('%Y-%m-%d', this.x) + '<br/>' +
                  Highcharts.numberFormat(this.y, 2);
          }
      },
      legend: {
          enabled: false
      },
      exporting: {
          enabled: false
      },
      series: [{
          name: '當日價格',
          data: (function () {
              return chartData;
          }())
      }]
    }
  }
  _getOptions = () => {
    return {
        global: { useUTC: false },
        lang: { decimalPoint: ',', thousandsSep: '.' }
    }
  }

  render() {
    if(this.props.isLoad){
      return(
        <ScrollView style={styles.container, {marginBottom: 20}}>
          <View style={{ marginTop: 10}}>
            <FoodChart id={this.state.foodId}
                       config={this._getConf(this.props.chartData)}
                       options={this._getOptions()}
            ></FoodChart>
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
    chartData: foodChart.chartData,
    recipeList: foodChart.recipeList,
    isLoad: foodChart.isLoad
   };
}

export default connect(mapStateToProps, actions)(FoodChartScreen);
