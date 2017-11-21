import expect from 'expect'

import Server from '../src/helpers/Server'

describe('Server', () => {

  it('getWsServerAdminApi().length > 0', () => {
    expect(Server.getWsServerAdminApi().length).toBeGreaterThan(0);
  })
  it('getWsServerResourcesApi.length > 0', () => {
    expect(Server.getWsServerResourcesApi().length).toBeGreaterThan(0);
  })
  it('getWsServerDbApi().length > 0', () => {
    expect(Server.getWsServerDbApi().length).toBeGreaterThan(0);
  })
  it('getWsServerLoginApi().length > 0', () => {
    expect(Server.getWsServerLoginApi().length).toBeGreaterThan(0);
  })
})
