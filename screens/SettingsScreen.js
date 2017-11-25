import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  View,
  Text,
  Image
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { connect } from 'react-redux';
import { Card, Button, SocialIcon } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import { CardSection } from '../components/common';

var screen = Dimensions.get('window');

class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this._fbLogin = this._fbLogin.bind(this);
    this._fbLogout = this._fbLogout.bind(this);
  }

  static navigationOptions = {
    title: '使用者',
    headerTintColor: "#2c3e50",
    headerStyle: {
     backgroundColor:"#f1c40f"
   }
  };

  state = {
    showWelcom: true,
    fadeAnim: new Animated.Value(0)
  }


  async componentWillMount() {
    this._AnimatedStart(0, 0);
    this.props.checkTokenProfile();
  }

  _AnimatedStart(value, duration){
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: value,
        duration: duration
      }
    ).start();
  }

  _fbLogin(){
    this.props.fbLogin();
    this.props.getToBuyList();
  }
  _fbLogout(){
    this.props.fbLogout();
    this.props.getToBuyList();
  }

  render() {
    const { token, profile } = this.props;
    let { fadeAnim } = this.state;

    if( token == null ){
      //default
      this._AnimatedStart(1, 1000);
      return(
        <View style={styles.wrapper}>
          <Animated.View style={{opacity: fadeAnim}}>
            <ScrollView>
              <Card >
                <SocialIcon
                  title='登入'
                  button
                  onPress={this._fbLogin}
                  type='facebook'
                />
              </Card>
            </ScrollView>
          </Animated.View>
        </View>
      );
    }else{
      // isLogin
      this._AnimatedStart(1, 1000);
      var uri = 'https://graph.facebook.com/'+profile.id+'/picture?type=normal';
      return(

          <View style={styles.wrapper}>
            <Animated.View style={{opacity: fadeAnim}}>
              <ScrollView
                style={styles.container}>
                <Card >
                  <View style={styles.image_view}>
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{ uri: uri }}
                    />
                    <Text style={styles.text_username}>{profile.name}</Text>
                  </View>
                  <SocialIcon
                    title='登出'
                    button
                    onPress={this._fbLogout}
                    type='facebook'
                  />
                </Card>
              </ScrollView>
            </Animated.View>
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
      paddingTop: 0,
      flex: 1
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaa'
  },
  modal4: {
    height: screen.height
  },
  image_view: {
    alignItems: 'center',
    marginTop: 10
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100/2
  },
  text_username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 50
  }
});


function mapStateToProps({ auth }){
  return {
    token: auth.token,
    profile: auth.profile,
  };
}


export default connect(mapStateToProps, actions)(SettingsScreen);
