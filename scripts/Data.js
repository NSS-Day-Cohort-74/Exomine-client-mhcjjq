// returns data from database.json based

export const getData = async (endpoint) => {
    const url = `http://localhost:8088/${endpoint}`
    const response = await fetch(url)
    const data = await response.json()

    return data
}

