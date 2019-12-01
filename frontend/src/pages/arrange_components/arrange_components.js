import React from 'react'

import "react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";
import { Responsive, WidthProvider } from 'react-grid-layout';
import VisualComponentsLayout from "./visual_components_layout";
import styled from "styled-components";
import axios from "axios";
import {confirmAlert} from "react-confirm-alert";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestion} from "@fortawesome/free-solid-svg-icons";
require('dotenv').config();

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
        this.state = {
            layout: [],
            componentFilenameList: [],
        };
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.getComponentsFilenames = this.getComponentsFilenames.bind(this);
        this.onInfoButtonClicked = this.onInfoButtonClicked.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }

    componentDidMount() {
        this.getComponentsFilenames();
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

    /**
     * return a list with all filenames of the available components
     *
     * @returns {Promise<void>}
     */
    async getComponentsFilenames() {
        await axios.get(process.env.REACT_APP_FILENAMES)
            .then(response => {
                this.setState({componentFilenameList: response.data});
                //localStorage.setItem("componentFilenameList", JSON.stringify(response.data))
            })
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

    onInfoButtonClicked() {
        this.showMessage("Info Box",
            "On this page, you can decide how you want to arrange your selected components. You can shift " +
            "them around by drag and drop movements. If you do not want to include them in the screen for now, " +
            "click on the cross on the upper left of the component or move it outside of the movement space " +
            "(indicated with dotted lines). The component will get add to the toolbox which stores all unused " +
            "components. You can include them on your screen again by clicking on them in the toolbox. " +
            "If you would like to check how your arrangement looks on the final output screen, click the " +
            "preview button on the upper right side of the screen. If you are satisfied with your arrangement, " +
            "click on the finish button and all your configurations are going to be stored.");
    }


    render() {
        const compFilenameList = this.state.componentFilenameList;

        if (compFilenameList.length === 0) {
            return <span>Loading data...</span>
        }

        const infoButton = <div style={{ display: "flex" }}>
            <button onClick={this.onInfoButtonClicked} style={{ marginLeft: "auto" }}><FontAwesomeIcon icon={faQuestion}/></button>
        </div>
        return (
            <div>
                <VisualComponentsLayout
                    onLayoutChange={this.onLayoutChange}
                    componentFilenameList={this.state.componentFilenameList}
                    infoButton={infoButton}
                />
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
