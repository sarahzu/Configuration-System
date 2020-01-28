# Configuration-System
In the scope of my Master's Thesis, I implemented a Configuration System for the simulation game of the Post-fossil cities project. This system is used as an intermediary system between the gameplay system, a model-processing backend system (called Agents Using System) and a storage of visual components used during game sessions.

After cloning this Repository, make sure to also clone the linked Repository in the testing folder which is used for the backend unit tests.

This project uses Python 3.7 and React 16.12.0.

```
cd ~/Configuration-System
git submodule init 
cd ~/Configuration-System/testing/github2
submodule update
cd ~/Configuration-System/testing/github
touch .git
```

## Run Web-Application
The configuration system is split into frontend, backend and database part. The database is already set up. In order to run the configuration web-application, you need to run a backend and frontend server.

  1. To run the backend API:
```
cd ~/Configuration-System/backend
pip install -r requirements.txt
cd ~/Configuration-System
python -m backend.configuration.configuration_api
```

  2. To run the frontend:
```
cd ~/Configuration-System/frontend
npm install
npm start
```
I've tested the web-application with mac OS X on Firefox 72.0.2 browser, with Windows 10 on Google Chrome 79.0.39.45.130 browser and with Linux (Ubuntu) on Midori web-browser.

## Run the Test-case Environment
This environment simulates the interface to the gameplay system. The backend extracts the needed information from the configuration system's database and the frontend loads a web-application which visualises all visual components as they where set in the configuration system. 

  3. To run the test-case UI backend API:
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

## Run Unit and End-to-End Tests

  5. To run backend unit tests:
```
cd  ~/Configuration-System
python -m backend.tests.controller_test
python -m backend.tests.model_test
python -m backend.tests.test_api
```

All unit tests where tested on Mac OS X 10.14.6. On other operating systems, some tests might fail because of different system path syntaxes. 

  6. To run frontend cypress end-to-end tests (frontend mustn't (step 2) but API in backend (step 1) needs to run during testing):
```
cd ~/Configuration-System/frontend
npm run test:cypress
```
You need to have at least one of the following browsers installed in order for cypress to run:
* Canary
* Chrome
* Chromium
* Electron

When cypress testing interface opens, either click *"Run all specs"* to run every test or click on the individual spec you want to run. The test(s) will be executed in your Browser. For more information about cypress testing, see [https://www.cypress.io/](https://www.cypress.io/)

