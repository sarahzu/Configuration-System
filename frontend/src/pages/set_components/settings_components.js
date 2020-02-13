import React from 'react'
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import ReactDataGrid from "react-data-grid";
import Checkbox from "./checkbox";
import "./settings_components.css"
import {Editors} from "react-data-grid-addons";
import axios from "axios";
import "../../pages.css"
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
        let checkboxAllChecked;

        if (localStorage.getItem("checkboxAllChecked")) {checkboxAllChecked = JSON.parse(localStorage.getItem("checkboxAllChecked"))}
        else {checkboxAllChecked = false;}

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
            checkboxAllChecked: checkboxAllChecked,
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
        if (localStorage.getItem("parametersUpper")) {this.setState({parametersUpper: JSON.parse(localStorage.getItem("parametersUpper"))});}
        //if (localStorage.getItem("dynamicDataGridColumns")) {this.setState({fullComponentsInfo: JSON.parse(localStorage.getItem("dynamicDataGridColumns"))});}
        if (localStorage.getItem("currentParameters")) {this.setState({currentParameters: JSON.parse(localStorage.getItem("currentParameters"))});}
        if (localStorage.getItem("checkboxAllChecked")) {this.setState({checkboxAllChecked: JSON.parse(localStorage.getItem("checkboxAllChecked"))});}

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
        const finalOutputComps = finalOutput.configuration['1'].components;
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
        finalOutput.configuration['1'].components = finalOutputComps;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        this.setState({componentsDataGridRows: gridRows});
        localStorage.setItem("componentsDataGridRows", JSON.stringify(gridRows));

    };

    /**
     * update callback data grid rows when selection on components is made. Store new value in local storage and state.
     *
     * @param fromRow   index of origin row
     * @param toRow     index of new row
     * @param updated   updated value
     */
     onCallbackComponentGridRowsUpdated = ({ fromRow, toRow, updated }) => {
         const nonDynamicDataGridRowsLength = this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length;
         const dynamicDataGridRowsLength = this.getDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length;
         const dependentDataGridRowsLength = this.getDependentComponentsDataGridRows(this.state.componentsDataGridRows).length;
         const callbackFromRow = fromRow + nonDynamicDataGridRowsLength + dynamicDataGridRowsLength + dependentDataGridRowsLength;
         const callbackToRow = toRow + nonDynamicDataGridRowsLength + dynamicDataGridRowsLength + dependentDataGridRowsLength;
         let gridRows = this.getGridRows(callbackFromRow , callbackToRow, updated);
         this.updateDynamicAndCallbackComponentGridRows(gridRows);
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

        this.updateDynamicAndCallbackComponentGridRows(gridRows);
    };

    updateDynamicAndCallbackComponentGridRows (gridRows) {

        // add chance to current stats
        let currState = JSON.parse(localStorage.getItem("currentStats"));
        currState.currParameters = gridRows;
        localStorage.setItem("currentStats", JSON.stringify(currState));
        const currCompName = currState.currComponentName;
        const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputComps = finalOutput.configuration['1'].components;
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
                            const dependentParameterOriginalName = match['1'];
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
                selectedParameters[v.name] = JSON.parse(localStorage.getItem("currentParameters"));
                this.setState({parametersUpper: selectedParameters});
                localStorage.setItem("parametersUpper", JSON.stringify(selectedParameters))
            }
            comp_index++;
        });
        finalOutput.configuration['1'].components = finalOutputComps;

        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        this.setState({componentsDataGridRows: gridRows});
        localStorage.setItem("componentsDataGridRows", JSON.stringify(gridRows));

    }

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

                finalOutput.configuration['1'].components = finalOutputComps;

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
    removeComponentInList(compId, list, isToolbox) {
        let j;
        for (j = 0; j < list.length; j++) {
            if(list[j].i === compId.toString()) {
                if (isToolbox) {
                    list.splice(j, 1)
                }
                else {
                    list[j] = {};
                }
            }
        }
    }

    /**
     * Update component and checked components entries in local storage and state.
     * If nothing is selected reset state
     *
     * @param newComponent  new component dictionary in the form {dc1: true,  dc2: false, dc3: true}
     */
    updateComponentsAndCheckedStorageWhenCheckboxIsChecked(newComponent) {
        this.setState({vis_components: newComponent});

        let checkedItems = Object.keys(newComponent).filter(k => newComponent[k]);
        localStorage.setItem("visualComponents", JSON.stringify(newComponent));
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
    }

    /**
     * Update final output according to new component and checked value.
     *
     * Return the width and y-coordinate of the updated component in order to position the next component below
     * the current component.
     *
     * @param component         updated component name
     * @param index             index of updated decision card
     * @param checkedValue      new check value of updated decision card
     * @param prevLayoutHeight  layout height of previous visual component
     * @param prevLayoutY       layout y-coordinate of previous visual component
     */
    updateFinaleOutputWhenCheckboxIsCheckedAndReturnLayoutWidthAndY(component, index, checkedValue, prevLayoutHeight, prevLayoutY) {
        //let checked = this.state.vis_components[v] === false;

        // set in final output the checked state of the component
        const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputComps = finalOutput.configuration['1'].components;

        // add checked state to final output
        finalOutputComps.map(v => {
            if (v.name === component) {
                v.enabled = checkedValue;

                // if there is no previouse parameters set in final output, take the default parameters from api response
                // if not, the parameters are already stored in the final output and nothing needs to be done
                if (v.parameter.length === 0 ) {
                    // get default parameters from api response
                    let parameters;
                    if (JSON.parse(localStorage.getItem("apiResponse"))) {
                        parameters = JSON.parse(localStorage.getItem("apiResponse")).componentsParameters[index].rows
                    }
                    else {
                        parameters = []
                    }
                    // add default parameters to final output
                    v.parameter = parameters;
                }
                // when a new component is selected it is automatically send to the screen, not to the toolbox
                // therefore the toolbox entry needs to be set to false with every selection
                v.toolbox = false;
            }
        });
        finalOutput.configuration['1'].components = finalOutputComps;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        //dict[name] = (checkedValue);

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
        let currLayoutHeight = prevLayoutHeight;
        let  currLayoutY = prevLayoutY;

        if (checkedValue && layout) {
            //fill empty slots in layout array
            let j;
            for (j = 0; j < index; j++) {
                if (!layout[j]) {
                    layout[j] = {};
                }
            }
            //layout[index] = {
            let layoutAlreadyInList = false;
            layout.map(item => {
                if (item.i === index.toString()) {
                    layoutAlreadyInList = true;
                }
            });
            if (!layoutAlreadyInList) {
                let height = 12;
                let width = 6;
                // position the current visual component below the previous visual component
                let y = prevLayoutY + prevLayoutHeight;
                let x = 0;
                layout.push({
                    x: x,
                    y: y,
                    w: width,
                    h: height,
                    i: index.toString(),
                    static: false
                });
                currLayoutHeight = height;
                currLayoutY = y;
            }
            localStorage.setItem("SelectedLayout", JSON.stringify({lg: layout}));
            return [currLayoutHeight, currLayoutY]
        }
        else {
            let usedList;
            let usedLocalStorageString;
            if (this.isComponentInList(index, layout)) {
                usedList = layout;
                usedLocalStorageString = "SelectedLayout";
            }
            else if (this.isComponentInList(index, toolbox)) {
                usedList = toolbox;
                usedLocalStorageString = "toolbox";
            }

            if (usedList) {
                const isToolbox = usedLocalStorageString === "toolbox";
                this.removeComponentInList(index, usedList, isToolbox);
                localStorage.setItem(usedLocalStorageString, JSON.stringify({lg: usedList}));
            }
            else {
                console.log("element not found");
                return [currLayoutHeight, currLayoutY]
            }
            return [currLayoutHeight, currLayoutY]
        }
    }

    /**
     * update all checkboxes according to the given value
     *
     * @param checkedValue  value of the checkbox
     */
    checkAllEvent(checkedValue) {
        let updatedComponents = {};
        let currLayoutHeight = 0;
        let currLayoutY = 0;
        Object.keys(this.state.vis_components).map((comp, i) => {
            let newLayoutHeightAndY = this.updateFinaleOutputWhenCheckboxIsCheckedAndReturnLayoutWidthAndY(
                comp, i, checkedValue, currLayoutHeight, currLayoutY);
            // extract previously used width and y-coordinate which are used to position the next component
            // below the current component
            currLayoutHeight = newLayoutHeightAndY[0];
            currLayoutY = newLayoutHeightAndY[1];

            updatedComponents[comp] = (checkedValue);
        });
        this.updateComponentsAndCheckedStorageWhenCheckboxIsChecked(updatedComponents)
    }

    /**
     * update only given checkbox with the given value
     *
     * @param name          name of the checkbox
     * @param checkedValue  new value of the checkbox
     */
    checkboxEvent(name, checkedValue) {
        let updatedComponent = {};
        let currLayoutHeight = 0;
        let currLayoutY = 0;
        Object.keys(this.state.vis_components).map((v, i) => {
            if (v === name) {
                let newLayoutHeightAndY = this.updateFinaleOutputWhenCheckboxIsCheckedAndReturnLayoutWidthAndY(
                    name, i, checkedValue, currLayoutHeight, currLayoutY);
                // extract previously used width and y-coordinate which are used to position the next component
                // below the current component
                currLayoutHeight = newLayoutHeightAndY[0];
                currLayoutY = newLayoutHeightAndY[1];
                updatedComponent[name] = (checkedValue);
            }
            else {
                updatedComponent[v] = this.state.vis_components[v]
            }
        });

        this.updateComponentsAndCheckedStorageWhenCheckboxIsChecked(updatedComponent)
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
        // const {name} = changeEvent.target;
        //
        // let dict = {};
        // Object.keys(this.state.vis_components).map((v, i) => {
        //     if (v === name) {
        //
        //     }
        //     else {
        //         dict[v] = this.state.vis_components[v]
        //     }
        // });

        const {name} = changeEvent.target;
        const checkedValue = this.state.vis_components[name] === false;
        this.checkboxEvent(name, checkedValue);
    };

    /**
     * Trigger when Check / Uncheck All checkbox is checked or unchecked.
     * Update all other checkbox' according to the value of Check / Uncheck All checkbox.
     *
     * @param event
     */
    handleAllChecked = (event) => {
        const dcs = this.state.vis_components; // components is in the form {comp1: true,  comp2: false, comp3: true}
        let checkValue;

        // get check state of checked all checkbox and alter state of all other checkboxes accordingly
        if (this.state.checkboxAllChecked) {
            checkValue = false
        }
        else {
            checkValue = true
        }
        this.checkAllEvent(checkValue);

        // update check all checkbox value
        this.setState({checkboxAllChecked: checkValue});
        localStorage.setItem("checkboxAllChecked", checkValue);
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
        let nonDynamicDataGridRows = [];
        fullDataGridRows.map(item => {
            if (item.type !== "dynamic" && item.type !== "dependent" && item.type !== 'callback') {
                nonDynamicDataGridRows.push(item)
            }
        });
        return nonDynamicDataGridRows
    }

    /**
     * extract all dependent parameters from the given data grid rows
     *
     * @param fullDataGridRows {array} list of row content of data grid in the form [{parameter: ..., type: ..., value: ...}, {}, ...]
     * @return {array} filtered data grid row list
     */
    getDependentComponentsDataGridRows(fullDataGridRows) {
        let dependentDataGridRows = [];
        fullDataGridRows.map(item => {
            if (item.type === "dependent") {
                dependentDataGridRows.push(item)
            }
        });
        return dependentDataGridRows
    }

    /**
     * extract all callback pramamters form the given data grid rows
     *
     * @param fullDataGridRows {array} list of row content of data grid in the form [{parameter: ..., type: ..., value: ...}, {}, ...]
     * @return {array} filtered data grid row list
     */
    getCallbackComponentsDataGridRows(fullDataGridRows) {
        let callbackDataGridRows = [];
        fullDataGridRows.map(item => {
            if (item.type === 'callback') {
                callbackDataGridRows.push(item)
            }
        });
        return callbackDataGridRows
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
                    <h2>Visual Components Settings </h2>
                </Grid>
                <Grid item xs={3}>
                    <div style={this.props.stylesCheckbox}>
                        <h3>Visual Components</h3>
                        <Checkbox
                            label={"Check / Uncheck All"}
                            isSelected={this.state.checkboxAllChecked}
                            onCheckboxChange={this.handleAllChecked}
                            key={"Check / Uncheck All"}
                        />
                        <ul>
                            {propsComponents}
                        </ul>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div>
                        <h3>Selected</h3>
                        <div className="configuration-text" id="selector-visual-components">
                            <Select value={this.state.selectedItemUpper} options={selectedFormattedComponentsList} maxMenuHeight={180} onChange = {this.getSelectedComponentsInput}/>
                        </div>
                    </div>
                </Grid>
                {/*<Grid xs={2}>
                    <div>
                        <h4>Description</h4>
                        <div> {this.state.descriptionComponents} </div>
                    </div>
                </Grid>*/}
                <Grid item xs={6}>
                    <div id="non-dynamic-data-grid">
                        <ReactDataGrid
                            columns={this.state.componentsDataGridColumns}
                            rowGetter={i => this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows)[i]}
                            rowsCount={this.getNonDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length}
                            onGridRowsUpdated={this.onComponentGridRowsUpdated}
                            enableCellSelect={true}
                            minHeight={200}
                        />
                    </div>
                    <div className={"noHeaderWrapper"} id="dynamic-data-grid">
                        <ReactDataGrid
                            columns={this.props.dynamicColumnsComponents}
                            rowGetter={i => this.getDynamicComponentsDataGridRows(this.state.componentsDataGridRows)[i]}
                            rowsCount={this.getDynamicComponentsDataGridRows(this.state.componentsDataGridRows).length}
                            onGridRowsUpdated={this.onDynamicComponentGridRowsUpdated}
                            enableCellSelect={true}
                            minHeight={200}
                        />
                    </div>
                    <div className={"noHeaderWrapper"} id="callback-data-grid">
                        <ReactDataGrid
                            columns={this.props.callbackColumnsComponents}
                            rowGetter={i => this.getCallbackComponentsDataGridRows(this.state.componentsDataGridRows)[i]}
                            rowsCount={this.getCallbackComponentsDataGridRows(this.state.componentsDataGridRows).length}
                            onGridRowsUpdated={this.onCallbackComponentGridRowsUpdated}
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
