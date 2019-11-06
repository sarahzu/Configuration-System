import React from 'react'

import Settings from "./settings"

import axios from 'axios';
import Async from "react-select/async/dist/react-select.browser.esm";
require('dotenv').config();

class SetComponents extends React.Component {

    constructor(props) {
        super(props);
        //FIXME: set this state to props of parent
        this.state = {info: []};
    }

    componentDidMount() {
        this.getSettingsInfo();
    }

    /**
     * get all information needed, to build the settings page
     *
     * @returns {Promise<void>} Json object with all needed info
     */
    async getSettingsInfo() {
        await axios.get(process.env.REACT_APP_SETTINGS_INFO, {headers: {'Content-Type': 'application/json'}}).then(response => {
            this.setState({info: response.data.input});
        });
    }

    render () {
        const info = this.state.info;

        if (info.length === 0) {
            return <span>Loading data...</span>
        }
        return (
            <div>
                <h1>Set Components</h1>
                <Settings settingsInfo={this.state.info}/>
            </div>);
    }


    /*render() {
        return (
            <div>
                <h1>Set Components</h1>
                <Settings settingsInfo={this.state.info}/>
            </div>
        );
    }*/
}

export default SetComponents;