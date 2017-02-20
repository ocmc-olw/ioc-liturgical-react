import expect from 'expect'

import Auth from '../src/helpers/Auth'

describe('Auth', () => {

  it('Auth.getUsername() initializes as empty', () => {
    expect(Auth.getUsername()).toEqual("");
  })
  it('Auth.getPassword() initializes as empty', () => {
    expect(Auth.getPassword()).toEqual("");
  })
  it('Auth.isAuthenticated() initializes to false', () => {
      expect(Auth.isAuthenticated()).toEqual(false);
  })
})
