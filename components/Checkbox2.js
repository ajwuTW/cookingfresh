import React, { Component } from 'react';
import Expo from 'expo';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors-theme';

import {Button}   from './common/Button';

var screen = Dimensions.get('window');

export default class Checkbox2 extends Component {

    renderVegetRankList(){
      return this.props.content.map(content =>{
          var id= content.id;
          return(
            <Text key={id} style={styles.textMainColor}>
              {content.text}
            </Text>
          );
      });
    }

    render() {
      var isChecked = this.props.isChecked;
      var food= this.props.food;
      var uid= this.props.uid;
      var checked = this.props.checked;
      return (
          <View style={styles.wrapper, styles.rowColor}>
              <View style={styles.rowWrapper}>
                <View  style={styles.recipeText} >
                  {this.renderVegetRankList()}
                </View>
                <View style={styles.recipeIcon} >
                  {
                    isChecked
                    ? (
                      <Icon
                        name='check-square-o'
                        type='font-awesome'
                        color={Colors.elementeTintColor}
                        iconStyle={{padding:5}}/>
                    ) : (
                      <Icon
                        name='square-o'
                        type='font-awesome'
                        color={Colors.elementeTintColor}
                        iconStyle={{padding:5}}/>
                    )
                  }
                </View>
              </View>
          </View>
      );
    }
}

const styles = {
  wrapper: {
    paddingTop: 0,
    width: screen.width,
    flex: 1
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
    marginRight: 15,
  },
  rowColor: {
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
