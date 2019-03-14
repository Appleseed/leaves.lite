const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        'bundle.min.css': [
            path.resolve(__dirname, './css/style.css'),
            path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css'),
            path.resolve(__dirname, 'node_modules/bootstrap-social/bootstrap-social.css'),
            path.resolve(__dirname, 'node_modules/intro.js/minified/introjs.min.css'),
        ],
        'app.bundle.js': [
          path.resolve(__dirname, './index.js')
        ],
        vendor: ['angular']
    },
    watch: false,
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader'
            })
          },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']      
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
        new ExtractTextPlugin("bundle.min.css"),
    ]
};