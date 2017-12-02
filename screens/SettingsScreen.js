import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  View,
  Text,
  Image,
  ImageBackground
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { connect } from 'react-redux';
import { Card, Button, SocialIcon } from 'react-native-elements';

import * as actions from '../actions';
import * as apis from '../api';

import Colors from '../constants/Colors-theme';

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
    headerTintColor: Colors.headerTintColor,
    headerStyle: {
     backgroundColor: Colors.headerColor
   }
  };

  state = {
    showWelcom: true
  }


  async componentWillMount() {
    this.props.checkTokenProfile();
  }

  _fbLogin(){
    this.props.fbLogin();
  }
  _fbLogout(){
    this.props.fbLogout();
  }

  render() {
    const { firebase, profile, isLogin } = this.props;
    let { fadeAnim } = this.state;
    return(
      <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
          <ScrollView style={styles.container}>
            <Card
              containerStyle={styles.cardColor}
            >
            {
              isLogin
              ? (
                <View>
                  <View style={styles.image_view}>
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{ uri: 'https://graph.facebook.com/'+profile.uid+'/picture?type=normal' }}
                    />
                    <Text style={styles.text_username}>{profile.displayName}</Text>
                  </View>
                  <SocialIcon
                    title='登出'
                    button
                    onPress={this._fbLogout}
                    type='facebook'
                  />
                </View>

              ) : (
                <SocialIcon
                  title='登入'
                  button
                  onPress={this._fbLogin}
                  type='facebook'
                />
              )
            }
            </Card>
          </ScrollView>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
      paddingTop: 0,
      flex: 1,
      backgroundColor: Colors.backgroundColor
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
  },
  cardColor: {
    backgroundColor: Colors.elementeBackgroundColor,
    borderColor: Colors.elementeBorderColor
  },
});


function mapStateToProps({ auth }){
  return {
    firebase: auth.firebase,
    profile: auth.profile,
    isLogin: auth.isLogin
  };
}


export default connect(mapStateToProps, actions)(SettingsScreen);
