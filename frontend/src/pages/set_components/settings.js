import React from 'react'

import CheckboxList from "./checkbox_list"
import Checkbox from "./checkbox"

import {SelectableGroup, DeselectAll, SelectAll, TSelectableItemProps, createSelectable} from 'react-selectable-fast'
//import Select from "react-dropdown-select";
import Select from 'react-select';
import Grid from "@material-ui/core/Grid";
//import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";

//import {Buffer, input} from "./input";
import {withRouter} from "react-router";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';

import axios from 'axios';
require('dotenv').config();

const ListItem = require("react-list-select");

//const components = input.components;
//const  decisionCards = input.decisionCards;

const { DropDownEditor } = Editors;

class Settings extends React.Component {

    constructor(props) {
        super(props);
        //localStorage.clear()

        if (localStorage.getItem('SelectedLayout')){}
        else {localStorage.setItem('SelectedLayout', JSON.stringify({lg: []}));}

        if (localStorage.getItem('toolbox')){}
        else {localStorage.setItem('toolbox', JSON.stringify({lg: []}));}


        let visComponents;
        let decision_cards;
        let checkedComponents;
        let checkedDc;
        let componentsDataGridRows;
        let dcDataGridRows;
        let issueTypesDataGridComponents;
        let issueTypesDataGridDc: [];
        let selectedItemUpper;
        let selectedItemLower;
        let issueTypeEditorDataGridComponents;
        let issueTypeEditorDataGridDc;
        let componentsDataGridColumns;
        let dcDataGridColumns;
        let descriptionComponents;
        let descriptionDc;

        //let settingsInfo = JSON.parse(this.props.settingsInfo);

        if (localStorage.getItem("visualComponents")) {visComponents =  JSON.parse(localStorage.getItem("visualComponents"));}
        else {
            visComponents = this.props.settingsInfo.components.reduce(
                (options, option) => ({
                    ...options,
                    [option]: false
                }),
                {}
            )
        }

        if (localStorage.getItem("decisionCards")) {decision_cards = JSON.parse(localStorage.getItem("decisionCards"));}
        else {
            decision_cards = this.props.settingsInfo.decisionCards.reduce(
                (options, option) => ({
                    ...options,
                    [option]: false
                }),
                {}
                )
            }

        if (localStorage.getItem("checkedComponents")) {checkedComponents = JSON.parse(localStorage.getItem("checkedComponents"))}
        else {checkedComponents = []}

        if (localStorage.getItem("checkedDecisionCards")) {checkedDc = JSON.parse(localStorage.getItem("checkedDecisionCards"))}
        else {checkedDc = []}

        if (localStorage.getItem("componentsDataGridRows")) {componentsDataGridRows = JSON.parse(localStorage.getItem("componentsDataGridRows"))}
        else {componentsDataGridRows = []}

        if (localStorage.getItem("dcDataGridRows")) {dcDataGridRows = JSON.parse(localStorage.getItem("dcDataGridRows"))}
        else {dcDataGridRows = []}
        //if (localStorage.getItem("issueTypesDataGridComponents")) {this.setState({issueTypesDataGridComponents: JSON.parse(localStorage.getItem("issueTypesDataGridComponents"))});}
        // if (localStorage.getItem("issueTypesDataGridDC")) {this.setState({issueTypesDataGridDc: JSON.parse(localStorage.getItem("issueTypesDataGridDC"))});}

        if (localStorage.getItem("selectedComponents")) {selectedItemUpper = JSON.parse(localStorage.getItem("selectedComponents"))}
        else {selectedItemUpper = []}

        if (localStorage.getItem("selectedDc")) {selectedItemLower = JSON.parse(localStorage.getItem("selectedDc"))}
        else {selectedItemLower = []}

        //if (localStorage.getItem("issueTypeEditorDataGridComponents")) {this.setState({issueTypeEditorDataGridComponents: JSON.parse(localStorage.getItem("issueTypeEditorDataGridComponents"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridDc")) {this.setState({issueTypeEditorDataGridDc: JSON.parse(localStorage.getItem("issueTypeEditorDataGridDc"))});}

        if (localStorage.getItem("componentsDataGridColumns")) {componentsDataGridColumns = JSON.parse(localStorage.getItem("componentsDataGridColumns"))}
        else {componentsDataGridColumns = []}

        if (localStorage.getItem("dcDataGridColumns")) {dcDataGridColumns = JSON.parse(localStorage.getItem("dcDataGridColumns"))}
        else {dcDataGridColumns = []}

        if (localStorage.getItem("descriptionComponents")) {descriptionComponents = JSON.parse(localStorage.getItem("descriptionComponents"))}
        else {descriptionComponents = ""}

        if (localStorage.getItem("descriptionDc")) {descriptionDc = JSON.parse(localStorage.getItem("descriptionDc"))}
        else {descriptionDc = ""}

        let checkboxComponents = {};
        let checkboxDecisionCards = {};

        this.props.settingsInfo.components.map((v, i) => {
            checkboxComponents[v] = false
        });

        this.props.settingsInfo.decisionCards.map((v, i) => {
            checkboxDecisionCards[v] = false
        });


        this.state = {
            info: {},
            comp: {},
            dc: {},

            vis_components: visComponents,
            decision_cards: decision_cards,
            checkedComponents: checkedComponents,
            checkedDc: checkedDc,
            componentsDataGridRows: componentsDataGridRows,
            dcDataGridRows:dcDataGridRows,
            issueTypesDataGridComponents: [],
            issueTypesDataGridDc: [],
            selectedItemUpper: selectedItemUpper,
            selectedItemLower: selectedItemLower,
            issueTypeEditorDataGridComponents: null,
            issueTypeEditorDataGridDc: null,
            componentsDataGridColumns: componentsDataGridColumns,
            dcDataGridColumns:dcDataGridColumns,
            descriptionComponents: descriptionComponents,
            descriptionDc: descriptionDc,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.createCheckboxComponents = this.createCheckboxComponents.bind(this);
        this.createCheckboxDc = this.createCheckboxDc.bind(this);
        this.handleCheckboxChangeComponents = this.handleCheckboxChangeComponents.bind(this);
        this.handleCheckboxChangeDc = this.handleCheckboxChangeDc.bind(this);


    }

    componentDidMount() {

        if (localStorage.getItem("visualComponents")) {
            let visComps = JSON.parse(localStorage.getItem("visualComponents"));
            this.setState({vis_components: visComps});
        }
        if (localStorage.getItem("decisionCards")) {this.setState({decision_cards: JSON.parse(localStorage.getItem("decisionCards"))});}
        if (localStorage.getItem("checkedComponents")) {this.setState({checkedComponents: JSON.parse(localStorage.getItem("checkedComponents"))});}
        if (localStorage.getItem("checkedDecisionCards")) {this.setState({checkedDc: JSON.parse(localStorage.getItem("checkedDecisionCards"))});}
        if (localStorage.getItem("componentsDataGridRows")) {this.setState({componentsDataGridRows: JSON.parse(localStorage.getItem("componentsDataGridRows"))});}
        if (localStorage.getItem("dcDataGridRows")) {this.setState({dcDataGridRows: JSON.parse(localStorage.getItem("dcDataGridRows"))});}
        //if (localStorage.getItem("issueTypesDataGridComponents")) {this.setState({issueTypesDataGridComponents: JSON.parse(localStorage.getItem("issueTypesDataGridComponents"))});}
        // if (localStorage.getItem("issueTypesDataGridDC")) {this.setState({issueTypesDataGridDc: JSON.parse(localStorage.getItem("issueTypesDataGridDC"))});}
        if (localStorage.getItem("selectedComponents")) {this.setState({selectedItemUpper: JSON.parse(localStorage.getItem("selectedComponents"))});}
        if (localStorage.getItem("selectedDc")) {this.setState({selectedItemLower: JSON.parse(localStorage.getItem("selectedDc"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridComponents")) {this.setState({issueTypeEditorDataGridComponents: JSON.parse(localStorage.getItem("issueTypeEditorDataGridComponents"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridDc")) {this.setState({issueTypeEditorDataGridDc: JSON.parse(localStorage.getItem("issueTypeEditorDataGridDc"))});}
        if (localStorage.getItem("componentsDataGridColumns")) {this.setState({componentsDataGridColumns: JSON.parse(localStorage.getItem("componentsDataGridColumns"))});}
        if (localStorage.getItem("dcDataGridColumns")) {this.setState({dcDataGridColumns: JSON.parse(localStorage.getItem("dcDataGridColumns"))});}
        if (localStorage.getItem("descriptionComponents")) {this.setState({descriptionComponents: JSON.parse(localStorage.getItem("descriptionComponents"))});}
        if (localStorage.getItem("descriptionDc")) {this.setState({descriptionDc: JSON.parse(localStorage.getItem("descriptionDc"))});}
    }



    /**
     * update data grid rows when selection is made. Store new value in local storage and state.
     *
     * @param fromRow
     * @param toRow
     * @param updated
     */
    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let gridRows = this.getGridRows(fromRow, toRow, updated);
        this.setState({componentsDataGridRows: gridRows});
        localStorage.setItem("componentsDataGridRows", JSON.stringify(gridRows));

    };

    /**
     * get data grid rows
     *
     * @param fromRow
     * @param toRow
     * @param updated
     * @returns {T[]}
     */
    getGridRows(fromRow, toRow, updated) {
        const rows = this.state.componentsDataGridRows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        return rows
    }

    /**
     * Find the dictionary in the given list, which contains the given name as value for the key "name"
     *
     * @param name {String}  name representing the searched key of the "name" value in the dictionary list
     * @param list  list in the form [ {name: "", ...}, {name: "", ...}, ...]
     * @returns {null|*}    dictionary that contains entry name with given key
     */
    findSelected(name, list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if(list[i].name === name) {
                return list[i];
            }
        }
        return null;
    }

    /**
     * Action happening after item is selected in the upper selection bar.
     * All states and local storage entries are updated according to selection.
     *
     * @param selectedItemUpper selected item in the selection. In the form {label:"name", value: -1}
     */
    getSelectedComponentsInput = selectedItemUpper => {
        this.setState({selectedItemUpper: selectedItemUpper});
        let selectedComponent = this.findSelected(selectedItemUpper.label, this.props.settingsInfo.componentsParameters);
        this.setState({componentsDataGridRows: selectedComponent.rows});
        this.setState({issueTypesDataGridComponents: selectedComponent.issueTypes});
        this.setState({descriptionComponents: selectedComponent.description});
        // this.setState({issueTypeEditorDataGridComponents: <DropDownEditor options={this.state.issueTypesDataGridComponents}/>});
        // let dropdown = <DropDownEditor options={selectedComponent.rows.issueTypes}/>
        this.setState({
            componentsDataGridColumns: [
                {key: "parameter", name: "Parameter"},
                {key: "type", name: "Type"},
                {key: "value", name: "Value", editable: true}]
        });

        //Fixme: do not use this.state.whatever in the updateLocalStorage
        // better define onle the values you need in the separate function with the original values!

        localStorage.setItem("componentsDataGridRows", JSON.stringify(selectedComponent.rows));
        localStorage.setItem("issueTypesDataGridComponents", JSON.stringify(selectedComponent.issueTypes));
        localStorage.setItem("selectedComponents", JSON.stringify(selectedItemUpper));
        localStorage.setItem("componentsDataGridColumns", JSON.stringify([
            {key: "parameter", name: "Parameter"},
            {key: "type", name: "Type"},
            {key: "value", name: "Value", editable: true}]));
        localStorage.setItem("descriptionComponents", JSON.stringify(selectedComponent.description));
    };

    /**
     * Action happening after item is selected in the lower selection bar.
     * All states and local storage entries are updated according to selection.
     *
     * @param selectedItemLower selected item in the selection. In the form {label:"name", value: -1}
     */
    getSelectedDcInput = selectedItemLower => {
        this.setState({selectedItemLower: selectedItemLower});
        let selectedDc = this.findSelected(selectedItemLower.label, this.props.settingsInfo.decisionCardsParameters);
        this.setState({dcDataGridRows: selectedDc.rows});
        this.setState({issueTypesDataGridDc: selectedDc.issueTypes});
        this.setState({descriptionDc: selectedDc.description});
        //this.setState({issueTypeEditorDataGridDc: <DropDownEditor options={this.state.issueTypesDataGridDc}/>});
        // let dropdown = <DropDownEditor options={selectedDc.issueTypes}/>

        this.setState({
            dcDataGridColumns: [
                {key: "parameter", name: "Parameter"},
                {key: "type", name: "Type"},
                {key: "value", name: "Value", editable: true}]
        });


        localStorage.setItem("issueTypesDataGridDC", JSON.stringify(selectedDc.issueTypes));
        localStorage.setItem("selectedDc", JSON.stringify(selectedItemLower));
        localStorage.setItem("dcDataGridColumns", JSON.stringify([
            {key: "parameter", name: "Parameter"},
            {key: "type", name: "Type"},
            {key: "value", name: "Value", editable: true}]));
        localStorage.setItem("dcDataGridRows", JSON.stringify(selectedDc.rows));
        localStorage.setItem("descriptionDc", JSON.stringify(selectedDc.description));
    };

    onDataGridCellExpand = subRowOptions => {
        let test = subRowOptions;
    };

    /**
     * Check if a given component (identified with an id) is in one of the dictionaries contained in the given list.
     *
     * @param compId {int} id of the component in the list
     * @param list {array} list of the format [{..., i: compId, ...}, {...}]
     * @return {boolean} true if component is in one of the dictionaries in list, false otherwise
     */
    isComponentInList(compId, list) {
        let j;
        for (j = 0; j < list.length; j++) {
            if(list[j].i === compId.toString()) {
                return true;
            }
        }
        return false;
    }

    /**
     * remove a given component dictionary (identified with an id) in the given list.
     *
     * @param compId {int} id of the component in the list
     * @param list {array} list of the format [{..., i: compId, ...}, {...}]
     */
    removeComponentInList(compId, list) {
        let j;
        for (j = 0; j < list.length; j++) {
            if(list[j].i === compId.toString()) {
                list[j] = {};
            }
        }
    }


    /**
     * Triggers when components checkbox is checked or unchecked.
     * Update local storage and state according to the selection, so that other page elements like the selection bar
     * can get updated. Depending on checked or unchecked state, add/remove component from layouts or toolbox list
     * so that the arrange component page can get updated as well.
     *
     * @param changeEvent
     */
    handleCheckboxChangeComponents = changeEvent => {
        const { name } = changeEvent.target;

        let dict = {};
        Object.keys(this.state.vis_components).map((v, i) => {
            if (v === name) {
                let checked = this.state.vis_components[v] === false;
                dict[name] = (checked);

                let layout = JSON.parse(localStorage.getItem("SelectedLayout")).lg;
                let toolbox = JSON.parse(localStorage.getItem("toolbox")).lg;

                if (checked && layout) {
                    //fill empty slots in layout array
                    let j;
                    for (j = 0; j < i; j++) {
                        if (!layout[j]) {
                            layout[j] = {};
                        }
                    }
                    layout[i] = {
                        x: i + i,
                        y: 0,
                        w: 2,
                        h: 6,
                        i: i.toString(),
                        static: false
                    };
                    localStorage.setItem("SelectedLayout", JSON.stringify({lg: layout}));
                }
                else {
                    let usedList;
                    let usedLocalStorageString;
                    if (this.isComponentInList(i, layout)) {
                        usedList = layout;
                        usedLocalStorageString = "SelectedLayout";
                    }
                    else if (this.isComponentInList(i, toolbox)) {
                        usedList = toolbox;
                        usedLocalStorageString = "toolbox";
                    }

                    if (usedList) {
                        this.removeComponentInList(i, usedList);
                        localStorage.setItem(usedLocalStorageString, JSON.stringify({lg: usedList}));
                    }
                    else {
                        console.log("element not found")
                    }
                }
            }
            else {
                dict[v] = this.state.vis_components[v]
            }
        });

        this.setState({vis_components: dict});

        let checkedItems = Object.keys(dict).filter(k => dict[k]);
        localStorage.setItem("visualComponents", JSON.stringify(dict));
        this.setState({checkedComponents: checkedItems});
        localStorage.setItem("checkedComponents", JSON.stringify(checkedItems));

        if (checkedItems.length === 0 || checkedItems.indexOf(this.state.selectedItemUpper.label) < 0) {
            this.setState({selectedItemUpper: []});
            this.setState({componentsDataGridRows: []});
            this.setState({issueTypesDataGridComponents: []});
            this.setState({descriptionComponents: ""});
            //this.setState({issueTypeEditorDataGridComponents: null});
            this.setState({componentsDataGridColumns: []});

            localStorage.setItem("componentsDataGridRows", JSON.stringify([]));
            localStorage.setItem("issueTypesDataGridComponents", JSON.stringify([]));
            localStorage.setItem("selectedComponents", JSON.stringify([]));
            localStorage.setItem("componentsDataGridColumns", JSON.stringify([]));
            localStorage.setItem("descriptionComponents", JSON.stringify(""));

            if(checkedItems.length === 0) {localStorage.setItem("SelectedLayout", JSON.stringify({lg: []}))}
        }

    };

    /**
     * Triggers when decision cards checkbox is checked or unchecked.
     * Update local storage and state according to the selection, so that other page elements like the selection bar
     * can get updated.
     *
     * @param changeEvent
     */
    handleCheckboxChangeDc = changeEvent => {
        const { name } = changeEvent.target;

        let dict = {};
        Object.keys(this.state.decision_cards).map((v) => {
            if (v === name) {
                dict[name] = (this.state.decision_cards[v] === false)
            }
            else {
                dict[v] = this.state.decision_cards[v]
            }
        });

        this.setState({decision_cards: dict});

        let checkedItems = Object.keys(dict).filter(k => dict[k]);
        localStorage.setItem("decisionCards", JSON.stringify(dict));

        this.setState({checkedDc: checkedItems});
        localStorage.setItem("checkedDecisionCards", JSON.stringify(checkedItems));

        if (checkedItems.length === 0 || checkedItems.indexOf(this.state.selectedItemLower.label) < 0) {
            //FIXME: add local storage
            this.setState({selectedItemLower: []});
            this.setState({dcDataGridRows: []});
            this.setState({issueTypesDataGridDc: []});
            this.setState({descriptionDc: ""});
            //this.setState({issueTypeEditorDataGridDc: null});
            this.setState({dcDataGridColumns: []});

            localStorage.setItem("issueTypesDataGridDC", JSON.stringify([]));
            localStorage.setItem("selectedDc", JSON.stringify([]));
            localStorage.setItem("dcDataGridColumns", JSON.stringify([]));
            localStorage.setItem("dcDataGridRows", JSON.stringify([]));
            localStorage.setItem("descriptionDc", JSON.stringify(""));
        }

    };

    /**
     * create single checkbox component for the given option in the visual component section.
     *
     * @param option checkbox label
     */
    createCheckboxComponents = option => {
            return (
            <Checkbox
                label={option}
                isSelected={this.state.vis_components[option]}
                onCheckboxChange={this.handleCheckboxChangeComponents}
                key={option}
            />
            );
    };

    /**
     * create single checkbox component for the given option in the decision cards section.
     *
     * @param option checkbox label
     */
    createCheckboxDc = option => {
            return (
                <Checkbox
                    label={option}
                    isSelected={this.state.decision_cards[option]}
                    onCheckboxChange={this.handleCheckboxChangeDc}
                    key={option}
                />
            );
    };

    render() {

        const stylesCheckbox = {
            overflow:"scroll",
        };
        const stylesSelected = {
            overflow:"scroll",
        };

        const stylesGridUpper = {
            background:"lightgray",
            borderRadius: "10px",
            marginTop:"5px",
            marginBottom: "10px"
        };

        const stylesGridLower = {
            background: "lightblue",
            marginTop: "10px",
            marginBottom:"5px",
            borderRadius: "10px",

        };

        let checkedComponents = Object.keys(this.state.vis_components).filter(k => this.state.vis_components[k]);
        let checkedDc = Object.keys(this.state.decision_cards).filter(k => this.state.decision_cards[k]);

        let i;
        let selectedFormattedComponentsList = [];
        for (i = 0; i < checkedComponents.length; i++) {
            selectedFormattedComponentsList.push({label: checkedComponents[i], value: i-1})
        }
        let j;
        let selectedFormattedDcList = [];
        for (i = 0; i < checkedDc.length; i++) {
            selectedFormattedDcList.push({label: checkedDc[i], value: i-1})
        }

        return (
            <div className="container">
                <div className="row">
                    <form className="form">
                        <Grid container spacing={3}  style={stylesGridUpper}>
                            <Grid item xs={12}>
                                <h3> Components Settings </h3>
                            </Grid>
                            <Grid item xs={2}>
                                {/*<h4>Visual Components</h4>
                                <div style={stylesCheckbox}>
                                    <div>
                                    {Object.keys(checkboxComponent).map((value, i) => (
                                        <div className="checkbox" key={i}>
                                            <Checkbox
                                                onChange={(value) => this.onCheckboxChange('vis_components', value)}
                                                value={value}
                                            />
                                        </div>))}
                                    </div>
                                </div>*/}
                                <div style={stylesCheckbox}>
                                    <h4>Visual Components</h4>
                                    {/*<CheckboxList
                                        onChange={(values) => this.onCheckboxChange('vis_components', values)}
                                        values={components}
                                        input={"comp"}
                                    />*/}
                                    {this.props.settingsInfo.components.map(this.createCheckboxComponents)}
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div>
                                    <h4>Selected</h4>
                                    <div>
                                        <Select value={this.state.selectedItemUpper} options={selectedFormattedComponentsList} maxMenuHeight={180} onChange = {this.getSelectedComponentsInput}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid xs={2}>
                                <div>
                                    <h4>Description</h4>
                                    <div> {this.state.descriptionComponents} </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div>
                                    <ReactDataGrid
                                        columns={this.state.componentsDataGridColumns}
                                        rowGetter={i => this.state.componentsDataGridRows[i]}
                                        rowsCount={this.state.componentsDataGridRows.length}
                                        onGridRowsUpdated={this.onGridRowsUpdated}
                                        enableCellSelect={true}
                                    />
                                    {/*onCellExpand={this.onDataGridCellExpand}*/}
                                    {/*<PageGuide />*/}
                                </div>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} style={stylesGridLower} >
                            <Grid item xs={12}>
                                <h3> Decision Cards Settings </h3>
                            </Grid>
                            <Grid item xs={2}>
                                <div style={stylesCheckbox}>
                                    <h4>Decision Cards</h4>
                                    {/*<CheckboxList
                                        onChange={(values) => this.onCheckboxChange('decision_cards', values)}
                                        values={decisionCards}
                                        input={"dc"}
                                    />*/}
                                    {this.props.settingsInfo.decisionCards.map(this.createCheckboxDc)}
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <div>
                                    <h4>Selected</h4>
                                    <div>
                                        <Select value={this.state.selectedItemLower} options={ selectedFormattedDcList } maxMenuHeight={180} onChange = {this.getSelectedDcInput}/>
                                    </div>
                                </div>
                            </Grid>
                            <Grid xs={2}>
                                <div>
                                    <h4>Description</h4>
                                    <div> {this.state.descriptionDc} </div>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div>
                                    <ReactDataGrid
                                        columns={this.state.dcDataGridColumns}
                                        rowGetter={i => this.state.dcDataGridRows[i]}
                                        rowsCount={this.state.dcDataGridRows.length}
                                        onGridRowsUpdated={this.onGridRowsUpdated}
                                        enableCellSelect={true}
                                    />
                                    {/*<PageGuide />*/}
                                </div>
                            </Grid>
                        </Grid>




                        {/*<div className="list-group col-xs-6">
                            <h4>Can Read</h4>
                            <CheckboxList
                                onChange={(values) => this.onChange('read', values)}
                                values={languages}
                            />
                        </div>

                        <div className="list-group col-xs-6">
                            <h4>Can Write</h4>
                            <CheckboxList
                                onChange={(values) => this.onChange('write', values)}
                                values={languages}
                            />
                        </div>

                        <div className="list-group col-xs-6">
                            <h4>Can Understand</h4>
                            <CheckboxList
                                onChange={(values) => this.onChange('understand', values)}
                                values={languages}
                            />
                        </div>*/}

                        {/*<button
                            className="btn btn-primary"
                            onClick={(e) => {
                                console.log(this.state);
                                e.preventDefault();
                            }}
                        >
                            Save
                        </button>*/}
                    </form>
                </div>
            </div>
        );
    }
}

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