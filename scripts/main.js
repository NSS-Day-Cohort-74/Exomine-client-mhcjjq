import { getFacilitiesList } from "./facilities.js"
import { getFacilityMineralList } from "./facilitiesMineralsList.js"
import { generateColonyMineral } from "./generateColonyMineral.js"
import { generateGovernorList } from "./generateGovernorList.js"
import { generateFacilityImage, generateGovImage } from "./generateImages.js"
import { generatePurchaseButton } from "./PurchaseButton.js"
import { generateShoppingCart } from "./SpaceCart.js"
import { addToCartButton } from "./AddToCartButton.js"

const mainContainerElement = document.querySelector("#container")

export const render = async () => {
  const governorListHTML = await generateGovernorList();                                    //moved into the render() to ensure that when the change events occur, the page is updated with the relevant data.
  const colonyMineralsHTML = await generateColonyMineral()
  const facilitiesListHTML = await getFacilitiesList()
  const facilityMineralsHTML = await getFacilityMineralList()
  const shoppingCartHTML = await generateShoppingCart()
  const purchaseButton = generatePurchaseButton()
  const govImgHTML = generateGovImage()
  const facilityImgHTML = generateFacilityImage()
  const addToCartButtonHTML = addToCartButton()


  const compositeHTML =
    `
    <h1 id="title">Solar System Mining Marketplace</h1>
      <section class="choices">
        <article class="choices_gov options">
          <h4>Choose a governor:</h4>
            ${governorListHTML}
        </article>
        <div>
          ${govImgHTML}
        </div>
        <article class="colonies_list options">
          ${colonyMineralsHTML}
        </article>
        <article class="choices_facility options">
          <h4>Choose a facility:</h4>
            ${facilitiesListHTML}    
        </article>
        <div>
          ${facilityImgHTML}
        </div>
      </section>
        
      <section class="display">
        <article class="choices_mineral options">
          ${facilityMineralsHTML}
          ${addToCartButtonHTML}
        </article>
        <article class="cart">
          <h2>Space Cart</h2>
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

