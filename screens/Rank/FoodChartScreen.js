import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Dimensions,
  ImageBackground
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { connect } from 'react-redux';
import { Card, Button, ListItem, List, Badge } from 'react-native-elements';
import ChartView from 'react-native-highcharts';

import * as actions from '../../actions';
import * as apis from '../../api';

import Colors from '../../constants/Colors-theme';

import FoodChart from '../../components/FoodChart';
import { CardSection } from '../../components/common';

var screen = Dimensions.get('window');

class FoodChartScreen extends React.Component {

  // INITIAL
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
      isLoad:false,
      unit: '(元/公斤)'
    }
    this._setFocusRecipe = this._setFocusRecipe.bind(this);
    this._getConf = this._getConf.bind(this);
    this._getOptions = this._getOptions.bind(this);

  }

  static navigationOptions = {
    title: '食材價格波動',
    headerTintColor: Colors.headerTintColor,
    headerStyle: {
     backgroundColor: Colors.headerColor
   }
  };

  // LIFE CYCLE
  componentDidMount(){
    const { category, foodId } = this.props.navigation.state.params;
    var unit = '(元/公斤)';
    if(foodId=='chicken'||foodId=='egg'){
      unit = '(元/台斤)';
    }
    AsyncStorage.getItem('food-'+foodId)
      .then((item) => {
           if (item) {
             this.setState({
               description: JSON.parse(item),
               foodId, unit
             });
           }else {
             apis.getFoodDescriptionByFoodId(foodId).then(({description}) => {
               AsyncStorage.setItem('food-'+foodId, JSON.stringify(description));
               this.setState({
                 description: description,
                 foodId, unit
               });
               // this.updateData();
             }).catch((error)=>{
                console.log("Api call error");
                console.log(error.message);
             })
           }
      });
    this.props.setFocusFoodId(category, foodId);
  }

  componentWillReceiveProps(){
    this.setState({
      isLoad: true
    });
  }

  componentWillUnmount(){
    this.props.initFoodChartScreen();
  }

  // FUNCTION

  _setFocusRecipe(recipeId){
    this.props.navigation.navigate('RecipeDetail', { 'recipeId': recipeId })
  }

  _getConf = (chartData) => {
    var Highcharts='Highcharts';
    return {
      chart: {
        type: 'scatter',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        backgroundColor: Colors.elementeBackgroundColor
      },
      title: {
        text: this.state.description.IngredientOriginName,
        style: {
            color: Colors.textMainColor,
            fontWeight: 'bold'
        }
      },
      subtitle: {
        text: this.state.description.IngredientName ,
        style: {
            color: Colors.textSubColor,
            fontWeight: 'bold'
        }
      },
      xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
              month: '%e. %b', year: '%b'
          },
          title: {
            text: '日期' ,
            style: {
                color: Colors.textSubColor,
                fontWeight: 'bold'
            }
          },
          labels: { style: { color: Colors.textSubColor } }
      },
      yAxis: {
        title: {
          text: '價格',
          style: {
              color: Colors.textSubColor,
              fontWeight: 'bold'
          }
        },
        labels: { style: { color: Colors.textSubColor } },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x:%m/%d}: {point.y:.1f}'+this.state.unit
      },
      legend: {
        itemStyle: {
            color: Colors.elementeTintColor,
            fontWeight: 'bold'
        },
        itemHiddenStyle: {
            color: Colors.unfocusColor,
            fontWeight: 'bold'
        }
      },
      plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: { enabled: true, lineColor: 'rgb(100,100,100)' }
                }
            },
            states: { hover: { marker: { enabled: false } } }
        }
      },
      exporting: { enabled: false },
      series: [{
          name: '前年',
          color: Colors.chartLineColorThree,
          visible: false,
          data: chartData['third']
      }, {
          name: '去年',
          color: Colors.chartLineColorTwo,
          visible: false,
          data: chartData['second']
      },{
          name: '今年',
          negativeColor: Colors.elementeBackgroundColor,
          color: Colors.chartLineColorOne,
          data: chartData['first']
      }]
    }
  }
  _getOptions = () => {
    return {
        global: { useUTC: false },
        lang: { decimalPoint: '.', thousandsSep: ',' }
    }
  }

  // DOM MAP RENDER
  renderReceiptList() {
      return this.props.recipeList.map(recipe =>
        <View key={recipe.RecipeID} >
          {
            recipe.RecipeID == ""
            ? (
              <Badge
                value={'找不到食譜'}
                textStyle={{ color: Colors.backgroundColor, fontWeight: 'bold' }}
                containerStyle={{
                  backgroundColor: Colors.elementeTintColor,
                  width: screen.width-80,
                  alignSelf: 'center',
                  marginTop: 5,
                  marginBottom: 5
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => this._setFocusRecipe(recipe.RecipeID)}
              >
                <CardSection style={{borderBottomWidth: 0}} >
                  <Text style={styles.textSubColor}>{recipe.RecipeName}</Text>
                </CardSection>
              </TouchableOpacity>
            )
          }
        </View>
    );
  }

  // DOM MAJOR RENDER
  render() {
    if(this.state.isLoad){
      return(
        <ImageBackground source={require('../../assets/images/default-backgroud.png')} style={styles.backgroundImage} >
          <ScrollView style={styles.container, {marginBottom: 80}}>
            <View style={{ marginTop: 0}}>
              <FoodChart id={this.state.foodId}
                         config={this._getConf(this.props.chartData)}
                         options={this._getOptions()}
              ></FoodChart>
              <Card
                title='食譜'
                titleStyle={styles.textMainColor}
                containerStyle={styles.cardColor}
                // containerStyle={{padding: 10}}
              >
                {this.renderReceiptList()}
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      );
    }else{
      return (
        <ImageBackground source={require('../../assets/images/default-backgroud.png')} style={styles.backgroundImage} >
          <Image source={require('../../assets/gif/loading.gif')} style={styles.loading} />
        </ImageBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  },
  italics: {
    fontStyle: 'italic'
  },
	chart: {
		height: 250,
    marginTop: 30
	},
  backgroundImage: {
    width: screen.width,
    height: screen.height,
    backgroundColor: Colors.backgroundColor,
  },
  cardColor: {
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
  },
  loading: {
    width: null,
    height: null,
    marginLeft: 100,
    marginRight: 100,
    resizeMode:'contain',
    flex: 1
  },
  textMainColor: {
    fontWeight: 'bold',
    color: Colors.textMainColor
  },
  textSubColor: {
    color: Colors.textSubColor
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
