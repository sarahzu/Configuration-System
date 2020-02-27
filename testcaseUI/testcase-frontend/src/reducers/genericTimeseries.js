// File taken from Patrick Zurmühle's project: https://github.com/kavengo/post_fossil_cities_visualizations

let initialState = {};

let counter = 0;

const genericTimeseriesReducer = (state = initialState, action) => {

    counter +=1;

    switch (action.type) {

        case 'GENERIC_TIMESERIES_UPDATE':

            var id              = action.payload.id;

            // Update state if id exists
            // -------------------------
            if (state.hasOwnProperty(id)) {
                state[id].min         = action.payload.min;
                state[id].max         = action.payload.max;
                state[id].today       = action.payload.today;
                state[id].data        = action.payload.data;
                state[id].change      = counter;
            }
            // Create state if id does not exist
            // ---------------------------------
            else {

                state[id] = {
                    min:        action.payload.min,
                    max:        action.payload.max,
                    today:      action.payload.today,
                    data:       action.payload.data,
                    change:     counter
                }

            }

        default:
            return state;

    }
};


export default genericTimeseriesReducer
