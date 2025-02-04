import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import compat from "eslint-plugin-compat";

export default [
	js.configs.recommended,
	prettierRecommended,
	compat.configs["flat/recommended"],
	{
		"rules": {
			"prefer-const": "error",
			'prettier/prettier': [
				'warn',
				{
					
						useTabs: true,
						printWidth: 120,
						trailingComma: 'none'
					
				}
			]
		}
	}
]
