# Configuration-System
Configuration System for my Master's Thesis

To run the fronenend:
```
cd ~/frontend
npm start
```

To run the backend API:
```
cd ~/backend/configuration
python3 api.py
```

To initialize the sqlight database:
```
cd ~/backend
export FLASK_APP=configuration
export FLASK_ENV=development
flask init-db
```

To run the test-case UI frontend:
```
cd ~/testcaseUI
npm start
```
