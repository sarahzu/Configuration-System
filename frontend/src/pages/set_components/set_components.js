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
            selected: "",
            selectValues:[],
            componentsRows: [],
            dcRows:[],
            issueTypesComponents: [],
            issueTypesDc: [],
            selectedItemUpper: [],
            selectedItemLower: [],
            issueTypeEditorComponents: null,
            issueTypeEditorDc: null,
            componentsColumns: [],
            dcColumns:[]
        }

    }

    onChange(name, values) {
        this.setState({ [name]: values })
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
        this.setState({componentsRows: this.getGridRows(fromRow, toRow, updated)});
    };

    getGridRows(fromRow, toRow, updated) {
        const rows = this.state.componentsRows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        return rows
    }

    findSelected(name, list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if(list[i].name === name) {
                return list[i];
            }
        }
        return null;
    }

    getSelectedComponentsInput = selectedItemUpper => {
        this.setState({selectedItemUpper: selectedItemUpper});
        let selectedComponent = this.findSelected(selectedItemUpper.label, input.componentsParameters);
        this.setState({componentsRows: selectedComponent.rows});
        this.setState({issueTypesComponents: selectedComponent.issueTypes});

        this.setState({issueTypeEditorComponents: <DropDownEditor options={this.state.issueTypesComponents} />});
        this.setState({componentsColumns: [
                { key: "parameter", name: "Parameter" },
                { key: "value", name: "Value", editor: this.state.issueTypeEditorComponents}
                ]});
    };

    getSelectedDcInput = selectedItemLower => {
        this.setState({selectedItemLower: selectedItemLower});
        let selectedDc = this.findSelected(selectedItemLower.label, input.decisionCardsParameters);
        this.setState({dcRows: selectedDc.rows});
        this.setState({issueTypesDc: selectedDc.issueTypes});

        this.setState({issueTypeEditorDc: <DropDownEditor options={this.state.issueTypesDc} />});
        this.setState({dcColumns: [
                { key: "parameter", name: "Parameter" },
                { key: "value", name: "Value", editor: this.state.issueTypeEditorDc}
            ]});
    };

    render() {
        {/********* need to be extracted from backend ***************/}

        //let components = this.getComponentNames();

        let selectedComponents = Object.keys(this.state.vis_components).filter(k => this.state.vis_components[k]);
        let selectedDc = Object.keys(this.state.decision_cards).filter(k => this.state.decision_cards[k]);




        {/* *********************************************** */}

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

        let i;
        let selectedFormattedComponentsList = [];
        for (i = 0; i < selectedComponents.length; i++) {
            selectedFormattedComponentsList.push({label: selectedComponents[i], value: i-1})
        }
        let j;
        let selectedFormattedDcList = [];
        for (i = 0; i < selectedDc.length; i++) {
            selectedFormattedDcList.push({label: selectedDc[i], value: i-1})
        }

        return (
            <div className="container">
                <div className="row">
                    <form className="form">
                        <h1> Set Components</h1>

                            <Grid container spacing={3}  style={stylesGridUpper}>
                                <Grid item xs={2}>
                                    <div style={stylesCheckbox}>
                                        <h4>Visual Components</h4>
                                        <CheckboxList
                                            onChange={(values) => this.onChange('vis_components', values)}
                                            values={components}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <div>
                                        <h4>Selected</h4>
                                        <div>
                                            <Select options={ selectedFormattedComponentsList } maxMenuHeight={180} onChange = {this.getSelectedComponentsInput}/>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid xs={2}>
                                    <div>
                                        <h4>Description</h4>
                                        <div> blablabla </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>
                                        <ReactDataGrid
                                            columns={this.state.componentsColumns}
                                            rowGetter={i => this.state.componentsRows[i]}
                                            rowsCount={this.state.componentsRows.length}
                                            onGridRowsUpdated={this.onGridRowsUpdated}
                                            enableCellSelect={true}
                                        />
                                        {/*<PageGuide />*/}
                                    </div>
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} style={stylesGridLower} >
                                <Grid item xs={2}>
                                    <div style={stylesCheckbox}>
                                        <h4>Decision Cards</h4>
                                        <CheckboxList
                                            onChange={(values) => this.onChange('decision_cards', values)}
                                            values={decisionCards}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <div>
                                        <h4>Selected</h4>
                                        <div>
                                            <Select options={ selectedFormattedDcList } maxMenuHeight={180} onChange = {this.getSelectedDcInput}/>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid xs={2}>
                                    <div>
                                        <h4>Description</h4>
                                        <div> blablabla </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>
                                        <ReactDataGrid
                                            columns={this.state.dcColumns}
                                            rowGetter={i => this.state.dcRows[i]}
                                            rowsCount={this.state.dcRows.length}
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