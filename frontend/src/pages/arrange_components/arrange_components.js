import React from 'react'
import { Container, Row, Col } from 'react-grid-system';

import "react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import GridLayout from 'react-grid-layout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import VisualComponentsLayout from "../../layout/visual_components_layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

class ArrangeComponents extends React.Component {

    constructor(props, layouts) {
        super(props);
        let layout;
        /*if (localStorage.getItem('SelectedLayout')){
            layout = JSON.parse(localStorage.getItem('SelectedLayout'));
        }
        else {
            layout = layout;
        }*/
        this.state = [{layout: []}];
        this.onLayoutChange = this.onLayoutChange.bind(this);
    }

    onLayoutChange(layout) {
        this.setState({ layout: layout});
        //localStorage.setItem('SelectedLayout', layout)
        //const storedObject = JSON.parse(localStorage.getItem("SelectedLayout"));
        //this.setState({layout: storedObject});
    }

    doNothing() {}

    stringifyLayout() {
        return this.state.layout.map(function(l) {
            return (
                <div className="layoutItem" key={l.i}>
                    <b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]
                </div>
            );
        });
    }



    // render() {
        // layout is an array of objects, see the demo for more complete usage
        /*const layouts = {
            lg: [{i: 'a', x: 0, y: 0, w: 1, h: 2, static: true}],
            mg: [{i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4}],
            sm: [{i: 'c', x: 4, y: 0, w: 1, h: 2}]
        };
        return (
            <ResponsiveGridLayout className="layout" layouts={layouts}
                                  breakpoints={{lg: 1200, mg: 996, sm: 768}}
                                  cols={{lg: 12, mg: 10, sm: 6}}>
                <div key="1">1</div>
                <div key="2">2</div>
                <div key="3">3</div>
            </ResponsiveGridLayout>
        );*/
        /*const layout = [
            {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
            {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
            {i: 'c', x: 4, y: 0, w: 1, h: 2}
        ];

        return (
            <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
                <div key="a">{TestComponent.render}</div>
                <div key="b">b</div>
                <div key="c">c</div>
            </GridLayout>
        )*/
    // }

    /*render() {
        return (
            <div>
                <div className="layoutJSON">
                    Displayed as <code>[x, y, w, h]</code>:
                    <div className="columns">{this.stringifyLayout()}</div>
                </div>
                <div>
                    <VisualComponentsLayout onLayoutChange={this.onLayoutChange} />
                </div>
            </div>
        );
    }*/
    render() {
        return (
            <div>
                <VisualComponentsLayout onLayoutChange={this.onLayoutChange} />
            </div>
        );
    }
}


// const ArrangeComponents = ({ children }) => (
//     <div>
//         <h1>Arrange Components</h1>
//         <Container fluid style={{ lineHeight: '32px' }}>
//             <Row >
//                 <Col >1 of 2</Col>
//                 <Col >2 of 2</Col>
//             </Row>
//             <br />
//             <Row >
//                 <Col >1 of 3</Col>
//                 <Col >2 of 3</Col>
//                 <Col >3 of 3</Col>
//             </Row>
//         </Container>
//         <div>{children}</div>
//     </div>
// );

export default ArrangeComponents
