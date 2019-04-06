const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config({path: __dirname + '/env/env.js'});
const env = dotenv.parsed

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
        new HtmlWebpackPlugin({
            inject: false,
            GA: '<script async src="https://www.googletagmanager.com/gtag/js?id='+env.GA_ID+'"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","'+env.GA_ID+'");</script>',
            PTCODE: 'window._pt_lt=(new Date).getTime(),window._pt_sp_2=[],_pt_sp_2.push("setAccount,'+env.PTCODE_ID+'");var _protocol="https:"==document.location.protocol?" https://":" http://";!function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src=_protocol+"cjs.ptengine.com/pta_en.js";var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(t,e)}();',
            template: './template.html',
            filename: './index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
        }),
        new CopyPlugin([
            { from: 'views/**/*', to: '' },
            { from: 'img/*', to: 'img/' },
            { from: 'js/bootstrap.min.js', to: 'js/' },
            { from: 'js/feather.min.js', to: 'js/' },
            { from: 'env/env.js', to: 'env/' },
            { from: 'node_modules/intro.js/intro.js', to: 'js/' },
        ]),
    ]
};