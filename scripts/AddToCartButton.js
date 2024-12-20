import { shoppingCartSet, transientState } from "./TransientState.js"
import { generateShoppingCart } from "./SpaceCart.js"

const handleAddToCartClick =  (clickEvent) => {
    if (clickEvent.target.id === "addToCartButton" && parseInt(transientState.get("mineralId")) != 0) {
        const shoppingCartObject = {
            facilityId: transientState.get("facilityId"),
            mineralId: transientState.get("mineralId"),
            colonyId: transientState.get("colonyId") 
        }
        
        shoppingCartSet.add(shoppingCartObject)
        
        console.log("shoppingCartSet", shoppingCartSet)
        generateShoppingCart()
        document.dispatchEvent(new CustomEvent("stateChanged"))
    }
}


export const addToCartButton = () => {
    document.addEventListener("click", handleAddToCartClick)
    return `<button id="addToCartButton">Add to Cart</button>`
}

