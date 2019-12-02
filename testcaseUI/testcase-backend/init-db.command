#! /bin/bash

cd /Users/sarah/Documents/UZH/Masterarbeit/project/Configuration-System/testcaseUI/testcase-backend

chmod u+x run.command

export FLASK_APP=backend
export FLASK_ENV=development
flask init-db

