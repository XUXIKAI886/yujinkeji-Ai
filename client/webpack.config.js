const path = require('path');

module.exports = {
  // ... other webpack configs ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [/node_modules\/@antv/]
      }
    ]
  },
  ignoreWarnings: [/Failed to parse source map/]
}; 