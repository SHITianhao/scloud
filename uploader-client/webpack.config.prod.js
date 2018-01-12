const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs  = require('fs');

const APP_INDEX = path.join(__dirname, "/src/index.js");
const APP_DIR = path.join(__dirname, "/src");
const BUILD_PATH = path.join(__dirname, "/dist");
const publicPath = path.join(__dirname, '/public');

const pkgPath = path.join(__dirname, 'package.json');
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};
let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  let cfgPath = pkg.theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = path.resolve(__dirname, cfgPath);
  }
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}

module.exports = {
    entry: APP_INDEX,
    output: {
        filename: '[name].js', //编译后的文件名字
        path: BUILD_PATH,
        chunkFilename: '[name].[chunkhash:5].min.js',
        publicPath: '/'
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    resolve: {
        extensions: [".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                // include : APP_DIR,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
                exclude: /node_modules/,
            },
            {
                test: /.less$/,  // antd 中的less
                include:[
                    path.resolve(__dirname, 'node_modules/antd'),
                    path.resolve(__dirname, 'src')
                ],  //这个路径要写准确，否则报错
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                    },
                    {
                      loader: 'less-loader',
                      options: {
                        sourceMap: false,
                        modules: false,
                        modifyVars: theme,
                      },
                    },
                  ],
                }),
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'sass-loader' }),
                exclude: /node_modules/,
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
                exclude: /node_modules/,
                loader: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=8192', //url-loader?limit=8192&name=images/[name].[ext]
                //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/public/index.html"),
            // environment: {
            //     REACT_CDN: "https://unpkg.com/react@16/umd/react.production.min.js",
            //     REACT_DOM_CDN: "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
			// }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify('production') //定义编译环境
            }
        }),
        new CopyWebpackPlugin([
            { from: 'public' }
        ]),
        new ExtractTextPlugin("[name]-[hash].css"),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false, // remove all comments
            },
            compress: {
                warnings: false
            }
        })
    ]
};