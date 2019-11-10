import React from 'react'

import Settings from "./settings"

import axios from 'axios';
import Async from "react-select/async/dist/react-select.browser.esm";
require('dotenv').config();

class SetComponents extends React.Component {

    constructor(props) {
        super(props);
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
            if (localStorage.getItem("apiResponse")) {
                const prevResponse = JSON.parse(localStorage.getItem("apiResponse"));
                // check if api response differs from last response. If so, clear local storage, so that new
                // settings an be made
                if (JSON.stringify(prevResponse) !== JSON.stringify(response.data.input)) {
                    localStorage.clear()
                }
            }
            else {
                localStorage.setItem("apiResponse", JSON.stringify(response.data.input))
            }
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