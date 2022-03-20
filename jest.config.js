module.exports = {
    roots: ["<rootDir>/src/"],
    moduleDirectories: ["node_modules", "src"],
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!(canvas)/)"],
    moduleNameMapper: {
        "\\.svg$": "<rootDir>/src/util/testing/svgrMock.ts",
    },
    setupFilesAfterEnv: ["./jest.setup.js"],
}
