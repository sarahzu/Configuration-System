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


const ListItem = require("react-list-select");


const components = ["Component 1", "Component 2", "Component 3", "Component 4", "Component 5", "Component 6"];
const decisionCards = ["Decision Card 1", "Decision Card 2", "Decision Card 3", "Decision Card 4",
    "Decision Card 5", "Decision Card 6"];

const { DropDownEditor } = Editors;
const issueTypes = [
    { id: "value1", value: "Value 1" },
    { id: "value2", value: "Value 2" },
    { id: "value3", value: "Value 3" }
];
const IssueTypeEditor = <DropDownEditor options={issueTypes} />;

const componentsColumns = [
    { key: "parameter", name: "Parameter" },
    { key: "value", name: "Value", editor: IssueTypeEditor },
];
const componentsRows = [
    { parameter: "Parameter 1", value: "Value 1"},
    { parameter: "Parameter 2", value: "Value 2"},
    { parameter: "Parameter 3", value: "Value 3"}
];

class SetComponents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vis_components: [],
            decision_cards: [],
            selected: "",
            selectValues:[],
            componentsRows: componentsRows
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
                                <Grid item xs={2} spacing={3}>
                                    <div style={stylesCheckbox}>
                                        <h4>Visual Components</h4>
                                        <CheckboxList
                                            onChange={(values) => this.onChange('vis_components', values)}
                                            values={components}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={2} spacing={3}>
                                    <div>
                                        <h4>Selected</h4>
                                        <div>
                                            <Select options={ selectedFormattedComponentsList } maxMenuHeight={180} />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid xs={2} spacing={3}>
                                    <div>
                                        <h4>Description</h4>
                                        <div> blablabla </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>
                                        <ReactDataGrid
                                            columns={componentsColumns}
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
                                            <Select options={ selectedFormattedDcList } maxMenuHeight={180} />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid xs={2} spacing={3}>
                                    <div>
                                        <h4>Description</h4>
                                        <div> blablabla </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>
                                        <ReactDataGrid
                                            columns={componentsColumns}
                                            rowGetter={i => this.state.componentsRows[i]}
                                            rowsCount={this.state.componentsRows.length}
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