module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 8
  },
  "env": {
    "mocha": true
  },
  "rules": {
    "max-len": [2, 240],
    "prefer-const": "error",
    "eqeqeq": ["error", "always"],
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "should|expect|assert"
      }
    ],
    "indent": ["error", 2],
    "require-jsdoc": ["error", {
      "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": false,
          "ClassDeclaration": false,
          "ArrowFunctionExpression": false,
          "FunctionExpression": false
      }
    }]
  }
};
