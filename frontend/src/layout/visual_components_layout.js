import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class VisualComponentsLayout extends React.Component {
    constructor(props) {
        super(props);

        let layout;
        if (localStorage.getItem('SelectedLayout')){
             layout = JSON.parse(localStorage.getItem('SelectedLayout'));
        }
        else {
            // layout = props.initialLayout;
            layout = {lg: generateLayout()};
        }
        this.state = {
            currentBreakpoint: "lg",
            compactType: "vertical",
            mounted: false,
            //layouts: { lg: props.initialLayout }
            layouts: layout
        };

        this.onBreakpointChange = this.onBreakpointChange.bind(this);
        this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onNewLayout = this.onNewLayout.bind(this);
        this.componentDidMount = this.componentDidMount(this);
    }

    componentDidMount() {
        this.setState({mounted: true});
        // localStorage.clear();
        if(localStorage.getItem("SelectedLayout")) {
            let storedObject = {lg: JSON.parse(localStorage.getItem("SelectedLayout"))};
            this.setState({layouts: storedObject});
            //localStorage.clear()
        }
    }

    generateDOM() {
        return _.map(this.state.layouts.lg, function(l, i) {
            return (
                <div key={i} className={l.static ? "static" : ""}>
                    {l.static ? (
                        <span
                            className="text"
                            title="This item is static and cannot be removed or resized."
                        >
              Static - {i}
            </span>
                    ) : (
                        <span className="text">{i}</span>
                    )}
                </div>
            );
        });
    }

    onBreakpointChange(breakpoint) {
        this.setState({
            currentBreakpoint: breakpoint
        });
    }

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

    onLayoutChange(layout, layouts) {
        //localStorage.setItem( 'SelectedLayout', layout);
        //this.props.onLayoutChange(layout, layouts);
        //localStorage.setItem("SelectedLayout", JSON.stringify(layout))
        //this.setState({layouts: layout})
        //this.onLayoutChange(layout, layouts)
        /*const params = {
            layout: layout
        };
        history.push({pathname: '/arrange', search: '?' + Qs.stringify(params)});*/
        this.props.onLayoutChange(layout, layouts);
        let jsonString = JSON.stringify(layouts);
        localStorage.setItem("SelectedLayout", jsonString);
        this.setState({layouts: layouts})
    }

    onNewLayout() {
        //this.setState({layouts: { lg: generateLayout() }});
        this.setState({
            layouts: { lg: generateLayout() }
        });
    }

    render() {
        return (
            <div>
                <div>
                    Current Breakpoint: {this.state.currentBreakpoint} ({
                    this.props.cols[this.state.currentBreakpoint]
                }{" "}
                    columns)
                </div>
                <div>
                    Compaction type:{" "}
                    {_.capitalize(this.state.compactType) || "No Compaction"}
                </div>
                <button onClick={this.onNewLayout}>Generate New Layout</button>
                <button onClick={this.onCompactTypeChange}>
                    Change Compaction Type
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
    //initialLayout: generateLayout()
    /*initialLayout: function () {
        let initialLayout;

        if (localStorage.getItem('SelectedLayout')) {
            initialLayout = {lg: JSON.parse(localStorage.getItem("SelectedLayout"))};
        }
        else {
            initialLayout = {lg: generateLayout()};
        }
        return initialLayout;
    }*/
    //initialLayout: {lg: generateLayout()}
};

function generateLayout() {
    /*return _.map(_.range(0, 4), function(item, i) {
        var y = Math.ceil(Math.random() * 4) + 1;
        return {
            x: (_.random(0, 5) * 2) % 12,
            y: Math.floor(i / 6) * y,
            w: 2,
            h: y,
            i: i.toString(),
            static: Math.random() < 0.05
        };
    });*/
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
