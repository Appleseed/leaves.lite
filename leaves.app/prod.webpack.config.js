var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname + '/client',
    entry: {
        app: './index.js',
        vendor: ['angular']
    },
    watch: false,
    output: {
        path: __dirname + '/client',
        filename: 'js/app.bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' }),
        new HtmlWebpackPlugin({
            inject: true,
            GA: '<script async src="https://www.googletagmanager.com/gtag/js?id=UA-125368255-3"></script><script>window.dataLayer=window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag("js", new Date()); gtag("config", "UA-125368255-3");</script>',
            PTCODE: 'window._pt_lt=new Date().getTime(); window._pt_sp_2=[]; _pt_sp_2.push("setAccount,35ee64ef"); var _protocol=(("https:"==document.location.protocol) ? " https://" : " http://"); (function(){var atag=document.createElement("script"); atag.type="text/javascript"; atag.async=true; atag.src=_protocol + "cjs.ptengine.com/pta_en.js"; var s=document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(atag, s);})();',
            template: './template.html',
            filename: './index.html' //relative to root of the application
        })
    ]
};