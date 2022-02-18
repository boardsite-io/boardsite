module.exports = {
    roots: ["<rootDir>/src/"],
    moduleDirectories: ["node_modules", "src"],
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: ["node_modules/(?!(canvas)/)"],
}
