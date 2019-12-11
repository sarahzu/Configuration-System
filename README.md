# Configuration-System
Configuration System for my Master's Thesis

To run the frontend:
```
cd ~/frontend
npm install
npm start
```

To initialise the sqlight database:
```
cd ~/backend
export FLASK_APP=configuration
export FLASK_ENV=development
flask init-db
```

To run the backend API:
```
cd ~/backend
pip install -r requirements.txt
cd configuration
python3 api.py
```

To run the test-case UI frontend:
```
cd ~/testcaseUI/testcase-backend
npm install
npm start
```

To run the test-case UI backend API:
```
cd ~/testcaseUI/testcase-backend
pip install -r requirements.txt
cd backend
python3 api.py
```
