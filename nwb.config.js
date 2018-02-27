module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'IocLiturgicalReact',
      externals: {
        react: 'React'
      }
    }
  }
};
