import React from 'react'
import ReactDataGrid from "react-data-grid";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Checkbox from "./checkbox";

class SettingsDecisionCards extends React.Component {

    constructor(props) {
        super(props);
        let dcDataGridRows;
        let dcDataGridColumns;
        let decision_cards;
        let checkedDc;
        let issueTypesDataGridDc: [];
        let selectedItem;
        let issueTypeEditorDataGridDc;
        let descriptionDc;
        let currentStats;
        let parameters;

        if (localStorage.getItem("decisionCards")) {decision_cards = JSON.parse(localStorage.getItem("decisionCards"));}
        else if (this.props.settingsInfo.decisionCards) {
            decision_cards = this.props.settingsInfo.decisionCards.reduce(
                (options, option) => ({
                    ...options,
                    [option]: false
                }),
                {}
            )
        }
        else {
            decision_cards = []
        }

        if (localStorage.getItem("descriptionDc")) {descriptionDc = JSON.parse(localStorage.getItem("descriptionDc"))}
        else {descriptionDc = ""}

        if (localStorage.getItem("checkedDecisionCards")) {checkedDc = JSON.parse(localStorage.getItem("checkedDecisionCards"))}
        else {checkedDc = []}

        if (localStorage.getItem("selectedDc")) {selectedItem = JSON.parse(localStorage.getItem("selectedDc"))}
        else {selectedItem = []}

        if (localStorage.getItem("dcDataGridRows")) {dcDataGridRows = JSON.parse(localStorage.getItem("dcDataGridRows"))}
        else {dcDataGridRows = []}

        if (localStorage.getItem("dcDataGridColumns")) {dcDataGridColumns = JSON.parse(localStorage.getItem("dcDataGridColumns"))}
        else {dcDataGridColumns = []}

        let checkboxDecisionCards = {};
        if (props.settingsInfo.decisionCards) {
            this.props.settingsInfo.decisionCards.map((v, i) => {
                checkboxDecisionCards[v] = false
            });
        }

        this.state = {
            dcDataGridColumns:  dcDataGridColumns,
            decision_cards: decision_cards,
            checkedDc: checkedDc,
            dcDataGridRows:dcDataGridRows,
            issueTypesDataGridDc: [],
            selectedItem: selectedItem,
            descriptionDc: descriptionDc,
            issueTypeEditorDataGridDc: null,
        };

        this.createCheckboxDc = this.createCheckboxDc.bind(this);
        this.handleCheckboxChangeDc = this.handleCheckboxChangeDc.bind(this);

    }

    componentDidMount() {
        if (localStorage.getItem("dcDataGridColumns")) {this.setState({dcDataGridColumns: JSON.parse(localStorage.getItem("dcDataGridColumns"))});}
        if (localStorage.getItem("dcDataGridRows")) {this.setState({dcDataGridRows: JSON.parse(localStorage.getItem("dcDataGridRows"))});}
        if (localStorage.getItem("decisionCards")) {this.setState({decision_cards: JSON.parse(localStorage.getItem("decisionCards"))});}
        if (localStorage.getItem("checkedDecisionCards")) {this.setState({checkedDc: JSON.parse(localStorage.getItem("checkedDecisionCards"))});}
        if (localStorage.getItem("selectedDc")) {this.setState({selectedItemLower: JSON.parse(localStorage.getItem("selectedDc"))});}
        if (localStorage.getItem("descriptionDc")) {this.setState({descriptionDc: JSON.parse(localStorage.getItem("descriptionDc"))});}
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

        try {
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
        }
        catch (e) {

        }

    };

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
        // let currState = JSON.parse(localStorage.getItem("currentStats"));
        // currState.currParameters = gridRows;
        // localStorage.setItem("currentStats", JSON.stringify(currState));
        // const currCompName = currState.currComponentName;
        // const finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        // const finalOutputComps = finalOutput.configuration.components;
        // finalOutputComps.map(v => {
        //     if (v.name === currCompName) {
        //         v.parameter = gridRows;
        //
        //         // also update the overall parameters
        //         let selectedParameters = localStorage.getItem("parametersUpper");
        //         selectedParameters[v.name] = gridRows;
        //         localStorage.setItem("parametersUpper", JSON.stringify(selectedParameters))
        //     }
        // });
        // finalOutput.configuration.components = finalOutputComps;
        // localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

        this.setState({dcDataGridColumns: gridRows});
        localStorage.setItem("dcDataGridColumns", JSON.stringify(gridRows));

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
                                   {propsDecisionCards}
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
                        />
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default SettingsDecisionCards;