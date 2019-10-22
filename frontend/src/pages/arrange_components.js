import React from 'react'
import { Container, Row, Col } from 'react-grid-system';
import Main from '../webpage'

const {expanded} = require("@trendmicro/react-sidenav");

const ArrangeComponents = ({ children }) => (
    <div>
        <h1>Arrange Components</h1>
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
        <div>{children}</div>
    </div>
);

export default ArrangeComponents
