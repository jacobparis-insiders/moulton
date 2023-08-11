const appFiles = ['app/**']

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "inline-type-imports",
      },
    ],
    "import/no-duplicates": "warn",
  },
  overrides: [
		{
			plugins: ['remix-react-routes'],
			files: appFiles,
			rules: {
				'remix-react-routes/use-link-for-routes': 'error',
				'remix-react-routes/require-valid-paths': 'error',
				// disable this one because it doesn't appear to work with our
				// route convention. Someone should dig deeper into this...
				'remix-react-routes/no-relative-paths': [
					'off',
					{ allowLinksToSelf: true },
				],
				'remix-react-routes/no-urls': 'error',
			},
		},
	],
}
