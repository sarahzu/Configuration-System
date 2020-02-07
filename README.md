# Configuration-System
In the scope of my Master's Thesis, I implemented a Configuration System for the simulation game of the Post-fossil cities project. This system is used as an intermediary system between the gameplay system, a model-processing backend system (called Agents Using System) and a storage of visual components used during game sessions.

This project uses Python 3.7.6 and React 16.12.0. I worked with mac OS X 10.14.6 on Firefox 72.0.2 browser.

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

You only need to run *pip install -r requirements.txt* and *npm install* once in order to install all dependencies. When you want to run the application again, you can omit those commands.

### Github Repository Information

If you do not have a Github Repository at hand, which you could use with this application, you can use one of these two testing Repositories:
* https://github.com/sarahzu/Visual-Components-Testcase
* https://github.com/sarahzu/Visual-Components-Testcase-2

Alternatively, the following Github Repository contains visual components designed for the Post-fossil cities project, which also work with this application: 
* https://github.com/sarahzu/post_fossil_cities_visualizations

Because this project is not open source, all mentioned Github Repositories are set to private. If you would like to have access to them, please contact me. 

If you use a private Github Repository and have not added your computer's ssh key to your Github account, the terminal running the API server will ask you about your accounts password two times on the general settings page while running the application:
* after loading the general settings page (the program checks if a new pull is available in order to decide if the pull button should get enabled)
* when you enter a new Github Repository and submit it

Please enter your account credentials directly into the terminal in order to get access to the set Github Repository.

## Run the Test-case Environment
This environment simulates the interface to the gameplay system and serves as a proof of concept. The backend extracts the needed information from the configuration system's database and the frontend loads a web-application which visualises all visual components as they were set in the configuration system. 

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

If you use a private Github Repository for the visual components and have not added your computer's ssh key to your Github Account, the terminal of the running API server will ask you about your credentials before loading the visual components on screen. Please enter your credentials in order to give the program access to load all visual components.

## Run Unit and End-to-End Tests

  5. To run backend unit tests:
```
cd  ~/Configuration-System
python -m backend.tests.controller_test
python -m backend.tests.model_test
python -m backend.tests.test_api
```

  6. To run frontend cypress end-to-end tests (frontend mustn't (step 2) but API in backend (step 1) needs to run during testing):
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

When cypress testing interface opens, either click *"Run all specs"* to run every test or click on the individual spec you want to run. The test(s) will be executed in your Browser. For more information about cypress testing, see [https://www.cypress.io/](https://www.cypress.io/)

### Github Repository Used for Testing

Because the unit tests and cypress end-to-end tests use one of the above mentioned private testing Github Repositories, you need access to be able to run the tests. If you have not added your computer's ssh key to your Github Account, the terminal of the running API will ask you about your credentials while running the tests. If a cypress test needs your Github account credentials, it will wait 10 seconds in order to give you enough time to enter them. Please enter your credentials into the terminal in the given timeframe, otherwise the test will fail. 

