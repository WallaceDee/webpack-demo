var path = require('path');
var webpack = require('webpack');
//引用webpack.config.js插件
var CopyWebpackPlugin = require('copy-webpack-plugin');
var vConsolePlugin = require('vconsole-webpack-plugin');
module.exports = {
    // entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
    entry: {
        user_center: './app/js/user_center.js',
        user_info: './app/js/user_info.js',
        player_info: './app/js/player_info.js',
        player_data: './app/js/player_data.js',
        purchased: './app/js/purchased.js',
        suggestion: './app/js/suggestion.js',
        live_center: './app/js/live_center.js',
        live: './app/js/live.js',
        vip: './app/js/vip.js',
        bind: './app/js/bind.js',
        vendor: './app/js/vendor.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].bundle.js',
    },
    devtool: 'source-map',
    devServer: {
        contentBase: "./dist", //本地服务器所加载的页面所在的目录
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
            }, {
                test: /\.(eot|svg|ttf|woff)/,
                loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]'
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[md5:hash:hex:7].[ext]'
            }
        ]
    },
    plugins: [
        new vConsolePlugin({
            filter: [], // 需要过滤的入口文件
            enable: true // 发布代码前记得改回 false
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            videojs: 'video.js'
        }), new CopyWebpackPlugin([{
            from: "./app/pages",
            to: "./",
            force: true
        }]), new CopyWebpackPlugin([{
            from: "./app/lib/jquery-2.1.4.js",
            to: "./js/",
            force: true
        }]), new CopyWebpackPlugin([{
            from: "./app/images/emoji",
            to: "./images/emoji",
            force: true
        }])
    ]
}