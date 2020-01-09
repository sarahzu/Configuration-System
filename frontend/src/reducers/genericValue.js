let initialState = {};

let counter = 0;

const genericValueReducer = (state = initialState, action) => {

    counter += 1;

    switch (action.type) {

        case 'GENERIC_VALUE_UPDATE':


            var id = action.payload.id;

            // Update state if id exists
            // -------------------------
            if (state.hasOwnProperty(id)) {
                state[id].value         = action.payload.value;
                state[id].change        = counter;
            }

            // Create state if id does not exist
            // ---------------------------------
            else {
                state[id] = {
                    value:              action.payload.value,
                    change:             counter,

                }
            }

            return state;

        default:
            return state;
    }

};

export default genericValueReducer
