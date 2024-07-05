export const onTranslate = async (text, langFrom, langTo) => {
    let data = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${langFrom}|${langTo}`)
    let result = await data.json()

    return result
}