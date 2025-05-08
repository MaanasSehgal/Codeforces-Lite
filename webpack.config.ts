import * as path from "path";
import * as webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import BundleAnalyzerPlugin from "webpack-bundle-analyzer";

const targetBrowser = process.env.TARGET_BROWSER || 'chrome';

const config: webpack.Configuration = {
    mode: (process.env.NODE_ENV as "development" | "production" | "none") || 'development',
    entry: {
        sidepanel: path.resolve(__dirname, 'src/main.tsx'),
    },
    output: {
        path: path.resolve(__dirname, `dist/${targetBrowser}`),
        filename: '[name].bundle.js',
        publicPath: '',
        globalObject: 'self',
        clean: true,
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename],
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.css$/,
                include: /node_modules[\\/]monaco-editor/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.ttf$/,
                include: /node_modules[\\/]monaco-editor/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
            filename: 'index.html',
            chunks: ['sidepanel'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `public/manifest.${targetBrowser}.json`),
                    to: path.resolve(__dirname, `dist/${targetBrowser}/manifest.json`),
                },
                {
                    from: path.resolve(__dirname, 'public/assets/icons'),
                    to: path.resolve(__dirname, `dist/${targetBrowser}/assets/icons`),
                },
                {
                    from: path.resolve(__dirname, 'public/assets/scripts'),
                    to: path.resolve(__dirname, `dist/${targetBrowser}/assets/scripts`),
                    globOptions: {
                        ignore: ['**/serviceWorker.js']
                    }
                },
                {
                    from: path.resolve(__dirname, 'public/assets/styles'),
                    to: path.resolve(__dirname, `dist/${targetBrowser}/assets/styles`),
                },
                ...(targetBrowser === 'chrome' ? [
                    {
                        from: path.resolve(__dirname, 'public/assets/scripts/serviceWorker.js'),
                        to: path.resolve(__dirname, `dist/${targetBrowser}/assets/scripts/serviceWorker.js`),
                    }
                ] : [])
            ],
        }),
        new MonacoWebpackPlugin({
            languages: ['cpp', 'java', 'python', 'javascript', 'kotlin', 'go', 'rust', 'ruby'],
            filename: '[name].worker.js',
        }),
        new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
            analyzerMode: 'disabled', // static to generate report.html
            openAnalyzer: false,
        })
    ],
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         maxSize: 2000000, // 2MB chunks
    //     },
    //     usedExports: true,
    // },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : 'hidden-source-map',
};

export default config;
