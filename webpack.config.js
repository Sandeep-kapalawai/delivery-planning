const path = require('path');
const packageJson = require('./package.json');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const vueRemoteAttributes = require('vue-remove-attributes');
const federation = require('@scm-common/federation');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (setup, options) => {
    console.debug('webpack arguments', { setup, options });

    return {
        // environment
        mode: options.mode,
        devtool: setup.NODE_ENV !== 'production' ? 'source-map' : false,

        // input/output...
        entry: {
            main: path.resolve(__dirname, './src/main.ts'),
        },

        output: {
            clean: true,
            path: path.resolve(__dirname, setup.OUTPUT_DIRECTORY || 'dist'),
            publicPath: 'auto',
            filename: 'scripts/main.bundle.js',
            chunkFilename: 'scripts/chunk-[name].[contenthash].deliveryplanning.bundle.js',
            assetModuleFilename: 'assets/images/[hash][ext][query]',
        },

        // plugins...
        plugins: [
            // linting
            new ESLintPlugin(),

            // vue js
            new VueLoaderPlugin(),

            // cleanup
            new CleanWebpackPlugin(),

            // hot reload
            new webpack.HotModuleReplacementPlugin(),

            // process
            new webpack.ProvidePlugin({ process: 'process/browser' }, {Buffer: ['buffer', 'Buffer']}),

            // environment variables (setup.ENV_FILE is for devops ONLY)
            new Dotenv({ path: `./.env.${setup.ENV_FILE || setup.NODE_ENV}`, safe: true, defaults: false, systemvars: false }),

            // module federation
            new webpack.container.ModuleFederationPlugin(federation.initialize(setup.NODE_ENV)),

            // html bundler
            new HtmlWebpackPlugin({
                title: 'Delivery Planning', // title
                filename: 'index.html', // output
                template: path.resolve(__dirname, './src/template.html'), // input
                chunks: ['main'], // HMR fails if remote-entry.js is reloaded when hot is set to true
            }),

            // style extraction
            new MiniCssExtractPlugin({
                // options similar to the same options in webpackOptions.output all options are optional
                filename: '[name].css',
                chunkFilename: 'styles/[name].[contenthash].deliveryplanning.css',
                attributes: { 'data-style-reference': packageJson.name },
                linkType: 'text/css',
                runtime: true,
                ignoreOrder: false, // enable to remove warnings about conflicting order
            }),

            new BundleAnalyzerPlugin({
                openAnalyzer: false,
                generateStatsFile: true,
                analyzerMode: 'disabled',
            }),
            
            new CopyPlugin({
                patterns: [
                    { from: 'public', to: '.' },
                ],
            }),
        ],

        // module rules...
        module: {
            // [NOTE]: @scm-common/federation package triggers "Critical dependency: the request of a dependency is an expression"
            // [REFERENCE]: https://webpack.js.org/configuration/module/
            exprContextCritical: false,

            rules: [
                // vue
                {
                    test: /\.vue$/,
                    use: {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                modules: [...(options.mode === 'production' ? [vueRemoteAttributes('data-spec')] : [])],
                            },
                        },
                    },
                },

                // javascript
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },

                // typescript
                {
                    test: /\.ts$/,
                    exclude: /node_modules|vue\/src/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                },

                // assets: images
                {
                    test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                    type: 'asset/resource',
                },

                // assets: inline
                {
                    test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
                    type: 'asset/inline',
                },

                // styles
                {
                    test: /\.(scss|css)$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
                },

                // assets: json (uncomment if required)
                // {
                //     test: /\.json/,
                //     type: 'asset/resource',
                //     exclude: /node_modules|package.json/,
                //     generator : {
                //         filename : 'assets/json/[name][ext][query]',
                //     }
                // },
            ],
        },

        // resolvers
        resolve: {
            alias: {
                '@': path.resolve('./src'),
                vue$: 'vue/dist/vue.esm.js',
            },
            extensions: ['*', '.ts', '.js', '.vue', '.json'],
            fallback: {
                'stream': require.resolve('stream-browserify'),
                'buffer': require.resolve('buffer'),
            },
        },

        // optimization
        optimization: {
            minimize: options.mode === 'production',
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                        compress: {
                            pure_funcs: ['console.log', 'console.debug', 'console.warn'],
                        },
                    },
                }),
            ],
        },

        // performance
        performance: {
            hints: false,
        },

        // development server
        devServer: {
            hot: true,
            open: true,
            compress: true,
            liveReload: false,
            historyApiFallback: true,
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
            },
            client: {
                overlay: true,
                progress: true,
                logging: 'error',
            },
        },
    };
};
