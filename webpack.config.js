const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development", // enabled useful tools for development
    // context: path.resolve(__dirname, 'app'),
    // Error: Can't resolve 'C:\developer\LearnCoding\EasyGas\app\src\index.html' in 'C:\developer\LearnCoding\EasyGas\app'
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'js/bundle.js'
    },
    node: {
		process: false,
		Buffer: false
	},
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
          })
        ],
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader:'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      // you can specify a publicPath here
                      // by default it uses publicPath in webpackOptions.output
                      publicPath: '../',
                      hmr: process.env.NODE_ENV === 'development',
                    },
                  },
                  'css-loader',
                ],
              }
        ]
    },
}