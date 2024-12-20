import { getData } from "./Data.js"

// Create transientState map to capture state changes
export const transientState = new Map()
export const shoppingCartSet = new Set()


// function to set all transient state properties
export const resetTransientState = () => {
    transientState.set("id", 0)
    transientState.set("governorId", 0)
    transientState.set("colonyId", 0)
    transientState.set("mineralId", 0)
    transientState.set("facilityId", 0)
    transientState.set("shoppingCartItems", shoppingCartSet) // holds mineralIds for shopping cart
    document.dispatchEvent(new CustomEvent("stateChanged")) //added dispatch event to activate when called to reset page.
}

// reset selected mineral after purchase
const resetTransientStateAfterPurchase = () => {
    transientState.set("mineralId", 0)
    shoppingCartSet.clear()
}

// initialize transient state properties 
resetTransientState()

// declare TransientState setter function with two parameters
export const setTransientState = (propertyType, selectedId) => {
    transientState.set(propertyType, selectedId)
    document.dispatchEvent(new CustomEvent("stateChanged"))
    // console.log(transientState)
}

// post and put data functions
const postData = async (data, url) => {

    const response = await fetch(url, ({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }))
}
const putData = async (data, url) => {

    const response = await fetch(url, ({
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }))
}


// Purchase Mineral Function
export const purchaseMineral = async () => {
    //loops through each set within the shoppingCartSet 
    for (const item of shoppingCartSet) {
        console.log(item) //adding to see what the set looks like before doing any modifications. I think the rest of the function will be moved into the for loop with the exception of 
        // Get current colony's id from transient state                        
        const currentColonyId = item.colonyId
    
        // Get current facility's id from transient state
        const currentFacilityId = item.facilityId
    
        // Get current mineral Id from transient state
        const currentMineralId = item.mineralId // transientState.get("mineralId")
    
        // getData from the colonyminerals database
        const colonyMineralData = await getData("colonyminerals")
    
        // getData from the facilityminerals database
        const facilityMineralData = await getData("facilityminerals")
    
        // find colonies with match to current colonyId and current selected mineral,
        // should return 0 or 1 element in an array. If no element, then doesn't exist in database and will need to POST
        // if 1 element, then already exists in database and will need to PUT to entry's endpoint/id
    
        const filteredColonyMineralData = colonyMineralData.filter((colonyMineral) => parseInt(colonyMineral.colonyId) === currentColonyId
            && parseInt(colonyMineral.mineralId) === currentMineralId)
    
        const currentFacilityMineral = facilityMineralData.find((facilityMineral) => parseInt(facilityMineral.facilityId) === currentFacilityId
            && parseInt(facilityMineral.mineralId) === currentMineralId)
    
        const facilityMineralDataPUT = {
            "id": (currentFacilityMineral.id ? currentFacilityMineral.id : 0),
            "quantity": (currentFacilityMineral.quantity != 0 ? currentFacilityMineral.quantity - 1 : 0), // ternary operator to ensure quantity doesnt go negative
            "mineralId": currentMineralId,
            "facilityId": currentFacilityId
        }
    
        // Check whether Governor's colony currently has an object in the array
        // If it exists, update database with a PUT.
        if (filteredColonyMineralData.length > 0) {
    
            const colonyMineralDataPUT = {
                "id": filteredColonyMineralData[0].id,
                "quantity": (currentFacilityMineral.quantity != 0 ? filteredColonyMineralData[0].quantity + 1 : filteredColonyMineralData[0].quantity), // ternary operate to ensure you cannot continue increasing quantity in colony when facility runs out
                "colonyId": currentColonyId,
                "mineralId": currentMineralId
            }
    
            // PUT TO DATABASE
            const putColonyURL = `http://localhost:8088/colonyminerals/${filteredColonyMineralData[0].id}`
            putData(colonyMineralDataPUT, putColonyURL)
    
            const putFacilityURL = `http://localhost:8088/facilityminerals/${currentFacilityMineral.id}`
            putData(facilityMineralDataPUT, putFacilityURL)
        }
    
        // if the colony currently has no material
        if (filteredColonyMineralData.length === 0) {
    
            const colonyMineralDataPOST = {
                "quantity": 1,
                "colonyId": currentColonyId,
                "mineralId": currentMineralId
            }
    
            // POST to database
            const postColonyURL = "http://localhost:8088/colonyminerals/"
            postData(colonyMineralDataPOST, postColonyURL)
            const putFacilityURL = `http://localhost:8088/facilityminerals/${currentFacilityMineral.id}`
            putData(facilityMineralDataPUT, putFacilityURL)
        }
    }

    resetTransientStateAfterPurchase()
    console.log("PURCHASE MATERIAL TRIGGERED")
    document.dispatchEvent(new CustomEvent("stateChanged"))
}


//If there is a coloniesMinerals entry that contains the purchased material, increase the value by 1 ton/
//If there is not a coloniesMinerals entry that contains the correct colony and purchased material, create a new entry that contains the rel information

