// File taken from Patrick Zurmühle's project

// import Reducers
import genericRollsReducer from "./genericRolls";
import carbonBudgetReducer from "./carbonBudget";
import rollspecificGoalsReducer from "./rollspecificGoals";
import genericTimeseriesReducer from "./genericTimeseries";
import genericValueReducer from "./genericValue";

import { combineReducers } from "redux";


// Combine all reducers
const allReducers = combineReducers({
   genericRolls:        genericRollsReducer,
   carbonBudget:        carbonBudgetReducer,
   rollspecificGoals:   rollspecificGoalsReducer,
   genericTimeseries:   genericTimeseriesReducer,
   genericValue:        genericValueReducer,
});

export default allReducers;
