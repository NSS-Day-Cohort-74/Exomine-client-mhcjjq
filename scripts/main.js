import { getFacilitiesList } from "./facilities.js"
import { getFacilityMineralList } from "./facilitiesMineralsList.js"
import { generateColonyMineral } from "./generateColonyMineral.js"
import { generateGovernorList } from "./generateGovernorList.js"
import { generatePurchaseButton } from "./PurchaseButton.js"
import { generateShoppingCart } from "./SpaceCart.js"

const mainContainerElement = document.querySelector("#container")

const render = async () => {
    const governorListHTML = await generateGovernorList();                                    //moved into the render() to ensure that when the change events occur, the page is updated with the relevant data.
    const colonyMineralsHTML = await generateColonyMineral()
    const facilitiesListHTML = await getFacilitiesList()
    const facilityMineralsHTML = await getFacilityMineralList()
    const shoppingCartHTML = await generateShoppingCart()
    const purchaseButton = generatePurchaseButton()


    const compositeHTML =
        `<h1 id="title">Solar System Mining Marketplace</h1>
      <section class="choices">
        <article class="choices_gov options">
            <h5>Choose a governor:</h5>
            ${governorListHTML}
        </article>
        <article class="colonies_list options">
            ${colonyMineralsHTML}
        </article>
        <article class="choices_facility options">
            <h5>Choose a facility:</h5>
            ${facilitiesListHTML}
        </article>
      </section>

      <section class="display">
        <article class="choices_mineral options">
            ${facilityMineralsHTML}
        </article>
        <article class="cart">
            <h3>Space Cart</h3>
            ${shoppingCartHTML}
            ${purchaseButton}
        </article>
      </section>
    `
    mainContainerElement.innerHTML = compositeHTML

}

document.addEventListener("stateChanged", event => {
    console.log("State of data has changed. Regenerating HTML...")
    render()
}) 

render()

