import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Button, Card } from 'react-native-elements';
import * as apis from '../api';


const SCREEN_WIDTH = Dimensions.get('window').width;

class RankCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: {
        IngredientName: '',
        IngredientOriginName: ''
      },
      isLoad: false
    }
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
             this.setState({
               description: JSON.parse(item),
               isLoad: true
             });
           }else {
             apis.getFoodDescriptionByFoodId(id).then(({description}) => {
               AsyncStorage.setItem('food-'+id, JSON.stringify(description));
               this.setState({
                 description: description,
                 isLoad: true
               });
             }).catch((error)=>{
                console.log("Api call error");
                alert(error.message);
             })
           }
      });
  }

  render() {
    var id = this.props.id;
    var imageUrl= this.props.imageUrl;
    if(this.state.isLoad){
      const{ IngredientName, IngredientOriginName } = this.state.description;
      return (
        <Card
          title={IngredientName}
          imageProps={{resizeMode: 'cover'}}
          image={{uri: imageUrl}} >
          <View style={styles.detailWrapper}>
            <Text style={styles.italics}>{IngredientOriginName}</Text>
          </View>
        </Card>
      );
    }else{
      return (
        <Card
          image={require('../assets/gif/card-loading.gif')} >
          <View style={styles.detailWrapper}>
          </View>
        </Card>
      );
    }

  }
}

const styles = {
  detailWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
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
