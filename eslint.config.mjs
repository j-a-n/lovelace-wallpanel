import js from "@eslint/js";
import compat from "eslint-plugin-compat";

export default [
	js.configs.recommended,
	compat.configs["flat/recommended"],
	{
		"rules": {
			"indent": ["error", "tab"],
			"prefer-const": "error"
		}
	}
]
