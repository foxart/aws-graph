const jestConfig = {
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json'
		}
	},
	verbose: true,
	notify: true,
	testRegex: '\\.test\\.ts$',
	testEnvironment: 'node',
	transformIgnorePatterns: [
		'node_modules',
	],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	moduleFileExtensions: [
		'js',
		'ts'
	],
	moduleDirectories: [
		'./node_modules',
		'./src'
	],
	// moduleNameMapper: {
	// 	'^.+\\.(htm|html)$': '<rootDir>/mocks/html.mock.js',
	// },
	// modulePathIgnorePatterns: ['controllers'],
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/{!(index),}.ts',
		'src/**/*.ts',
	],
	coverageThreshold: {
		global: {
			statements: 25,
			branches: 25,
			functions: 25,
			lines: 25,
		}
	},
	coverageDirectory: '.coverage',
	setupFiles: []
};
module.exports = jestConfig;
