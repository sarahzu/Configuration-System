# Configuration-System
Configuration System for my Master's Thesis

## Run Webapplication

  1. To initialise the sqlight database:
```
cd ~/Configuration-System/backend
export FLASK_APP=configuration
export FLASK_ENV=development
flask init-db
```
When the message *"Initialized the database."* appears, then the database creation was successful. This step only needs to be done once.

  2. To run the backend API:
```
cd ~/Configuration-System/backend
pip install -r requirements.txt
cd ~/Configuration-System
python -m backend.configuration.configuration_api
```

  3. To run the frontend:
```
cd ~/Configuration-System/frontend
npm install
npm start
```


## Run the Test-case Environment
You need to complete at least step 1 in order to run the test-case environment.

  4. To run the test-case UI backend API:
```
cd ~/testcaseUI/testcase-backend
pip install -r requirements.txt
cd ~/Configuration-System
python -m testcaseUI.testcase-backend.backend.api
```

  5. To run the test-case UI frontend:
```
cd ~/testcaseUI/testcase-backend
npm install
npm start
```

## Run Unit and End-to-End Tests

  6. To run backend unit tests:
```
cd  ~/Configuration-System
python -m backend.tests.controller_test
python -m backend.tests.model_test
python -m backend.tests.test_api
```

  7. To run frontend cypress end-to-end tests (frontend mustn't (step 3) but API in backend (step 2) needs to run during testing):
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

