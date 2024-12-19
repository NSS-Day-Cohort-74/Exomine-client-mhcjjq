import { getData } from "./Data.js"

export const transientState = new Map()

const resetTransientState = () => {
    transientState.set("id", 0)
    transientState.set("governorId", 0)
    transientState.set("colonyId", 0)
    transientState.set("mineralId", 0)
    transientState.set("facilityId", 0)
}

const resetTransientStateAfterPurchase = () => {
    transientState.set("mineralId", 0)
}

resetTransientState()

// export const setFacility = (facilityId) => {
//     state.selectedFacility = facilityId
//     document.dispatchEvent(new CustomEvent("stateChanged"))
// }

export const setTransientState = (propertyType, selectedId) => {
    transientState.set(propertyType, selectedId)
    document.dispatchEvent(new CustomEvent("stateChanged"))
    console.log(transientState)
}

export const purchaseMineral = async () => {
    const facilityId = transientState.get("facilityId")
    const colonyId = transientState.get("colonyId")
    const mineralId = transientState.get("mineralId")

    console.log("Starting purchase with:", { colonyId, mineralId, facilityId })

    const facilityMinerals = await getData(`facilityMinerals?facilityId=${facilityId}&mineralId=${mineralId}`)

    console.log("Found facility minerals:", facilityMinerals)

    if (facilityMinerals.length > 0 && facilityMinerals[0].quantity > 0) {
        const facilityMineral = facilityMinerals[0]
        const updatedFacilityMineral = {
            ...facilityMineral,
            quantity: facilityMineral.quantity - 1
        }
        await fetch(`http://localhost:8088/facilityMinerals/${facilityMineral.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedFacilityMineral)
        })
    }

    const colonyMinerals = await getData(`colonyMinerals?colonyId=${colonyId}&mineralId=${mineralId}`)
    console.log("Existing colony minerals:", colonyMinerals)

    if (colonyMinerals.length > 0) {
        const colonyMineral = colonyMinerals[0]
        const updatedColonyMineral = {
            ...colonyMineral, 
            quantity: colonyMineral.quantity + 1
        }
        await fetch(`http://localhost:8088/colonyMinerals/${colonyMineral.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedColonyMineral)
        })
    } else {
        const newMineralPurchase = {
            colonyId: colonyId,
            mineralId: mineralId,
            quantity: 1
        }

        await fetch("http://localhost:8088/colonyMinerals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMineralPurchase)
        })
    }

    console.log("PURCHASE MATERIAL TRIGGERED")
    resetTransientStateAfterPurchase()
    document.dispatchEvent(new CustomEvent("stateChanged"))
}


//If there is a coloniesMinerals entry that contains the purchased material, increase the value by 1 ton/
//If there is not a coloniesMinerals entry that contains the correct colony and purchased material, create a new entry that contains the rel information

