const path = require('path');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const isProduction = typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

module.exports = {
    entry: './src/TapotanLauncher.ts',
    target: 'web',
    mode,
    devtool,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                "sourceMap": !isProduction,
                            }
                        }
                    },

                    {
                        loader: 'ifdef-loader',
                        options: {
                            'ENV_PRODUCTION': isProduction,
                            'ENV_DEVELOPMENT': !isProduction
                        }
                    }
                ],
                exclude: /node_modules/
            },
            
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.css']
    },

    output: {
        filename: 'tapotan.js',
        path: path.join(__dirname, 'build')
    },

    plugins: [
        new SimpleProgressWebpackPlugin({
            format: 'compact'
        })
    ]
}