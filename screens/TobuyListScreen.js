import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoLinksView } from '@expo/samples';
import _ from 'lodash';

import { connect } from 'react-redux';
import { Badge, Button, Card, ListItem, List } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import Checkbox2  from '../components/Checkbox2';

var screen = Dimensions.get('window');

class TobuyListScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      fadeAnim: new Animated.Value(0)
    }
    this._switchToRecipeList = this._switchToRecipeList.bind(this);
  }
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: `購物清單-食材`,
      headerRight: <Badge value="食譜"
                      containerStyle={{ marginRight: 10}}
                      onPress={() => params.handleSave()}
                   />,
      headerTintColor: "#2c3e50",
      headerStyle: {
         backgroundColor:"#f1c40f"
      }
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this._switchToRecipeList });
  }

  componentWillMount(){
    this.props.getToBuyList();
  }

  _switchToRecipeList(){
    if(this.props.isLogin){
      this.props.navigation.navigate('TobuyRecipe');
    }else{
      alert("請先登入 Facebook");
    }

  }

  _setFoodChecked(food, uid, checked){
    if(checked){
      this.props.setFoodChecked({uid, Checked: false});
    }else{
      this.props.setFoodChecked({uid, Checked: true});
    }
  }
  _setExceptionChecked(exception, uid, checked){
    if(checked){
      this.props.setExceptionChecked({uid, Checked: false});
    }else{
      this.props.setExceptionChecked({uid, Checked: true});
    }
  }

  // Page 1: Food
  renderToBuyFoodCheckBoxList(){
      return this.props.food.map(food =>{
        var uid= food.uid;
        var checked = food.Checked;
        var sum = food.IngredientQty*food.count;
        var unit = food.IngredientUnit;
        var content = [
          {id: 'name',text: uid},
          {id: 'sumUnit',text: sum+' '+unit}
        ];
        return(
          <TouchableOpacity
            key={uid}
            onPress={()=>this._setFoodChecked(food, uid, checked )}>
            <Checkbox2
              isChecked={checked}
              content={content}
            />
          </TouchableOpacity>
        );
      });
  }
  // Page 1: exception
  renderToBuyExceptionCheckBoxList(){
      return this.props.exception.map(exception =>{
        var uid= exception.uid;
        var checked = exception.Checked;
        var unit = exception.IngredientUnit;
        var content = [
          {id: 'name',text: uid},
          {id: 'unit',text: unit}
        ];
        return(
          <TouchableOpacity
            key={uid}
            onPress={()=>this._setExceptionChecked(exception, uid, checked )}>
            <Checkbox2
              isChecked={checked}
              content={content}
            />
          </TouchableOpacity>
        );
      });
  }
  // Modal 1: Recipe
  renderToBuyRecipeCheckBoxList(){
      return this.props.list.map(list =>{
        var uid= list.uid;
        var count = list.count;
        return(
          <RecipeCheckBoxRow
            key={uid}
            uid={uid}
            count={count}
            onPlusPress={this._plusRecipeQty}
            onMinusPress={this._minusRecipeQty}
          ></RecipeCheckBoxRow>
        );
      });
  }

  render() {
    let { fadeAnim } = this.state;
    if(!this.props.isLogin){
      return (
        <View style={styles.wrapper}>
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
        </View>
      );
    }
    if(this.props.isLoad){
      return(
        <View style={styles.wrapper}>
          <ScrollView
            style={{ backgroundColor: 'white' }}
          >
              {this.renderToBuyFoodCheckBoxList()}
              {this.renderToBuyExceptionCheckBoxList()}
          </ScrollView>
        </View>
      );
    }else{
      return (
          <ScrollView
            style={{ backgroundColor: 'white' }}
          >
            <Image source={require('../assets/gif/loading04.gif')} style={styles.loading} />
          </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    flex: 1,
  },
  loading: {
    resizeMode:'contain'
  },
});


function mapStateToProps({ toBuy }){
  const food = _.map(toBuy.food,(val, uid) => {
    return { ...val, uid };
  });

  const list = _.map( toBuy.list ,(val, uid) => {
    return { ...val, uid };
  });
  const exception = _.map( toBuy.exception ,(val, uid) => {
    return { ...val, uid };
  });

  return {
    food: food,
    list: list,
    exception: exception,
    isLoad: toBuy.isLoad,
    isLogin: toBuy.isLogin
   };
}


export default connect(mapStateToProps, actions)(TobuyListScreen);
