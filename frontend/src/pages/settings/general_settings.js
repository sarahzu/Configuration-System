import React from 'react'
import SetComponents from "../set_components/set_components";
import axios from "axios";
require('dotenv').config();

class GeneralSettings extends React.Component {

    constructor(props) {
        super(props);

        let gitRepoAddress;
        if (localStorage.getItem("gitRepoAddress")) {gitRepoAddress = localStorage.getItem("gitRepoAddress")}
        else {gitRepoAddress = ''}

        this.state = {gitRepoAddress: gitRepoAddress};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({gitRepoAddress: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        let json_req = {
            gitRepoAddress: this.state.gitRepoAddress
        };
        await axios.post(process.env.REACT_APP_GENERAL_SETTINGS_POST, json_req, {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.data.success) {
                    localStorage.setItem("gitRepoAddress", this.state.gitRepoAddress);
                }
                else {
                    console.assert("git repo is not valid")
                }
            });
        /*await axios.post(process.env.REACT_APP_GENERAL_SETTINGS_POST,
            {gitRepoAddress: this.state.gitRepoAddress},
            {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (!response.success) {
                    console.assert("git repo is not valid")
                }
                else {
                    localStorage.setItem("gitRepoAddress", this.state.gitRepoAddress);
                }
            });*/
    }

    render()
        {
            return (
                <div>
                    <h1>Settings</h1>
                    <form onSubmit={this.handleSubmit}>
                        Visual Components Git Repo:
                        <input type="text" value={this.state.gitRepoAddress} name="gitRepoAddress"
                               onChange={this.handleChange}/>
                        <input type="submit" value="Submit"/>
                    </form>
                </div>
            );
        }
    }

export default GeneralSettings;


{/*action="http://localhost:5000/settings-result" method="get"*/}
