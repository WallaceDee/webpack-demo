var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var entries = getEntry('./app/js/**/*.js'); // 获得入口js文件
//引用webpack.config.js插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var vConsolePlugin = require('vconsole-webpack-plugin');




var config = {
    // entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
    entry: entries,
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
    externals: {
        'jquery': 'window.jQuery'
    },
    plugins: [
        new vConsolePlugin({
            filter: [], // 需要过滤的入口文件
            enable: true // 发布代码前记得改回 false
        }),
        // new webpack.ProvidePlugin({
        //     videojs: 'video.js'
        // }), 
        // , new CopyWebpackPlugin([{
        //     from: "./app/pages",
        //     to: "./",
        //     force: true
        // }]), 
        new CopyWebpackPlugin([{
            from: "./app/lib/jquery-2.1.4.js",
            to: "./js/",
            force: true
        }]),
        new CopyWebpackPlugin([{
            from: "./app/images/emoji",
            to: "./images/emoji",
            force: true
        }])
    ]
}

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;
    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[basename] = entry;
    });
    return entries;
}
console.log("dev pages----------------------");

function copyHtmlToDist() {
    var pages = getEntry('./app/pages/**/*.html');
    for (var basename in pages) {
        console.log("filename:" + basename + '.html');
        console.log("template:" + pages[basename]);
        // 配置生成的html文件，定义路径等
        var conf = {
            filename: '../dist/' + basename + '.html',
            template: pages[basename], // 模板路径
            minify: { //传递 html-minifier 选项给 minify 输出
                removeComments: true
            },
            inject: 'head', // js插入位置
            chunks: [basename, "vendor"] // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        };
        // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
        config.plugins.push(new HtmlWebpackPlugin(conf));
    }
}
copyHtmlToDist();
module.exports = config