// File taken from Patrick Zurmühle's project

let initialState = {};

let counter = 0;

const carbonBudgetReducer = (state = initialState, action) => {

    counter +=1;

    switch (action.type) {

        case 'CARBON_GAUGE_UPDATE':

            var id                              = action.payload.id;

            // Update state if id exists
            // -------------------------
            if (state.hasOwnProperty(id)) {
                state[id].cumulated_emissions   = action.payload.cumulated_emissions;
                state[id].critical_emissions    = action.payload.critical_emissions;
                state[id].years_left            = action.payload.years_left;
                state[id].year_speed            = action.payload.year_speed;
                state[id].change                = counter
            }
            // Create state if id does not exist
            // ---------------------------------
            else {

                state[id] = {
                    cumulated_emissions:        action.payload.cumulated_emissions,
                    critical_emissions:         action.payload.critical_emissions,
                    years_left:                 action.payload.years_left,
                    year_speed:                 action.payload.year_speed,
                    change:                     counter
                }

            }

            return state;


        case 'CARBON_EMISSION_UPDATE':

            var id                              = action.payload.id;

            // Update state if id exists
            // -------------------------
            if (state.hasOwnProperty(id)) {
                state[id].today                 = action.payload.today;
                state[id].min                   = action.payload.min;
                state[id].max                   = action.payload.max;
                state[id].timeseries            = action.payload.timeseries;
                state[id].change                = counter;

            }
            // Create state if id does not exist
            // ---------------------------------
            else {

                state[id] = {
                    today:                      action.payload.today,
                    min:                        action.payload.min,
                    max:                        action.payload.max,
                    timeseries:                 action.payload.timeseries,
                    change:                     counter
                }

            }

            return state;

        default:
            return state;
    }
};

export default carbonBudgetReducer
