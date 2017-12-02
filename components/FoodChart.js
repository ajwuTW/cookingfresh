import React, { Component } from 'react';
import Expo from 'expo';
import { View, Text, Dimensions, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Icon, Card } from 'react-native-elements'
import ChartView from 'react-native-highcharts';

import Colors from '../constants/Colors-theme';

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
        return (
          <Card
            titleStyle={styles.textMainColor}
            containerStyle={styles.cardColor, { padding: 0 }}>
            <ChartView style={{height:300}}
                       config={config}
                       options={options}
            ></ChartView>
          </Card>
        );
    }

}

const styles = {
  cardColor: {
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
  },
  textMainColor: {
    color: Colors.textMainColor
  },
  textSubColor: {
    color: Colors.textSubColor
  },
};
