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
                <h1>Welcome to the Configuration System of the Post fossil cities project!</h1>

            </div>
        );
    }

    /*
    <h3>
                    On this website you can decide which visual components (such as e.g. charts or tables)
                    should be visualized during the simulation game session of the post fossil cities project
                    and what information these components should process.
                </h3>
                <h4>On the settings page, select a git repository, which contains all visual components.</h4>
                <h4>On the set components page, select which components should be integrated and define it's parameters.</h4>
                <h4>On the arrange components page, decide on the size and position of the selected visual components.</h4>
                <h4>By clicking on the full screen button, you can get a preview of your current arrangement.</h4>
                <h4>If you are satisfied with your overall settings, click on finish and all your settings are going to be saved.</h4>
     */

    // render() {
    //     return (
    //         <div>
    //             <h1>Home</h1>
    //             <div className="comp">
    //                 <button
    //                     onClick={() => this.getComponentNames()}
    //                     className="button"
    //                 >
    //                     Names
    //                 </button>
    //                 <button
    //                     onClick={() => this.getResult()}
    //                     className="button"
    //                 >
    //                     SUBMIT
    //                 </button>
    //                 <div>{"state: " + this.state.status}</div>
    //             </div>
    //         </div>
    //     );
    // }

}

export default Home;