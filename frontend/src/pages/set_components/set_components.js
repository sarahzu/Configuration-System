import React from 'react'

import CheckboxList from "./checkbox_list"
import axios from "axios";
import List from 'react-list-select'
import {SelectableGroup, DeselectAll, SelectAll, TSelectableItemProps, createSelectable} from 'react-selectable-fast'
//import Select from "react-dropdown-select";
import Select from 'react-select';
import Grid from "@material-ui/core/Grid";
//import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";

import {Buffer, input} from "./input";


const ListItem = require("react-list-select");
const components = input.components;
const decisionCards = input.decisionCards;

const { DropDownEditor } = Editors;


class SetComponents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vis_components: [],
            decision_cards: [],
            checkedComponents: [],
            checkedDc: [],
            componentsDataGridRows: [],
            dcDataGridRows:[],
            issueTypesDataGridComponents: [],
            issueTypesDataGridDc: [],
            selectedItemUpper: [],
            selectedItemLower: [],
            issueTypeEditorDataGridComponents: null,
            issueTypeEditorDataGridDc: null,
            componentsDataGridColumns: [],
            dcDataGridColumns:[],
            descriptionComponents:"",
            descriptionDc: "",
        };

        this.updateLocalStorage = this.updateLocalStorage.bind(this);

    }

    /*componentWillMount() {
        localStorage.clear()
        if (localStorage.getItem("visualComponents")) {this.setState({vis_components: localStorage.getItem("visualComponents")});}
        if (localStorage.getItem("decisionCards")) {this.setState({vis_components: localStorage.getItem("decisionCards")});}
        if (localStorage.getItem("checkedComponents")) {this.setState({vis_components: localStorage.getItem("checkedComponents")});}
        if (localStorage.getItem("checkedDecisionCards")) {this.setState({vis_components: localStorage.getItem("checkedDecisionCards")});}
        if (localStorage.getItem("componentsDataGridRows")) {this.setState({vis_components: localStorage.getItem("componentsDataGridRows")});}
        if (localStorage.getItem("dcDataGridRows")) {this.setState({vis_components: localStorage.getItem("dcDataGridRows")});}
        if (localStorage.getItem("issueTypesDataGridComponents")) {this.setState({vis_components: localStorage.getItem("issueTypesDataGridComponents")});}
        if (localStorage.getItem("issueTypesDataGridDC")) {this.setState({vis_components: localStorage.getItem("issueTypesDataGridDC")});}
        if (localStorage.getItem("selectedComponents")) {this.setState({vis_components: localStorage.getItem("selectedComponents")});}
        if (localStorage.getItem("selectedDc")) {this.setState({vis_components: localStorage.getItem("selectedDc")});}
        if (localStorage.getItem("issueTypeEditorDataGridComponents")) {this.setState({vis_components: localStorage.getItem("issueTypeEditorDataGridComponents")});}
        if (localStorage.getItem("issueTypeEditorDataGridDc")) {this.setState({vis_components: localStorage.getItem("issueTypeEditorDataGridDc")});}
        if (localStorage.getItem("componentsDataGridColumns")) {this.setState({vis_components: localStorage.getItem("componentsDataGridColumns")});}
        if (localStorage.getItem("dcDataGridColumns")) {this.setState({vis_components: localStorage.getItem("dcDataGridColumns")});}
        if (localStorage.getItem("descriptionComponents")) {this.setState({vis_components: localStorage.getItem("descriptionComponents")});}
        if (localStorage.getItem("descriptionDc")) {this.setState({vis_components: localStorage.getItem("descriptionDc")});}
    }*/

    updateLocalStorage() {
        /*localStorage.setItem("visualComponents", this.state.vis_components);
        localStorage.setItem("decisionCards", this.state.decisionCards);
        localStorage.setItem("checkedComponents", this.state.checkedComponents);
        localStorage.setItem("checkedDecisionCards", this.state.checkedDc);
        localStorage.setItem("componentsDataGridRows", this.state.componentsDataGridRows);
        localStorage.setItem("issueTypesDataGridComponents", this.state.issueTypesDataGridComponents);
        localStorage.setItem("issueTypesDataGridDC", this.state.issueTypesDataGridDc);
        localStorage.setItem("selectedComponents", this.state.selectedItemUpper);
        localStorage.setItem("selectedDc", this.state.selectedItemLower);
        localStorage.setItem("issueTypeEditorDataGridComponents", this.state.issueTypeEditorDataGridComponents);
        localStorage.setItem("issueTypeEditorDataGridDc", this.state.issueTypeEditorDataGridDc);
        localStorage.setItem("componentsDataGridColumns", this.state.componentsDataGridColumns);
        localStorage.setItem("dcDataGridColumns", this.state.dcDataGridColumns);
        localStorage.setItem("dcDataGridRows", this.state.dcDataGridRows);
        localStorage.setItem("descriptionComponents", this.state.descriptionComponents);
        localStorage.setItem("descriptionDc", this.state.descriptionDc);*/
    }

    onCheckboxChange(name, values) {
        this.setState({[name]: values});

        // Check if a item was deselected which is selected by another component
        // if so, deselect it on the other components as well
        let checkedItems = Object.keys(values).filter(k => values[k]);
        if (name === 'vis_components') {
            this.setState({checkedComponents: checkedItems});
            if (checkedItems.length === 0 || checkedItems.indexOf(this.state.selectedItemUpper.label) < 0) {
                this.setState({selectedItemUpper: []});
                this.setState({componentsDataGridRows: []});
                this.setState({issueTypesDataGridComponents: []});
                this.setState({descriptionComponents: ""});
                this.setState({issueTypeEditorDataGridComponents: null});
                this.setState({componentsDataGridColumns: []});
            }
        }
        else if (name === 'decision_cards') {
            this.setState({checkedDc: checkedItems});
            if (checkedItems.length === 0 || checkedItems.indexOf(this.state.selectedItemLower.label) < 0) {
                this.setState({selectedItemLower: []});
                this.setState({dcDataGridRows: []});
                this.setState({issueTypesDataGridDc: []});
                this.setState({descriptionDc: ""});
                this.setState({issueTypeEditorDataGridDc: null});
                this.setState({dcDataGridColumns: []});
            }
        }
        this.updateLocalStorage();
    }

    getComponentNames() {
        axios.get(process.env.REACT_APP_COMPONENT_NAMES)
            .then(response => {
                // returning the data here allows the caller to get it through another .then(...)
                return response.data
            });
    }

    // setValues = selectValues => this.setState({ selectValues });

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState({componentsDataGridRows: this.getGridRows(fromRow, toRow, updated)});
        this.updateLocalStorage();
    };

    getGridRows(fromRow, toRow, updated) {
        const rows = this.state.componentsDataGridRows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        return rows
    }

    /**
     * Find the dictionary in the given list, which contains for the name value the given  key
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
     * Action happening after item is selected in the upper selection bar. All states are updated according to selection.
     *
     * @param selectedItemUpper selected item in the selection. In the form {label:"name", value: -1}
     */
    getSelectedComponentsInput = selectedItemUpper => {
        this.setState({selectedItemUpper: selectedItemUpper});
        let selectedComponent = this.findSelected(selectedItemUpper.label, input.componentsParameters);
        this.setState({componentsDataGridRows: selectedComponent.rows});
        this.setState({issueTypesDataGridComponents: selectedComponent.issueTypes});
        this.setState({descriptionComponents: selectedComponent.description});
        // this.setState({issueTypeEditorDataGridComponents: <DropDownEditor options={this.state.issueTypesDataGridComponents}/>});
        // let dropdown = <DropDownEditor options={selectedComponent.rows.issueTypes}/>
        this.setState({
            componentsDataGridColumns: [
                {key: "parameter", name: "Parameter"},
                {key: "value", name: "Value", editor: null}]
        });
        this.updateLocalStorage();
    };

    /**
     * Action happening after item is selected in the lower selection bar. All states are updated according to selection.
     *
     * @param selectedItemLower selected item in the selection. In the form {label:"name", value: -1}
     */
    getSelectedDcInput = selectedItemLower => {
        this.setState({selectedItemLower: selectedItemLower});
        let selectedDc = this.findSelected(selectedItemLower.label, input.decisionCardsParameters);
        this.setState({dcDataGridRows: selectedDc.rows});
        this.setState({issueTypesDataGridDc: selectedDc.issueTypes});
        this.setState({descriptionDc: selectedDc.description});
        //this.setState({issueTypeEditorDataGridDc: <DropDownEditor options={this.state.issueTypesDataGridDc}/>});
        // let dropdown = <DropDownEditor options={selectedDc.issueTypes}/>

        this.setState({
            dcDataGridColumns: [
                {key: "parameter", name: "Parameter"},
                {key: "value", name: "Value", editor: null}]
        });
        this.updateLocalStorage();
    };

    onDataGridCellExpand = subRowOptions => {
        let test = subRowOptions;
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
                        <h1> Set Components</h1>

                            <Grid container spacing={3}  style={stylesGridUpper}>
                                <Grid item xs={12}>
                                    <h3> Components Settings </h3>
                                </Grid>
                                <Grid item xs={2}>
                                    <div style={stylesCheckbox}>
                                        <h4>Visual Components</h4>
                                        <CheckboxList
                                            onChange={(values) => this.onCheckboxChange('vis_components', values)}
                                            values={components}
                                        />
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
                                        <CheckboxList
                                            onChange={(values) => this.onCheckboxChange('decision_cards', values)}
                                            values={decisionCards}
                                        />
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

export default SetComponents