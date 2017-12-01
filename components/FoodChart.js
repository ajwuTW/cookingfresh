import React, { Component } from 'react';
import Expo from 'expo';
import { View, Text, Dimensions, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Icon, Card } from 'react-native-elements'
import ChartView from 'react-native-highcharts';

import {Button}   from './common/Button';

var screen = Dimensions.get('window');

export default class FoodChart extends Component {

    constructor(props) {
      super(props);
      this.state = {
        config: props.config,
        options: props.options,
        description: {
          IngredientName: '',
          IngredientOriginName: ''
        },
        isLoad: false
      }
    }
    componentDidMount(){
      this.setState({
        isLoad: true
      })
    }

    render() {
      const { config, options } = this.props;
      if(this.state.isLoad){
        return (
          <Card>
            <ChartView style={{height:300}}
                       config={config}
                       options={options}
            ></ChartView>
          </Card>
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
  wrapper: {
    paddingTop: 0,
    width: screen.width,
    flex: 1
  },
  contentWrapper: {
    flex: 1,
    width: screen.width,
    flexDirection: 'row',
    justifyContent:'space-around'
  },
  contentType: {
    width:  screen.width/4,
    height: screen.height/4,
  },
  rowWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: screen.width
  },
  recipeText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    padding:2
  },
  recipeIcon: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  }
};
