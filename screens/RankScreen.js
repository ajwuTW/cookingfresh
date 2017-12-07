import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoLinksView } from '@expo/samples';
import _ from 'lodash';

import { connect } from 'react-redux';
import { Badge, Button, ButtonGroup, Card, ListItem, List, SearchBar } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import Colors from '../constants/Colors-theme';

import Checkbox2  from '../components/Checkbox2';
import RankCard  from '../components/RankCard';

var screen = Dimensions.get('window');

class RankScreen extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
        sort: '蔬果',
        searchText: '',
        pageSize: 20,
        lastKnownVal: null,
        vegetable:{
          maxPageSize: 1
        },
        seafood:{
          maxPageSize: 1
        }
      };
      this._switchToSeafoodList = this._switchToSeafoodList.bind(this);
      this._switchToVegetableList = this._switchToVegetableList.bind(this);
      this._initlPageState = this._initlPageState.bind(this);
      this._setFocusFood = this._setFocusFood.bind(this);
      this._setFocusRecipe = this._setFocusRecipe.bind(this);
    }
    static navigationOptions = ({navigation}) => {
      const { params = {} } = navigation.state;
      return {
        title: '排行榜-'+params.title,
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
        title: `蔬果`,
        next: `海鮮`,
        handleSave: this._switchToSeafoodList
      });
        this.makeRemoteRequest();
        apis.getVegetablePageConfig()
          .then(({pageTotal}) => {
            const { vegetable, pageSize } = this.state;
            vegetable.maxPageSize = Math.ceil(pageTotal/pageSize);
            this.setState({ vegetable });
          });
        apis.getSeafoodPageConfig()
          .then(({pageTotal}) => {
            const { seafood, pageSize } = this.state;
            seafood.maxPageSize = Math.ceil(pageTotal/pageSize);
            this.setState({ seafood });
          });
    }


    _initlPageState() {
      this.setState({
        ...this.state,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
        sort: '蔬果',
        maxPageSize: 1,
        lastKnownVal: null,
      },
      () => {
        this.makeRemoteRequest();
      });
    }

    _switchToSeafoodList(){
      this._initlPageState();
      this.setState({'sort': '海鮮'});
      this.props.navigation.setParams(
        {
        title: `海鮮`,
        next: `蔬果`,
        handleSave: this._switchToVegetableList
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    }

    _switchToVegetableList(){
      this._initlPageState();
      this.setState({
        'sort': '蔬果'
      });
      this.props.navigation.setParams(
        {
          title: `蔬果`,
          next: `海鮮`,
          handleSave: this._switchToSeafoodList
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
      const { page, seed, sort, lastKnownVal } = this.state;

      this.setState({ loading: true });
      var measure = null;
      var id = null;
      var isFirstPage = false;
      if(lastKnownVal){
        measure = lastKnownVal.measure;
        id = lastKnownVal.id;
      }else{
        isFirstPage = true;
      }
      if(this.state.sort == '蔬果'){
        const { maxPageSize } = this.state.vegetable;
        console.log('page: '+page+'  maxPageSize: '+maxPageSize);
        if(page>maxPageSize){
          this.setState({ loading: false });
          this.renderFooter();
          return;
        }
        apis.getRankInVegetableByPageing( measure, id, isFirstPage, page )
          .then(({vegetable_rank_data, lastKnownVal}) => {
            this.setState({
              data: page === 1 ? vegetable_rank_data : [...this.state.data, ...vegetable_rank_data],
              loading: false,
              refreshing: false,
              lastKnownVal: lastKnownVal,
              maxPageSize: maxPageSize
            });
          });
      }else if(this.state.sort == '海鮮'){
        const { maxPageSize } = this.state.seafood;
        if(page>maxPageSize){
          this.setState({ loading: false });
          this.renderFooter();
          return;
        }
        apis.getRankInSeafoodByPageing( measure, id, isFirstPage, page )
          .then(({seafood_rank_data, lastKnownVal}) => {
            this.setState({
              data: page === 1 ? seafood_rank_data : [...this.state.data, ...seafood_rank_data],
              loading: false,
              refreshing: false,
              lastKnownVal: lastKnownVal,
              maxPageSize: maxPageSize
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

    renderFooter = () => {
      if (!this.state.loading){
        return (
          <Badge
            value={'已到底部'}
            textStyle={{ color: Colors.backgroundColor, fontWeight: 'bold' }}
            containerStyle={{
              backgroundColor: Colors.elementeTintColor,
              width: screen.width-40,
              alignSelf: 'center',
              marginTop: 10
            }}
          />
        );
      }

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
      if(this.state.sort == '蔬果'){
        return (
          <RankCard
            id={item.id}
            onPress={() => this._setFocusFood('vegetable', item.id)}
            imageUrl={`http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${item.id}.jpg`}
          ></RankCard>
        );
      }else if(this.state.sort == '海鮮'){
        return (
          <RankCard
            id={item.id}
            onPress={() => this._setFocusFood('seafood', item.id)}
            imageUrl={`http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${item.id}.jpg`}
          ></RankCard>
        );
      }
    };

    render() {
      return (
        <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0, backgroundColor: Colors.backgroundColor }}>
            <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.backgroundImage} >
              <FlatList
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={item => item.key}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={2}
              />
            </ImageBackground>
          </List>
        </ImageBackground>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  backgroundImage: {
    width: screen.width,
    backgroundColor: Colors.backgroundColor,
  },
  loading: {
    resizeMode:'contain'
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
  return {
    results_vegetable: rank.results_vegetable,
    results_fish: rank.results_fish,
    lastKnownVegetableValue: rank.lastKnownVegetableValue,
    lastKnownFishValue: rank.lastKnownFishValue,
    isLoad: true,
    isLogin: rank.isLogin
  };
}


export default connect(mapStateToProps, actions)(RankScreen);
