const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ['file-loader']
            },
        ],
    },
    devServer: {
        static: './public',
        hot: true,
        open: true,
        compress: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html'
        })
    ],
    resolve: {
        fallback: {
            "fs": false,
            "path": false,
            "perf_hooks": false,
            "worker_threads": false,
            "os": false,
        },
        alias: {
            "fs": path.resolve(__dirname, "src/empty-module.js"),
            "path": path.resolve(__dirname, "src/empty-module.js"),
            "perf_hooks": path.resolve(__dirname, "src/empty-module.js"),
            "worker_threads": path.resolve(__dirname, "src/empty-module.js"),
        }
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
}