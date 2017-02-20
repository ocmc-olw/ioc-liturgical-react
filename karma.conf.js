module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.js': ['sourcemap']
    }
  });
};