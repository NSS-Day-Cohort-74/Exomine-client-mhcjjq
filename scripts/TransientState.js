import { getData } from "./Data.js"

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
    // console.log(transientState)
}


export const purchaseMineral = async () => {
    /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?

        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.

        Only the foolhardy try to solve this problem with code.
    */

    // Get current colony's id from transient state
    const currentColonyId = transientState.get("colonyId")

    // Get current facility's id from transient state
    const currentFacilityId = transientState.get("facilityId")

    // Get current mineral Id from transient state
    const currentMineralId = transientState.get("mineralId")

    // getData from the colonyminerals database
    const colonyMineralData = await getData("colonyminerals")

    // getData from the facilityminerals database
    const facilityMineralData = await getData("facilityminerals")

    // find colonies with match to current colonyId and current selected mineral,
    // should return 0 or 1 element in an array
    const filteredColonyMineralData = colonyMineralData.filter((colonyMineral) => parseInt(colonyMineral.colonyId) === currentColonyId
        && parseInt(colonyMineral.mineralId) === currentMineralId)

    const currentFacilityMineral = facilityMineralData.find((facilityMineral) => parseInt(facilityMineral.facilityId) === currentFacilityId
        && parseInt(facilityMineral.mineralId) === currentMineralId)

    // BUILD DATA OBJECTS TO EITHER PUT OR POST

    const colonyMineralDataPut = `{
        id: ${filteredColonyMineralData[0].id},
        quantity: ${filteredColonyMineralData[0].quantity + 1},
        colonyId: ${currentColonyId},
        mineralId: ${currentMineralId}
    }`

    const colonyMineralDataPost = `{
        id: ${filteredColonyMineralData[0].id},
        quantity: 1,
        colonyId: ${currentColonyId},
        mineralId: ${currentMineralId}
    }`

    const facilityMineralPostData = `{
        id: ${currentFacilityMineral.id},
        quantity: ${currentFacilityMineral.quantity - 1},
        mineralId: ${currentMineralId},
        facilityId: ${currentFacilityId} 
    }`


    const postData = async (facilityPostData, colonyPostData) => {



        const responseFacility = await fetch("http://localhost:8088/facilityminerals", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(facilityPostData)
        })

        const responseColony = await fetch("http://localhost:8088/colonyminerals", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(colonyPostData)
        })
    }

    const putData = async (facilityPostData, colonyPutData) => {

        const responseFacility = await fetch("http://localhost:8088/facilityminerals", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(facilityPostData)
        })

        const responseColony = await fetch("http://localhost:8088/colonyminerals", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(colonyPutData)
        })
    }

    // Check whether Governor's colony currently has current materials
    // If it exists, update database
    if (filteredColonyMineralData.length > 0) {
        // PUT TO DATABASE
        putData(facilityMineralPostData, colonyMineralDataPut)
    }

    // if the colony currently has no material
    if (filteredColonyMineralData.length === 0) {
        // POST TO DATABASE
        // PUT facilityminerals
        // POST colonyminerals
        postData(facilityMineralPostData, colonyMineralDataPost)
    }



    console.log("PURCHASE MATERIAL TRIGGERED")
    document.dispatchEvent(new CustomEvent("stateChanged"))
}


//If there is a coloniesMinerals entry that contains the purchased material, increase the value by 1 ton/
//If there is not a coloniesMinerals entry that contains the correct colony and purchased material, create a new entry that contains the rel information

