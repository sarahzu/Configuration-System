import React from 'react'
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {faCog, faQuestion} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router";
import "./general_settings.css";
import "../../pages.css"

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
            pullSuccess: false,
            pullPressed: false,
            onLoading: true,
            hasError: false,
            submitted: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleGitRepoChange = this.handleGitRepoChange.bind(this);
        this.getGitRepoAddress = this.getGitRepoAddress.bind(this);
        this.isNewPullAvailable = this.isNewPullAvailable.bind(this);
        this.onPullButtonPressed = this.onPullButtonPressed.bind(this);
        this.submitGitRepo = this.submitGitRepo.bind(this);
        this.submitPull = this.submitPull.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.onFirstInfoButtonClicked = this.onFirstInfoButtonClicked.bind(this);
        this.onSecondInfoButtonClicked = this.onSecondInfoButtonClicked.bind(this);
        this.onGoToSetComponentsButtonClicked = this.onGoToSetComponentsButtonClicked.bind(this);
    }

    componentDidMount(){
        this.getGitRepoAddress();
        this.isNewPullAvailable();
        this.setState({pullSuccess:false})
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    handleChange(event) {
        this.setState({gitRepoAddress: event.target.value});
    }

    async handleGitRepoChange() {
        //event.preventDefault();
        this.setState({submitted: true});
        let json_req = {
            gitRepoAddress: this.state.gitRepoAddress
        };
        await axios.post(process.env.REACT_APP_GENERAL_SETTINGS_POST, json_req, {headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.data.success) {
                    //localStorage.setItem("gitRepoAddress", this.state.gitRepoAddress);
                    //alert('Git Repo was successfully updated');
                    this.message('Success!', 'Git Repo was successfully updated');
                    localStorage.clear();
                    localStorage.setItem("fullComponentsInfo", JSON.stringify({configuration: {'1':{components:[], decisionCards:[], gitRepository: this.state.gitRepoAddress}}}));

                }
                else {
                    this.message("Something went wrong!", "Git repo is not valid or you miss the needed credentials. Make sure that you are also connected to the internet.")
                    localStorage.clear();
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
                this.setState({onLoading: false})
            });
    }

    async onPullButtonPressed() {
        this.setState({pullPressed:true});
        await axios.get(process.env.REACT_APP_PULL_FROM_REMOTE)
            .then(resp => {
                this.setState({pullSuccess: resp.data.success});
                // if pull was successful, set pull state to false to disable pull button
                if (resp.data.success) {
                    this.setState({pull: false});
                    localStorage.clear()
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

    submitPull = () => {
        confirmAlert({
            title: 'Confirm before pull',
            message: 'Are you sure you want to pull from the current remote Git Repository? If you proceed, all your unsaved settings are going to be deleted.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.onPullButtonPressed()
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    submitGitRepo = () => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to change the Git Repository path? If you proceed, all your unsaved settings are going to be deleted.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.handleGitRepoChange()
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    message = (title, message) => {
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

    onFirstInfoButtonClicked() {
        this.showMessage("Info Box",
            "On this page you can decide the source of your visual components. " +
            "Please store your visual components in a git repository and enter the path to it " +
            "in the input field. Make sure to save your settings, so that you can start making your " +
            "configuration. ");
    }

    onSecondInfoButtonClicked() {
        this.showMessage("Info Box", "If a new pull is available from your already entered git repository, " +
            "the pull button will become enabled. If you wish to update your already entered Git Repo " +
            "to the newest version, click the pull button. However, your unsaved configurations so far will " +
            "get deleted if you do so, so be careful.");
    }

    onGoToSetComponentsButtonClicked() {
        let path = `/set`;
        this.props.history.push(path);
    }


    render()
        {
            let infoButton =
                <button className="configuration-button" onClick={this.onSecondInfoButtonClicked}><FontAwesomeIcon icon={faQuestion}/></button>;

            let content;
            if (this.state.onLoading && !this.state.pullPressed) {
                content = <div className="configuration-text">Loading...</div>;
            }
            else if (!this.state.onLoading && !this.state.pullPressed) {
                content = <div className="configuration-text">
                    {this.returnStringAccordingToBooleanValue(this.state.pull, "new pull available", "no new pull available")} &nbsp;
                    <button className="configuration-button" onClick={this.submitPull} disabled={!this.state.pull} >Pull</button> &nbsp;
                    {infoButton}
                </div>;
            }
            else if (!this.state.onLoading && this.state.pullPressed && !this.state.pullSuccess) {
                content = <div className="configuration-text">
                    {"pulling..."} &nbsp;
                    <button className="configuration-button" onClick={this.submitPull} disabled={true} >Pull</button> &nbsp;
                    {infoButton}
                </div>;
            }
            else if (!this.state.onLoading && this.state.pullPressed && this.state.pullSuccess) {
                content = <div className="configuration-text">
                    {"pulled successfully"} &nbsp;
                    <button className="configuration-button" onClick={this.submitPull} disabled={!this.state.pull} >Pull</button> &nbsp;
                    {infoButton}
                </div>;
            }

            if (this.state.hasError && this.state.submitted) {
                window.location.reload();
            }
            else {
                return (
                    <div>
                        <h1>Settings</h1>
                        <div>&nbsp;</div>
                        <button className="configuration-button" style={{marginBottom: "20px"}}
                                onClick={this.onGoToSetComponentsButtonClicked}>Go to 'Set Visual Components' page
                        </button>

                        <div className="settings-wrapper">
                            <Grid item xs={12} container spacing={3} className="settings-wrapper">
                                {/*<Grid item xs={12}>
                                <button className="configuration-button" onClick={this.onGoToSetComponentsButtonClicked}>Go to 'Set Visual Components' page</button>
                            </Grid>*/}
                                <Grid item xs={12}>
                                    <div className="configuration-text">
                                        Visual Components Git Repo: &nbsp;
                                        <input className="configuration-input" type="text"
                                               value={this.state.gitRepoAddress} name="gitRepoAddress"
                                               onChange={this.handleChange}
                                        /> &nbsp;
                                        <button className="configuration-button" onClick={this.submitGitRepo}>Save
                                        </button>
                                        &nbsp;
                                        <button className="configuration-button"
                                                onClick={this.onFirstInfoButtonClicked}><FontAwesomeIcon
                                            icon={faQuestion}/></button>
                                    </div>
                                    <div> &nbsp; </div>
                                    {content}
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                );
            }
        }
    }

export default withRouter(GeneralSettings);


{/*action="http://localhost:5000/settings-result" method="get"*/}
