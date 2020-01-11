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
import history from './history';
import GeneralSettings from "./pages/settings/general_settings";

//import './gitclone/src/actions/index'
// Import Redux
import {useSelector, useDispatch} from "react-redux";
import {updateCarbonEmissionArea, updateCarbonGauge, updateGenericRolls, updateGenericValue, updateGenericTimeseries, updateRollspecificGoals} from "./actions";

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;

/**
 * Fill redux storage with dummy data by using the predefined actions.
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
 * function taken from Patrick Zurmühle's project (DataGenerator.js)
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
        //localStorage.clear()
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
                    <Menu pageWrapId={ "page-wrap" } width={ 340 } isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}>
                        <img src={Logo} alt="website logo" style={{className:"img", align:"center", height:49, marginBottom:50}}/>
                        <div className="content-wrapper">
                        <Link to="/" className="menu-item" style={{ textDecoration: 'none' } }>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faHome}/><span>Home</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
                        <div className="content-wrapper">
                            <Link to="/settings" className="menu-item" style={{ textDecoration: 'none' }}>
                                <IconContext.Provider value={{ className: "global-class-name" }}>
                                    <div>
                                        <FontAwesomeIcon icon={faCog}/><span>Data Source Settings</span>
                                    </div>
                                </IconContext.Provider>
                            </Link>
                        </div>
                        <div className="content-wrapper">
                        <Link to="/set" className="menu-item" style={{ textDecoration: 'none' }}>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faClone}/><span>Set Components</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
                        <div className="content-wrapper">
                        <Link to="/arrange" className="menu-item" style={{ textDecoration: 'none' }}>
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

/*
<div className="content-wrapper">
                        <Link to="/create" className="menu-item" style={{ textDecoration: 'none' }}>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faToolbox}/><span>Create Decision Cards</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
 */

/*export default class App extends PureComponent {
    state = {
        selected: 'home',
        expanded: false
    };

    onSelect = (selected) => {
        this.setState({ selected: selected });
    };
    onToggle = (expanded) => {
        this.setState({ expanded: expanded });
    };

    pageTitle = {
        'home': ['Home'],
        'set-components': ['Set Components'],
        'create-dc': ['Create Decision Card'],
        'arrange-components': ['Arrange Components'],
        //'settings/network': ['Settings', 'Network']
    };

    items = [
        { to: '/', label: 'Home' },
        { to: '/set', label: 'Set Components' },
        { to: '/create', label: 'Create Decision Card' },
        { to: '/arrange', label: 'Arrange Components' },
    ];

    renderBreadcrumbs() {
        const { selected } = this.state;
        const list = ensureArray(this.pageTitle[selected]);

        return (
            <Breadcrumbs>
                {list.map((item, index) => (
                    <Breadcrumbs.Item
                        active={index === list.length - 1}
                        key={`${selected}_${index}`}
                    >
                        {item}
                    </Breadcrumbs.Item>
                ))}
            </Breadcrumbs>
        );
    }

    navigate = (pathname) => () => {
        this.setState({ selected: pathname });
    };*/
//}
//export default function App() {
/*    render() {
        const { expanded, selected } = this.state;*/

  //      return (
    {/*    <Router>*/}
    {/*        <Route render={({location, history}) => (*/}
    {/*            <React.Fragment>*/}
    {/*                <SideNav*/}
    {/*                    onSelect={(selected) => {*/}
    {/*                        const to = '/' + selected;*/}
    {/*                        if (location.pathname !== to) {*/}
    {/*                            history.push(to);*/}
    {/*                        }*/}
    {/*                    }}*/}
    {/*                >*/}
    {/*                    <SideNav.Toggle/>*/}
    {/*                    <SideNav.Nav defaultSelected="home">*/}
    {/*                        <NavItem eventKey="home">*/}
    {/*                            <NavIcon>*/}
    {/*                                <i className="fa fa-fw fa-home" style={{fontSize: '1.75em'}}/>*/}
    {/*                            </NavIcon>*/}
    {/*                            <NavText>*/}
    {/*                                Home*/}
    {/*                            </NavText>*/}
    {/*                        </NavItem>*/}
    {/*                        <NavItem eventKey="set">*/}
    {/*                            <NavIcon>*/}
    {/*                                <i className="fa fa-fw fa-set" style={{fontSize: '1.75em'}}/>*/}
    {/*                            </NavIcon>*/}
    {/*                            <NavText>*/}
    {/*                                Set Components*/}
    {/*                            </NavText>*/}
    {/*                        </NavItem>*/}
    {/*                        <NavItem eventKey="create">*/}
    {/*                            <NavIcon>*/}
    {/*                                <i className="fa fa-fw fa-create" style={{fontSize: '1.75em'}}/>*/}
    {/*                            </NavIcon>*/}
    {/*                            <NavText>*/}
    {/*                                Create Decision Cards*/}
    {/*                            </NavText>*/}
    {/*                        </NavItem>*/}
    {/*                        <NavItem eventKey="arrange">*/}
    {/*                            <NavIcon>*/}
    {/*                                <i className="fa fa-fw fa-arrange" style={{fontSize: '1.75em'}}/>*/}
    {/*                            </NavIcon>*/}
    {/*                            <NavText>*/}
    {/*                                Arrange Components*/}
    {/*                            </NavText>*/}
    {/*                        </NavItem>*/}
    {/*                    </SideNav.Nav>*/}
    {/*                </SideNav>*/}
    {/*                <main>*/}
    {/*                    <Route path="/" exact component={props => <Home/>}/>*/}
    {/*                    <Route path="/set" exact component={props => <SetComponents/>}/>*/}
    {/*                    <Route path="/create" exact component={props => <CreateDecisionCard/>}/>*/}
    {/*                    <Route path="/arrange" exact component={props => <ArrangeComponents/>}/>*/}
    {/*                </main>*/}
    {/*            </React.Fragment>*/}

    {/*        )}*/}
    {/*        />*/}
    {/*    </Router>*/}
    {/*);*/}

{/*        return (
            <div>
                <Router>
                <SideNav onSelect={this.onSelect} onToggle={this.onToggle}>
                    <SideNav.Toggle />
                    <SideNav.Nav selected={selected}>
                        <NavItem eventKey="home">
                            <NavIcon>
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Home">
                                Home
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="set-components">
                            <NavIcon>
                                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Set Components">
                                Set Components
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="create-dc">
                            <NavIcon>
                                <i className="fa fa-fw fa-list-alt" style={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Create Decision Card">
                                Create Decision Card
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="arrange-components">
                            <NavIcon>
                                <i className="fa fa-fw fa-cogs" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                            </NavIcon>
                            <NavText style={{ paddingRight: 32 }} title="Arrange Components">
                                Arrange Components
                            </NavText>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
                <Main expanded={expanded}>
                    {React.version}
                    {/!*{this.renderBreadcrumbs()}*!/}
                    {/!*<Breadcrumbs>
                            {this.items.map(({ to, label }) => (
                                <Link key={to} to={to}>
                                    {/!*{label}*!/}
                                {/!*</Link>
                            ))}
                        </Breadcrumbs>*!/}
                    <Route path="/" exact component={props => <Home/>}/>
                    <Route path="/set" exact component={props => <SetComponents/>}/>
                    <Route path="/create" exact component={props => <CreateDecisionCard/>}/>
                    <Route path="/arrange" exact component={props => <ArrangeComponents/>}/>
                </Main>
                </Router>
            </div>
        );
    }*/}
