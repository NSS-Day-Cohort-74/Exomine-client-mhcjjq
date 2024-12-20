import { getData } from "./Data.js"
import { transientState } from "./TransientState.js"

export const generateColonyMineral = async () => {
    const colonyMinerals = await getData("colonyMinerals?_expand=mineral&_expand=colony");
    let headerHTML = `<h2>Colony Minerals: </h2>`
    let colonyMineralsHTML = "<ul>"
    console.log(transientState)
    if (transientState.get("governorId") > 0) {
        const colonyMineralsArray = colonyMinerals.filter(
            (colonyMineral) => {
                return colonyMineral.colonyId != 0 && colonyMineral.colonyId === transientState.get("colonyId") && colonyMineral.quantity > 0
            }
        ).map((colonyMineral) => {
            headerHTML = `<h2>${colonyMineral.colony.name} Minerals:</h2>`
            return `<li id="colonyMineralsAvailable" value="${colonyMineral.colonyId}">${colonyMineral.quantity} tons of ${colonyMineral.mineral.name}</li>`
        })
        colonyMineralsHTML += "</ul>"
        colonyMineralsHTML += colonyMineralsArray.join("")

        return `${headerHTML} ${colonyMineralsHTML}`
    } else if (transientState.get("governorId") === 0) {
        return headerHTML

    }
}
