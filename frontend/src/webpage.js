import React from "react";
import Home from "./pages/home/home";
import SetComponents from "./pages/set_components/set_components";
import CreateDecisionCard from "./pages/create_decision_cards/create_decision_card";
import ArrangeComponents from "./pages/arrange_components/arrange_components";
import {
    BrowserRouter as Router,
    Route,
    Link, Switch
} from "react-router-dom";
import "./webpage.css"
import styled from 'styled-components';
import Menu from 'react-burger-menu/lib/menus/slide'
import {FaHome, FaCog, FaToolbox, FaTh} from "react-icons/fa";
import { IconContext } from "react-icons";
import {icon, text} from "@fortawesome/fontawesome-svg-core";
import {faClone, faCog, faEnvelopeOpenText, faHome, faTh, faToolbox} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from "./images/logo_nfp73_en.png";
import GeneralSettings from "./pages/settings/general_settings";
import {useSelector, useDispatch} from "react-redux";
import {updateCarbonEmissionArea, updateCarbonGauge, updateGenericRolls, updateGenericValue, updateGenericTimeseries, updateRollspecificGoals} from "./actions";
// import history from './history';
//import './gitclone/src/actions/index'
// Import Redux

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;

/**
 * Fill redux storage with dummy data by using the predefined actions. Function content partially taken from Patrick Zurmühle's project: https://github.com/kavengo/post_fossil_cities_visualizations
 *
 * This function is temporarily implemented. When the storage is filled with data form the AUM system
 * this function is no longer needed
 */
function AddActionsToRedux () {
    const dispatch = useDispatch();

    /*
    Generic Rolls
     */
    dispatch(updateGenericRolls({
        id: "generic_rolls_1",
        min: 0,
        max: 25,
        data: {
            politics: 15,
            energy: 5,
            investor: 8,
            population: 13,
            planer: 16,
            niche: 10,
            industry: 4,
        },
    }));

    /*
    Generic Value
     */
    dispatch(updateGenericValue({
        id:             "test_1",
        value:          300.4
    }));

    /*
    Generic Timeseries
     */
    dispatch(updateGenericTimeseries({
        id:         "generic_timeseries_1",
        min:        Math.round(0),
        max:        Math.round(200),
        today:      Date.parse("01 Jan 2030"),
        data:       [{
            label:  "Personenwagen",
            values: generateData( 105, 0.6, 81),
        }, {
            label:  "Bus und Tram",
            values: generateData(11, 0.1, 81),
        }, {
            label:  "Zug",
            values: generateData(25, 0.3, 81),
        }, {
            label:  "Fuss und Velo",
            values: generateData(8, 0.1, 81),
        }]
    }));

    /*
    Role-specific Goals
     */
    dispatch(updateRollspecificGoals({
        id:                     "rollspecific_goals_1",
        data:                   {
            politics:           { value: 0.30, speed: 1 },
            population:         { value: 0.80, speed: 3 },
            investor:           { value: 0.50, speed: 5 },
            energy:             { value: 0.90, speed: 4 },
            planer:             { value: 0.40, speed: 2 },
            niche:              { value: 0.60, speed: 2 },
            industry:           { value: 0.75, speed: 1 },
        },
    }));

    /*
    Carbon Budget
    Carbon Emission Areas
     */
    dispatch(updateCarbonEmissionArea({
            id:                    "carbon_budget_1_carbon_area",
            today:                  Date.parse("01 Jan 2030"),
            min:                    0,
            max:                    100,
            timeseries:             [
                {
                    label:          "Haushalte",
                    values:         generateData(20, 0.03, 81),
                    capturing:      false,
                }, {
                    label:          "Transport",
                    values:         generateData(12, 0.01, 81),
                    capturing:      false,
                }, {
                    label:          "Industrie",
                    values:         generateData(7, -0.05, 81),
                    capturing:      false,
                }, {
                    label:          "Energy",
                    values:         generateData(5, 0.05, 81),
                    capturing:      false,
                }, {
                    label:          "CO2 Rückgewinnung",
                    values:         generateData(0,0, 81),
                    capturing:      true
                }]
        }));

        /*
        Carbon Budget
        Carbon Gauge
         */
        dispatch(updateCarbonGauge({
            id:                     "carbon_budget_1_carbon_gauge",
            cumulated_emissions:    0,
            critical_emissions:     1500,
            years_left:             10,
            year_speed:             5,
        }));
}

/**
 * function taken from Patrick Zurmühle's project (DataGenerator.js): https://github.com/kavengo/post_fossil_cities_visualizations
 *
 * generateData
 * ------------
 *
 * Generate Timeseries in a yearly basis
 *
 * @param start     Float       Start value
 * @param growth    Float       Linear growth value
 * @param n         Integer     Number of datapoints
 *
 *
 * @returns {Array}
 */
function generateData(start, growth, n) {

    let values = [];

    let timeseries = [];

    let i;
    for (i = 2020; i < (2020 + n); i++) {

        values.push(start);
        start += growth;

        var data_point = {
            date: Date.parse('01 Jan ' + i),
            value: start
        };

        timeseries.push(data_point);

        values.push(start);
        start += growth;
    }

    return timeseries

}

function App () {
    try {
        // fill redux storage with dummy data
        AddActionsToRedux();
    }
    catch (e) {}
    return(<WebPage/>);
}

export default App;

class WebPage extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            menuOpen: false,
        };
    }

    componentDidMount() {
        // create a local storage for the final output, layout and toolbox if none already exists
        if (!localStorage.getItem("fullComponentsInfo")) {
            localStorage.setItem("fullComponentsInfo", JSON.stringify({configuration:{components:[], decisionCards:[]}}))
        }
        if (!localStorage.getItem("SelectedLayout")) {
            localStorage.setItem("SelectedLayout", JSON.stringify({lg: []}));
        }
        if (!localStorage.getItem("toolbox")) {
            localStorage.setItem("toolbox", JSON.stringify({lg: []}));
        }
    }

    handleStateChange (state) {
        this.setState({menuOpen: state.isOpen})
    }

    toggleMenu () {
        this.setState(state => ({menuOpen: !state.menuOpen}))
    }

    closeMenu () {
        this.setState({menuOpen: false})
    }

    openMenu () {
        this.setState({menuOpen: true})
    }

    isMenuOpen() {
        return this.state.isOpen;
    };

    showSettings (event) {
        event.preventDefault();
    }

    render () {

        return (
            <Router>
                <div>
                    <Menu id="burger-menu" pageWrapId={ "page-wrap" } width={ 340 } isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}>
                        <img src={Logo} alt="website logo" style={{className:"img", align:"center", height:49, marginBottom:50}}/>
                        <div id="home" className="content-wrapper">
                        <Link id="home-link" to="/" className="menu-item" style={{ textDecoration: 'none' } }>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faHome}/><span>Home</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
                        <div id="settings" className="content-wrapper">
                            <Link id="settings-link" to="/settings" className="menu-item" style={{ textDecoration: 'none' }}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <div>
                                        <FontAwesomeIcon icon={faCog}/><span>Data Source Settings</span>
                                    </div>
                                </IconContext.Provider>
                            </Link>
                        </div>
                        <div id="set" className="content-wrapper">
                        <Link id="set-comp-link" to="/set" className="menu-item" style={{ textDecoration: 'none' }}>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faClone}/><span>Set Components</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
                        <div id="arrange" className="content-wrapper">
                        <Link id="arrange-comp-link" to="/arrange" className="menu-item" style={{ textDecoration: 'none' }}>
                            <IconContext.Provider value={{ className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faTh}/><span>Arrange Components</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
                    </Menu>
                    <Main>
                        <Switch>
                            <Route path="/" exact component={props => <Home/>}/>
                            <Route exact path="/set" render={props => (
                                <SetComponents {...props}/>
                            )}/>
                            <Route path="/create" exact component={props => <CreateDecisionCard/>}/>
                            <Route exact path="/arrange" render={props => (
                                <ArrangeComponents {...props}/>
                            )}/>
                            <Route exact path="/settings" render={props => (
                                <GeneralSettings {...props}/>
                            )}/>
                        </Switch>
                    </Main>
                </div>
            </Router>
        );
    }
}

