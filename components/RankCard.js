import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Button, Card } from 'react-native-elements';

import * as apis from '../api';
import * as hardcode from '../hardcode';

import Colors from '../constants/Colors-theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

class RankCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: {
        IngredientName: '',
        IngredientOriginName: ''
      },
      isSeasonal: false,
      isLoad: false
    }
    this._checkIsSeasonal = this._checkIsSeasonal.bind(this);
  }
  componentWillMount(){
    var id = this.props.id;
    this.setState({
      IngredientName: '',
      IngredientOriginName: ''
    });
    AsyncStorage.getItem('food-'+id)
      .then((item) => {
           if (item) {
             var description = JSON.parse(item);
             var isSeasonal = this._checkIsSeasonal(description.IngredientName);
             this.setState({
               description: description,
               isSeasonal: isSeasonal,
               isLoad: true
             });
           }else {
             apis.getFoodDescriptionByFoodId(id).then(({description}) => {
               AsyncStorage.setItem('food-'+id, JSON.stringify(description));
               var isSeasonal = this._checkIsSeasonal(description.IngredientName);
               this.setState({
                 description: description,
                 isSeasonal: isSeasonal,
                 isLoad: true
               });
             }).catch((error)=>{
                console.log("Api call error");
                alert(error.message);
             })
           }
      });
  }
  _checkIsSeasonal(FoodName){
      var season_vegetable = hardcode.getSeasonVegetable_NOW();
      console.log(FoodName);
      if(season_vegetable[FoodName]){
        console.log('true');
        return true;
      }else{
        console.log('false');
        return false;
      }
  }

  render() {
    var id = this.props.id;
    var imageUrl= this.props.imageUrl;
    const{ IngredientName, IngredientOriginName } = this.state.description;
    return (
      <Card
        title={IngredientName}
        titleStyle={styles.textMainColor}
        containerStyle={styles.cardColor}
        imageProps={{resizeMode: 'contain'}}
        image={{uri: imageUrl, cache: 'reload'}} >
        <View style={styles.detailWrapper}>
          <Text style={styles.italics, styles.textSubColor}>{IngredientOriginName}</Text>
        </View>
      </Card>
    );

  }
}

const styles = {
  detailWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  cardColor: {
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
  },
  textMainColor: {
    fontWeight: 'bold',
    color: Colors.textMainColor
  },
  textSubColor: {
    color: Colors.textSubColor
  },
  italics: {
    fontStyle: 'italic'
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

export default RankCard;
