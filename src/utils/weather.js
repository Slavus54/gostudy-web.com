export const getWeatherAPI = async (lat = 0, long = 0, isCurrent = true) => {
    let data = await fetch(`https://api.openweathermap.org/data/2.5/${isCurrent ? 'weather' : 'forecast'}?lat=${lat}&lon=${long}&appid=f9c068417d07b1b012bab4659d687259`)
    let result = await data.json()

    return result
}