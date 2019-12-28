module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "testMatch": [
    "<rootDir>/__tests__/**"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  'moduleFileExtensions': [
    'js',
    'ts',
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}