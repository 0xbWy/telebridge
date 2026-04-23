export default {
  setupFilesAfterEnv: ['./tests/init.js'],
  moduleNameMapper: {
    '\\.(css|scss|wasm|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|tgs)$':
      '<rootDir>/tests/staticFileMock.js',
    '^@teact$': '<rootDir>/src/lib/teact/teact.ts',
    '^@teact/(.*)$': '<rootDir>/src/lib/teact/$1',
    // @noble/curves ESM subpath imports (require .js extension)
    '^@noble/curves/ed25519$': '<rootDir>/node_modules/@noble/curves/ed25519.js',
    '^@noble/curves/ed25519.js$': '<rootDir>/node_modules/@noble/curves/ed25519.js',
    '^@noble/hashes/sha2$': '<rootDir>/node_modules/@noble/hashes/sha2.js',
    '^@noble/hashes/sha2.js$': '<rootDir>/node_modules/@noble/hashes/sha2.js',
    '^@noble/hashes/hkdf$': '<rootDir>/node_modules/@noble/hashes/hkdf.js',
    '^@noble/hashes/hkdf.js$': '<rootDir>/node_modules/@noble/hashes/hkdf.js',
    '^@noble/hashes/hmac$': '<rootDir>/node_modules/@noble/hashes/hmac.js',
    '^@noble/hashes/hmac.js$': '<rootDir>/node_modules/@noble/hashes/hmac.js',
  },
  testPathIgnorePatterns: [
    '<rootDir>/tests/playwright/',
    '<rootDir>/node_modules/',
    '<rootDir>/legacy_notes_and_workbook/',
    '<rootDir>/client/src/stylesheets/',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '\\.(jsx?|tsx?)$': 'babel-jest',
    '\\.txt$': '@glen/jest-raw-loader',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@noble/curves|@noble/hashes|@noble/ed25519|argon2-browser|bip39)/)',
  ],
  globals: {
    APP_REVISION: 'jest-test',
    APP_VERSION: '0.0.1',
  },
};
