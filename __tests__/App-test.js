import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
const middlewares = []; // you can mock any middlewares here if necessary
const mockStore = configureStore(middlewares);

// it('renders the loading screen', async () => {
//   const tree = renderer.create(<App />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

const initialState = {
};


describe('Testing App', () => {
  it('renders as expected', () => {
    const wrapper = shallow(
      <App loadJestSetting />,
      { context: { store: mockStore(initialState) } , adapter: new Adapter()},
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
