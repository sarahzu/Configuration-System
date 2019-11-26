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
                database.execute('DELETE FROM parameter')
                database.execute('DELETE FROM component')

                database.commit()
            else:
                database.execute(
                    'INSERT INTO general_settings (git_repo_address, config_id, is_active) VALUES (?, ?, ?)',
                    (git_repo_address, 1, True)
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
        frontend_request = request.get_json()
        configuration = frontend_request.get("configuration")
        components = configuration.get("components")
        # TODO: handle decision cards
        decision_cards = configuration.get("decisionCards")

        database = get_db()
        for component in components:
            # if component is already included in database
            if is_component_in_database(component.get("name")):
                # update component table
                database.execute('UPDATE OR IGNORE component '
                                 'SET description = (?), width = (?), height = (?), x = (?), y = (?), '
                                 'enabled = (?), toolbox = (?) WHERE component_name = (?)',
                                 (component.get("description"),
                                  component.get("position").get("width"), component.get("position").get("height"),
                                  component.get("position").get("x"), component.get("position").get("y"),
                                  component.get("enabled"), component.get("toolbox"), component.get("name")))
                comp_name = component.get("name")
                component_id = database.execute('SELECT component_id FROM component WHERE component_name = (?)'
                                                , (comp_name, )).fetchone()[0]
                parameters = component.get("parameter")
                if len(parameters) == 0:
                    # if no parameters given, erase all previously given parameters
                    database.execute('UPDATE OR IGNORE parameter SET '
                                     'parameter_value = (?) WHERE component_id = (?)', ("", component_id))
                else:
                    # also add parameters to database
                    for parameter in parameters:
                        value = ""
                        # extract value if it is given
                        if parameter.get("value"):
                            value = parameter.get("value")
                        # check if parameter is already included in database
                        if is_component_parameter_in_database(component_id, parameter.get("parameter")):
                            # update parameter table
                            database.execute('UPDATE OR IGNORE parameter SET parameter_name = (?), parameter_type = (?), '
                                             'parameter_value = (?) WHERE component_id = (?)', (parameter.get("parameter"),
                                                                                                parameter.get("type"),
                                                                                                value, component_id))
                        else:
                            # insert the new parameter in the parameter table
                            database.execute('INSERT OR IGNORE INTO parameter (component_id, parameter_name, '
                                             'parameter_type, parameter_value) VALUES ((?), (?), (?), (?))',
                                             (component_id, parameter.get("parameter"), parameter.get("type"), value))
            # component is not already included in component table
            else:
                # insert new component in component table
                database.execute('INSERT INTO component (config_id, component_name, description, '
                                 'width, height, x, y, enabled, toolbox) '
                                 'VALUES ((?), (?), (?), (?), (?), (?), (?), (?), (?))', (1, component.get("name"),
                                                                                          component.get("description"),
                                                                                          component.get("position").get(
                                                                                              "width"),
                                                                                          component.get("position").get(
                                                                                              "height"),
                                                                                          component.get("position").get(
                                                                                              "x"),
                                                                                          component.get("position").get(
                                                                                              "y"),
                                                                                          component.get("enabled"),
                                                                                          component.get("toolbox")))
                comp_name = component.get("name")
                component_id = database.execute('SELECT component_id FROM component WHERE component_name = ?'
                                                , (comp_name,)).fetchone()[0]
                parameters = component.get("parameter")
                # also add all parameters to database
                for parameter in parameters:
                    value = ""
                    # extract value if given
                    if parameter.get("value"):
                        value = parameter.get("value")
                    # check if parameter is already included parameter table
                    if is_component_parameter_in_database(component_id, parameter.get("parameter")):
                        # update parameter in parameter table
                        database.execute('UPDATE parameter SET parameter_name = (?), parameter_type = (?), '
                                         'parameter_value = (?) WHERE component_id = (?)', (parameter.get("parameter"),
                                                                                            parameter.get("type"),
                                                                                            value, component_id))
                    else:
                        # insert new parameter in parameter table
                        database.execute('INSERT INTO parameter (component_id, parameter_name, '
                                         'parameter_type, parameter_value) VALUES ((?), (?), (?), (?))',
                                         (component_id, parameter.get("parameter"), parameter.get("type"), value))
        # commit all gathered database commands
        database.commit()
        return True


def is_component_in_database(component_name):
    database = get_db()
    if database.execute('SELECT * FROM component WHERE config_id = (?) AND component_name = (?)',
                        (1, component_name)).fetchone() is not None:
        return True
    else:
        return False


def is_component_parameter_in_database(component_id, parameter_name):
    database = get_db()
    if database.execute('SELECT component_id FROM parameter WHERE component_id = (?) and parameter_name = (?)',
                        (component_id, parameter_name)).fetchone() is not None:
        return True
    else:
        return False


class GetModels(Resource):

    def get(self):
        database = get_db()
        if database.execute('SELECT model_name from model').fetchone() is not None:
            models = database.execute('SELECT model_name from model')
            result = [item[0] for item in models.fetchall()]
            return result
        else:
            return []


api.add_resource(GeneralSettings, '/config_api/general_settings_input')
api.add_resource(ConfigurationSettingInput, '/config_api/settings_input')
api.add_resource(ExtractGitRepoAddressFromDB, '/config_api/get_git_repo_address')
api.add_resource(NewPullAvailable, '/config_api/git_new_pull')
api.add_resource(PullFromRemoteGit, '/config_api/pull_from_remote')
api.add_resource(LocalGitRepoPath, '/config_api/local_git_repo_path')
api.add_resource(FileNames, '/config_api/filenames')
api.add_resource(ComponentsInfoFromFrontend, '/config_api/set_components')
api.add_resource(GetModels, '/config_api/get_models')


if __name__ == '__main__':

    app.run(debug=True)
