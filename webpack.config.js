const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
	entry: slsw.lib.entries,
	mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
	optimization: {
		minimize: false,
	},
	performance: {
		hints: false,
	},
	devtool: 'nosources-source-map',
	externals: [nodeExternals()],
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json'],
	},
	plugins: [],
	module: {
		rules: [
			{test: /\.ts(x?)$/, use: [{loader: 'ts-loader',}]},
			{test: /\.(txt|htm|html)$/,  use: 'raw-loader', exclude: /node_modules\//},
		],
	},
	output: {
		libraryTarget: 'commonjs2',
		path: path.join(__dirname, '.webpack'),
		filename: '[name].js',
		sourceMapFilename: '[file].map',
	},
	watch: false,
};
