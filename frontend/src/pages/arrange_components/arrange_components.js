import React from 'react'

import "react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from 'react-grid-layout';
import VisualComponentsLayout from "./visual_components_layout";
import styled from "styled-components";


const ResponsiveGridLayout = WidthProvider(Responsive);

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: margin-left: ${props => (props.expanded ? 240 : 64)}px;;
    margin-top: 100px
`;

class ArrangeComponents extends React.Component {

    constructor(props, layouts) {
        super(props);
        this.state = [{layout: []}];
        this.onLayoutChange = this.onLayoutChange.bind(this);
    }

    onLayoutChange(layout) {
        this.setState({ layout: layout});
    }

    stringifyLayout() {
        return this.state.layout.map(function(l) {
            return (
                <div className="layoutItem" key={l.i}>
                    <b>{l.i}</b>: [{l.x}, {l.y}, {l.w}, {l.h}]
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                <Main>
                    <VisualComponentsLayout onLayoutChange={this.onLayoutChange} />
                </Main>
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
