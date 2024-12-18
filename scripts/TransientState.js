export const transientState = new Map()

const resetTransientState = () => {
    transientState.set("id", 0)
    transientState.set("governorId", 0)
    transientState.set("colonyId", 0)
    transientState.set("mineralId", 0)
    transientState.set("facilityId", 0)
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

export const purchaseMineral = () => {
    /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?

        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.

        Only the foolhardy try to solve this problem with code.
    */

    console.log("PURCHASE MATERIAL TRIGGERED")
    resetTransientState()
    document.dispatchEvent(new CustomEvent("stateChanged"))
}


//If there is a coloniesMinerals entry that contains the purchased material, increase the value by 1 ton/
//If there is not a coloniesMinerals entry that contains the correct colony and purchased material, create a new entry that contains the rel information

