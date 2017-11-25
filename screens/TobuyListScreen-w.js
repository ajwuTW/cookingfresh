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
import { Badge, Button, Card, ListItem, List, SearchBar } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import Checkbox2  from '../components/Checkbox2';

var screen = Dimensions.get('window');

class TobuyListScreen extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false
      };
    }

    componentDidMount() {
      this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
      const { page, seed } = this.state;
      const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
      this.setState({ loading: true });

      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.setState({
            data: page === 1 ? res.results : [...this.state.data, ...res.results],
            error: res.error || null,
            loading: false,
            refreshing: false
          });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
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
            height: 1,
            width: "86%",
            backgroundColor: "#CED0CE",
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
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };

    render() {
      return (
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                roundAvatar
                title={`${item.name.first} ${item.name.last}`}
                subtitle={item.email}
                avatar={{ uri: item.picture.thumbnail }}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            )}
            keyExtractor={item => item.email}
            ItemSeparatorComponent={this.renderSeparator}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
        </List>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    flex: 1,
  },
  loading: {
    resizeMode:'contain'
  },
  txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 30,
    }
});


function mapStateToProps({ toBuy }){
  const food = _.map(toBuy.food,(val, uid) => {
    return { ...val, uid };
  });

  const list = _.map( toBuy.list ,(val, uid) => {
    return { ...val, uid };
  });
  const exception = _.map( toBuy.exception ,(val, uid) => {
    return { ...val, uid };
  });

  return {
    food: food,
    list: list,
    exception: exception,
    isLoad: toBuy.isLoad,
    isLogin: toBuy.isLogin
   };
}


export default connect(mapStateToProps, actions)(TobuyListScreen);
