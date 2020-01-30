# Configuration-System Test-Case Backend Part

Please follow the instructions below to run the test-case backend's API server.

## Run test-case API server

```
cd ~/testcaseUI/testcase-backend
pip install -r requirements.txt
cd ~/Configuration-System
python -m testcaseUI.testcase-backend.backend.api
```

You only need to run *pip install -r requirements.txt* once in order to install all dependencies. When you want to run the test-case API server again, you can omit those commands.