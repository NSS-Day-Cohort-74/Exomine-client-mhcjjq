import { getData } from "./Data.js"
import { transientState, setTransientState, resetTransientState, shoppingCartSet} from "./TransientState.js";

const handleGovernorChange = async (governorSelectedChangeEvent) => {
    let govSelectedValue = parseInt(governorSelectedChangeEvent.target.value)

    if (governorSelectedChangeEvent.target.id === "governor" && governorSelectedChangeEvent.target.value != 0) {
        const convertedToInteger = parseInt(governorSelectedChangeEvent.target.value)
        const currentGovColonyId = await getData("governors")
        const foundGov = currentGovColonyId.find((governor) => parseInt(governor.id) === convertedToInteger)
        setTransientState("governorId", convertedToInteger)
        setTransientState("colonyId", foundGov.colonyId)
    } else if (governorSelectedChangeEvent.target.id === "governor" && govSelectedValue=== 0) {
        // console.log(governorSelectedChangeEvent.target.value)
        resetTransientState()
        shoppingCartSet.clear()
    }
}
export const generateGovernorList = async () => {
    const govData = await getData("governors");
    let govListHTML = ""

    govListHTML += '<select id="governor">'
    govListHTML += '<option value="0">Choose a governor</option>'

    const governorArray = govData
        .filter((governor) => governor.activestatus === true)
        .map((governor) => {
            if (governor.id === transientState.get("governorId")) {

                return `<option value="${governor.id}"  selected>${governor.name}</option>`
            }
            return `<option value="${governor.id}">${governor.name}</option>`
        }
        )

    govListHTML += governorArray.join("")
    govListHTML += "</select>"

    document.addEventListener("change", handleGovernorChange)
    return govListHTML
}
