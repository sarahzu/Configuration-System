// File taken from Patrick Zurmühle's project

//////////////////////////////////////////////////
//                                              //
// Generic Value                                //
//                                              //
//////////////////////////////////////////////////


export const updateGenericValue = (values) => {
    return {
        type: 'GENERIC_VALUE_UPDATE',
        payload: values
    }
};


//////////////////////////////////////////////////
//                                              //
// Generic Rolls                                //
//                                              //
//////////////////////////////////////////////////


export const updateGenericRolls = (values) => {
    return {
        type: 'GENERIC_ROLLS_UPDATE',
        payload: values
    }
};

//////////////////////////////////////////////////
//                                              //
// Generic Timeseries                           //
//                                              //
//////////////////////////////////////////////////


export const updateGenericTimeseries = (values) => {
    return {
        type: 'GENERIC_TIMESERIES_UPDATE',
        payload: values
    }
};

//////////////////////////////////////////////////
//                                              //
// Carbon Budget                                //
//                                              //
//////////////////////////////////////////////////

export const updateCarbonGauge = (values) => {
    return {
        type: 'CARBON_GAUGE_UPDATE',
        payload: values
    }
};

export const updateCarbonEmissionArea = (values) => {
    return {
        type: 'CARBON_EMISSION_UPDATE',
        payload: values
    }
};

export const updateCarbonCapturingArea = (values) => {
    return {
        type: 'CARBON_CAPTURING_UPDATE',
        payload: values
    }
};


//////////////////////////////////////////////////
//                                              //
// Carbon Budget                                //
//                                              //
//////////////////////////////////////////////////

export const updateRollspecificGoals = (values) => {
    return {
        type: 'ROLLSPECIFIC_GOALS_UPDATE',
        payload: values
    }
};
