from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from controller import Controller
import os

from configuration.db import get_db, init_app

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'configuration-system.sqlite'),
)
api = Api(app)
CORS(app)

# initialize database
init_app(app)


class GeneralSettings(Resource):

    def post(self):

        try:
            database = get_db()
            git_repo_json = request.get_json()
            git_repo_address = git_repo_json.get('gitRepoAddress')

            # check if database already has entry
            if database.execute('SELECT * FROM general_settings WHERE config_id =1').fetchone() is not None:
                database.execute('UPDATE general_settings SET git_repo_address=(?) WHERE config_id=(?)',
                                 (git_repo_address, 1))
                database.commit()
            else:
                database.execute(
                    'INSERT INTO general_settings (git_repo_address, config_id) VALUES (?, ?)',
                    (git_repo_address, 1)
                )
                database.commit()

            return {"success": True}

        except():
            return {"success": False}


class ConfigurationSettingInput(Resource):

    def get(self):
        if not get_git_repo_address() == "":
            git_repo_address = get_git_repo_address()
            controller = Controller(git_repo_address)
            settings_info = controller.get_configuration_settings_input()
            return {'input': settings_info}
        else:
            return {'input': {}}


class ExtractGitRepoAddressFromDB(Resource):

    def get(self):
        if not get_git_repo_address() == "":
            git_repo_address = get_git_repo_address()

            return {'repo': git_repo_address}
        else:
            return {'repo': ""}


class PullFromRemoteGit(Resource):

    def get(self):
        if not get_git_repo_address() == "":
            git_repo_address = get_git_repo_address()
            controller = Controller(git_repo_address)
            return {'success': controller.pull_from_remote_repo()}
        else:
            return {'success': False}


class NewPullAvailable(Resource):

    def get(self):
        if not get_git_repo_address() == "":
            git_repo_address = get_git_repo_address()
            controller = Controller(git_repo_address)
            return {'pull': controller.is_new_pull_request_available()}
        else:
            return {'pull': False}


def get_git_repo_address():
    database = get_db()
    if database.execute('SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone() is not None:
        return database.execute(
            'SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone()[0]
    else:
        return ""


class LocalGitRepoPath(Resource):

    def get(self):
        try:
            return os.getenv("LOCAL_REPO_PATH")
        except():
            return ""


class FileNames(Resource):

    def get(self):
        git_repo_address = get_git_repo_address()
        controller = Controller(git_repo_address)
        filenames = controller.get_file_names()
        return filenames


class ComponentsInfoFromFrontend(Resource):

    def post(self):
        comp_info = request.get_json()
        # TODO: write to database
        return True


api.add_resource(GeneralSettings, '/config_api/general_settings_input')
api.add_resource(ConfigurationSettingInput, '/config_api/settings_input')
api.add_resource(ExtractGitRepoAddressFromDB, '/config_api/get_git_repo_address')
api.add_resource(NewPullAvailable, '/config_api/git_new_pull')
api.add_resource(PullFromRemoteGit, '/config_api/pull_from_remote')
api.add_resource(LocalGitRepoPath, '/config_api/local_git_repo_path')
api.add_resource(FileNames, '/config_api/filenames')
api.add_resource(ComponentsInfoFromFrontend, '/config_api/set_components')




if __name__ == '__main__':
    app.run(debug=True)
