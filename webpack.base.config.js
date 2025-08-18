const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new AssetsPlugin({removeFullPathAutoPrefix: true, prettyPrint: true}),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/images', to: 'src/images' },
                { from: 'src/sounds', to: 'src/sounds'},
                { from: 'src/models', to: 'src/models'},
                { from: 'src/fonts', to: 'src/fonts'}
            ]
        })
    ],
    entry: {
        index: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name]-bundle-[hash].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "src/images/[name][ext]",
                },
            },
            {
                test: /\.(mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "src/sounds/[name][ext]",
                },
            },
            {
                test: /\.(otf|ttf|woff|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: "src/fonts/[name][ext]",
                },
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    sources: false
                }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.css']
    }
};
