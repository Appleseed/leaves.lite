var webpack = require('webpack');

module.exports = {
    context: __dirname + '/client',
    entry: {
        app: './index.js',
        vendor: ['angular']
    },
    watch: true,
    output: {
        path: __dirname + '/client/js',
        filename: 'app.bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
    ]
};
