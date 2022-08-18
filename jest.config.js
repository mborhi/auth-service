module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    watchPathIgnorePatterns: ['globalConfig'],
    // setupFilesAfterEnv: ['./jest.setup.redis-mock.js'],
};