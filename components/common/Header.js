import React from 'react';
import { View, Text } from 'react-native';

// 建立元件
const Header = (props) => {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle} >
      <Text style={textStyle} >{props.headerContent}</Text>
    </View>
  );
};

// 樣式
const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    height: 60,
    shadowColor: '#ccc',
    shadowOffset: { width: 0.0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20
  }
};

// 使元件能夠被使用在其他部分
export { Header };
