import { getData } from "./Data.js"
import { transientState } from "./TransientState.js"

export const generateShoppingCart = async () => {
    const mineralData = await getData("minerals")
    const facilityData = await getData("facilities")
    const colonyData = await getData("colonies")
    const shoppingCart = transientState.get("shoppingCartItems")
    // const stateOfMinerals = shoppingCartSet //transientState.get("mineralId")
    // const stateOfFacility = transientState.get("facilityId")

    console.log("shoppingCart", shoppingCart)
    let shoppingCartHTML = ""

    for (const item of shoppingCart) {      
        // console.log("item.facilityId", typeof item.facilityId)
        // console.log("item.mineralId", typeof item.mineralId) 
        // console.log("item", item)
        const targetMineral = mineralData.find(({ id: mineralId }) => item.mineralId=== mineralId)
        // console.log(targetMineral)
        const targetFacility = facilityData.find(({ id: facilityId }) => item.facilityId === facilityId)
        const targetColony = colonyData.find(({ id: colonyId }) => item.colonyId === colonyId)
        // console.log(targetFacility)

        shoppingCartHTML += `<p>1 ton of ${targetMineral.name} from ${targetFacility.name} for ${targetColony.name}</p>`

        // if (item.facilityId != 0 && item.mineralId != 0) {
        // } else {
        //     return ""
        // }
    }

    return shoppingCartHTML
}