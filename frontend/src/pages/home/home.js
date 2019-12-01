import React from 'react'
import "./home.css"
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {faClone, faCog, faTh} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withRouter} from "react-router";

require('dotenv').config();

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            status: ""
        };

        this.onDataSourceSettingsPageClicked = this.onDataSourceSettingsPageClicked.bind(this);
        this.onSetComponentsPageClicked = this.onSetComponentsPageClicked.bind(this);
        this.onArrangeComponentsPageClicked = this.onArrangeComponentsPageClicked.bind(this);
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

    onDataSourceSettingsPageClicked() {
        let path = `/settings`;
        this.props.history.push(path);
    }

    onSetComponentsPageClicked() {
        let path = `/set`;
        this.props.history.push(path);
    }

    onArrangeComponentsPageClicked() {
        let path = `/arrange`;
        this.props.history.push(path);
    }

    render() {
        const textStyle = {
            textAlign:"center",
            marginTop:"20px",
        };
        const gridItemStyle = {
            background:"lightblue",
            height:"150px",
            marginLeft:"auto",
            justify:"center",
            alignItems: "center",
        };

        return (
            <div style={{textAlign:"center"}}>
                <h1 style={{textAlign:"center"}}>Welcome to the Configuration System of the Post fossil cities project!</h1>
                <h4 style={{marginTop:"50px", marginBottom:"50px"}}>This website enables you to make configuration to the visual components which are shown during the game session.
                    Please follow the following guideline while configuring.
                </h4>
                <Grid container
                      spacing={3}
                      direction="row"
                      alignItems="center"
                      justify="center"
                >
                    <Grid item xs={4} style={gridItemStyle}>
                        <Grid item xs={6}>
                            <button onClick={this.onDataSourceSettingsPageClicked}><FontAwesomeIcon icon={faCog}/></button>
                        </Grid>
                        <Grid item xs={6}>
                            <div style={textStyle}>
                                First set the location of the used visual vomponents in the 'Data Source Settings' page.
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} style={gridItemStyle}>
                        <Grid item xs={6}>
                            <button onClick={this.onSetComponentsPageClicked}><FontAwesomeIcon icon={faClone}/></button>
                        </Grid>
                        <Grid item xs={6}>
                            <div style={textStyle}>
                                Then decide which components you want to use and modify their parameters in the 'Set Components' page.
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} style={gridItemStyle}>
                        <Grid item xs={6}>
                            <button onClick={this.onArrangeComponentsPageClicked}><FontAwesomeIcon icon={faTh}/></button>
                        </Grid>
                        <Grid item xs={6}>
                            <div style={textStyle}>
                                Lastly in the 'Arrange Components' page, arrange the choosen components on the screen and save your settings.
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

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

export default withRouter(Home);