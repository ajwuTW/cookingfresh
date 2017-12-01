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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpoLinksView } from '@expo/samples';
import _ from 'lodash';

import { connect } from 'react-redux';
import { Badge, Button, ButtonGroup, Card, ListItem, List, SearchBar } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import Checkbox2  from '../components/Checkbox2';
import RankCard  from '../components/RankCard';

var screen = Dimensions.get('window');

class RankScreen extends React.Component {
    constructor(props) {
      super(props);
      this._setFocusFood = this._setFocusFood.bind(this);
      this.state = {
        loading: false,
        vegetable: {
          data: [],
          page: 1,
          lastKnownVal: null,
          maxPageSize: 1,
          pageSize: 20
        },
        fish: {
          data: [],
          page: 1,
          lastKnownVal: null,
          maxPageSize: 1,
          pageSize: 20
        },
        seed: 1,
        error: null,
        refreshing: false,
        selectedIndex: 0,
        fadeAnim: new Animated.Value(0),
      };
    }

    static navigationOptions = ({navigation}) => {
      const { params = {} } = navigation.state;
      return {
        title: `排行榜`,
        headerTintColor: "#2c3e50",
        headerStyle: {
           backgroundColor:"#f1c40f"
        }
      };
    };

    componentWillMount() {
      apis.getVegetablePageConfig()
        .then(({pageTotal}) => {
          const { vegetable } = this.state;
          vegetable.maxPageSize = Math.ceil(pageTotal/vegetable.pageSize);
          this.setState({ vegetable });
        });
      apis.getSeafoodPageConfig()
        .then(({pageTotal}) => {
          const { fish } = this.state;
          fish.maxPageSize = Math.ceil(pageTotal/fish.pageSize);
          this.setState({ fish });
        });
    }
    componentDidMount() {
      this._AnimatedStart(1, 1000);
      this.makeRemoteRequest();
    }

    _setFocusFood(category, id){
      this.props.navigation.navigate('FoodChart', { 'foodId': id, 'category': category  })
    }

    makeRemoteRequest = () => {
      this.setState({ loading: true });
      var measure = null;
      var id = null;
      var isFirstPage = false;
      if( this.state.selectedIndex == 0 ){
        const { page, seed, lastKnownVal, maxPageSize } = this.state.vegetable;
        if(page>maxPageSize){
          console.log('return')
          return;
        }
        if(lastKnownVal){
          measure = lastKnownVal.measure;
          id = lastKnownVal.id;
        }else{
          isFirstPage = true;
        }
        apis.getRankInVegetableByPageing( measure, id, isFirstPage )
          .then(({vegetable_rank_data, lastKnownVal}) => {
            const { vegetable } = this.state;
            vegetable.lastKnownVal = lastKnownVal;
            vegetable.data = page === 1 ? vegetable_rank_data : [...this.state.vegetable.data, ...vegetable_rank_data];
            this.setState({
              vegetable
            });
          })
      }
      if( this.state.selectedIndex == 1 || this.state.fish.data.length == 0 ){
        const { page, seed, lastKnownVal, maxPageSize } = this.state.fish;
        if(page>maxPageSize){
          console.log('return')
          return;
        }
        if(lastKnownVal){
          measure = lastKnownVal.measure;
          id = lastKnownVal.id;
        }else{
          isFirstPage = true;
        }
        apis.getRankInSeafoodByPageing( measure, id, isFirstPage )
          .then(({fish_rank_data, lastKnownVal}) => {
            const { fish } = this.state;
            fish.lastKnownVal = lastKnownVal;
            fish.data = page === 1 ? fish_rank_data : [...this.state.fish.data, ...fish_rank_data];
            this.setState({
              fish
            });
          })
      }

    };

    handleRefresh = () => {
      this.setState(
        {
          page: 1,
          seed: this.state.fish.seed + 1,
          refreshing: true
        },
        () => {
          this.makeRemoteRequest();
        }
      );
    };

    handleLoadMore_vegetable = () => {
      const { vegetable } = this.state;
      vegetable.page = this.state.vegetable.page + 1
      this.setState(
        { vegetable },
        () => {
          this.makeRemoteRequest();
        }
      );
    };

    handleLoadMore_fish = () => {
      const { fish } = this.state;
      fish.page = this.state.fish.page + 1
      this.setState(
        { fish },
        () => {
          this.makeRemoteRequest();
        }
      );
    };
    renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "86%",
            // backgroundColor: "#CED0CE",
            marginLeft: "14%"
          }}
        />
      );
    };

    renderHeader = () => {
      return <SearchBar placeholder="Type Here..." lightTheme round />;
    };

    renderFooter = () => {
      if (!this.state.loading) return null;

      return (
        <View
          style={{
            paddingVertical: 0,
            borderTopWidth: 1,
            // borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };


    _AnimatedStart(value, duration){
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: value,
          duration: duration
        }
      ).start();
    }

    updateIndex (selectedIndex) {
      this._AnimatedStart(0, 0);
      this._AnimatedStart(1, 500);
      this.setState({selectedIndex})
    }

    scrollView(selectedIndex, buttons){
      var updateIndex = this.updateIndex.bind(this);
      let { fadeAnim } = this.state;
      return (
        <View style={styles.wrapper}>
        <ButtonGroup
          onPress={updateIndex}
          selectedIndex={selectedIndex}
          selectedBackgroundColor='#1abc9c'
          buttons={buttons} />
              <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginTop: 0, backgroundColor: 'rgba(233, 233, 239, 1)' }}>
                {
                  selectedIndex == 0
                  ? (
                    <FlatList
                      data={this.state.vegetable.data}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => this._setFocusFood('vegetable', item.id)} >
                          <RankCard
                            id={item.id}
                            imageUrl={`http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${item.id}.jpg`}
                          ></RankCard>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id}
                      ItemSeparatorComponent={this.renderSeparator}
                      // onRefresh={this.handleRefresh}
                      // refreshing={this.state.refreshing}
                      onEndReached={this.handleLoadMore_vegetable}
                      onEndReachedThreshold={1}
                    />
                  ) :(
                    <FlatList
                      data={this.state.fish.data}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          // key={item.id+'touch'}
                          onPress={() => this._setFocusFood('seafood', item.id)} >
                          <RankCard
                            id={item.id}
                            imageUrl={`http://fs-old.mis.kuas.edu.tw/~s1103137212/ingredient/${item.id}.jpg`}
                          ></RankCard>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id}
                      ItemSeparatorComponent={this.renderSeparator}
                      // onRefresh={this.handleRefresh}
                      // refreshing={this.state.refreshing}
                      onEndReached={this.handleLoadMore_fish}
                      onEndReachedThreshold={1}
                    />
                  )
                }
              </List>
        </View>
      );
    }

    render() {
      const component1 = () => <Text>蔬果</Text>
      const component2 = () => <Text>漁貨</Text>
      const buttons = [{ element: component1 }, { element: component2 }];
      const { selectedIndex } = this.state;
      if(this.props.isLoad){
        return(
          this.scrollView(selectedIndex ,buttons)
        );
      }else{
        return (
            <Image source={require('../assets/gif/loading04.gif')} style={styles.loading} />
        );
      }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    paddingBottom: 20,
    flex: 1,
  },
  loading: {
    resizeMode:'contain'
  },
  txt: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 30,
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
