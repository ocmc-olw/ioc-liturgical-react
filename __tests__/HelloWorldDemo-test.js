jest.unmock('../src/ioc-liturgical-reactDemo');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ioc-liturgical-reactDemo from '../src/ioc-liturgical-reactDemo'

describe('<ioc-liturgical-reactDemo />', () => {
  it('', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <ioc-liturgical-reactDemo />
    );
    const dom = renderer.getRenderOutput();
    //expect(dom.props.//PROPS_NAME).toEqual('//TEXT');
  });
});
