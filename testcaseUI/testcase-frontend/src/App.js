import React, {Suspense} from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./App.css"
import axios from "axios";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

require('dotenv').config();


class App extends React.Component {

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
            }
            else if (parameter.type === "dynamic") {
              if (parseInt(parameter.value, 10)) {
                value = parseInt(parameter.value, 10)
              }
              else if (parameter.value.toLowerCase() === 'true') {
                value = true
              }
              else if (parameter.value.toLowerCase() === 'false') {
                value = false
              }
              else {
                value = parameter.value
              }
            }
            else if (parameter.type === "dependent") {
              dependent = true;
              let match = parameter.parameter.match(/(.*?)--(.*?)--(.*)/);
              const parameterName = match[1];
              if (parseInt(parameter.value, 10)) {
                value = parseInt(parameter.value, 10)
              }
              else if (parameter.value.toLowerCase() === 'true') {
                value = true
              }
              else if (parameter.value.toLowerCase() === 'false') {
                value = false
              }
              else {
                value = parameter.value
              }
              dynamicProps[parameterName] = value
            }
          }
          if (!dependent) {
            dynamicProps[parameter.parameter] = value;
          }
        });

        if (""+ currentFileName !== "undefined" && component.enabled && !component.toolbox) {
          const CurrentComponent = React.lazy(() => import("./components/" + currentFileName));

          if (Object.keys(dynamicProps).length !== 0) {
            return (
                <div key={l.i} className={"components"}>
                  <div>
                    <Suspense fallback={<div>Loading...</div>}>
                      <CurrentComponent {...dynamicProps}/>
                    </Suspense>
                  </div>
                </div>
            );
          }
          else {
            return (
                <div key={l.i} className={"components"}>
                  <div>
                    <Suspense fallback={<div>Loading...</div>}>
                      <CurrentComponent/>
                    </Suspense>
                  </div>
                </div>
            );
          }
        }
        else {
          return (<div><h1>nothing</h1></div>)
        }
      }
      catch (e) {
        return (<div><h1>nothing too</h1></div>)
      }

    });
  }


  /**
   * generate layout, which is used to generate the item position in the responsive grid, from the output json.
   *
   * @returns {{[p: string]: []}} the layout in the form: {lg: [{w: .., h: .., x: .., y: .., i: .., moved: .., static: ..}, ..]}
   */
  getLayout() {
    try {
      let layout = {[this.state.currentBreakpoint]: []};
      let components = this.state.outputJson.configuration.components;
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
      })
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
      return this.state.outputJson.configuration.components
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
    const style = {
      height: "auto",
      width: "auto",
    };

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
      return (
          <div>
            <div style={style}>
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
                >
                  {this.generateVisualComponents(this.state.componentList, this.state.componentFilenameList, this.state.layouts)}
                </ResponsiveReactGridLayout>
              </div>
            </div>
          </div>
      );
    }
  }
}

App.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function() {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  verticalCompact: false,
};

export default App;
