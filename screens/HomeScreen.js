import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  AsyncStorage,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Card, ListItem, Button, List, ButtonGroup, CheckBox, Avatar, SocialIcon } from 'react-native-elements';

import { WebBrowser } from 'expo';
import { connect } from 'react-redux';

import Colors from '../constants/Colors-theme';
import { MonoText } from '../components/StyledText';

import * as actions from '../actions';

var screen = Dimensions.get('window');
class HomeScreen extends React.Component {
// export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: '首頁',
    headerTintColor: Colors.headerTintColor,
    headerStyle: {
     backgroundColor: Colors.headerColor
   }
  };

  state = {
    fadeAnim: new Animated.Value(0)
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

  async componentWillMount() {
    this.props.checkAuthState();
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/default-backgroud.png')} style={styles.wrapper} >
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/CookingFresh-icon-v2.png')}
            style={styles.welcomeImage}
          />
        </View>
      </ImageBackground>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

  function mapStateToProps({ auth }){
    return { token: auth.token };
  }

export default connect(mapStateToProps, actions)(HomeScreen);

const styles = StyleSheet.create({
  wrapper: {
    width: screen.width,
    paddingTop: 0,
    flex: 1,
    backgroundColor:Colors.backgroundColor
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 320,
    height: 280,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
