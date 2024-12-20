import { transientState } from "./TransientState.js"
import { getData } from "./Data.js"
const govData = await getData("governors")
const facilityData = await getData("facilities")


export const generateGovImage = () => {
    const currentGovId = transientState.get("governorId")
    const currentGovObject = govData.find(({ id: id }) => parseInt(currentGovId) === id)
    if (currentGovId != 0) {
        return `<img id="gov__img" src=${currentGovObject.avatar} />`
    } else {
        return ""
    }
    // return ""
}

export const generateFacilityImage = () => {
    const currentFacilityId = transientState.get("facilityId")
    const currentFacilityObject = facilityData.find(({ id: id }) => parseInt(currentFacilityId) === id)
    if (currentFacilityId != 0) {
        return `<img id="facility__img" src=${currentFacilityObject.avatar} />`
    } else {
        return ""
    }
    // return ""
}