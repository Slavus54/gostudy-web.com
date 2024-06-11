const {onCheckInitialDate, onGenerateDates, onFindDistance} = require('../test-api')

describe('Testing datus.js and centum.js libraries', () => {
    test('Check initial date generation', () => {
        expect(onCheckInitialDate()).not.toBe(null)
    })

    test('Generate dates to choose and check it', () => {
        expect(onGenerateDates()).toBe(true)
    })

    test('Find distance between two dots', () => {
        expect(onFindDistance(1)).not.toBeNaN()
    })
})