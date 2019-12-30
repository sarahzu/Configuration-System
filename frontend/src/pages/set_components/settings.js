import React from 'react'

import { Editors } from "react-data-grid-addons";
import {withRouter} from "react-router";
import PropTypes from "prop-types";
import SettingsDecisionCards from "./settings_decision_cards";
import SettingsComponents from "./settings_components";
import axios from "axios";

require('dotenv').config();

const ListItem = require("react-list-select");

class Settings extends React.Component {

    constructor(props) {
        super(props);

        //initialize layout and toolbox
        if (localStorage.getItem('SelectedLayout')){}
        else {localStorage.setItem('SelectedLayout', JSON.stringify({lg: []}));}
        if (localStorage.getItem('toolbox')){}
        else {localStorage.setItem('toolbox', JSON.stringify({lg: []}));}

        //initialize final output and current stats
        let finalComponentsInfo;
        let currentStats;
        let currentStatsDc;
        if (localStorage.getItem("currentStats")) {currentStats = JSON.parse(localStorage.getItem("currentStats"))}
        else {
            currentStats = {
                currComponentName: "",
                currParameters: [],
                currPosition: {},
                currEnabled: false,
                currToolbox: false
            };
            localStorage.setItem("currentStats", JSON.stringify(currentStats))
        }
        if (localStorage.getItem("currentStatsDc")) {currentStatsDc = JSON.parse(localStorage.getItem("currentStatsDc"))}
        else {
            currentStatsDc = {
                currDcName: "",
                currParameters: [],
                currEnabled: false,
            };
            localStorage.setItem("currentStatsDc", JSON.stringify(currentStatsDc))
        }
        if (localStorage.getItem('fullComponentsInfo')){finalComponentsInfo = JSON.parse(localStorage.getItem('fullComponentsInfo'))}
        else {
            localStorage.setItem('fullComponentsInfo', JSON.stringify({configuration:{'1':{components:[], decisionCards:[]}}}));
            finalComponentsInfo = {}
        }

        let models;


        //let settingsInfo = JSON.parse(this.props.settingsInfo);
        //if (localStorage.getItem("issueTypesDataGridComponents")) {this.setState({issueTypesDataGridComponents: JSON.parse(localStorage.getItem("issueTypesDataGridComponents"))});}
        // if (localStorage.getItem("issueTypesDataGridDC")) {this.setState({issueTypesDataGridDc: JSON.parse(localStorage.getItem("issueTypesDataGridDC"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridComponents")) {this.setState({issueTypeEditorDataGridComponents: JSON.parse(localStorage.getItem("issueTypeEditorDataGridComponents"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridDc")) {this.setState({issueTypeEditorDataGridDc: JSON.parse(localStorage.getItem("issueTypeEditorDataGridDc"))});}

        this.state = {
            finalComponentsInfo: finalComponentsInfo,

            currComponentName: currentStats.currComponentName,
            currParameters: currentStats.currParameters,
            currPosition: currentStats.currPosition,
            currEnabled: currentStats.currEnabled,
            currToolbox: currentStats.currToolbox,


            models: [],
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onPageChangeButtonClicked = this.onPageChangeButtonClicked.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("fullComponentsInfo")) {this.setState({fullComponentsInfo: JSON.parse(localStorage.getItem("fullComponentsInfo"))});}
        if (localStorage.getItem("currentStats")) {this.setState({currentStats: JSON.parse(localStorage.getItem("currentStats"))});}
        if (localStorage.getItem("currentStatsDc")) {this.setState({currentStatsDc: JSON.parse(localStorage.getItem("currentStatsDc"))});}
    }


    // /**
    //  * collect all information of one component and add it to the final output
    //  *
    //  * @param componentName {string}    name of the component
    //  * @param parameters    {array}     parameter of the component in the form [{"name":"param1", "type":"string","value":"param value"}, {...}, ...]
    //  * @param position      {json}      position of the component on screen in the from {"width":360, "height":250, "x":65, "y":203}
    //  * @param enabled       {boolean}   true if component is a checked component, false otherwise
    //  * @param toolbox       {boolean}   true if component resides in toolbox, false otherwise
    //  */
    // addParametersToFinalComponents(componentName, parameters, position, enabled, toolbox) {
    //     // if final output is not yet in local storage, add it
    //     if (!localStorage.getItem("fullComponentsInfo")) {localStorage.setItem('fullComponentsInfo', JSON.stringify({configuration:{components:[], decisionCards:[]}}));}
    //
    //     // add content to storage
    //     const finalComponents = JSON.parse(localStorage.getItem("fullComponentsInfo"));
    //     const compMeta = {
    //         "name": componentName,
    //         "parameter":parameters,
    //         "position": position,
    //         "enabled": enabled,
    //         "toolbox": toolbox
    //     };
    //     finalComponents.components.put(compMeta);
    //     localStorage.setItem("fullComponentsInfo", finalComponents);
    // }

    onPageChangeButtonClicked() {
        let path = `/arrange`;
        this.props.history.push(path);
    }

    render() {

        const stylesCheckbox = {
            overflow:"scroll",
        };
        const stylesSelected = {
            overflow:"scroll",
        };

        const stylesGridUpper = {
            //background:"lightgray",
            background: "lightblue",
            borderRadius: "10px",
            marginTop:"5px",
            marginBottom: "10px"
        };

        const stylesGridLower = {
            background: "lightgray",
            marginTop: "10px",
            marginBottom:"5px",
            borderRadius: "10px",

        };

        return (
            <div className="container">
                <button onClick={this.onPageChangeButtonClicked}>Go to 'Arrange Components' page</button>
                <div className="row">
                    <form className="form">
                        <SettingsComponents dynamicColumnsComponents ={this.props.dynamicColumnsComponents} callbackColumnsComponents={this.props.callbackColumnsComponents} stylesGridUpper={stylesGridUpper} stylesCheckbox={stylesCheckbox} settingsInfo={this.props.settingsInfo}/>
                        <SettingsDecisionCards callbackColumnsDecisionCards={this.props.callbackColumnsDecisionCards} stylesGridLower={stylesGridLower} stylesCheckbox={stylesCheckbox} settingsInfo={this.props.settingsInfo}/>
                    </form>
                </div>
            </div>
        );
    }
}

/*
// dynamic component settings. Can be integrated in rendering return form next to the components settings
<SettingsDecisionCards stylesGridLower={stylesGridLower} stylesCheckbox={stylesCheckbox} settingsInfo={this.props.settingsInfo}/>
 */

/**
 * props description of parameters
 */
const descriptionNameRowShape = PropTypes.shape({
    description: PropTypes.string.isRequired,
    name:PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape({
        issueTypes: PropTypes.arrayOf(PropTypes.arrayOf({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        }).isRequired).isRequired,
        parameter: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired).isRequired
});

Settings.propTypes = {
    settingsInfo: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        componentsParameters: PropTypes.arrayOf(descriptionNameRowShape.isRequired).isRequired,
        decisionCards: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        decisionCardsParameter: PropTypes.arrayOf(descriptionNameRowShape.isRequired).isRequired
    }).isRequired
};

/*Settings.propTypes = {
    settingsInfo: PropTypes.object.isRequired
};*/

export default withRouter(Settings)