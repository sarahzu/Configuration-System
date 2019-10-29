import React from 'react'

import CheckboxList from "./checkbox_list"
import axios from "axios";
import List from 'react-list-select'
import {SelectableGroup, DeselectAll, SelectAll, TSelectableItemProps, createSelectable} from 'react-selectable-fast'
//import Select from "react-dropdown-select";
import Select from 'react-select';
import Grid from "@material-ui/core/Grid";
//import 'bootstrap/dist/css/bootstrap.min.css';


const ListItem = require("react-list-select");



class SetComponents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            vis_components: [],
            selected: "",
            selectValues:[]
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

    setValues = selectValues => this.setState({ selectValues });



    render() {
        const components = ["Component 1", "Component 2", "Component 3", "Component 4", "Component 5", "Component 6"];
        //let components = this.getComponentNames();

        let selectedItems = Object.keys(this.state.vis_components).filter(k => this.state.vis_components[k]);

        const stylesCheckbox = {
            overflow:"scroll",
        };
        const stylesSelected = {
            overflow:"scroll",
            height:"500px"
        };

        let i;
        let selectedFormattedList = [];
        for (i = 0; i < selectedItems.length; i++) {
            selectedFormattedList.push({label: selectedItems[i], value: i-1})
        }

        return (
            <div className="container">
                <div className="row">
                    <form className="form">
                        <h1> Set Components</h1>

                        <Grid container spacing={24}>
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
                                        <Select options={ selectedFormattedList } maxMenuHeight={80} />
                                    </div>
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

                        <button
                            className="btn btn-primary"
                            onClick={(e) => {
                                console.log(this.state);
                                e.preventDefault();
                            }}
                        >
                            Save
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default SetComponents