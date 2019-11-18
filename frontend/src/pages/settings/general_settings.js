import React from 'react'
import axios from "axios";

require('dotenv').config();

class GeneralSettings extends React.Component {

    constructor(props) {
        super(props);

        let gitRepoAddress;
        // if (localStorage.getItem("gitRepoAddress")) {gitRepoAddress = localStorage.getItem("gitRepoAddress")}
        // else {gitRepoAddress = ''}

        this.state = {
            gitRepoAddress: "",
            pull: false,
            pullSuccess: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getGitRepoAddress = this.getGitRepoAddress.bind(this);
        this.isNewPullAvailable = this.isNewPullAvailable.bind(this);
        this.onPullButtonPressed = this.onPullButtonPressed.bind(this);
    }

    componentDidMount(){
        this.getGitRepoAddress();
        this.isNewPullAvailable();
        this.setState({pullSuccess:false})
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

    async isNewPullAvailable() {
        await axios.get(process.env.REACT_APP_PULL_AVAILABLE)
            .then(resp => {
                this.setState({pull: resp.data.pull});
            });
    }

    async onPullButtonPressed() {
        await axios.get(process.env.REACT_APP_PULL_FROM_REMOTE)
            .then(resp => {
                this.setState({pullSuccess: resp.data.success});
                // if pull was successful, set pull state to false to disable pull button
                if (resp.data.success) {
                    this.setState({pull: false})
                }
            });
    }

    returnStringAccordingToBooleanValue(isTrue, trueString, falseString) {
        if (isTrue) {
            return trueString
        }
        else {
            return falseString
        }
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
                    {this.returnStringAccordingToBooleanValue(this.state.pull, "new pull available", "no new pull available")}
                    <button onClick={this.onPullButtonPressed} disabled={!this.state.pull} >Pull</button>
                    {this.returnStringAccordingToBooleanValue(this.state.pullSuccess, "pulled successfully", "")}
                </div>
            );
        }
    }

export default GeneralSettings;


{/*action="http://localhost:5000/settings-result" method="get"*/}
