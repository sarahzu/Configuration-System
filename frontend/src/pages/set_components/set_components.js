import React from 'react'

import Settings from "./settings"

import axios from 'axios';
import Async from "react-select/async/dist/react-select.browser.esm";
import {Editors} from "react-data-grid-addons";
require('dotenv').config();
const { DropDownEditor } = Editors;


class SetComponents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            info: [],
            dynamicColumnsComponents: []
        };
    }

    componentDidMount() {
        this.getSettingsInfo();
        this.getModelsAndCreateDynamicDataGridColumns()
    }

    async getModelsAndCreateDynamicDataGridColumns() {
        await axios.get(process.env.REACT_APP_GET_MODELS).then(response => {
            this.setState({models: response.data});
            let j = 1;
            let models = [];
            // map through all models in the response. put them in the form e.g. {id: "model1", value:"Energy"}
            // and put them in a list [{id: "model1", value:"Energy"}, {...}, ...]
            response.data.map(item => {
                models.push({id: "model"+j, value: item})
            });
            // create dropdown editor for data grid
            let dropdownEditor = <DropDownEditor options={models}/>;

            this.setState({dynamicColumnsComponents: [
                    {key: "parameter", name: "Parameter"},
                    {key: "type", name: "Type"},
                    {key: "value", name: "Value", editor: dropdownEditor}]});
        });
    }

    /**
     * get all information needed, to build the settings page
     *
     * @returns {Promise<void>} Json object with all needed info
     */
    async getSettingsInfo() {
        await axios.get(process.env.REACT_APP_SETTINGS_INFO, {headers: {'Content-Type': 'application/json'}}).then(response => {
            this.setState({info: response.data.input});
            if (localStorage.getItem("apiResponse") && response.data.input.components) {
                const prevResponse = JSON.parse(localStorage.getItem("apiResponse"));
                // check if api response differs from last response. If so, clear local storage, so that new
                // settings can be made
                if (JSON.stringify(prevResponse) !== JSON.stringify(response.data.input)) {
                    localStorage.clear();
                    // make a new entry for the final output after erasing everything
                    localStorage.setItem("fullComponentsInfo", JSON.stringify({configuration:{components:[], decisionCards:[]}}))

                    // fill final output with infos
                    const components = response.data.input.components;
                    let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
                    components.map(v => {
                        let currComp = {
                            "name": v,
                            "parameter":[],
                            "position": {},
                            "enabled": false,
                            "toolbox": false
                        };
                        finalOutput.configuration.components.push(currComp);
                    });
                    localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput))
                }
            }
            else if (response.data.input.components) {
                localStorage.setItem("apiResponse", JSON.stringify(response.data.input));
                // fill final output with infos
                const components = response.data.input.components;
                let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
                components.map(v => {
                    let currComp = {
                        "name": v,
                        "parameter":[],
                        "position": {},
                        "enabled": false,
                        "toolbox": false
                    };
                    finalOutput.configuration.components.push(currComp);
                });
                localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput))
            }
        });
    }

    /**
     * check if given json is contained in array
     *
     * @param array
     * @param json
     * @returns {boolean}
     */
    isJsonInArray(array, json) {
        let result = false;
        array.map(v => {
            if (JSON.stringify(v) === JSON.stringify(json)) {
                result = true;
            }
        });
        return result;
    }

    render () {
        const info = this.state.info;

        if (info.length === 0) {
            return <span>Loading data...</span>
        }
        return (
            <div>
                <h1>Set Components</h1>
                <Settings settingsInfo={this.state.info} dynamicColumnsComponents={this.state.dynamicColumnsComponents}/>
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