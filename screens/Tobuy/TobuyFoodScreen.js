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

import * as actions from '../../actions';
import * as apis from '../../api';

import Colors from '../../constants/Colors-theme';

import Checkbox2  from '../../components/Checkbox2';

var screen = Dimensions.get('window');

class TobuyFoodScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      fadeAnim: new Animated.Value(0)
    }
    this._multiply = this._multiply.bind(this);
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: `購物清單-食材`,
      headerTintColor: Colors.headerTintColor,
      headerStyle: {
         backgroundColor: Colors.headerColor
      }
    };
  };

  componentWillMount(){
    this.props.getToBuyList();
  }

  _multiply(x, y){
    var cf = 10
    return (x * cf) * (y * cf) / (cf * cf)
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
        var sum = this._multiply(food.IngredientQty, food.count);
        var unit = food.IngredientUnit;
        var content = [
          {id: 'name',text: uid},
          {id: 'sumUnit',text: sum+' '+unit}
        ];
        return(
          <TouchableOpacity
            key={uid}
            onPress={()=>this._setFoodChecked(food, uid, checked )}>
            <View style={styles.rowColor}>
              <Checkbox2
                isChecked={checked}
                content={content}
              />
            </View>
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
            <View style={styles.rowColor}>
              <Checkbox2 isChecked={checked} content={content} />
            </View>
          </TouchableOpacity>
        );
      });
  }

  render() {
      return(
        <ScrollView>
            {this.renderToBuyFoodCheckBoxList()}
            {this.renderToBuyExceptionCheckBoxList()}
        </ScrollView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  wrapper: {
    width: screen.width,
    paddingTop: 3,
    flex: 1,
  },
  loading: {
    resizeMode:'contain'
  },
  rowColor: {
    padding:5, margin:8,
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
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


export default connect(mapStateToProps, actions)(TobuyFoodScreen);
