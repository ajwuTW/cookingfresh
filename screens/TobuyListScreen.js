import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoLinksView } from '@expo/samples';
import _ from 'lodash';

import { connect } from 'react-redux';
import { Badge, Button, Card, ListItem, List } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import Colors from '../constants/Colors-theme';

import TobuyFoodScreen  from './Tobuy/TobuyFoodScreen';
import TobuyRecipeScreen  from './Tobuy/TobuyRecipeScreen';

var screen = Dimensions.get('window');

class TobuyListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      'fadeAnim': new Animated.Value(0),
      'page': '食材',
      isLoad: false
    }
    this._switchToRecipeList = this._switchToRecipeList.bind(this);
    this._switchToFoodList = this._switchToFoodList.bind(this);
  }
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: '購物清單-'+params.title,
      headerRight: <Badge value={params.next}
                      containerStyle={{ marginRight: 10}}
                      onPress={() => params.handleSave()}
                   />,
      headerTintColor: Colors.headerTintColor,
      headerStyle: {
         backgroundColor: Colors.headerColor
      }
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: `食材`,
      next: `食譜`,
      handleSave: this._switchToRecipeList
    });
  }

  componentWillMount(){
    this.props.initToBuyList();
  }

  _switchToRecipeList(){
    if(this.props.isLogin){
      this.props.navigation.setParams({
        title: `食譜`,
        next: `食材`,
        handleSave: this._switchToFoodList
      });
      this.setState({'page': '食譜'});
    }else{
      alert("請先登入 Facebook");
    }
  }

  _switchToFoodList(){
    this.props.navigation.setParams({
      title: `食材`,
      next: `食譜`,
      handleSave: this._switchToRecipeList
    });
    this.setState({'page': '食材'});
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

  // Modal 1: Recipe
  renderToBuyScreen(){
    if(this.state.page == '食材'){
      return(
        <TobuyFoodScreen></TobuyFoodScreen>
      );
    }else if(this.state.page == '食譜'){
      return(
          <TobuyRecipeScreen></TobuyRecipeScreen>
      );
    }
  }

  render() {
    let { fadeAnim } = this.state;

    if( !this.props.isLoad && this.props.isLogin){
      const { isLogin, uid } = this.props;
      this.props.getToBuyList(isLogin, uid);
    }
    if(!this.props.isLogin){
      return (
        <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
          <Badge
            value={'尚未登入 Facebook'}
            textStyle={{ color: 'white' }}
            containerStyle={{
              backgroundColor: '#95a5a6',
              width: screen.width-40,
              alignSelf: 'center',
              marginTop: 10
            }}
          />
        </ImageBackground>
      );
    }else{
      if(this.props.isLoad){
        return(
          <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
            {this.renderToBuyScreen()}
          </ImageBackground>
        );
      }else{
        return (
          <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
            <ScrollView >
              <Image source={require('../assets/gif/loading04.gif')} style={styles.loading} />
            </ScrollView>
          </ImageBackground>
        );
      }
    }


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.backgroundColor
  },
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.backgroundColor
  },
  loading: {
    resizeMode:'contain'
  },
  backgroundImage: {
    flex: 1
  },
});


function mapStateToProps({ toBuy, auth }){
  const food = _.map(toBuy.food,(val, uid) => {
    return { ...val, uid };
  });

  const list = _.map( toBuy.list ,(val, uid) => {
    return { ...val, uid };
  });
  const exception = _.map( toBuy.exception ,(val, uid) => {
    return { ...val, uid };
  });
  var isLogin= false, uid='';
  if( auth.isLogin ){
    isLogin = true;
    uid = auth.firebase.uid;
  }
  return {
    food: food,
    list: list,
    exception: exception,
    isLoad: toBuy.isLoad,
    isLogin: isLogin,
    uid: uid
   };
}


export default connect(mapStateToProps, actions)(TobuyListScreen);
