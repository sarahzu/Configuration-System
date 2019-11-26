# Configuration-System
Configuration System for my Master's Thesis

To run the fronenend:
```
cd ~/frontend
npm start
```
The API .env file for the fronend is not included on Github. Please contact me, if you need it. 

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
