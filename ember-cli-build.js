'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        enabled: true,
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules']
            }
          },
          require('tailwindcss')('./app/tailwind/config.js'),
          require('autoprefixer')
        ]
      }
    },
    'ember-cli-postcss': {
      compile: {
        plugins: [
          {
            module: require('tailwindcss'),
            options: {
              config: './app/tailwind/config.js'
            }
          },
          require('autoprefixer')
        ]
      }
    }
  });

  return app.toTree();
};
