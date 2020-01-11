// File taken from Patrick Zurmühle's project

let initialState = {};

const genericRollsReducer = (state = initialState, action) => {

    switch (action.type) {

        case 'GENERIC_ROLLS_UPDATE':

            var id              = action.payload.id;

            // Update state if id exists
            // -------------------------
            if (state.hasOwnProperty(id)) {
                state[id].min           = action.payload.min;
                state[id].max           = action.payload.max;
                state[id].data          = action.payload.data;
            }
            // Create state if id does not exist
            // ---------------------------------
            else {

                state[id] = {
                    min:        action.payload.min,
                    max:        action.payload.max,
                    data:       action.payload.data,
                }

            }

            return state;

        default:
            return state;
    }
};

export default genericRollsReducer
