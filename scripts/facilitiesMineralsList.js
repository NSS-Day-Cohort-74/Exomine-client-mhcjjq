
import { getData } from "./Data.js"
import { setTransientState, transientState } from "./TransientState.js"

const handleMineralChange = (mineralSelectedChangeEvent) => {
    if (mineralSelectedChangeEvent.target.name === "facilityMineralsAvailable") {
        const convertedToInteger = parseInt(mineralSelectedChangeEvent.target.value)
        setTransientState("mineralId", convertedToInteger)
    }
}

export const getFacilityMineralList = async () => {
    let facilityMinerals = await getData("facilityMinerals?_expand=mineral&_expand=facility")
    let headerHTML = `<h2>Facility Minerals: </h2>`
    let facilityMineralsHTML = ""

    document.addEventListener(
        "change",
        handleMineralChange
    )


    if (transientState.get("facilityId") > 0) {
        const facilityMineralsStringArray = facilityMinerals.filter(
            (facilityMineral) => {
                return facilityMineral.facilityId != 0 && facilityMineral.facilityId === transientState.get("facilityId") && facilityMineral.quantity > 0
            }
        ).map((facilityMineral) => {
            if (facilityMineral.mineralId === transientState.get("mineralId")) {
                headerHTML = `<h2>${facilityMineral.facility.name} Minerals:</h2>`
                return `
                  <div>
                    <input type="radio" name="facilityMineralsAvailable" value=${facilityMineral.mineral.id} checked>${facilityMineral.quantity} tons of ${facilityMineral.mineral.name}</input>
                  </div>
                    `
            }
            headerHTML = `<h2>${facilityMineral.facility.name} Minerals:</h2>`
            return `
                  <div>
                    <input type="radio" name="facilityMineralsAvailable" value=${facilityMineral.mineral.id}>${facilityMineral.quantity} tons of ${facilityMineral.mineral.name}</input>
                  </div>
                    `
        })

        facilityMineralsHTML += facilityMineralsStringArray.join("")
        return `${headerHTML} ${facilityMineralsHTML}`

    } else {
        return headerHTML
    }
}