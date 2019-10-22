import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import axios from 'axios';
import { Container, Row, Col } from 'react-grid-system';

require('dotenv').config();


class Grid extends React.Component {

    render() {
        return (
            <Container fluid style={{ lineHeight: '32px' }}>
                <Row debug>
                    <Col debug>1 of 2</Col>
                    <Col debug>2 of 2</Col>
                </Row>
                <br />
                <Row debug>
                    <Col debug>1 of 3</Col>
                    <Col debug>2 of 3</Col>
                    <Col debug>3 of 3</Col>
                </Row>
            </Container>
        )
    }
}

class Configurator extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                startDate: new Date(),
                endDate: new Date(),
                status: "none yet",
            };
    }

    async getResult() {

        //send to server
        let json_req = {
            "latitude": 37.386051,
            "longitude": -122.083855,
            "start_date": "2019-03-01",
            "end_date": "2019-03-03"
        };
        const response = await axios.post(process.env.REACT_APP_BACKEND_API, json_req, {headers: {'Content-Type': 'application/json'}});

        this.setState({
            status: JSON.stringify(response.data)
        });
    }


    render()
    {
        return (
            <div>
                <h1>Test</h1>
                <div className="comp">
                    <button
                        onClick={() => this.getResult()}
                        className="button"
                    >
                        SUBMIT
                    </button>
                    <div>{"state: " + this.state.status}</div>
                </div>
            </div>
        );
    }
}