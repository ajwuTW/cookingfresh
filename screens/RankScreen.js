import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { connect } from 'react-redux';
import { Card, Button, ButtonGroup, SocialIcon, ListItem, List } from 'react-native-elements';
import Modal from 'react-native-modalbox';

import * as actions from '../actions';
import * as apis from '../api';

import RankCard  from '../components/RankCard';
import { CardSection } from '../components/common';

class RankScreen extends React.Component {

  constructor(props) {
    super(props);
    this._setFocusFood = this._setFocusFood.bind(this);
  }

  static navigationOptions = {
    title: '排行榜',
    headerTintColor: "#2c3e50",
    headerStyle: {
     backgroundColor:"#f1c40f"
   }
  };

  state = {
    mapLoaded: false,
    isOpen: false,
    isDisabled: false,
    swipeToClose: true,
    sliderValue: 0.3,
    selectedIndex: 0,
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount() {
    this._AnimatedStart(1, 1000);
  }

  _AnimatedStart(value, duration){
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: value,
        duration: duration
      }
    ).start();
  }

  _setFocusFood(category, id){
    this.props.navigation.navigate('FoodChart', { 'foodId': id, 'category': category  })
  }

  // 蔬菜果花卉排行榜
  renderVegetRankList(){
      return this.props.results_vegetable.map(rank =>{
          var id= rank.id;
          var uri = `http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${id}.jpg`;
          return(
            <TouchableOpacity
              key={rank.id}
              onPress={() => this._setFocusFood('vegetable', rank.id)} >
              <RankCard id={id} imageUrl={uri} ></RankCard>
            </TouchableOpacity>
          );
      });
  }

  // 漁貨排行榜
  renderFishRankList(){
      return this.props.results_fish.map(rank =>{
          var id= rank.id;
          var uri = `http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${id}.jpg`;
          return(
            <TouchableOpacity
              key={id}
              onPress={() => this._setFocusFood('fish', rank.id)} >
              <RankCard id={id} imageUrl={uri} ></RankCard>
            </TouchableOpacity>
          );
      });
  }


  scrollView(selectedIndex, buttons){
      var updateIndex = this.updateIndex.bind(this);
      let { fadeAnim } = this.state;

      var BContent = <Button onPress={() => this.setState({isOpen: false})} style={[styles.btn, styles.btnModal]}>X</Button>;
      switch(selectedIndex){
        case 0:
          return (
            <View style={styles.wrapper}>
              <ButtonGroup
                onPress={updateIndex}
                selectedIndex={selectedIndex}
                selectedBackgroundColor='#1abc9c'
                buttons={buttons}
                containerStyle={{height: 40}} />
              <ScrollView >
                <Animated.View style={{opacity: fadeAnim}}>
                  {this.renderVegetRankList()}
                </Animated.View>
              </ScrollView>
            </View>
          );
          break;
        case 1:
          return (
            <View style={styles.wrapper}>
              <ButtonGroup
                onPress={updateIndex}
                selectedIndex={selectedIndex}
                selectedBackgroundColor='#1abc9c'
                buttons={buttons}
                containerStyle={{height: 40}} />
              <ScrollView >
                <Animated.View style={{opacity: fadeAnim}}>
                  {this.renderFishRankList()}
                </Animated.View>
              </ScrollView>
            </View>
          );
          break;
        default:
      }
    }

  updateIndex (selectedIndex) {
    this._AnimatedStart(0, 0);
    this._AnimatedStart(1, 500);
    this.setState({selectedIndex})
  }

  render() {
    const component1 = () => <Text>蔬果</Text>
    const component2 = () => <Text>漁貨</Text>
    const buttons = [{ element: component1 }, { element: component2 }];
    const { selectedIndex } = this.state;

    if(this.props.isLoad){
      switch (selectedIndex) {
        case 0:
          return(
            this.scrollView(selectedIndex ,buttons)
          );
          break;
        case 1:
          return(
            this.scrollView(selectedIndex ,buttons)
          );
          break;
        default:
      }
    }else{
      return (
          <Image source={require('../assets/gif/loading04.gif')} style={styles.loading} />
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
});


function mapStateToProps({ rank }){
  return {
    results_vegetable: rank.results_vegetable,
    results_fish: rank.results_fish,
    isLoad: rank.isLoad,
    isLogin: rank.isLogin
  };
}


export default connect(mapStateToProps, actions)(RankScreen);
