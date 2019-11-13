from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from controller import Controller

from configuration.db import get_db, init_app

# from . import db

app = Flask(__name__)
api = Api(app)
CORS(app)

# initialize database
# init_app(app)


# @app.route('/settings-result', methods=['GET', 'POST'])
# def result():
#     if request.method == 'GET':
#         place = request.args.get('gitRepoAddress', None)
#         if place:
#             return place
#         return "No git repo address is given"

GIT_REPO_ADDRESS = ""


class GeneralSettings(Resource):

    def post(self):

        try:
            # database = get_db()
            # git_repo_json = request.get_json()
            # git_repo_address = git_repo_json.get('gitRepoAddress')
            #
            # # check if database already has entry
            # if database.execute('SELECT * FROM general_settings WHERE config_id =1').fetchone() is not None:
            #     database.execute('UPDATE general_settings SET git_repo_address=(?) WHERE config_id=(?)',
            #                               (git_repo_address, 1))
            #     database.commit()
            # else:
            #     database.execute(
            #         'INSERT INTO general_settings (git_repo_address, config_id) VALUES (?, ?)',
            #         (git_repo_address, 1)
            #     )
            #     database.commit()
            global GIT_REPO_ADDRESS
            git_repo_json = request.get_json()
            GIT_REPO_ADDRESS = git_repo_json.get('gitRepoAddress')

            # controller = Controller(git_repo_address)
            # reports = controller.get_components()
            return {"success": True}

        except():
            return {"success": False}


class ConfigurationSettingInput(Resource):

    def get(self):
        # FIXME
        controller = Controller(GIT_REPO_ADDRESS)
        settings_info = controller.get_configuration_settings_input()
        return {'input': settings_info}


api.add_resource(GeneralSettings, '/config_api/general_settings_input')
api.add_resource(ConfigurationSettingInput, '/config_api/settings_input')

if __name__ == '__main__':
    app.run(debug=True)
