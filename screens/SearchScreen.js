import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { List, ListItem, SearchBar, Badge, Card } from "react-native-elements";
import { connect } from 'react-redux';

import * as actions from '../actions';
import * as apis from '../api';

import Colors from '../constants/Colors-theme';

import RankCard  from '../components/RankCard';

var screen = Dimensions.get('window');

class SearchScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      sort: '食材',
      searchText: '',
      maxPageSize: 1
    };
    this._switchToRecipeList = this._switchToRecipeList.bind(this);
    this._switchToFoodList = this._switchToFoodList.bind(this);
    this._initlPageState = this._initlPageState.bind(this);
    this._setFocusFood = this._setFocusFood.bind(this);
    this._setFocusRecipe = this._setFocusRecipe.bind(this);
  }
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: '搜尋-'+params.title,
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
      handleSave: this._switchToRecipeList
    });
      // this.makeRemoteRequest();
  }


  _initlPageState() {
    this.setState({
      data: [],
      error: null,
      loading: false,
      refreshing: true,
      searchText: '',
      maxPageSize: 1,
      page: 1
    });
  }

  _switchToRecipeList(){
    const { searchText } = this.state;
    this._initlPageState();
    this.changeText(searchText);
    this.setState({'sort': '食譜'});
    this.props.navigation.setParams(
      {
      title: `食譜`,
      next: `食材`,
      handleSave: this._switchToFoodList
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  }

  _switchToFoodList(){
    const { searchText } = this.state;
    this._initlPageState();
    this.changeText(searchText);
    this.setState({
      'sort': '食材'
    });
    this.props.navigation.setParams(
      {
        title: `食材`,
        next: `食譜`,
        handleSave: this._switchToRecipeList
      }
    );
  }

  _setFocusFood(category, id){
    this.props.navigation.navigate('FoodChart', { 'foodId': id, 'category': category  })
  }
  _setFocusRecipe(recipeId){
    this.props.navigation.navigate('RecipeDetail', { 'recipeId': recipeId })
  }

  makeRemoteRequest = () => {
    const { page, seed, sort, searchText, maxPageSize } = this.state;
    if(page>maxPageSize){
      return;
    }
    this.setState({ loading: true });
    var pageSize = 10;
    if(this.state.sort == '食材'){
      apis.getFoodListByFoodText(searchText, page, pageSize)
        .then(({Info, Ingredient}) => {
          this.setState({
            data: page === 1 ? Ingredient : [...this.state.data, ...Ingredient],
            loading: false,
            refreshing: false,
            maxPageSize: Info.TotalPage
          });
        });
    }else if(this.state.sort == '食譜'){
      apis.getRecipeListByRecipeText(searchText, page, pageSize)
        .then(({Info, Recipe}) => {
          this.setState({
            data: page === 1 ? Recipe : [...this.state.data, ...Recipe],
            loading: false,
            refreshing: false,
            maxPageSize: Info.TotalPage
          });
        });
    }

  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  changeText = (text) => {
    this._initlPageState();
    this.setState(
      {
        searchText: text,
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderHeader = () => {
    return (
        <SearchBar
          icon={{ color: Colors.unfocusColor, name: 'search' }}
          inputStyle={{backgroundColor: Colors.backgroundColor, color:Colors.elementeTintColor}}
          placeholderTextColor={Colors.unfocusColor}
          containerStyle={styles.searchBarColor}
          onChangeText={this.changeText}

          placeholder={`請輸入${this.state.sort}名稱`}
          lightTheme round />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 0,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderItem = ({item}) => {
    if(item.IngredientId == "" || item.RecipeID == ""){
      return (
        <View style={styles.wrapper}>
          <Badge
            value={'無資料'}
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
    }else if(this.state.sort == '食材'){
      return (
        <TouchableOpacity
          // key={item.id+'touch'}
          onPress={() => this._setFocusFood(item.IngredientKind, item.IngredientId)} >
          <RankCard
            id={item.IngredientId}
            imageUrl={`http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${item.IngredientId}.jpg`}
          ></RankCard>
        </TouchableOpacity>
      );
    }else if(this.state.sort == '食譜'){
      return (
        <TouchableOpacity
          key={item.RecipeID}
          onPress={() => this._setFocusRecipe(item.RecipeID)} >
          <Card
            titleStyle={styles.textMainColor}
            containerStyle={styles.cardColor}
            title={item.RecipeName}
            imageProps={{resizeMode: 'cover'}}
            image={{uri: item.RecipePicture}} >
          </Card>
        </TouchableOpacity>
      );
    }
  };

  render() {
    return (
      <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
        {this.renderHeader()}
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0, backgroundColor: Colors.backgroundColor }}>
          <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.backgroundImage} >
            <FlatList
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={item => item.IngredientId||item.RecipeID || 'null'}
              ItemSeparatorComponent={this.renderSeparator}
              // ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              // onRefresh={this.handleRefresh}
              // refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={1}
            />
          </ImageBackground>
        </List>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  backgroundImage: {
    width: screen.width,
    backgroundColor: Colors.backgroundColor,
  },
  searchBarColor: {
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
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
  }
});


function mapStateToProps({ rank }){
  return rank;
}


export default connect(mapStateToProps, actions)(SearchScreen);
