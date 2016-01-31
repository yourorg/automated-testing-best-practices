import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';

jest.dontMock('./account-summary')
const AccountSummary = require('./account-summary').default;

describe('Account Summary Component', function () {
  describe('render', function () {
    it('shows the balance', function () {
      const wrapper = shallow(
        <AccountSummary account={{balance: 10}}/>
      );

      expect(wrapper.text()).toBe('$ 10');
    });
  });
});
