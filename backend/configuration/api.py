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
        database = get_db()
        # TODO: change config_id to nonstatic one
        if database.execute('SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone() is not None:
            git_repo_address = database.execute(
                'SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone()[0]
            # FIXME: change get_configuration_settings_input() to cloning git repo again
            controller = Controller(git_repo_address)
            settings_info = controller.get_configuration_settings_input()
            return {'input': settings_info}
        else:
            return {'input': {}}


class ExtractGitRepoAddressFromDB(Resource):

    def get(self):
        database = get_db()
        # TODO: change config_id to nonstatic one
        if database.execute('SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone() is not None:
            git_repo_address = database.execute(
                'SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone()[0]

            return {'repo': git_repo_address}
        else:
            return {'repo': ""}


api.add_resource(GeneralSettings, '/config_api/general_settings_input')
api.add_resource(ConfigurationSettingInput, '/config_api/settings_input')
api.add_resource(ExtractGitRepoAddressFromDB, '/config_api/get_git_repo_address')

if __name__ == '__main__':
    app.run(debug=True)
