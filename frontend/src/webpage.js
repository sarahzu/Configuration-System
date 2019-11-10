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
import {faCog, faEnvelopeOpenText, faHome, faTh, faToolbox} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from "./images/logo_nfp73_en.png";
import history from './history';

const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;

export default class App extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            menuOpen: false,
        };
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
        let iconColor = "white";
        let iconSize = 30;
        let layout = this.state.layout;

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
                        <Link to="/set" className="menu-item" style={{ textDecoration: 'none' }}>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faCog}/><span>Set Components</span>
                                </div>
                            </IconContext.Provider>
                        </Link>
                        </div>
                        <div className="content-wrapper">
                        <Link to="/create" className="menu-item" style={{ textDecoration: 'none' }}>
                            <IconContext.Provider value={{className: "global-class-name" }}>
                                <div>
                                    <FontAwesomeIcon icon={faToolbox}/><span>Create Decision Cards</span>
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
                        </Switch>
                    </Main>
                </div>
            </Router>
        );
    }
}

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
