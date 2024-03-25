import { SummaryState } from "./interface";
import { SET_BUDGET } from "./types";

const initialState: SummaryState = {
    budget: 100,
}

const summaryReducer = (state: SummaryState = initialState, action: any) => {
    switch (action.type) {
        case SET_BUDGET:
            return {...state, budget: action.payload};
        default:
            return state;
    }
}
export default summaryReducer;



/*import { SummaryState } from "./types";
import { SET_CURRENCY, SET_START_DATE, SET_BUDGET } from "./actions";
import { Reducer } from "redux";

export const initialState: SummaryState = {
    currency: 'EUR',
    startDate: 1,
    budget: 1000,
}

const summaryReducer: Reducer = ( state = initialState, action) => {
    switch(action.type){
        case SET_CURRENCY:
            return { ...state, currency: action.payload };
        case SET_START_DATE:
            return { ...state, startDate: action.payload };
        case SET_BUDGET:
            return { ...state, budget: action.payload };
        default:
            return state;
    }
}

export default summaryReducer;*/