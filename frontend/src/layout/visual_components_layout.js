import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./visual_components_layout.css"
import { Container, Row, Col } from 'react-grid-system';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompressArrowsAlt, faExpandArrowsAlt, faToolbox} from "@fortawesome/free-solid-svg-icons";
import PreviewVisualComponents from "./preview_visual_components";
import {Link, BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "../pages/home/home";
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import {IconContext} from "react-icons";
import {ToolBox, ToolBoxItem} from "../pages/arrange_components/toolbox";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


class VisualComponentsLayout extends React.Component {
    constructor(props) {
        super(props);

        let layout;
        let toolbox;

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
            toolbox: toolbox
        };

        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onNewLayout = this.onNewLayout.bind(this);
        this.componentDidMount = this.componentDidMount(this);
        this.loadPreview = this.loadPreview.bind(this);
        this.backToArranging = this.backToArranging.bind(this);
        this.removeEmptyDictFromList = this.removeEmptyDictFromList.bind(this);
    }

    componentDidMount() {
        this.setState({mounted: true});
        if (localStorage.getItem("SelectedLayout")) {
            let storedObject = {lg: JSON.parse(localStorage.getItem("SelectedLayout"))};
            this.removeEmptyDictFromList(storedObject.lg)
            this.setState({layouts: storedObject});
        }
        if (localStorage.getItem("toolbox")) {
            let toolboxObject = JSON.parse(localStorage.getItem("toolbox"));
            this.setState({toolbox: toolboxObject});
        }
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
     * generate HTML code used in render function. Generates all visual components boxes.
     *
     * @returns {*} HTML code
     */
    generateDOM() {
        return _.map(this.state.layouts[this.state.currentBreakpoint], l => {
            return (
                <div key={l.i} className={l.static ? "static" : "not-static"}>
                    <div className="hide-button" onClick={this.onPutItem.bind(this, l)}>
                        &times;
                    </div>
                    {l.static ? (
                        <span
                            className="text"
                            title="This item is static and cannot be removed or resized."
                        >
                            Static - {l.i}
                        </span>
                        ) :
                        (
                            <span className="box">{
                                <div>
                                    <h1>Component {l.i}</h1>
                                    <Container fluid style={{ lineHeight: '32px' }}>
                                        <Row >
                                            <Col >1 of 2</Col>
                                            <Col >2 of 2</Col>
                                        </Row>
                                        <br />
                                        <Row >
                                            <Col >1 of 3</Col>
                                            <Col >2 of 3</Col>
                                            <Col >3 of 3</Col>
                                        </Row>
                                    </Container>
                                </div>}
                            </span>
                        )}
                </div>
            );
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
     * Triggered if an item from visual component arrangement section is taken to the toolbox.
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
    };

    /**
     * Triggered if an item from the toolbox is taken to the visual component arrangement section.
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

    onNewLayout() {
        this.setState({
            layouts: { lg: generateLayout() }
        });
    }

    loadPreview() {
        this.setState({preview: true});
    }

    backToArranging() {
        this.setState({preview: false});
    }

    render() {
        if (this.state.preview) {
                return (
                <div>
                    <button className="button" onClick={this.backToArranging}>
                        <div className="font-awesome">
                            <FontAwesomeIcon icon={faCompressArrowsAlt}/>
                        </div>
                    </button>
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
                        {this.generateDOM()}
                    </ResponsiveReactGridLayout>
                </div>
            );
        } else {
            return (
                <div>
                    {/*<div>
                        Current Breakpoint: {this.state.currentBreakpoint} ({
                        this.props.cols[this.state.currentBreakpoint]
                    }{" "}
                        columns)
                    </div>
                    <div>
                        Compaction type:{" "}
                        {_.capitalize(this.state.compactType) || "No Compaction"}
                    </div>*/}
                    {/*<button onClick={this.onNewLayout}>Generate New Layout</button>*/}
                    <button className="button" onClick={this.loadPreview}><FontAwesomeIcon icon={faExpandArrowsAlt}/></button>

                    <ToolBox
                        items={this.state.toolbox[this.state.currentBreakpoint] || []}
                        onTakeItem={this.onTakeItem}
                    />

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
                        {this.generateDOM()}
                    </ResponsiveReactGridLayout>
                </div>
            );
        }
    }
}

VisualComponentsLayout.propTypes = {
    onLayoutChange: PropTypes.func.isRequired
};


VisualComponentsLayout.defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    verticalCompact: false
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
