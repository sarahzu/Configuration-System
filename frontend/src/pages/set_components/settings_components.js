import React from 'react'
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import ReactDataGrid from "react-data-grid";
import Checkbox from "./checkbox";
import "./settings_components.css"
import {Editors} from "react-data-grid-addons";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExpandArrowsAlt, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {confirmAlert} from "react-confirm-alert";
const { DropDownEditor } = Editors;


class SettingsComponents extends React.Component {
    constructor(props) {
        super(props);
        let visComponents;
        let checkedComponents;
        let componentsDataGridRows;
        let issueTypesDataGridComponents;
        let selectedItem;
        let issueTypeEditorDataGridComponents;
        let componentsDataGridColumns = [
            {key: "parameter", name: "Parameter"},
            {key: "type", name: "Type"},
            {key: "value", name: "Value", editable: true}];
        let descriptionComponents;
        let parameters;
        let currentParameters;

        if (localStorage.getItem("parametersUpper")) {parameters = JSON.parse(localStorage.getItem("parametersUpper"))}
        else {parameters = {}}

        if (localStorage.getItem("visualComponents")) {
            visComponents =  JSON.parse(localStorage.getItem("visualComponents"));
            if (Object.keys(visComponents).length < this.props.settingsInfo.components.length) {
                visComponents = this.props.settingsInfo.components.reduce(
                    (options, option) => ({
                        ...options,
                        [option]: false
                    }),
                    {}
                )
            }
        }
        else if (this.props.settingsInfo.components) {
            visComponents = this.props.settingsInfo.components.reduce(
                (options, option) => ({
                    ...options,
                    [option]: false
                }),
                {}
            )
        }
        else {
            visComponents = []
        }

        if (localStorage.getItem("checkedComponents")) {checkedComponents = JSON.parse(localStorage.getItem("checkedComponents"))}
        else {checkedComponents = []}

        if (localStorage.getItem("componentsDataGridRows")) {componentsDataGridRows = JSON.parse(localStorage.getItem("componentsDataGridRows"))}
        else {componentsDataGridRows = []}

        if (localStorage.getItem("selectedComponents")) {selectedItem = JSON.parse(localStorage.getItem("selectedComponents"))}
        else {selectedItem = []}

        // if (localStorage.getItem("componentsDataGridColumns")) {componentsDataGridColumns = JSON.parse(localStorage.getItem("componentsDataGridColumns"))}
        // else {componentsDataGridColumns = []}

        if (localStorage.getItem("descriptionComponents")) {descriptionComponents = JSON.parse(localStorage.getItem("descriptionComponents"))}
        else {descriptionComponents = ""}

        if (localStorage.getItem("currentParameters")) {currentParameters = JSON.parse(localStorage.getItem("currentParameters"))}
        else {currentParameters = []}

        let checkboxComponents = {};

        if (props.settingsInfo.components) {
            this.props.settingsInfo.components.map((v, i) => {
                checkboxComponents[v] = false
            });
        }

        this.state = {
            vis_components: visComponents,
            checkedComponents: checkedComponents,
            componentsDataGridRows: componentsDataGridRows,
            issueTypesDataGridComponents: [],
            selectedItemUpper: selectedItem,
            parametersUpper: parameters,
            issueTypeEditorDataGridComponents: null,
            componentsDataGridColumns: componentsDataGridColumns,
            descriptionComponents: descriptionComponents,
            currentDependentValue: null,
            currentParameters: currentParameters,
        };

        this.createCheckboxComponents = this.createCheckboxComponents.bind(this);
        this.handleCheckboxChangeComponents = this.handleCheckboxChangeComponents.bind(this);
        this.getValueFromSource = this.getValueFromSource.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("visualComponents")) {
            let visComps = JSON.parse(localStorage.getItem("visualComponents"));
            if (Object.keys(visComps).length < this.props.settingsInfo.components.length) {
                visComps = this.props.settingsInfo.components.reduce(
                    (options, option) => ({
                        ...options,
                        [option]: false
                    }),
                    {}
                )
            }
            this.setState({vis_components: visComps});
        }
        if (localStorage.getItem("checkedComponents")) {this.setState({checkedComponents: JSON.parse(localStorage.getItem("checkedComponents"))});}
        if (localStorage.getItem("componentsDataGridRows")) {this.setState({componentsDataGridRows: JSON.parse(localStorage.getItem("componentsDataGridRows"))});}
        //if (localStorage.getItem("issueTypesDataGridComponents")) {this.setState({issueTypesDataGridComponents: JSON.parse(localStorage.getItem("issueTypesDataGridComponents"))});}
        // if (localStorage.getItem("issueTypesDataGridDC")) {this.setState({issueTypesDataGridDc: JSON.parse(localStorage.getItem("issueTypesDataGridDC"))});}
        if (localStorage.getItem("selectedComponents")) {this.setState({selectedItemUpper: JSON.parse(localStorage.getItem("selectedComponents"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridComponents")) {this.setState({issueTypeEditorDataGridComponents: JSON.parse(localStorage.getItem("issueTypeEditorDataGridComponents"))});}
        //if (localStorage.getItem("issueTypeEditorDataGridDc")) {this.setState({issueTypeEditorDataGridDc: JSON.parse(localStorage.getItem("issueTypeEditorDataGridDc"))});}
        if (localStorage.getItem("componentsDataGridColumns")) {this.setState({componentsDataGridColumns: JSON.parse(localStorage.getItem("componentsDataGridColumns"))});}
        if (localStorage.getItem("descriptionComponents")) {this.setState({descriptionComponents: JSON.parse(localStorage.getItem("descriptionComponents"))});}
        if (localStorage.getItem("parametersUpper")) {this.setState({fullComponentsInfo: JSON.parse(localStorage.getItem("parametersUpper"))});}
        //if (localStorage.getItem("dynamicDataGridColumns")) {this.setState({fullComponentsInfo: JSON.parse(localStorage.getItem("dynamicDataGridColumns"))});}
        if (localStorage.getItem("currentParameters")) {this.setState({currentParameters: JSON.parse(localStorage.getItem("currentParameters"))});}

    }

    /**
     * update data grid rows when selection on components is made. Store new value in local storage and state.
     *
     * @param fromRow   index of origin row
     * @param toRow     index of new row
     * @param updated   updated value
     */
     onComponentGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let gridRows = this.getGridRows(fromRow, toRow, updated);

        // add chance to current stats
        let currState = JSON.parse(localStorage.getItem("currentStats"));
        currState.currParameters = gridRows;
        localStorage.setItem("currentStats", JSON.stringify(currState));
        const currCompName = currState.currComponentName;
        const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputComps = finalOutput.configuration.components;
        finalOutputComps.map(v => {
            if (v.name === currCompName) {
                v.parameter = gridRows;

                // also update the overall parameters
                let selectedParameters = this.state.parametersUpper;
                selectedParameters[v.name] = gridRows;
                this.setState({parametersUpper: selectedParameters});
                localStorage.setItem("parametersUpper", JSON.stringify(selectedParameters))
            }
        });
        finalOutput.configuration.components = finalOutputComps;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        this.setState({componentsDataGridRows: gridRows});
        localStorage.setItem("componentsDataGridRows", JSON.stringify(gridRows));

    };

    /**
     * update dynamic data grid rows when selection on components is made. Store new value in local storage and state.
     *
     * @param fromRow   index of origin row
     * @param toRow     index of new row
     * @param updated   updated value
     */
    onDynamicComponentGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        const dynamicFromRow = fromRow + this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length;
        const dynamicToRow = toRow + this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length;

        let gridRows = this.getGridRows(dynamicFromRow , dynamicToRow, updated);

        // add chance to current stats
        let currState = JSON.parse(localStorage.getItem("currentStats"));
        currState.currParameters = gridRows;
        localStorage.setItem("currentStats", JSON.stringify(currState));
        const currCompName = currState.currComponentName;
        const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputComps = finalOutput.configuration.components;
        let comp_index = 0;
        finalOutputComps.map(v => {
            if (v.name === currCompName) {
                v.parameter = gridRows;
                //this.setState({"currentParameters": v.parameter});
                localStorage.setItem("currentParameters", JSON.stringify(v.parameter));
                let parameters = v.parameter;

                let param_index = 0;
                v.parameter.map(dependentParameter => {
                    if (dependentParameter.type === "dependent") {
                        let match = dependentParameter.parameter.match(/(.*?)--(.*?)--(.*)/);
                        try {
                            const dependentParameterOriginalName = match[1];
                            const dependentParameterName = match[2];
                            const dependentParameterNodePath = match[3];

                            v.parameter.map(dynamicParameter => {
                                if (dependentParameterName === dynamicParameter.parameter && dynamicParameter.type !== "dependent") {

                                    const newSource = dynamicParameter.value;
                                    const apiRequest = {"new_source": newSource, "node_path": dependentParameterNodePath};
                                    const response = this.getValueFromSource(apiRequest, parameters, param_index, v.name,
                                        finalOutputComps, finalOutput, gridRows, comp_index);
                                }
                            })
                        }
                        catch (e) {}
                    }
                    param_index++;
                    v.parameter = JSON.parse(localStorage.getItem("currentParameters"));
                });

                // also update the overall parameters
                let selectedParameters = this.state.parametersUpper;
                //selectedParameters[v.name] = gridRows;
                selectedParameters[v.name] = JSON.parse(localStorage.getItem("currentParameters"));;
                this.setState({parametersUpper: selectedParameters});
                localStorage.setItem("parametersUpper", JSON.stringify(selectedParameters))
            }
            comp_index++;
        });
        finalOutput.configuration.components = finalOutputComps;

        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        this.setState({componentsDataGridRows: gridRows});
        localStorage.setItem("componentsDataGridRows", JSON.stringify(gridRows));

    };

    async getValueFromSource(source_json, currentParameters, index_parameter, currentName, finalOutputComps, finalOutput, gridRows, index_comp) {
        await axios.post(process.env.REACT_APP_GET_VALUE, source_json, {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                //this.setState({"currentDependentValue": response.data.value});
                currentParameters[index_parameter].value = response.data.value;
                //this.setState({"currentParameters": currentParameters});
                localStorage.setItem("currentParameters", JSON.stringify(currentParameters));


                // also update the overall parameters
                let selectedParameters = this.state.parametersUpper;
                //selectedParameters[v.name] = gridRows;
                selectedParameters[currentName] = JSON.parse(localStorage.getItem("currentParameters"));
                this.setState({parametersUpper: selectedParameters});
                localStorage.setItem("parametersUpper", JSON.stringify(selectedParameters));

                finalOutputComps[index_comp].parameter = JSON.parse(localStorage.getItem("currentParameters"));

                finalOutput.configuration.components = finalOutputComps;

                localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

                this.setState({componentsDataGridRows: gridRows});
                localStorage.setItem("componentsDataGridRows", JSON.stringify(gridRows));
            }
        );

        }

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

        // set current stats and store them in local storage
        const currStats = {};
        this.setState({
            currComponentName: selectedItemUpper.label,
            currParameters: selectedComponent.rows,
        });
        // let parameters = JSON.parse(localStorage.getItem("parametersUpper"));
        let parameters = this.state.parametersUpper;

        let localCurrStats;
        if (JSON.parse(localStorage.getItem("currentStats"))) {
            localCurrStats = JSON.parse(localStorage.getItem("currentStats"));
        }
        else {
            localCurrStats = {}
        }

        localCurrStats.currComponentName = selectedItemUpper.label;
        // localCurrStats.currParameters = selectedComponent.rows;
        localCurrStats.currParameters = parameters[selectedItemUpper.label];
        localStorage.setItem("currentStats", JSON.stringify(localCurrStats));

        // set data grid rows according to parameters of selected component
        if (localCurrStats.currParameters) {
            this.setState({componentsDataGridRows: localCurrStats.currParameters});
            localStorage.setItem("componentsDataGridRows", JSON.stringify(localCurrStats.currParameters));

        }
        else {
            this.setState({componentsDataGridRows: selectedComponent.rows});
            localStorage.setItem("componentsDataGridRows", JSON.stringify(selectedComponent.rows));
        }



        this.setState({issueTypesDataGridComponents: selectedComponent.issueTypes});
        this.setState({descriptionComponents: selectedComponent.description});

        // this.setState({issueTypeEditorDataGridComponents: <DropDownEditor options={["test", "test2", "test3"]}/>});
        // let dropdown = <DropDownEditor options={["test", "test2", "test3"]}/>

        // const parameter = selectedComponent.rows;
        // let gridContent = [];
        // let i;
        // let dropDownFound = false;
        // for (i = 0; i < parameter.length; i++) {
        //     let currParam = parameter[i];
        //     if (currParam.type === "dynamic") {
        //         this.setState({
        //             componentsDataGridColumns: [
        //                 {key: "parameter", name: "Parameter"},
        //                 {key: "type", name: "Type"},
        //                 {key: "value", name: "Value", editable: true}]
        //         });
        //         dropDownFound = true;
        //         return
        //     }
        // }
        // if (!dropDownFound) {
        //     this.setState({
        //         componentsDataGridColumns: [
        //             {key: "parameter", name: "Parameter"},
        //             {key: "type", name: "Type"},
        //             {key: "value", name: "Value", editable: true}]
        //     });
        // }

        // this.setState({
        //     componentsDataGridColumns: [
        //         {key: "parameter", name: "Parameter"},
        //         {key: "type", name: "Type"},
        //         {key: "value", name: "Value", editable: true}]
        // });

        //Fixme: do not use this.state.whatever in the updateLocalStorage
        // better define onle the values you need in the separate function with the original values!

        localStorage.setItem("issueTypesDataGridComponents", JSON.stringify(selectedComponent.issueTypes));
        localStorage.setItem("selectedComponents", JSON.stringify(selectedItemUpper));
        // localStorage.setItem("componentsDataGridColumns", JSON.stringify([
        //     {key: "parameter", name: "Parameter"},
        //     {key: "type", name: "Type"},
        //     {key: "value", name: "Value", editable: true}]));
        localStorage.setItem("descriptionComponents", JSON.stringify(selectedComponent.description));
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
        const {name} = changeEvent.target;

        let dict = {};
        Object.keys(this.state.vis_components).map((v, i) => {
            if (v === name) {
                let checked = this.state.vis_components[v] === false;

                // set in final output the checked state of the component
                const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
                // get default parameters from api response
                let parameters;
                if (JSON.parse(localStorage.getItem("apiResponse"))) {
                     parameters = JSON.parse(localStorage.getItem("apiResponse")).componentsParameters[i].rows
                }
                else {
                    parameters = []
                }
                const finalOutputComps = finalOutput.configuration.components;
                // add checked state to final output
                finalOutputComps.map(v => {
                    if (v.name === name) {
                        v.enabled = checked;
                        // also add default parameters
                        v.parameter = parameters;
                    }
                });
                finalOutput.configuration.components = finalOutputComps;
                localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

                dict[name] = (checked);

                let layout;
                let toolbox;
                if (JSON.parse(localStorage.getItem("SelectedLayout")) && JSON.parse(localStorage.getItem("toolbox"))) {
                    layout = JSON.parse(localStorage.getItem("SelectedLayout")).lg;
                    toolbox = JSON.parse(localStorage.getItem("toolbox")).lg;
                }
                else {
                    layout = [];
                    toolbox = [];
                }


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
                        w: 4,
                        h: 10,
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
            // this.setState({componentsDataGridColumns: []});

            localStorage.setItem("componentsDataGridRows", JSON.stringify([]));
            localStorage.setItem("issueTypesDataGridComponents", JSON.stringify([]));
            localStorage.setItem("selectedComponents", JSON.stringify([]));
            //localStorage.setItem("componentsDataGridColumns", JSON.stringify([]));
            localStorage.setItem("descriptionComponents", JSON.stringify(""));

            if(checkedItems.length === 0) {localStorage.setItem("SelectedLayout", JSON.stringify({lg: []}))}
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
     * extract all dynamic parameters from the given data grid rows
     *
     * @param fullDataGridRows {array} list of row content of data grid in the form [{parameter: ..., type: ..., value: ...}, {}, ...]
     * @return {array} filtered data grid row list
     */
    getDynamicComponentsDataGridRows(fullDataGridRows) {
        let dynamicDataGridRows = [];
        fullDataGridRows.map(item => {
            if (item.type === "dynamic") {
                dynamicDataGridRows.push(item)
            }
        });
        return dynamicDataGridRows
    }

    /**
     * extract all non-dynamic parameters from the given data grid rows
     *
     * @param fullDataGridRows {array} list of row content of data grid in the form [{parameter: ..., type: ..., value: ...}, {}, ...]
     * @return {array} filtered data grid row list
     */
    getNonDynamicComponentsDataGridRows(fullDataGridRows) {
        let dynamicDataGridRows = [];
        fullDataGridRows.map(item => {
            if (item.type !== "dynamic" && item.type !== "dependent" && item.type !== 'inputLocation') {
                dynamicDataGridRows.push(item)
            }
        });
        return dynamicDataGridRows
    }


    render() {
        let checkedComponents = Object.keys(this.state.vis_components).filter(k => this.state.vis_components[k]);

        let i;
        let selectedFormattedComponentsList = [];
        for (i = 0; i < checkedComponents.length; i++) {
            selectedFormattedComponentsList.push({label: checkedComponents[i], value: i-1})
        }

        let propsComponents = "";
        if (this.props.settingsInfo.components) {
            propsComponents = this.props.settingsInfo.components.map(this.createCheckboxComponents);
        }

        return (
            <Grid container spacing={3}  style={this.props.stylesGridUpper}>
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
                    <div style={this.props.stylesCheckbox}>
                        <h4>Visual Components</h4>
                        {/*<CheckboxList
                                        onChange={(values) => this.onCheckboxChange('vis_components', values)}
                                        values={components}
                                        input={"comp"}
                                    />*/}
                        {/*<button onClick={this.selectAllCheckboxFields(propsComponents)}>select all</button>*/}
                        {propsComponents}
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
                            rowGetter={i => this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows)[i]}
                            rowsCount={this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length}
                            onGridRowsUpdated={this.onComponentGridRowsUpdated}
                            enableCellSelect={true}
                            minHeight={200}
                        />
                    </div>
                    <div className={"noHeaderWrapper"}>
                        <ReactDataGrid
                            columns={this.props.dynamicColumnsComponents}
                            rowGetter={i => this.getDynamicComponentsDataGridRows(this.state.componentsDataGridRows)[i]}
                            rowsCount={this.getDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length}
                            onGridRowsUpdated={this.onDynamicComponentGridRowsUpdated}
                            enableCellSelect={true}
                            minHeight={200}
                        />
                    </div>
                </Grid>
            </Grid>
        );
    }
}
export default SettingsComponents;
