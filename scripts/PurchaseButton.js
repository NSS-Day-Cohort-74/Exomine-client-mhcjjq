import { purchaseMineral, transientState } from "./TransientState.js"

const handleButtonClick = (clickEvent) => {
    const stateOfMinerals = transientState.get("mineralId")
    const stateOfFacility = transientState.get("facilityId")
    if (clickEvent.target.id === "purchasebutton") {
        // check to make sure something is in the cart
        if (stateOfMinerals != 0 && stateOfFacility != 0) {
            purchaseMineral()
        }
    }
}

export const generatePurchaseButton = () => {
    document.addEventListener("click", handleButtonClick)
    return `<button id="purchasebutton">Purchase Mineral</button>`
}