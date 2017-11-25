import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import { connect } from 'react-redux';
import * as actions from '../actions';
import * as apis from '../api';

class SearchScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Search',
    headerTintColor: "#2c3e50",
    headerStyle: {
     backgroundColor:"#f1c40f"
   }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <ExpoLinksView />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});


function mapStateToProps({ rank }){
  return rank;
}


export default connect(mapStateToProps, actions)(SearchScreen);
