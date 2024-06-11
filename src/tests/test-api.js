const Centum = require('centum.js')
const {Datus} = require('datus.js')

const centum = new Centum()
const datus = new Datus()

const onCheckInitialDate = () => {
    const result = datus.now('date')

    return result
}

const onGenerateDates = (length = 4) => {
    const result = datus.dates('day', length)

    let flag = typeof result === 'object' && result.length === length

    return flag
}

const onFindDistance = (round = 0) => {
    const start = onGenerateCords()
    const end = onGenerateCords()

    let distance = centum.haversine([start.lat, start.long, end.lat, end.long], round)

    return distance
}

const onGenerateCords = () => {
    return {lat: Math.random() * 180, long: Math.random() * 180}
}

module.exports = {onCheckInitialDate, onGenerateDates, onFindDistance}