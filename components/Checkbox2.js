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
            <Text key={id}>
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
      if(isChecked){
        return (
            <View style={styles.wrapper, styles.rowColor}>
                <View style={styles.rowWrapper}>
                  <View  style={styles.recipeText} >
                    {this.renderVegetRankList()}
                  </View>
                  <View style={styles.recipeIcon} >
                    <Icon
                      name='check-square-o'
                      type='font-awesome'
                      color='#f50'
                      iconStyle={{padding:3}}/>
                  </View>
                </View>
            </View>
        );
      }else{
        return (
            <View style={styles.wrapper, styles.rowColor}>
                <View style={styles.rowWrapper}>
                  <View  style={styles.recipeText} >
                    {this.renderVegetRankList()}
                  </View>
                  <View style={styles.recipeIcon} >
                    <Icon
                      name='square-o'
                      type='font-awesome'
                      color='#f50'
                      iconStyle={{padding:3}}/>
                  </View>
                </View>
            </View>
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
  },
  rowColor: {
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
  },
};
