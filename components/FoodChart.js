import React, { Component } from 'react';
import Expo from 'expo';
import { connect } from 'react-redux';
import { View, Text, AsyncStorage, ScrollView, ListView, TouchableOpacity, Image } from 'react-native';
import { Card, ListItem, Button, List } from 'react-native-elements'
import ReactDOM from 'react-dom';
import ChartView from 'react-native-highcharts';
import _,{ random, range } from 'lodash';

import * as actions from '../actions';


class FoodChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: {
        IngredientName: '',
        IngredientOriginName: ''
      },
      isLoad: false,
    }

  }


  componentWillMount(nextProps) {
      var foodid = this.props.foodid;
      AsyncStorage.getItem('food-'+foodid)
        .then((item) => {
             if (item) {
               this.setState({
                 description: JSON.parse(item),
                 isLoad: true
               });
             }else {
               apis.getFoodDescriptionByFoodId(id).then(({description}) => {
                 AsyncStorage.setItem('food-'+id, JSON.stringify(description));
                 this.setState({
                   description: description,
                   isLoad: true
                 });
               }).catch((error)=>{
                  console.log("Api call error");
                  alert(error.message);
               })
             }
        });
    }

  updateData() {
    const { chartData, chartDay, chart } = this.props;
      // this.data[0] = this.props.chart;
      // this.options.axisX.tickValues = this.props.chartDay;
      var Highcharts='Highcharts';
      var conf={
              chart: {
                  type: 'spline',
                  animation: Highcharts.svg, // don't animate in old IE
                  marginRight: 10,
                  // events: {
                  //     load: function () {
                  //
                  //         // set up the updating of the chart each second
                  //         var series = this.series[0];
                  //         setInterval(function () {
                  //             var x = (new Date()).getTime(), // current time
                  //                 y = Math.random();
                  //             series.addPoint([x, y], true, true);
                  //         }, 1000);
                  //     }
                  // }
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
          };

      const options = {
          global: { useUTC: false },
          lang: { decimalPoint: ',', thousandsSep: '.' }
      };
      return { conf, options };
  }

  render() {
    if(this.state.isLoad){
      const { conf, options } = this.updateData();
      return (
        <View>
          <ChartView style={{height:300}} config={conf} options={options}></ChartView>
        </View>
      );
    }else{
      return (
        <Image source={require('../assets/gif/loading04.gif')} style={styles.loading} />
      );
    }
  }

}



const styles = {
  italics: {
    fontStyle: 'italic'
  },
  detailWrapper: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  container: {
		flex: 1,
	  marginBottom: 10,
	  marginTop: 50,
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'white',
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
}

function mapStateToProps({ foodChart }){
  return {
    maxPoints: 120,
    foodid: foodChart.foodid,
    chart: foodChart.chart,
    chartDay: foodChart.chartDay,
    chartData: foodChart.chartData,
    recipe: foodChart.recipe,
    isLoad: foodChart.isLoad
   };
}

export default connect(mapStateToProps, actions)(FoodChart);
