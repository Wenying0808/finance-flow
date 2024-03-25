import { SET_BUDGET } from "./types";

const setBudget = (payload: number) => ({
    type: SET_BUDGET,
    payload,
  });

  export { setBudget };

/*
//Define action types

export const SET_CURRENCY = 'SET_CURRENCY';
export const SET_START_DATE = 'SET_START_DATE';
export const SET_BUDGET = 'SET_BUDGET';

//define action creator
export interface SetCurrencyAction {
    type: typeof SET_CURRENCY;
    payload: string;
}

export interface SetStartDateAction {
    type: typeof SET_START_DATE;
    payload: number;
}

export interface SetBudgetAction {
    type: typeof SET_BUDGET;
    payload: number;
}

export type ActionTypes = SetCurrencyAction | SetStartDateAction | SetBudgetAction;*/