import React, {Suspense} from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import "./visual_components_layout.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompressArrowsAlt, faExpandArrowsAlt, faToolbox} from "@fortawesome/free-solid-svg-icons";
import { withRouter } from 'react-router-dom';
import {ToolBox, ToolBoxItem} from "./toolbox";
import axios from "axios";
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import "../../pages.css"
import Grid from "@material-ui/core/Grid";
import Loadable from "react-loadable";
//import { Container, Row, Col } from 'react-grid-system';
//import PreviewVisualComponents from "./preview_visual_components";
//import {Link, BrowserRouter as Router, Route, Switch} from "react-router-dom";
//import Home from "../home/home";
//import { Button } from 'reactstrap';
//import {IconContext} from "react-icons";
//import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
//import parse from 'html-react-parser';
// import { Responsive, WidthProvider } from "react-grid-layout";
//import PropTypes from "prop-types";

require('dotenv').config();

// const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ResponsiveReactGridLayout = WidthProvider(RGL);


class VisualComponentsLayout extends React.PureComponent {
    constructor(props) {
        super(props);

        let layout;
        let toolbox;
        let componentFilenameList;

        if (localStorage.getItem('SelectedLayout')){
            layout = JSON.parse(localStorage.getItem('SelectedLayout'));
            this.removeEmptyDictFromList(layout.lg)
        }
        else {layout = {lg: []};}
        if (localStorage.getItem('toolbox')){toolbox = JSON.parse(localStorage.getItem('toolbox'));}
        else {toolbox = {lg: []}}

        this.state = {
            currentBreakpoint: "lg",
            compactType: "vertical",
            mounted: false,
            layouts: layout,
            preview: false,
            toolbox: toolbox,
            importCount: 0
        };

        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.componentDidMount = this.componentDidMount(this);
        this.loadPreview = this.loadPreview.bind(this);
        this.backToArranging = this.backToArranging.bind(this);
        this.removeEmptyDictFromList = this.removeEmptyDictFromList.bind(this);
        this.onFinishClicked = this.onFinishClicked.bind(this);
        this.onPageChangeButtonClicked = this.onPageChangeButtonClicked.bind(this);
    }

    componentDidMount() {
        this.setState({mounted: true});
        if (localStorage.getItem("SelectedLayout")) {
            let storedObject = JSON.parse(localStorage.getItem("SelectedLayout"));
            this.removeEmptyDictFromList(storedObject.lg);
            this.setState({layouts: storedObject});
        }
        if (localStorage.getItem("toolbox")) {
            let toolboxObject = JSON.parse(localStorage.getItem("toolbox"));
            this.setState({toolbox: toolboxObject});
        }
        //this.getLocalGitRepoPath();
    }

    /**
     * remove all empty dictionaries form the given list.
     *
     * @param list {array} in the form [{...}, {}, {...}]
     */
    removeEmptyDictFromList(list) {
        let i;
        for (i = 0; i < list.length; i++) {
            if (Object.keys(list[i]).length === 0) {
                list.splice(i, 1);
            }
        }
    }

    /**
     * Generate HTML code used in render function. Generates all visual components boxes.
     *
     * @returns {*} HTML code
     */
    generateVisualComponents() {
        var VisComponentName = "";
        let components = {};
        if (localStorage.getItem("checkedComponents")) {
            const compList = JSON.parse(localStorage.getItem("checkedComponents"));
            let i;
            for (i = 0; i < compList.length; i++) {
                components[i] = compList[i];
            }
        }

        var componentFilenameList = this.props.componentFilenameList;

        return _.map(this.state.layouts[this.state.currentBreakpoint], l => {
            let compIndex = parseInt(l.i, 10);

            try {
                const currentFileName = componentFilenameList[compIndex];

                // fill final output with layout information
                const visCompName = JSON.parse(localStorage.getItem("apiResponse")).componentsParameters[compIndex].name;
                let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
                const finalOutputComps = finalOutput.configuration['1'].components;
                finalOutputComps.map(v => {
                    if (v.name === visCompName) {
                        v.position = {
                            width: parseInt(l.w, 10), height: parseInt(l.h, 10),
                            x: parseInt(l.x, 10), y: parseInt(l.y, 10)
                        }
                    }
                });
                finalOutput.configuration['1'].components = finalOutputComps;
                localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

                // create dynamic props from parameters
                const visCompParameters = finalOutput.configuration['1'].components[compIndex].parameter;
                let dynamicProps = {};
                visCompParameters.map(parameter => {
                    let value = '';
                    let dependent = false;
                    if (parameter.value) {
                        if (parameter.type === 'integer') {
                            value = parseInt(parameter.value, 10)
                        } else if (parameter.type === 'string') {
                            value = parameter.value;
                        } else if (parameter.type === 'boolean') {
                            value = (parameter.value.toLowerCase() === 'true')
                        } else if (parameter.type === 'dictionary') {
                            try {
                                value = JSON.parse(parameter.value)
                            }
                            catch {
                                value = {}
                            }
                        }
                        else if (parameter.type === "dynamic") {
                            if (parseInt(parameter.value, 10)) {
                                value = parseInt(parameter.value, 10)
                            }
                            else if (parameter.value.toLowerCase() === 'true') {
                                value = true
                            }
                            else if (parameter.value.toLowerCase() === 'false') {
                                value = false
                            }
                            else {
                                value = parameter.value
                            }
                        }
                        else if (parameter.type === "dependent") {
                            dependent = true;
                            let match = parameter.parameter.match(/(.*?)--(.*?)--(.*)/);
                            const parameterName = match[1];
                            if (parseInt(parameter.value, 10)) {
                                value = parseInt(parameter.value, 10)
                            }
                            else if (parameter.value.toLowerCase() === 'true') {
                                value = true
                            }
                            else if (parameter.value.toLowerCase() === 'false') {
                                value = false
                            }
                            else {
                                value = parameter.value
                            }
                            dynamicProps[parameterName] = value
                        }
                        else if (parameter.type === 'callback') {
                            value = parameter.value;
                        }
                    }
                    if (!dependent) {
                        dynamicProps[parameter.parameter] = value;
                    }
                });
                //let dynamicProps = {"width":1000, "breakpoint":5000, position:'bottom'};

                if (""+ currentFileName !== "undefined") {
                    //const CurrentComponent = React.lazy(() => import("../../gitclone/" + currentFileName));

                    const CurrentComponent = Loadable({
                        loader: () => import("./gitclone/" + currentFileName),
                        loading: Loading //() => <div>Loading...</div>
                    });

                    if (Object.keys(dynamicProps) !== 0) {

                        let toolboxButton;
                        if (this.state.preview) {
                            // if the current state is preview, do not show toolbox button
                            toolboxButton = <div/>
                        }
                        else {
                            toolboxButton = <div className="hide-button" onClick={this.onPutItem.bind(this, l)}>
                                &times;
                            </div>
                        }

                        let datagrid = { w: l.w, h: l.h, x: l.x, y: l.y };

                        return (
                            <div key={l.i} data-grid={{ w: l.w, h: l.h, x: l.x, y: l.y }}>
                                {toolboxButton}
                                <div>
                                    <ErrorBoundary>
                                        {/*<Suspense fallback={<div>Loading...</div>}>*/}
                                        <CurrentComponent {...dynamicProps}/>
                                        {/*</Suspense>*/}
                                    </ErrorBoundary>
                                </div>
                            </div>
                        );
                    }
                    else {
                        return (
                            <div key={l.i} data-grid={{ w: l.w, h: l.h, x: l.x, y: l.y }}>
                                <div className="hide-button" onClick={this.onPutItem.bind(this, l)}>
                                    &times;
                                </div>
                                <div>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <CurrentComponent/>
                                    </Suspense>
                                </div>
                            </div>
                        );
                    }
                }
                else {
                    return (<div><h1>nothing</h1></div>)
                }
            }
            catch (e) {
                return (<div><h1>nothing too</h1></div>)
            }

        });
    }

    onBreakpointChange = breakpoint => {
        this.setState(prevState => ({
            currentBreakpoint: breakpoint,
            toolbox: {
                ...prevState.toolbox,
                [breakpoint]:
                prevState.toolbox[breakpoint] ||
                prevState.toolbox[prevState.currentBreakpoint] ||
                []
            }
        }));
    };

    /**
     * Triggered if an item from toolbox is taken to the visual component arrangement section.
     * Update local storage entries of layouts and toolbox and the corresponding states.
     *
     * @param item visual component which has been selected
     */
    onTakeItem = item => {
        let toolbox = {...this.state.toolbox,
            [this.state.currentBreakpoint]:
                this.state.toolbox[this.state.currentBreakpoint].filter(({ i }) => i !== item.i)};
        let layouts = {...this.state.layouts,
            [this.state.currentBreakpoint]: [...this.state.layouts[this.state.currentBreakpoint], item]};

        this.setState({toolbox: toolbox, layouts: layouts});
        localStorage.setItem("toolbox", JSON.stringify(toolbox));
        localStorage.setItem("SelectedLayout", JSON.stringify(layouts));

        // fill final output with layout information
        const visCompName = JSON.parse(localStorage.getItem("apiResponse")).componentsParameters[parseInt(item.i, 10)].name;
        let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputComps = finalOutput.configuration["1"].components;
        finalOutputComps.map(v => {
            if (v.name === visCompName) {
                v.toolbox = false;
            }
        });
        finalOutput.configuration["1"].components = finalOutputComps;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));
    };

    /**
     * Triggered if an item from the visual component arrangement section is taken to the toolbox.
     * Update local storage entries of layouts and toolbox and the corresponding states.
     *
     * @param item visual component which has been selected
     */
    onPutItem = item => {
        let toolbox = {
            ...this.state.toolbox,
            [this.state.currentBreakpoint]: [
                ...(this.state.toolbox[this.state.currentBreakpoint] || []),
                item
            ]};
        let layouts = {
            ...this.state.layouts,
            [this.state.currentBreakpoint]: this.state.layouts[
                this.state.currentBreakpoint
                ].filter(({ i }) => i !== item.i)
                //].splice(parseInt(item.i, 10), 1, JSON.parse("{}"))
        };

        this.setState({toolbox: toolbox, layouts: layouts});
        localStorage.setItem("toolbox", JSON.stringify(toolbox));
        localStorage.setItem("SelectedLayout", JSON.stringify(layouts));

        // fill final output with layout information
        const visCompName = JSON.parse(localStorage.getItem("apiResponse")).componentsParameters[parseInt(item.i, 10)].name;
        let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
        const finalOutputComps = finalOutput.configuration["1"].components;
        finalOutputComps.map(v => {
            if (v.name === visCompName) {
                v.toolbox = true;
            }
        });
        finalOutput.configuration["1"].components = finalOutputComps;
        localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput));

    };

    onCompactTypeChange() {
        const { compactType: oldCompactType } = this.state;
        const compactType =
            oldCompactType === "horizontal"
                ? "vertical"
                : oldCompactType === "vertical"
                ? null
                : "horizontal";
        this.setState({ compactType });
    }

    /**
     * triggered when layout of visual components have been changed.
     * Update all according states and local storage entries.
     *
     * @param layout dictionary containing all visual components' layout
     *
     */
    onLayoutChange(layout) {
        let layouts = {lg: layout};
        layout.map(item => {
            if (item.i === "null") {
                layouts = this.state.layouts
            }
        });
        if (global.localStorage) {
            let jsonString = JSON.stringify(layouts);
            global.localStorage.setItem("SelectedLayout", jsonString);
        }
        else {
            let jsonString = JSON.stringify(layouts);
            localStorage.setItem("SelectedLayout", jsonString);
        }
        this.setState({layouts});
        this.props.onLayoutChange(layout);
    }

    /**
     * switch to preview mode
     */
    loadPreview() {
        this.setState({preview: true});
    }

    /**
     * switch to arrange components mode
     */
    backToArranging() {
        this.setState({preview: false});
    }

    /**
     * show popup with message
     *
     * @param title     title of popup
     * @param message   message of popup
     */
    showMessage = (title, message) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                {
                    label: 'Ok',
                }
            ]
        });
    };

    /**
     * send all settings and visual components informations back to backend
     */
    async onFinishClicked() {

        const json_input = JSON.parse(localStorage.getItem("fullComponentsInfo"));

        await axios.post(process.env.REACT_APP_SET_COMPONENTS,
            json_input,
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                //console.log(response.data);
                //alert('Settings have been saved!')
                if (response.data) {
                    this.showMessage("Success!", "All your settings have been saved!");
                }
                else {
                    this.showMessage("Failed to store Settings!", "Something went wrong while trying to save your settings. Please try again...");
                }
            });
    }

    /**
     * go to set components page
     */
    onPageChangeButtonClicked() {
        let path = `/set`;
        this.props.history.push(path);
    }

    render() {

        const layoutStyle = {
            backgroundColor: "#eee",
            borderStyle: "dashed",
            height: "auto",
            width: "auto",
            borderRadius: "10px"
    };

        const previewStyle = {
            height: "auto",
            width: "auto",
        };

        if (this.state.preview) {
                return (
                <div>
                    <div style={{ display: "flex" }}>
                        <button className="icon-button" onClick={this.backToArranging} style={{ marginLeft: "auto"}}>
                            <div className="font-awesome">
                                <FontAwesomeIcon icon={faCompressArrowsAlt}/>
                            </div>
                        </button>
                    </div>
                    <div style={previewStyle}>
                        <ResponsiveReactGridLayout className={"gridLayout"}
                            {...this.props}
                            layouts={this.state.layouts}
                            onLayoutChange={this.onLayoutChange}
                            isDraggable={false}
                            isResizable={false}
                        >
                            {this.generateVisualComponents()}
                        </ResponsiveReactGridLayout>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>Arrange Visual Components</h1>
                    <div>&nbsp;</div>
                    <Grid container spacing={1}>
                        <Grid item xs={6} style={{marginTop:"auto", marginBottom:"10px"}}>
                            <button className="configuration-button" onClick={this.onPageChangeButtonClicked} style={{align:"center"}} >Go to 'Set Visual Components' page</button>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid item xs={12}>
                                {this.props.infoButton}
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex" }}>
                                    <button
                                        className="configuration-button"
                                        onClick={this.loadPreview}
                                        style={{marginLeft: "auto", marginBottom: "10px"}}>
                                        <FontAwesomeIcon icon={faExpandArrowsAlt}/>
                                    </button>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex" }}>
                                    <button className="configuration-button" onClick={this.onFinishClicked} style={{marginLeft: "auto", marginBottom: "10px"}}>Finish</button>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <ToolBox
                        items={this.state.toolbox[this.state.currentBreakpoint] || []}
                        onTakeItem={this.onTakeItem}
                    />
                    <div className="responsive-grid-background" style={layoutStyle}>
                        <ResponsiveReactGridLayout
                            {...this.props}
                            layouts={this.state.layouts}
                            onLayoutChange={this.onLayoutChange}
                            // WidthProvider option
                            measureBeforeMount={true}
                            compactType={this.state.compactType}
                            preventCollision={!this.state.compactType}
                        >
                            {this.generateVisualComponents()}
                        </ResponsiveReactGridLayout>
                    </div>
                </div>
            );
        }
    }
}


VisualComponentsLayout.defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    //cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    cols: 12,
    verticalCompact: false,
};

export default withRouter(VisualComponentsLayout);

/**
 * Class taken and modified from https://web.dev/code-splitting-suspense/
 * last visited: 25.02.2020
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    render() {
        if (this.state.hasError) {
            // if statement taken from https://stackoverflow.com/questions/6160415/reload-an-html-page-just-once-using-javascript
            // last visited 25.02.2020
            if(window.location.href.substr(-2) !== "?r") {
                window.location = window.location.href + "?r";
            }
            return <p>Loading failed! Please reload.</p>;

        }

        return this.props.children;
    }
}

function Loading(props) {
    if (props.error) {
        return <div>Error! Please restart frontend server.</div>;
    } else {
        return <div>Loading...</div>;
    }
}