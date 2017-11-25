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
        },
        fish: {
          data: [],
          page: 1,
          lastKnownVal: null,
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

    componentDidMount() {
      this._AnimatedStart(1, 1000);
      console.log('mount')
      this.makeRemoteRequest();
    }

    _setFocusFood(category, id){
      this.props.navigation.navigate('FoodChart', { 'foodId': id, 'category': category  })
    }

    makeRemoteRequest = () => {
      // const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
      this.setState({ loading: true });
      var measure = null;
      var id = null;
      var isFirstPage = false;
      if( this.state.selectedIndex == 0 ){
        const { page, seed, lastKnownVal } = this.state.vegetable;
        if(lastKnownVal){
          measure = lastKnownVal.measure;
          id = lastKnownVal.id;
        }else{
          isFirstPage = true;
        }
        apis.getRankInVegetableByPageing( measure, id, isFirstPage )
          .then(({vegetable, lastKnownVal}) => {
            this.setState({
              vegetable: {
                lastKnownVal: lastKnownVal,
                data: page === 1 ? vegetable : [...this.state.vegetable.data, ...vegetable],
              }
            });
          })
      }
      if( this.state.selectedIndex == 1 || this.state.fish.data.length == 0 ){
        const { page, seed, lastKnownVal } = this.state.fish;
        if(lastKnownVal){
          measure = lastKnownVal.measure;
          id = lastKnownVal.id;
        }else{
          isFirstPage = true;
        }
        apis.getRankInFishByPageing( measure, id, isFirstPage )
          .then(({fish, lastKnownVal}) => {
            this.setState({
              fish: {
                lastKnownVal: lastKnownVal,
                data: page === 1 ? fish : [...this.state.fish.data, ...fish],
              }
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

    handleLoadMore = () => {
      this.setState(
        {
          page: this.state.fish.page + 1
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
      switch(selectedIndex){
        case 0:
          return (

            <View style={styles.wrapper}>
                  <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <ButtonGroup
                      onPress={updateIndex}
                      selectedIndex={selectedIndex}
                      selectedBackgroundColor='#1abc9c'
                      buttons={buttons}
                      containerStyle={{height: 40}} />
                    <FlatList
                      data={this.state.vegetable.data}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          // key={item.id+'touch'}
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
                      onEndReached={this.handleLoadMore}
                      onEndReachedThreshold={1}
                    />
                  </List>
            </View>
          );
          break;
        case 1:
          return (
            <View style={styles.wrapper}>
                  <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <ButtonGroup
                      onPress={updateIndex}
                      selectedIndex={selectedIndex}
                      selectedBackgroundColor='#1abc9c'
                      buttons={buttons}
                      containerStyle={{height: 40}} />
                      <Animated.View style={{opacity: fadeAnim}}>
                        <FlatList
                          data={this.state.fish.data}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              // key={item.id+'touch'}
                              onPress={() => this._setFocusFood('fish', item.id)} >
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
                          onEndReached={this.handleLoadMore}
                          onEndReachedThreshold={1}
                        />
                      </Animated.View>
                  </List>
            </View>
          );
          break;
      }

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
    flex: 1,
    marginTop: -15,
    backgroundColor: '#fff',
  },
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#fff',
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
