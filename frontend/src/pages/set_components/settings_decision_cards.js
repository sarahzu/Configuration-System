import React from 'react'
import ReactDataGrid from "react-data-grid";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Checkbox from "./checkbox";

class SettingsDecisionCards extends React.Component {

    constructor(props) {
        super(props);

        let decisionCards;
        let checkedDc;
        let dcDataGridRows;
        let issueTypesDataGridDc;
        let issueTypeEditorDataGridDc;
        let dcDataGridColumns = [
            {key: "parameter", name: "Parameter"},
            {key: "type", name: "Type"},
            {key: "value", name: "Value", editable: true}];
        let selectedItem;
        let descriptionDc;
        //let currentStats;
        let parameters;
        let currentParametersDc;
        let checkboxAllCheckedDc;

        if (localStorage.getItem("checkboxAllCheckedDc")) {checkboxAllCheckedDc = JSON.parse(localStorage.getItem("checkboxAllCheckedDc"))}
        else {checkboxAllCheckedDc = false;}

        if (localStorage.getItem("parametersLower")) {parameters = JSON.parse(localStorage.getItem("parametersLower"))}
        else {parameters = {}}

        if (localStorage.getItem("currentParametersDc")) {currentParametersDc = JSON.parse(localStorage.getItem("currentParametersDc"))}
        else {currentParametersDc = []}

        if (localStorage.getItem("decisionCards")) {
            decisionCards =  JSON.parse(localStorage.getItem("decisionCards"));
            if (Object.keys(decisionCards).length < this.props.settingsInfo.decisionCards.length) {
                decisionCards = this.props.settingsInfo.decisionCards.reduce(
                    (options, option) => ({
                        ...options,
                        [option]: false
                    }),
                    {}
                )
            }
        }
        else if (this.props.settingsInfo.decisionCards) {
            decisionCards = this.props.settingsInfo.decisionCards.reduce(
                (options, option) => ({
                    ...options,
                    [option]: false
                }),
                {}
            )
        }
        else {
            decisionCards = []
        }

        if (localStorage.getItem("descriptionDc")) {descriptionDc = JSON.parse(localStorage.getItem("descriptionDc"))}
        else {descriptionDc = ""}

        if (localStorage.getItem("checkedDecisionCards")) {checkedDc = JSON.parse(localStorage.getItem("checkedDecisionCards"))}
        else {checkedDc = []}

        if (localStorage.getItem("selectedDc")) {selectedItem = JSON.parse(localStorage.getItem("selectedDc"))}
        else {selectedItem = []}

        if (localStorage.getItem("dcDataGridRows")) {dcDataGridRows = JSON.parse(localStorage.getItem("dcDataGridRows"))}
        else {dcDataGridRows = []}



        // if (localStorage.getItem("dcDataGridColumns")) {dcDataGridColumns = JSON.parse(localStorage.getItem("dcDataGridColumns"))}
        // else {dcDataGridColumns = []}

        let checkboxDecisionCards = {};
        if (props.settingsInfo.decisionCards) {
            this.props.settingsInfo.decisionCards.map((v, i) => {
                checkboxDecisionCards[v] = false
            });
        }

        this.state = {
            dcDataGridColumns:  dcDataGridColumns,
            decision_cards: decisionCards,
            checkedDc: checkedDc,
            dcDataGridRows:dcDataGridRows,
            issueTypesDataGridDc: [],
            selectedItemLower: selectedItem,
            descriptionDc: descriptionDc,
            issueTypeEditorDataGridDc: null,
            parametersLower: parameters,
            currentDependentValue: null,
            currentParametersDc: currentParametersDc,
            checkboxAllCheckedDc: checkboxAllCheckedDc,
        };

        this.createCheckboxDc = this.createCheckboxDc.bind(this);
        this.handleCheckboxChangeDc = this.handleCheckboxChangeDc.bind(this);
        this.checkboxEvent = this.checkboxEvent.bind(this);

    }

    componentDidMount() {
        if (localStorage.getItem("decisionCards")) {
            let dcs = JSON.parse(localStorage.getItem("decisionCards"));
            if (Object.keys(dcs).length < this.props.settingsInfo.decisionCards.length) {
                dcs = this.props.settingsInfo.decisionCards.reduce(
                    (options, option) => ({
                        ...options,
                        [option]: false
                    }),
                    {}
                )
            }
            this.setState({decision_cards: dcs});
        }
        if (localStorage.getItem("dcDataGridColumns")) {this.setState({dcDataGridColumns: JSON.parse(localStorage.getItem("dcDataGridColumns"))});}
        if (localStorage.getItem("dcDataGridRows")) {this.setState({dcDataGridRows: JSON.parse(localStorage.getItem("dcDataGridRows"))});}
        if (localStorage.getItem("checkedDecisionCards")) {this.setState({checkedDc: JSON.parse(localStorage.getItem("checkedDecisionCards"))});}
        if (localStorage.getItem("selectedDc")) {this.setState({selectedItemLower: JSON.parse(localStorage.getItem("selectedDc"))});}
        if (localStorage.getItem("descriptionDc")) {this.setState({descriptionDc: JSON.parse(localStorage.getItem("descriptionDc"))});}
        if (localStorage.getItem("parametersLower")) {this.setState({parametersLower: JSON.parse(localStorage.getItem("parametersLower"))});}
        if (localStorage.getItem("currentParametersDc")) {this.setState({currentParametersDc: JSON.parse(localStorage.getItem("currentParametersDc"))});}
        if (localStorage.getItem("checkboxAllCheckedDc")) {this.setState({currentParametersDc: JSON.parse(localStorage.getItem("checkboxAllCheckedDc"))});}
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

    //FIXME: I'm here

    /**
     * Action happening after item is selected in the lower selection bar.
     * All states and local storage entries are updated according to selection.
     *
     * @param selectedItemLower selected item in the selection. In the form {label:"name", value: -1}
     */
    getSelectedDcInput = selectedItemLower => {
        // this.setState({selectedItemLower: selectedItemLower});
        // let selectedDc = this.findSelected(selectedItemLower.label, this.props.settingsInfo.decisionCardsParameters);
        // this.setState({dcDataGridRows: selectedDc.rows});
        // this.setState({issueTypesDataGridDc: selectedDc.issueTypes});
        // this.setState({descriptionDc: selectedDc.description});
        // //this.setState({issueTypeEditorDataGridDc: <DropDownEditor options={this.state.issueTypesDataGridDc}/>});
        // // let dropdown = <DropDownEditor options={selectedDc.issueTypes}/>
        //
        // this.setState({
        //     dcDataGridColumns: [
        //         {key: "parameter", name: "Parameter"},
        //         {key: "type", name: "Type"},
        //         {key: "value", name: "Value", editable: true}]
        // });
        //
        //
        // localStorage.setItem("issueTypesDataGridDC", JSON.stringify(selectedDc.issueTypes));
        // localStorage.setItem("selectedDc", JSON.stringify(selectedItemLower));
        // localStorage.setItem("dcDataGridColumns", JSON.stringify([
        //     {key: "parameter", name: "Parameter"},
        //     {key: "type", name: "Type"},
        //     {key: "value", name: "Value", editable: true}]));
        // localStorage.setItem("dcDataGridRows", JSON.stringify(selectedDc.rows));
        // localStorage.setItem("descriptionDc", JSON.stringify(selectedDc.description));

        this.setState({selectedItemLower: selectedItemLower});
        let selectedDecisionCards = this.findSelected(selectedItemLower.label, this.props.settingsInfo.decisionCardsParameters);

        // set current stats and store them in local storage
        const currStats = {};
        this.setState({
            currDcName: selectedItemLower.label,
            currParametersDc: selectedDecisionCards.rows,
        });
        // let parameters = JSON.parse(localStorage.getItem("parametersUpper"));
        let parameters = this.state.parametersLower;

        let localCurrStats;
        if (JSON.parse(localStorage.getItem("currentStatsDc"))) {
            localCurrStats = JSON.parse(localStorage.getItem("currentStatsDc"));
        }
        else {
            localCurrStats = {}
        }

        localCurrStats.currDcName = selectedItemLower.label;
        // localCurrStats.currParameters = selectedComponent.rows;
        localCurrStats.currParametersDc = parameters[selectedItemLower.label];
        localStorage.setItem("currentStatsDc", JSON.stringify(localCurrStats));

        // set data grid rows according to parameters of selected component
        if (localCurrStats.currParametersDc) {
            this.setState({dcDataGridRows: localCurrStats.currParametersDc});
            localStorage.setItem("dcDataGridRows", JSON.stringify(localCurrStats.currParametersDc));

        }
        else {
            this.setState({dcDataGridRows: selectedDecisionCards.rows});
            localStorage.setItem("dcDataGridRows", JSON.stringify(selectedDecisionCards.rows));
        }

        //this.setState({issueTypesDataGridDc: selectedDecisionCards.issueTypes});
        this.setState({descriptionDc: selectedDecisionCards.description});

        //localStorage.setItem("issueTypesDataGridDc", JSON.stringify(selectedDecisionCards.issueTypes));
        localStorage.setItem("selectedDc", JSON.stringify(selectedItemLower));
        localStorage.setItem("descriptionDc", JSON.stringify(selectedDecisionCards.description));
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
     * Trigger when Check / Uncheck All checkbox is checked or unchecked.
     * Update all other checkbox' according to the value of Check / Uncheck All checkbox.
     *
     * @param event
     */
    handleAllChecked = (event) => {
        const dcs = this.state.decision_cards; // dcs is in the form {dc1: true,  dc2: false, dc3: true}
        let checkValue;

        // get check state of checked all checkbox and alter state of all other checkboxes accordingly
        if (this.state.checkboxAllCheckedDc) {
            checkValue = false
        }
        else {
            checkValue = true
        }
        this.checkAllEvent(checkValue);

        // update check all checkbox value
        this.setState({checkboxAllCheckedDc: checkValue});
        localStorage.setItem("checkboxAllCheckedDc", checkValue);
    };

    /**
     * Triggers when decision cards checkbox is checked or unchecked.
     * Update local storage and state according to the selection, so that other page elements like the selection bar
     * can get updated.
     *
     * @param changeEvent
     */
    handleCheckboxChangeDc = changeEvent => {
        const {name} = changeEvent.target;
        const checkedValue = this.state.decision_cards[name] === false;
        this.checkboxEvent(name, checkedValue);
    };

    /**
     * update all checkboxes according to the given value
     *
     * @param checkedValue  value of the checkbox
     */
    checkAllEvent(checkedValue) {
        let updatedDecisionCards = {};
        Object.keys(this.state.decision_cards).map((dc, i) => {
            this.updateFinaleOutputWhenCheckboxIsChecked(dc, i, checkedValue);
            updatedDecisionCards[dc] = (checkedValue);
        });
        this.updateDecisionCardsAndCheckedStorageWhenCheckboxIsChecked(updatedDecisionCards)
    }

    /**
     * update only given checkbox with the given value
     *
     * @param name          name of the checkbox
     * @param checkedValue  new value of the checkbox
     */
    checkboxEvent(name, checkedValue) {

        let updatedDecisionCards = {};
        Object.keys(this.state.decision_cards).map((v, i) => {
            if (v === name) {
                this.updateFinaleOutputWhenCheckboxIsChecked(name, i, checkedValue);
                updatedDecisionCards[name] = (checkedValue);
            }
            else {
                updatedDecisionCards[v] = this.state.decision_cards[v]
            }
        });

        this.updateDecisionCardsAndCheckedStorageWhenCheckboxIsChecked(updatedDecisionCards)

    };

    /**
     * Update decision cards and checked decision cards entries in local storage and state.
     * If nothing is selected reset state
     *
     * @param newDecisionCards  new decision card dictionary in the form {dc1: true,  dc2: false, dc3: true}
     */
    updateDecisionCardsAndCheckedStorageWhenCheckboxIsChecked(newDecisionCards) {
        this.setState({decision_cards: newDecisionCards});
        localStorage.setItem("decisionCards", JSON.stringify(newDecisionCards));

        let checkedItems = Object.keys(newDecisionCards).filter(k => newDecisionCards[k]);

        this.setState({checkedDc: checkedItems});
        localStorage.setItem("checkedDecisionCards", JSON.stringify(checkedItems));

        try {
            if (checkedItems.length === 0 || checkedItems.indexOf(this.state.selectedItemLower.label) < 0) {
                this.setState({selectedItemLower: []});
                this.setState({dcDataGridRows: []});
                //this.setState({issueTypesDataGridDc: []});
                this.setState({descriptionDc: ""});
                //this.setState({issueTypeEditorDataGridDc: null});
                //this.setState({dcDataGridColumns: []});

                //localStorage.setItem("issueTypesDataGridDC", JSON.stringify([]));
                localStorage.setItem("selectedDc", JSON.stringify([]));
                //localStorage.setItem("dcDataGridColumns", JSON.stringify([]));
                localStorage.setItem("dcDataGridRows", JSON.stringify([]));
                localStorage.setItem("descriptionDc", JSON.stringify(""));
            }
        }
        catch (e) {}
    }

    /**
     * Update final output according to new decision card and checked value.
     *
     * @param decisionCard  updated decision card name
     * @param index         index of updated decision card
     * @param checkedValue  new check value of updated decision card
     */
    updateFinaleOutputWhenCheckboxIsChecked(decisionCard, index, checkedValue) {
        // set in final output the checked state of the component
        const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        // get default parameters from api response
        let parameters;
        if (JSON.parse(localStorage.getItem("apiResponse"))) {
            parameters = JSON.parse(localStorage.getItem("apiResponse")).decisionCardsParameters[index].rows
        }
        else {
            parameters = []
        }
        const finalOutputDc = finalOutput.configuration["1"].decisionCards;
        // add checked state to final output
        finalOutputDc.map(v => {
            if (v.name === decisionCard) {
                v.enabled = checkedValue;
                // also add default parameters
                v.parameter = parameters;
            }
        });
        finalOutput.configuration["1"].decisionCards = finalOutputDc;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));
    }

    /**
     * update data grid rows when selection on decision cards is made. Store new value in local storage and state.
     *
     * @param fromRow   index of origin row
     * @param toRow     index of new row
     * @param updated   updated value
     */
    onDecisionCardsGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let gridRows = this.getGridRows(fromRow, toRow, updated);

        // add chance to current stats
        let currState = JSON.parse(localStorage.getItem("currentStatsDc"));
        currState.currParameters = gridRows;
        localStorage.setItem("currentStatsDc", JSON.stringify(currState));
        const currDcName = currState.currDcName;
        const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputDc = finalOutput.configuration["1"].decisionCards;
        finalOutputDc.map(v => {
            if (v.name === currDcName) {
                v.parameter = gridRows;

                // also update the overall parameters
                let selectedParameters = this.state.parametersLower;
                selectedParameters[v.name] = gridRows;
                this.setState({parametersLower: selectedParameters});
                localStorage.setItem("parametersLower", JSON.stringify(selectedParameters))
            }
        });
        finalOutput.configuration["1"].decisionCards = finalOutputDc;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        this.setState({dcDataGridRows: gridRows});
        localStorage.setItem("dcDataGridRows", JSON.stringify(gridRows));

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
        const rows = this.state.dcDataGridRows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        return rows
    }

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
        let checkedDc = Object.keys(this.state.decision_cards).filter(k => this.state.decision_cards[k]);

        let propsDecisionCards = "";
        if (this.props.settingsInfo.decisionCards) {
            propsDecisionCards = this.props.settingsInfo.decisionCards.map(this.createCheckboxDc);
        }
        let i;
        let selectedFormattedDcList = [];
        for (i = 0; i < checkedDc.length; i++) {
            selectedFormattedDcList.push({label: checkedDc[i], value: i-1})
        }
        return (
            <Grid container spacing={3} style={this.props.stylesGridLower} >
                <Grid item xs={12}>
                    <h3> Decision Cards Settings </h3>
                </Grid>
                <Grid item xs={2}>
                    <div style={this.props.stylesCheckbox}>
                        <h4>Decision Cards</h4>
                        {/*<CheckboxList
                                       onChange={(values) => this.onCheckboxChange('decision_cards', values)}
                                       values={decisionCards}
                                       input={"dc"}
                                   />*/}
                        {/*<input type="checkbox" onClick={this.handleAllChecked}  value="checkedall" /> */}
                        <Checkbox
                            label={"Check / Uncheck All"}
                            isSelected={this.state.checkboxAllCheckedDc}
                            onCheckboxChange={this.handleAllChecked}
                            key={"Check / Uncheck All"}
                        />
                        <ul>
                            {propsDecisionCards}
                        </ul>
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
                            onGridRowsUpdated={this.onDecisionCardsGridRowsUpdated}
                            enableCellSelect={true}
                            minHeight={400}
                        />
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default SettingsDecisionCards;