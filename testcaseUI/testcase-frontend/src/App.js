import React, {Suspense} from "react";
import _ from "lodash";
//import { Responsive, WidthProvider } from "react-grid-layout";
import RGL, { WidthProvider } from "react-grid-layout";
import "./App.css"
import axios from "axios";
import Loadable from "react-loadable";

import {useDispatch} from "react-redux";
import {updateCarbonEmissionArea, updateCarbonGauge, updateGenericRolls, updateGenericValue, updateGenericTimeseries, updateRollspecificGoals} from "./actions";


// const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ResponsiveReactGridLayout = WidthProvider(RGL);

require('dotenv').config();

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

class WebPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentBreakpoint: "lg",
      compactType: "vertical",
      componentFilenameList: null,
      outputJson: {},
      layouts: null,
      componentList: null,
      gitRepoAddress: "",
      gitClonedSuccessfully: null,
      hasError: false,
    };

    this.generateVisualComponents = this.generateVisualComponents.bind(this);
    this.getComponentsFilenames = this.getComponentsFilenames.bind(this);
    this.getOutputJson = this.getOutputJson.bind(this);
    this.getGitRepoAddress = this.getGitRepoAddress.bind(this);
    this.cloneGitRepo = this.cloneGitRepo.bind(this);
  }

  componentDidMount() {
    this.getComponentsFilenames();
    this.getOutputJson();
    this.getGitRepoAddress();
    this.cloneGitRepo()
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  /**
   * Generate HTML code used in render function. Generates all visual components boxes.
   *
   * @param componentsList {array}  list of all components that should be visualized in the form e.g.:
   *                                [{name: "comp name", parameter: [{parameter: "name", type: "string": value:"200"}, {...},...],
   *                                position:{width:40, height:30, x:0, y:0}, enabled:true, toolbox:false}]
   * @param componentFilenameList   {array} list of all js filenames of the components. Used for import and in the form ["name1", "name2"]
   * @param layouts                 layout information for the visual components in the form:
   *                                {lg: [{"w":4,"h":9,"x":0,"y":0,"i":"0","moved":false,"static":false},{...},...]}
   * @param currentBreakPoint       used breakpoint. Per default lg.
   *
   * @returns {*} HTML code
   */
  generateVisualComponents(componentsList, componentFilenameList, layouts, currentBreakPoint = this.state.currentBreakpoint) {
    try {
      return _.map(layouts[currentBreakPoint], l => {
        let compIndex = parseInt(l.i, 10);

        try {
          const currentFileName = componentFilenameList[compIndex];

          // create dynamic props from parameters
          const visCompParameters = componentsList[compIndex].parameter;
          const component = componentsList[compIndex];
          let dynamicProps = {};
          visCompParameters.map(parameter => {
            let value = '';
            let dependent = false;
            if (parameter.value) {
              if (parameter.type === 'integer') {
                value = parseInt(parameter.value, 10)
              } else if (parameter.type === 'string') {
                value = parameter.value;
              } else if (parameter.type === 'boolean') {
                value = (parameter.value.toLowerCase() === 'true')
              } else if (parameter.type === 'dictionary') {
                try {
                  value = JSON.parse(parameter.value)
                } catch {
                  value = {}
                }
              } else if (parameter.type === "dynamic") {
                if (parseInt(parameter.value, 10)) {
                  value = parseInt(parameter.value, 10)
                } else if (parameter.value.toLowerCase() === 'true') {
                  value = true
                } else if (parameter.value.toLowerCase() === 'false') {
                  value = false
                } else {
                  value = parameter.value
                }
              } else if (parameter.type === "dependent") {
                dependent = true;
                let match = parameter.parameter.match(/(.*?)--(.*?)--(.*)/);
                const parameterName = match[1];
                if (parseInt(parameter.value, 10)) {
                  value = parseInt(parameter.value, 10)
                } else if (parameter.value.toLowerCase() === 'true') {
                  value = true
                } else if (parameter.value.toLowerCase() === 'false') {
                  value = false
                } else {
                  value = parameter.value
                }
                dynamicProps[parameterName] = value
              } else if (parameter.type === 'callback') {
                value = parameter.value;
              }
            }
            if (!dependent) {
              dynamicProps[parameter.parameter] = value;
            }
          });

          if ("" + currentFileName !== "undefined" && component.enabled && !component.toolbox) {
            //const CurrentComponent = React.lazy(() => import("./components/" + currentFileName));
            const CurrentComponent = Loadable({
              loader: () => import("./components/" + currentFileName),
              loading: Loading //() => <div>Loading...</div>
            });

            if (Object.keys(dynamicProps).length !== 0) {
              return (
                  //<div key={l.i} className={"components"}>
                  <div key={l.i} data-grid={{ w: l.w, h: l.h, x: l.x, y: l.y }}>
                    <div>
                      <ErrorBoundary>
                      {/*<Suspense fallback={<div>Loading...</div>}>*/}
                        <CurrentComponent {...dynamicProps}/>
                      {/*</Suspense>*/}
                      </ErrorBoundary>
                    </div>
                  </div>
              );
            } else {
              return (
                  //<div key={l.i} className={"components"}>
                  <div key={l.i} data-grid={{ w: l.w, h: l.h, x: l.x, y: l.y }}>
                    <div>
                      <ErrorBoundary>
                      {/*<Suspense fallback={<div>Loading...</div>}>*/}
                        <CurrentComponent/>
                      {/*</Suspense>*/}
                      </ErrorBoundary>
                    </div>
                  </div>
              );
            }
          } else {
            return (<div><h1>nothing</h1></div>)
          }
        } catch (e) {
          return (<div><h1>nothing too</h1></div>)
        }

      });
    }
    catch (e) {
      // if statement taken from https://stackoverflow.com/questions/6160415/reload-an-html-page-just-once-using-javascript
      // last visited 25.02.2020
      if(window.location.href.substr(-2) !== "?r") {
        window.location = window.location.href + "?r";
      }
      //window.location.reload();
    }
  }


  /**
   * generate layout, which is used to generate the item position in the responsive grid, from the output json.
   *
   * @returns {{[p: string]: []}} the layout in the form: {lg: [{w: .., h: .., x: .., y: .., i: .., moved: .., static: ..}, ..]}
   */
  getLayout() {
    try {
      let layout = {[this.state.currentBreakpoint]: []};
      let components = this.state.outputJson.configuration['1'].components;
      let compIndex = 0;
      components.map(component => {
        const componentPosition = component.position;
        let layoutJson = {};
        layoutJson.w = componentPosition.width;
        layoutJson.h = componentPosition.height;
        layoutJson.x = componentPosition.x;
        layoutJson.y = componentPosition.y;
        layoutJson.i = compIndex.toString();
        compIndex++;
        layoutJson.moved = false;
        layoutJson.static = false;
        layout[this.state.currentBreakpoint].push(layoutJson)
      });
      return layout
    }
    catch (e) {
      return {[this.state.currentBreakpoint]:[]}
    }
  }

  /**
   * return a list with all filenames of the available components
   *
   * @returns {Promise<void>}
   */
  async getComponentsFilenames() {
    await axios.get(process.env.REACT_APP_FILENAMES)
        .then(response => {
          this.setState({componentFilenameList: response.data});
        })
  }

  async getOutputJson() {
    await axios.get(process.env.REACT_APP_OUTPUT_JSON)
        .then(response => {
          if (response.data) {
            this.setState({outputJson: response.data});
            this.setState({layouts: this.getLayout()});
            this.setState({componentList: this.getComponentsList()})
          }
        })
  }

  getComponentsList() {
    try {
      return this.state.outputJson.configuration['1'].components
    }
    catch (e) {
      return []
    }
  }

  async getGitRepoAddress() {
    await axios.get(process.env.REACT_APP_GET_GIT_REPO)
        .then(resp => {
          this.setState({gitRepoAddress: resp.data.repo});
        });
  }

  async cloneGitRepo() {
    await axios.get(process.env.REACT_APP_CLONE_GIT_REPO)
        .then(resp => {
          this.setState({gitClonedSuccessfully: resp.data.success});
        });
  }

  render() {
    const layoutStyle = {
      height: "auto",
      width: "auto",
    };


    const textStyle = {
      textAlign: "center"
    };

    if (this.state.layouts === null || this.state.componentFilenameList === null
        || this.state.componentList === null || this.state.gitClonedSuccessfully == null) {
      return <span>Loading data...</span>
    }
    else {
      if(this.state.hasError) {
        // if statement taken from https://stackoverflow.com/questions/6160415/reload-an-html-page-just-once-using-javascript
        // last visited 25.02.2020
        if(window.location.href.substr(-2) !== "?r") {
          window.location = window.location.href + "?r";
        }
        //window.location.reload();
      }
      else {
        return (
            <div>
              <div style={textStyle}>
                <h1>Post fossil cities Simulation Game</h1>
              </div>
              <div style={layoutStyle}>
                <ResponsiveReactGridLayout className={"gridLayout"}
                                           {...this.props}
                                           layouts={this.state.layouts}
                                           measureBeforeMount={true}
                                           isDraggable={false}
                                           isResizable={false}
                                           compactType={"vertical"}
                                           preventCollision={!"vertical"}
                >
                  {this.generateVisualComponents(this.state.componentList, this.state.componentFilenameList, this.state.layouts)}
                </ResponsiveReactGridLayout>
              </div>
            </div>
        );
      }
    }
  }
}

/**
 * Class taken and modified from https://web.dev/code-splitting-suspense/
 * last visited: 25.02.2020
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      // if statement taken from https://stackoverflow.com/questions/6160415/reload-an-html-page-just-once-using-javascript
      // last visited 25.02.2020
      if(window.location.href.substr(-2) !== "?r") {
        window.location = window.location.href + "?r";
      }
      else {
        return <p>Loading failed! Please reload.</p>;
      }
    }

    return this.props.children;
  }
}

function Loading(props) {
  if (props.error) {
    // if statement taken from https://stackoverflow.com/questions/6160415/reload-an-html-page-just-once-using-javascript
    // last visited 25.02.2020
    if(window.location.href.substr(-2) !== "?r") {
      window.location = window.location.href + "?r";
    }
    else {
      return <div>Something went wrong! Please restart frontend server.</div>;
    }
  } else {
    return <div>Loading...</div>;
  }
}

WebPage.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function() {},
  //cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  cols: 12,
  verticalCompact: false,
};

export default App;
