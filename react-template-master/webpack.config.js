require('dotenv').config();

const path = require('path');
const webpack = require('webpack');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    argv.env = { ...argv.env };

    const config = {
        entry: './src/index.js',
        output: {
            filename: 'assets/js/app.[hash].js',
            chunkFilename: 'assets/js/[name].[hash].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            alias: {
                '@actions': path.resolve(__dirname, './src/actions'),
                '@contexts': path.resolve(__dirname, './src/contexts'),
                '@constants': path.resolve(__dirname, './src/constants'),
                '@style': path.resolve(__dirname, './src/style'),
                '@components': path.resolve(__dirname, './src/components'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@selectors': path.resolve(__dirname, './src/selectors'),
                '@svg': path.resolve(__dirname, './src/svg'),
                '@img': path.resolve(__dirname, './src/img')
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: {
                        loader: 'file-loader'
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                emitFile: true,
                                name: '[name].[hash].[ext]',
                                outputPath: 'assets/img/'
                            }
                        },
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [
                                    { removeTitle: true },
                                    { inlineStyles: true },
                                    { cleanupIDs: true }
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.(gif|png|jpe?g)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                emitFile: true,
                                name: '[name].[hash].[ext]',
                                outputPath: 'assets/img/'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: './src/index.html',
                filename: './index.html',
                alwaysWriteToDisk: true,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            }),
            new HtmlWebpackHarddiskPlugin(),
            new CleanWebpackPlugin(['dist']),
            new webpack.DefinePlugin({
                PERSONA_ID: JSON.stringify('1'),
                CAMERA_ID: JSON.stringify('CloseUp'),
                TOKEN_ISSUER: JSON.stringify(argv.env.TOKEN_ISSUER || process.env.TOKEN_ISSUER),
                ORCHESTRATION_MODE: argv.env.ORCHESTRATION_MODE || process.env.ORCHESTRATION_MODE,
                SHOW_CAMERA: argv.env.SHOW_CAMERA || process.env.SHOW_CAMERA
            }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            host: 'localhost',
            port: 8000,
            historyApiFallback: true,
            disableHostCheck: true,
            publicPath: '/',
            https: true
        }
    };

    return config;
};
