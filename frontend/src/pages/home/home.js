import React from 'react'
import "./home.css"
import axios from "axios";

require('dotenv').config();

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            status: ""
        }
    }

    async getComponentNames() {
        const response = await axios.get(process.env.REACT_APP_SETTINGS_INFO);
        this.setState({status: JSON.stringify(response.data)})
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

    render() {
        return (
            <div>
                <h1>Home</h1>
                <div className="comp">
                    <button
                        onClick={() => this.getComponentNames()}
                        className="button"
                    >
                        Names
                    </button>
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

export default Home;