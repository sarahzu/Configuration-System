let initialState = {};

let counter = 0;

const rollspecificGoalsReducer = (state = initialState, action) => {

    counter += 1;

    switch (action.type) {

        case 'ROLLSPECIFIC_GOALS_UPDATE':

            var id                  = action.payload.id;

            // Update state if id exists
            // -------------------------
            if (state.hasOwnProperty(id)) {
                state[id].data      = action.payload.data;
                state[id].change    = counter;
            }

            // Create state if id does not exist
            // ---------------------------------
            else {
                state[id] = {
                    data:           action.payload.data,
                    change:         counter
                }

            }

            return state;

        default:
            return state;
    }
};

export default rollspecificGoalsReducer
