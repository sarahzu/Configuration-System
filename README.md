# Configuration-System
## Introduction
In the scope of my Master's Thesis, I implemented a User Interface Management System (UIMS) used as configuration system for the simulation game of the Post-fossil cities project. It consists of:
* a web-application
* a corresponding backend system
* a database storage 
* a test-case environment simulating all interfaces between the UIMS and other project parts (see below).

The UIMS is used as an intermediary system between the following simulation game system subparts:
* the system behind the simulation game's screen, called gameplay system, which presents game relevant information during the game session
* a model-processing backend system called Agents Using Model (AUM)
* a storage of visual components (plots and graphics). 

It enables its users, hereafter called configurators, to decide which visual components should be visualized on the simulation game screen and which play cards should be used during each game session. The components can furthermore be modified by deciding which models form the AUM system they should represent. Additionally, the user can arrange the visual components on screen in order to decide the game screen's layout. The finished configuration data can furthermore be used by the gameplay system in order to visualise the needed information during the game session.

The UIMS contains flexible interfaces to its connected simulation game system subparts. The configuration output data of the UIMS is stored as a modifiable JSON structure which allows the gameplay system to easily extract all needed data. The UIMS extracts the available visual components directly from their source code location (which is defined outside of the UIMS's code) by using a self-defined ontology, called Visual Component Specification Language (VCSL). The visual components are therefore not hardcoded into the UIMS source code but stored in separate Github Repositories. By providing the link via the web-application to the UIMS, the configurators are able to decide which collection of visual components should be used for the current configuration session. Therefore, the UIMS does not need to be changed when new visual components are created in the future. Similarly, the UIMS does not use hardcoded data from the AUM system but only uses location paths which are extracted from the visual components, that define them, by using the VCSL. Thus, the UIMS stays robust to changes even when other data sources are used.

This project uses Python 3.7.6 and React 16.12.0.

## Run Web-Application
The configuration system is split into frontend, backend and database part. The database is already set up. In order to run the configuration web-application, you need to run a backend API and frontend server.

  1. To run the backend API server:
```
cd ~/Configuration-System/backend
pip install -r requirements.txt
cd ~/Configuration-System
python -m backend.configuration.configuration_api
```

  2. To run the frontend server:
```
cd ~/Configuration-System/frontend
npm install
npm start
```

You only need to run *pip install -r requirements.txt* and *npm install* once in order to install all dependencies. When you want to run the application again, you can omit those commands.

There are four pages on the web-application:
* home page: Introduction page
* general settings page: On this page, you can submit the link of the visual components Github Repository which should be used during the configuration session.
* set visual components page: After submitting a link in the general settings page, you can modify all visual components on this page.
* arrange components page: The modified visual components can be arranged on screen on this page. Finally, when you are satisfied with your configuration, you can save your settings. 

### Github Repository Information

If you do not have a Github Repository containing visual components at hand which you could use with this application, you can use one of these two testing Repositories:
* https://github.com/sarahzu/Visual-Components-Testcase
* https://github.com/sarahzu/Visual-Components-Testcase-2

Alternatively, the following Github Repository contains visual components designed for the Post-fossil cities project, which also work with this application. Because this Repository is a fork of a private Github Repository, it is set to private as well. Only authorised project members have access to it.  
* https://github.com/sarahzu/post_fossil_cities_visualizations

## Run the Test-case Environment
This environment simulates the interface to the gameplay system as well as to the AUM system and the visual component storage. It serves as a proof of concept. The backend extracts the needed information from the configuration system's database and the frontend loads a web-application which visualises all visual components as they were set in the UIMS. 

  3. To run the test-case backend API:
```
cd ~/testcaseUI/testcase-backend
pip install -r requirements.txt
cd ~/Configuration-System
python -m testcaseUI.testcase-backend.backend.api
```

  4. To run the test-case UI frontend:
```
cd ~/testcaseUI/testcase-backend
npm install
npm start
```

You only need to run *pip install -r requirements.txt* and *npm install* once in order to install all dependencies. When you want to run the test-case application again, you can omit those commands.

## Run Unit and End-to-End Tests

  5. To run backend unit tests:
```
cd  ~/Configuration-System
python -m backend.tests.controller_test
python -m backend.tests.model_test
python -m backend.tests.test_api
```

  6. To run frontend cypress end-to-end tests (API server in backend (step 1) needs to run during testing):
```
cd ~/Configuration-System
python -m backend.configuration.configuration_api
cd ~/Configuration-System/frontend
npm run test:cypress
```
You need to have at least one of the following browsers installed in order for cypress to run:
* Canary
* Chrome
* Chromium
* Electron

When cypress testing interface opens, either click *"Run all specs"* to run every test or click on the individual spec you want to run. The test(s) will be executed in your browser. For more information about cypress testing, see [https://www.cypress.io/](https://www.cypress.io/)

