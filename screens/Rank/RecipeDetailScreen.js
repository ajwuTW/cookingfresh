import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  View,
  Text,
  Dimensions,
  ImageBackground
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { connect } from 'react-redux';
import { Badge, Button, Card, ListItem, List } from 'react-native-elements';

import * as actions from '../../actions';
import * as apis from '../../api';

import Colors from '../../constants/Colors-theme';

import { CardSection } from '../../components/common';

var screen = Dimensions.get('window');

class RecipeDetailScreen extends React.Component {

  // INITIAL
  constructor(props) {
    super(props);
    this.state ={
      isLoad:false
    }
  }

  static navigationOptions = {
    title: '食譜',
    headerTintColor: Colors.headerTintColor,
    headerStyle: {
     backgroundColor: Colors.headerColor
   }
  };

  // LIFE CYCLE
  componentDidMount(){
    const { recipeId } = this.props.navigation.state.params;
    this.props.setFocusRecipeId(recipeId, this.props.isLogin, this.props.uid);
  }

  componentWillUnmount(){
    this.props.initRecipeDetailScreen();
  }

  _onCarPressButton(){
    const { isExists } = this.props;
    if(isExists){
      alert("此食譜已存在在購物清單內");
    }else{
      this.props.setRecipeToCarStatusReset();
      this.props.setRecipeToCar(this.props);
      alert("新增成功");
    }
  }

  renderFoodList() {
      return this.props.food.map(food =>
        <View key={food.IngredientName} >
            <CardSection style={{borderBottomWidth: 0}} >
                <Text style={styles.textSubColor}>{food.IngredientName}</Text>
                <Text style={styles.textSubColor}>{food.IngredientQty+' '+food.IngredientUnit}</Text>
            </CardSection>
        </View>
    );
  }

  renderExceptionList() {
      return this.props.exception.map(exception =>
        <View key={exception.IngredientName} >
            <CardSection style={{borderBottomWidth: 0}} >
                <Text style={styles.textSubColor}>{exception.IngredientName}</Text>
                <Text style={styles.textSubColor}>{exception.IngredientUnit}</Text>
            </CardSection>
        </View>
    );
  }

  renderStepDetail(step) {
      var stepImgUri = step.StepPicture;
      if(stepImgUri !== ""){
        return (
          <View>
          <Image
            style={{width: screen.width-50, height: screen.height/3, resizeMode: 'contain'}}
            source={{uri: stepImgUri}}/>
            <CardSection style={{borderBottomWidth: 0, padding: 5}} >
                <Text style={styles.textSubColor}>{step.StepSeq+'. '+step.StepContent}</Text>
            </CardSection>
          </View>
        );
      }else{
        return (
          <CardSection style={{borderBottomWidth: 0}} >
              <Text style={styles.textSubColor}>{step.StepSeq+'. '+step.StepContent}</Text>
          </CardSection>
        );
      }

  }

  renderStepList() {
      return this.props.step.map(step =>
        <View key={step.StepSeq} >
          {this.renderStepDetail(step)}
        </View>
    );
  }

  render() {
    if(this.props.isLoad){
      const resizeMode = 'center';
      return (
        <ImageBackground source={require('../../assets/images/default-backgroud.png')} style={styles.container} >
          <ScrollView style={{marginBottom: 10 }}>
            <View style={{ marginTop: 0, width: screen.width}}>
              <Card
                titleStyle={styles.textMainColor}
                containerStyle={styles.cardColor}
                image={{uri: this.props.description.RecipePicture}}
                title={this.props.description.RecipeName}
                imageStyle={{ height: 200 }}
              >
                <View style={styles.detailWrapper}>
                  <Text style={styles.italics, styles.textSubColor}>{this.props.description.RecipeUnit+' 人份'}</Text>
                </View>
                {
                  this.props.isLogin
                  ? (
                    <Button
                      raised icon={{name: 'add'}}
                      backgroundColor='#1abc9c'
                      textStyle={styles.textMainColor}
                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}, styles.buttonColor}
                      onPress={() => this._onCarPressButton()}
                      title='加入購物清單' />
                  ) : (
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
                  )
                }
              </Card>
              <Card title='食材'
                titleStyle={styles.textMainColor}
                containerStyle={styles.cardColor}
              >
                {this.renderFoodList()}
              </Card>
              <Card title='其他材料'
                titleStyle={styles.textMainColor}
                containerStyle={styles.cardColor}
              >
                {this.renderExceptionList()}
              </Card>
              <Card title='步驟'
                titleStyle={styles.textMainColor}
                containerStyle={styles.cardColor}
              >
                {this.renderStepList()}
              </Card>
            </View>
          </ScrollView>
        </ImageBackground>
      );
    }else{
      return (
        <ImageBackground source={require('../../assets/images/default-backgroud.png')} style={styles.container} >
          <Image source={require('../../assets/gif/loading.gif')} style={styles.loading} />
        </ImageBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 0,
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  detailWrapper: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  loading: {
    width: null,
    height: null,
    marginLeft: 100,
    marginRight: 100,
    resizeMode:'contain',
    flex: 1
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
  buttonColor: {
    backgroundColor: Colors.headerColor
  }
});


function mapStateToProps({ recipeDetail, auth }){
  return {
    recipeid: recipeDetail.recipeid,
    description: recipeDetail.description,
    food: recipeDetail.food,
    exception: recipeDetail.exception,
    step: recipeDetail.step,
    isLoad: recipeDetail.isLoad,
    isExists: recipeDetail.isExists,
    isLogin: auth.isLogin,
    uid: auth.firebase.uid
   };
}

export default connect(mapStateToProps, actions)(RecipeDetailScreen);
