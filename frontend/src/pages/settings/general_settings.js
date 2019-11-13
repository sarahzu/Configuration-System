import React from 'react'
import axios from "axios";

require('dotenv').config();

class GeneralSettings extends React.Component {

    constructor(props) {
        super(props);

        let gitRepoAddress;
        // if (localStorage.getItem("gitRepoAddress")) {gitRepoAddress = localStorage.getItem("gitRepoAddress")}
        // else {gitRepoAddress = ''}

        this.state = {gitRepoAddress: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getGitRepoAddress = this.getGitRepoAddress.bind(this);
    }

    componentDidMount(){
        this.getGitRepoAddress()
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
                    //localStorage.setItem("gitRepoAddress", this.state.gitRepoAddress);
                }
                else {
                    console.alert("git repo is not valid")
                }
            });
    }

    async getGitRepoAddress() {
        await axios.get(process.env.REACT_APP_GET_GIT_REPO)
            .then(resp => {
                this.setState({gitRepoAddress: resp.data.repo});
            });
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
