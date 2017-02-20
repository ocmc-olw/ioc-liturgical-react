jest.unmock('../src/ioc-liturgical-react');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ioc-liturgical-react from '../src/ioc-liturgical-react'

describe('<ioc-liturgical-react />', () => {
  it('', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <ioc-liturgical-react />
    );
    const dom = renderer.getRenderOutput();
    //expect(dom.props.//PROPS_NAME).toEqual('//TEXT');
  });
});
