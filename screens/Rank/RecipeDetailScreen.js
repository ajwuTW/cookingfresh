import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Image,
  View,
  Text,
  Dimensions
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { connect } from 'react-redux';
import { Badge, Button, Card, ListItem, List } from 'react-native-elements';

import * as actions from '../../actions';
import * as apis from '../../api';

var screen = Dimensions.get('window');

class RecipeDetailScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '食譜',
    headerTintColor: "#2c3e50",
    headerStyle: {
     backgroundColor:"#f1c40f"
   }
  };

  componentWillMount(){
    // console.log("params4");
    // console.log(this.props.navigation.state.params);
    const { recipeId } = this.props.navigation.state.params;
    this.props.setFocusRecipeId({'id': recipeId});
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
                <Text>{food.IngredientName}</Text>
                <Text>{food.IngredientQty+' '+food.IngredientUnit}</Text>
            </CardSection>
        </View>
    );
  }

  renderExceptionList() {
      return this.props.exception.map(exception =>
        <View key={exception.IngredientName} >
            <CardSection style={{borderBottomWidth: 0}} >
                <Text>{exception.IngredientName}</Text>
                <Text>{exception.IngredientUnit}</Text>
            </CardSection>
        </View>
    );
  }

  renderStepDetail(step) {
      var stepImgUri = step.StepPicture;
      if(stepImgUri !== ""){
        return (
          <View>
            <CardSection style={{borderBottomWidth: 0, justifyContent:'center'}} >
                <Image
                  style={{width: screen.width/2, height: screen.height/5}}
                  source={{uri: stepImgUri}}/>
            </CardSection>
            <CardSection style={{borderBottomWidth: 0}} >
                <Text>{step.StepSeq+'. '+step.StepContent}</Text>
            </CardSection>
          </View>
        );
      }else{
        return (
          <CardSection style={{borderBottomWidth: 0}} >
              <Text>{step.StepSeq+'. '+step.StepContent}</Text>
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
      if(this.props.isLogin){
        console.log(this.props.description);
        return (
          <View style={styles.wrapper}>
            <ScrollView style={{marginBottom: 100 }}>
              <View style={{ marginTop: 10, width: screen.width}}>
                <Card
                  image={{uri: this.props.description.RecipePicture}}
                  title={this.props.description.RecipeName}
                  imageStyle={{ height: 200 }}
                >
                  <View style={styles.detailWrapper}>
                    <Text style={styles.italics}>{this.props.description.RecipeUnit+' 人份'}</Text>
                  </View>
                  <Button
                    raised icon={{name: 'add'}}
                    backgroundColor='#1abc9c'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    onPress={() => this._onCarPressButton()}
                    title='加入購物清單' />
                </Card>
                <Card title='食材' containerStyle={{padding: 10}} >
                  {this.renderFoodList()}
                </Card>
                <Card title='其他材料' containerStyle={{padding: 10}} >
                  {this.renderExceptionList()}
                </Card>
                <Card title='步驟' containerStyle={{padding: 10}} >
                  {this.renderStepList()}
                </Card>
              </View>
            </ScrollView>
          </View>
        );
      }else{
        return (
          <View style={styles.wrapper}>
            <ScrollView style={{marginBottom: 100 }}>
              <View style={{ marginTop: 10, width: screen.width}}>
                <Card
                  image={{uri: this.props.description.RecipePicture}}
                  title={this.props.description.RecipeName}
                  imageStyle={{ height: 200 }}
                >
                  <View style={styles.detailWrapper}>
                    <Text style={styles.italics}>{this.props.description.RecipeUnit+' 人份'}</Text>
                  </View>

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
                </Card>
                <Card title='食材' containerStyle={{padding: 10}} >
                  {this.renderFoodList()}
                </Card>
                <Card title='其他材料' containerStyle={{padding: 10}} >
                  {this.renderExceptionList()}
                </Card>
                <Card title='步驟' containerStyle={{padding: 10}} >
                  {this.renderStepList()}
                </Card>
              </View>
            </ScrollView>
          </View>
        );
      }
    }else{
      return (
        <Image source={require('../../assets/gif/loading04.gif')} style={styles.loading} />
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
    paddingTop: 15,
    backgroundColor: '#fff',
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
  }
});


function mapStateToProps({ recipeDetail }){
  console.log('recipeDetail');
    console.log(recipeDetail);
  return {
    recipeid: recipeDetail.recipeid,
    description: recipeDetail.description,
    food: recipeDetail.food,
    exception: recipeDetail.exception,
    step: recipeDetail.step,
    isLoad: recipeDetail.isLoad,
    isLogin: recipeDetail.isLogin,
    isExists: recipeDetail.isExists
   };
}

export default connect(mapStateToProps, actions)(RecipeDetailScreen);
