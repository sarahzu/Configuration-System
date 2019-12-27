import React, {Suspense} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./visual_components_layout.css"
import { Container, Row, Col } from 'react-grid-system';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompressArrowsAlt, faExpandArrowsAlt, faToolbox} from "@fortawesome/free-solid-svg-icons";
import PreviewVisualComponents from "./preview_visual_components";
import {Link, BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "../home/home";
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import {IconContext} from "react-icons";
import {ToolBox, ToolBoxItem} from "./toolbox";
import axios from "axios";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import parse from 'html-react-parser';
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

require('dotenv').config();


const ResponsiveReactGridLayout = WidthProvider(Responsive);


class VisualComponentsLayout extends React.Component {
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
            //layouts: { lg: props.initialLayout }
            layouts: layout,
            preview: false,
            //toolbox: { lg: [] }
            toolbox: toolbox,
            //localGitPath: "",
        };

        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onNewLayout = this.onNewLayout.bind(this);
        this.componentDidMount = this.componentDidMount(this);
        this.loadPreview = this.loadPreview.bind(this);
        this.backToArranging = this.backToArranging.bind(this);
        this.removeEmptyDictFromList = this.removeEmptyDictFromList.bind(this);
        this.onFinishClicked = this.onFinishClicked.bind(this);
        this.onPageChangeButtonClicked = this.onPageChangeButtonClicked.bind(this);

        //this.getLocalGitRepoPath = this.getLocalGitRepoPath.bind(this);
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

    // /**
    //  * get the location of the local git repo
    //  *
    //  * @returns {Promise<void>}
    //  */
    // async getLocalGitRepoPath() {
    //     await axios.get(process.env.REACT_APP_LOCAL_GIT_REPO_PATH)
    //         .then(response => {
    //             this.setState({localGitPath: response.data});
    //         })
    // }

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

        //var componentFilenameList = this.state.componentFilenameList;
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
                    }
                    if (!dependent) {
                        dynamicProps[parameter.parameter] = value;
                    }
                });
                //let dynamicProps = {"width":1000, "breakpoint":5000, position:'bottom'};

                if (""+ currentFileName !== "undefined") {
                    const CurrentComponent = React.lazy(() => import("../../gitclone/" + currentFileName));

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

                        return (
                            <div key={l.i} className={"components"}>
                                {toolboxButton}
                                <div>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <CurrentComponent {...dynamicProps}/>
                                    </Suspense>
                                </div>
                            </div>
                        );
                    }
                    else {
                        return (
                            <div key={l.i} className={"components"}>
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
    //                        <div>{ ReactHtmlParser(html)[0] }</div>
    //                        <PieChart width={200} breakpoint={480} position={"bottom"}>Pie</PieChart>

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
     * @param item item which has been selected
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
     * @param item item which has been selected
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

    onNewLayout() {
        this.setState({
            layouts: { lg: generateLayout() }
        });
    }

    /**
     * triggered when layout of visual components have been changed.
     * Update all according states and local storage entries.
     *
     * @param layout Used for recursive call.
     * @param layouts dictionary containing all visual components layouts
     *
     */
    onLayoutChange(layout, layouts) {
        this.props.onLayoutChange(layout, layouts);
        let jsonString = JSON.stringify(layouts);
        localStorage.setItem("SelectedLayout", jsonString);
        this.setState({layouts: layouts})
    }

    loadPreview() {
        this.setState({preview: true});
    }

    backToArranging() {
        this.setState({preview: false});
    }

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
     * send all settings and component infos back to backend
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
        };

        const previewStyle = {
            height: "auto",
            width: "auto",
        };

        if (this.state.preview) {
                return (
                <div>
                    <div style={{ display: "flex" }}>
                        <button className="button" onClick={this.backToArranging} style={{ marginLeft: "auto"}}>
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
                    <h1>Arrange Components</h1>
                    {this.props.infoButton}
                    <button onClick={this.onPageChangeButtonClicked}>Go to 'Set Components' page</button>

                    <div style={{ display: "flex" }}>
                        <button
                            className="button"
                            onClick={this.loadPreview}
                            style={{ marginLeft: "auto"}}>
                            <FontAwesomeIcon icon={faExpandArrowsAlt}/>
                        </button>
                    </div>
                    <div style={{ display: "flex" }}>
                        <button className="button" onClick={this.onFinishClicked} style={{ marginLeft: "auto", marginTop:"20px" }}>Finish</button>
                    </div>

                    <ToolBox
                        items={this.state.toolbox[this.state.currentBreakpoint] || []}
                        onTakeItem={this.onTakeItem}
                    />
                    <div style={layoutStyle}>
                        <ResponsiveReactGridLayout
                            {...this.props}
                            layouts={this.state.layouts}
                            onBreakpointChange={this.onBreakpointChange}
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

VisualComponentsLayout.propTypes = {
    onLayoutChange: PropTypes.func.isRequired,
};

VisualComponentsLayout.defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    verticalCompact: false,
};

function generateLayout() {
    return _.map(_.range(0, 4), function(item, i) {
        var y = Math.ceil(4) + 1;
        return {
            x: (3 * 2) % 12,
            y: Math.floor(i / 6) * y,
            w: 2,
            h: y,
            i: i.toString(),
            static: false
        };
    });
}

export default withRouter(VisualComponentsLayout);
