import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Button, Card, Tile, Badge } from 'react-native-elements';

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
    AsyncStorage.removeItem('food-'+id);
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
                console.log(error.message);
             })
           }
      });
  }
  _checkIsSeasonal(FoodName){
      var season_vegetable = hardcode.getSeasonVegetable_NOW();
      // console.log(season_vegetable[FoodName]);
      if(season_vegetable[FoodName]){
        return true;
      }else{
        return false;
      }
  }

  render() {
    var imageUrl= this.props.imageUrl;
    const{ IngredientName, IngredientOriginName } = this.state.description;
    return (
      <View
        style={{paddingTop:20}}>
        <Tile
          imageSrc={{uri: imageUrl, cache: 'reload'}}
          title={IngredientName}
          titleStyle={styles.textMainColor}
          containerStyle={styles.cardColor}
          onPress={this.props.onPress}
          contentContainerStyle={{height: 70, marginTop:0}}
        >
            {
              this.state.isSeasonal
              ?(
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>{IngredientOriginName}</Text>
                  <Badge value='當季'
                      textStyle={{color: Colors.headerTintColor}}
                      containerStyle={{ marginRight: 10, backgroundColor: Colors.headerColor}}
                   />
               </View>
              ):(
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text>{IngredientOriginName}</Text>
                  <Text></Text>
               </View>
              )
            }
        </Tile>
      </View>
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
