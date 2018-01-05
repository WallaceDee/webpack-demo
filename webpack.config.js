var path = require('path');
var webpack = require('webpack');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
module.exports = {
    context: path.join(__dirname, '/app/'),
    // entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
    entry: {
        index: './js/index.js',
        test: './js/main.js',
        vendor: ['./lib/jquery-2.1.4.js', './lib/jquery-weui.min.js', './lib/city-picker.min.js', './lib/swiper.min.js','./js/style.js']
    },
    output: {
        path: path.join(__dirname, '/app/pages/src'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    devServer: {
        contentBase: "./app/pages", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true //实时刷新
    },
    module: {
        rules: [{
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "env",
                            // "react"
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        modules: true
                    }
                }, {
                    loader: "postcss-loader"
                }]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ]
}