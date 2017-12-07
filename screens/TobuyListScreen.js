import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoLinksView } from '@expo/samples';
import _ from 'lodash';

import { connect } from 'react-redux';
import { Badge, Button, Card, ListItem, List, Icon } from 'react-native-elements';

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
    this._cleanTonuyList = this._cleanTonuyList.bind(this);
    this._switchToRecipeList = this._switchToRecipeList.bind(this);
    this._switchToFoodList = this._switchToFoodList.bind(this);
    this._setFocusRecipe = this._setFocusRecipe.bind(this);
  }
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: '購物清單-'+params.title,

      headerLeft: <Icon
                    name='delete'
                    color={Colors.headerTintColor}
                    containerStyle={{ marginLeft: 10}}
                    onPress={() => params.cleanTobuy()}
                  />,
      headerRight: <Badge value={params.next}
                      textStyle={{
                        color: Colors.headerColor,
                        fontWeight: 'bold' }}
                      containerStyle={{
                        marginRight: 10,
                        backgroundColor: Colors.headerTintColor}}
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
      handleSave: this._switchToRecipeList,
      cleanTobuy: this._cleanTonuyList
    });
  }

  componentWillMount(){
    this.props.initToBuyList();
  }

  _cleanTonuyList(){
    Alert.alert(
      '是否清空購物清單',
      '',
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '確認', onPress: () => this.props.cleanTobuyList()},
      ],
      { cancelable: false }
    )
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

  _setFocusRecipe(recipeId){
    this.props.navigation.navigate('RecipeDetail', { 'recipeId': recipeId })
  }


  // Modal 1: Recipe
  renderToBuyScreen(){
    if(this.state.page == '食材'){
      return(
        <TobuyFoodScreen></TobuyFoodScreen>
      );
    }else if(this.state.page == '食譜'){
      return(
          <TobuyRecipeScreen onSetFocusRecipe={this._setFocusRecipe}></TobuyRecipeScreen>
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
            textStyle={{ color: Colors.backgroundColor, fontWeight: 'bold' }}
            containerStyle={{
              backgroundColor: Colors.elementeTintColor,
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
          <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.container} >
            <Image source={require('../assets/gif/loading.gif')} style={styles.loading} />
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
    width: null,
    height: null,
    marginLeft: 100,
    marginRight: 100,
    resizeMode:'contain',
    flex: 1
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
