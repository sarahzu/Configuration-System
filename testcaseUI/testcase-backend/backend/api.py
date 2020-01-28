import ast
import sqlite3
import json

import git
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from flask import g

from .controller import Controller
import os

from .db import init_app

ROOT_DIR = os.path.abspath(os.curdir)

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(ROOT_DIR, '/backend/instance/configuration-system.sqlite'),
)
api = Api(app)
CORS(app)

# initialize database
init_app(app)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            ROOT_DIR + "/backend/instance/configuration-system.sqlite")
        g.db.row_factory = sqlite3.Row

    return g.db


class CloneGitRepoForTestcaseUI(Resource):

    def get(self):
        try:
            if not get_git_repo_address() == "":
                git_repo_address = get_git_repo_address()
                try:
                    controller = Controller(git_repo_address, os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH_TEST_CASE"))
                    if not controller.git_repo_created:
                        try:
                            os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH_TEST_CASE"))
                        except FileExistsError:
                            pass
                        return {"success": False}
                    if controller.is_new_pull_request_available():
                        controller.pull_from_remote_repo()
                    return {'success': True}
                except (git.exc.GitCommandError, TypeError, FileNotFoundError):
                    # recreate lost gitclone folder
                    try:
                        os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH_TEST_CASE"))
                    except FileExistsError:
                        pass
                    return {"success": False}
            else:
                return {'success': False}
        except (git.exc.GitCommandError, TypeError):
            return {'success': False}


class ExtractGitRepoAddressFromDB(Resource):

    def get(self):
        if not get_git_repo_address() == "":
            git_repo_address = get_git_repo_address()

            return {'repo': git_repo_address}
        else:
            return {'repo': ""}


def get_git_repo_address():
    database = get_db()
    if database.execute('SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone() is not None:
        return database.execute(
            'SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone()[0]
    else:
        return ""


class FileNames(Resource):

    def get(self):
        try:
            git_repo_address = get_git_repo_address()
            controller = Controller(git_repo_address, os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH_TEST_CASE"))
            if not controller.git_repo_created:
                # recreate lost gitclone folder
                try:
                    os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH_TEST_CASE"))
                except FileExistsError:
                    pass
            filenames = controller.get_file_names()
            return filenames
        except (git.exc.GitCommandError, TypeError, FileNotFoundError):
            # recreate lost gitclone folder
            try:
                os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH_TEST_CASE"))
            except FileExistsError:
                pass
            return []


class GetOutputJson(Resource):

    def get(self):
        database = get_db()
        if database.execute('SELECT output_json from general_settings WHERE config_id = 1').fetchone() is not None:
            try:
                output_string = database.execute('SELECT output_json from general_settings WHERE config_id = 1').fetchone()[0]
                return json.loads(output_string)
            except ValueError:
                return {}
        else:
            return {}


api.add_resource(ExtractGitRepoAddressFromDB, '/config_api/get_git_repo_address')
api.add_resource(FileNames, '/config_api/filenames')
api.add_resource(GetOutputJson, '/config_api/get_output_json')
api.add_resource(CloneGitRepoForTestcaseUI, '/config_api/clone_git_repo_for_testcaseUI')


if __name__ == '__main__':
    app.run(port=5001, debug=True)
