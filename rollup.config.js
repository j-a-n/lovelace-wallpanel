import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
	input: "wallpanel-src.js",
	output: {
		file: "wallpanel.js",
		format: "iife",
		name: "WallPanel"
	},
	plugins: [
		resolve(), // Resolve node_modules
		commonjs(), // Convert CommonJS to ES6
		babel({ babelHelpers: "bundled", exclude: "node_modules/**" }),
		terser() // Minify
	]
};
