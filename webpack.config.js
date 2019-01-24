var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: {
        app: './index.js',
        vendor: ['angular']
    },
    watch: false,
    output: {
        path: __dirname,
        filename: 'js/app.bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.bundle.js' })
    ]
};