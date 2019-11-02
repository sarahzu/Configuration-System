import React from 'react'

import Settings from "./settings"


class SetComponents extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Set Components</h1>
                <Settings/>
            </div>
        );
    }
}

export default SetComponents;