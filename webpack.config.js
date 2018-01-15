var path = require('path');
var webpack = require('webpack');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
module.exports = {
    context: path.join(__dirname, '/app/'),
    // entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
    entry: {
        user_center: './js/user_center.js',
        user_info: './js/user_info.js',
        player_info: './js/player_info.js',
        player_data: './js/player_data.js',
        purchased: './js/purchased.js',
        suggestion: './js/suggestion.js',
        live_center: './js/live_center.js',
        live: './js/live.js',
        vip: './js/vip.js',
        bind: './js/bind.js',
        vendor: './js/vendor.js'
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
    externals: {
        'jquery': 'window.jQuery'
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
                        modules: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        getLocalIdent: (context, localIdentName, localName, options) => {
                            return localName
                        }
                    }
                }, {
                    loader: "postcss-loader"
                }]
            }, { test: /\.(eot|svg|ttf|woff)/, loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            videojs: 'video.js'
        }),
    ]
}