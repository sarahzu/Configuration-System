import ast
import sys

import git
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS

from .configuration_controller import Controller, get_model_names, get_value_from_data_json
import os

import json

from .db import get_db, init_app

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'configuration-system.sqlite'),
)
api = Api(app)
CORS(app)

# initialize database
init_app(app)

ROOT_DIR = os.path.abspath(os.curdir)
sys.path.append(ROOT_DIR)

class StoreAndCloneGitRepoPath(Resource):
    """
    Post: request Github Repository Link from frontend. Clone the given Repo, store link in database
    and return success message.
    """

    def post(self):

        try:
            database = get_db()
            git_repo_json = request.get_json()
            git_repo_address = git_repo_json.get('gitRepoAddress')

            return clone_git_repo_and_store_path_in_database(git_repo_address, database, "LOCAL_REPO_PATH")
        except():
            return {"success": False}


def clone_git_repo_and_store_path_in_database(git_repo_address, database, local_repo_path_env_string):
    """
    Clone Github Repo of the given link and store the link in the given database

    :param git_repo_address:            {String}        link of the Github Repository
    :param database:                    {Database}      database object
    :param local_repo_path_env_string:  {String}        name of the env parameter which stores the location of the
                                                        Github clone location
    :return:                            {Dictionary}    {'success':True} if everything worked, {'success':False} otherwise
    """
    try:
        controller = Controller(git_repo_address,
                                os.path.dirname(os.path.abspath(__file__)) + os.getenv(local_repo_path_env_string))
    except (git.exc.GitCommandError, TypeError):
        # recreate lost gitclone folder
        try:
            os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv(local_repo_path_env_string))
        except FileExistsError:
            pass
        enterGitRepoAddressIntoDatabase(database, None)
        return {"success": False}
    # check if git repo was created
    if controller.git_repo_created:
        enterGitRepoAddressIntoDatabase(database, git_repo_address)
        return {"success": True}
    else:
        # recreate lost gitclone folder
        try:
            os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv(local_repo_path_env_string))
        except FileExistsError:
            pass
        enterGitRepoAddressIntoDatabase(database, None)
        return {"success": False}


def enterGitRepoAddressIntoDatabase(database, git_repo_address):
    """
    Store given Github Repo link in given database
    :param database:            {Database}  database object
    :param git_repo_address:    {String}    Github Repository link
    :return:
    """
    # check if database already has entry
    if database.execute('SELECT * FROM general_settings WHERE config_id =1').fetchone() is not None:
        database.execute('UPDATE general_settings SET git_repo_address=(?), output_json=(?) WHERE config_id=(?)',
                         (git_repo_address, None, 1))
        # if git repo changes, erase previous settings form database
        database.execute('DELETE FROM parameter')
        database.execute('DELETE FROM component')
        database.execute('DELETE FROM decision_card')

        database.commit()
    else:
        database.execute(
            'INSERT INTO general_settings (git_repo_address, config_id, is_active, output_json) VALUES (?, ?, ?, ?)',
            (git_repo_address, 1, True, None)
        )
        database.commit()


class ExtractVisualComponentAndDecisionCardsInformationFromGitRepo(Resource):
    """
    Extract all needed information about the visual components and decision cards which are used in the frontend.
    """

    def get(self):
        database = get_db()
        if not get_git_repo_address(database) == "":
            git_repo_address = get_git_repo_address(database)
            return extract_visual_component_and_decision_cards_information_from_git_repo("LOCAL_REPO_PATH",
                                                                                         git_repo_address)
        else:
            return {'input': {}}


def extract_visual_component_and_decision_cards_information_from_git_repo(local_repo_path_env_string, git_repo_address):
    """
    extract information about visual components and decision cards from the given Github Repo

    :param local_repo_path_env_string:  {String}        name of the env parameter which stores the location of the Github clone location
    :param git_repo_address:            {String}        link to the Github Repo
    :return:                            {Dictionary}    information extracted form the Github Repository
    """
    # if not get_git_repo_address() == "":
    #     git_repo_address = get_git_repo_address()
    try:
        controller = Controller(git_repo_address,
                                 os.path.dirname(os.path.abspath(__file__)) + os.getenv(local_repo_path_env_string))
        settings_info = controller.get_configuration_settings_input()
    except (git.exc.GitCommandError, TypeError):
        # recreate lost gitclone folder
        try:
            os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv(local_repo_path_env_string))
        except FileExistsError:
            pass
        return {"input": {}}
    return {'input': settings_info}
    # else:
    #     return {'input': {}}


class ExtractGitRepoAddressFromDB(Resource):
    """
    Extract the Github Repository Link from the database
    """

    def get(self):
        database = get_db()
        if not get_git_repo_address(database) == "":
            git_repo_address = get_git_repo_address(database)

            return {'repo': git_repo_address}
        else:
            return {'repo': ""}


class PullFromRemoteGit(Resource):
    """
    On the local Github Repository (which is stored in the frontend folder) pull if possible from remote master branch.
    Erase all other made settings from database.
    """

    def get(self):
        database = get_db()
        if not get_git_repo_address(database) == "":
            git_repo_address = get_git_repo_address(database)
            try:
                controller = Controller(git_repo_address,
                                        os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))

                # if git repo gets updated, erase previous settings form database
                # erase previous settings form database
                erase_output_json_and_everything_from_parameter_component_and_dc_tables_in_db(database)
                database.commit()

                return {'success': controller.pull_from_remote_repo()}
            except (git.exc.GitCommandError, TypeError):
                # recreate lost gitclone folder
                try:
                    os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))
                except FileExistsError:
                    pass
                return {"success": False}
        else:
            return {'success': False}


def erase_output_json_and_everything_from_parameter_component_and_dc_tables_in_db(database):
    """
    erase output_json entry in general_settings table and clear all content of component, decision_card and parameter
    table in database.

    :param database:    {Database}  database object
    :return:
    """
    database.execute('UPDATE general_settings SET output_json = (?) WHERE config_id = 1', (None,))
    database.execute('DELETE FROM parameter')
    database.execute('DELETE FROM component')
    database.execute('DELETE FROM decision_card')


class NewPullAvailable(Resource):
    """
    Check if a new pull is available in the local Github Repository (stored in the frontend folder)
    """

    def get(self):
        database = get_db()
        if not get_git_repo_address(database) == "":
            git_repo_address = get_git_repo_address(database)
            try:
                controller = Controller(git_repo_address,
                                        os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))
            except (git.exc.GitCommandError, TypeError):
                # recreate lost gitclone folder
                try:
                    os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))
                except FileExistsError:
                    return {"pull": False}
                return {"pull": False}
            if controller.git_repo_created:
                pull_available = controller.is_new_pull_request_available()
                return {'pull': pull_available}
            else:
                # recreate lost gitclone folder
                try:
                    os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))
                except FileExistsError:
                    return {"pull": False}
                return {"pull": False}
        else:
            return {'pull': False}


def get_git_repo_address(database):
    """
    Extract Github Repository link from database

    :param database:    {Database}  database object
    :return:            {String}    Github Repository link
    """
    if database.execute('SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone() is not None:
        return database.execute(
            'SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone()[0]
    else:
        return ""


class LocalGitRepoPath(Resource):
    """
    Extract local Github Repository path which is stored as env variable
    """

    def get(self):
        try:
            return os.getenv("LOCAL_REPO_PATH")
        except():
            return ""


class FileNames(Resource):
    """
    Extract all filenames of the files in the local Github Repository folder
    """

    def get(self):
        database = get_db()
        git_repo_address = get_git_repo_address(database)
        try:
            controller = Controller(git_repo_address,
                                    os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))
            filenames = controller.get_file_names()
            return filenames
        except (git.exc.GitCommandError, TypeError):
            # recreate lost gitclone folder
            try:
                os.mkdir(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_REPO_PATH"))
            except FileExistsError:
                pass
            return []


def add_output_json_to_database(database, frontend_request):
    """
    Insert given output_json from frontend into the general_settings table of the database.

    :param database:            {Database}      database object
    :param frontend_request:    {Dictionary}    output json which has to be stored in the database
    :return:
    """
    output_json_string = json.dumps(frontend_request)
    if database.execute('SELECT * from general_settings where config_id = 1').fetchone() is not None:
        database.execute('UPDATE OR IGNORE general_settings SET output_json = (?) WHERE config_id = 1',
                         (output_json_string,))
    else:
        database.execute(
            'INSERT OR IGNORE INTO general_settings (config_id, is_active, output_json) VALUES ((?), (?), (?))',
            (1, True, output_json_string))


def insert_decision_cards_into_database(database, decision_cards):
    """
    Insert all information about a decision card into the decision_card table and parameter table of the database.

    :param database:        {Database}      database object
    :param decision_cards:  {Dictionary}    decision cards information stored in a dictionary
    :return:
    """
    for decision_card in decision_cards:
        # if decision card is already included in database
        if is_decision_card_in_database(decision_card.get("name")):
            # update decision card table
            database.execute('UPDATE OR IGNORE decision_card '
                             'SET description = (?), enabled = (?) WHERE decision_card_name = (?)',
                             (decision_card.get("description"), decision_card.get("enabled"),
                              decision_card.get("name")))

            decision_card_name = decision_card.get("name")
            decision_card_id = database.execute(
                'SELECT decision_card_id FROM decision_card WHERE decision_card_name = (?)',
                (decision_card_name,)).fetchone()[0]
            parameters = decision_card.get("parameter")
            if len(parameters) == 0:
                # if no parameters given, erase all previously given parameters
                # database.execute('UPDATE OR IGNORE parameter SET '
                #                  'parameter_value = (?) WHERE decision_card_id = (?)', ("", decision_card_id))
                database.execute('DELETE FROM parameter WHERE decision_card_id = (?)', (decision_card_id,))
            else:
                # also add parameters to database
                for parameter in parameters:
                    value = ""
                    # extract value if it is given
                    if parameter.get("value"):
                        value = parameter.get("value")
                    # check if parameter is already included in database
                    if is_decision_card_parameter_in_database(decision_card_id, parameter.get("parameter")):
                        # update parameter table
                        database.execute(
                            'UPDATE OR IGNORE parameter SET parameter_type = (?), '
                            'parameter_value = (?) WHERE decision_card_id = (?) and parameter_name = (?)',
                            (parameter.get("type"), value, decision_card_id, parameter.get("parameter")))
                    else:
                        # insert the new parameter in the parameter table
                        database.execute('INSERT OR IGNORE INTO parameter (decision_card_id, parameter_name, '
                                         'parameter_type, parameter_value) VALUES ((?), (?), (?), (?))',
                                         (decision_card_id, parameter.get("parameter"), parameter.get("type"),
                                          value))
        # decision card is not already included in component table
        else:
            # insert new decision card in decision card table
            database.execute('INSERT INTO decision_card (config_id, decision_card_name, description, enabled) '
                             'VALUES ((?), (?), (?), (?))',
                             (1, decision_card.get("name"), decision_card.get("description"),
                              decision_card.get("enabled")))
            decision_card_name = decision_card.get("name")
            decision_card_id = \
                database.execute('SELECT decision_card_id FROM decision_card WHERE decision_card_name = ?'
                                 , (decision_card_name,)).fetchone()[0]
            parameters = decision_card.get("parameter")
            # also add all parameters to database
            for parameter in parameters:
                value = ""
                # extract value if given
                if parameter.get("value"):
                    value = parameter.get("value")
                # check if parameter is already included parameter table
                if is_decision_card_parameter_in_database(decision_card_id, parameter.get("parameter")):
                    # update parameter in parameter table
                    database.execute('UPDATE parameter SET parameter_type = (?), '
                                     'parameter_value = (?) WHERE decision_card_id = (?) and parameter_name = (?)',
                                     (parameter.get("type"), value, decision_card_id, parameter.get("parameter")))
                else:
                    # insert new parameter in parameter table
                    database.execute('INSERT INTO parameter (decision_card_id, parameter_name, '
                                     'parameter_type, parameter_value) VALUES ((?), (?), (?), (?))',
                                     (decision_card_id, parameter.get("parameter"), parameter.get("type"), value))


def insert_visual_component_into_database(database, components):
    """
        Insert all information about a visual component into the component table and parameter table of the database.

        :param database:        {Database}      database object
        :param components:      {Dictionary}    visual components information stored in a dictionary
        :return:
        """
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
                                            , (comp_name,)).fetchone()[0]
            parameters = component.get("parameter")
            if len(parameters) == 0:
                # if no parameters given, erase all previously given parameters
                # database.execute('UPDATE OR IGNORE parameter SET '
                #                  'parameter_value = (?) WHERE component_id = (?)', ("", component_id))
                database.execute('DELETE FROM parameter WHERE component_id = (?)', (component_id,))
            else:
                # also add parameters to database
                for parameter in parameters:
                    value = ""
                    # extract value if it is given
                    if parameter.get("value"):
                        value = parameter.get("value")
                    # check if parameter is already included in database
                    if is_component_parameter_in_database(component_id, parameter.get("parameter"), database):
                        # update parameter table
                        database.execute(
                            'UPDATE OR IGNORE parameter SET parameter_type = (?), '
                            'parameter_value = (?) WHERE component_id = (?) and parameter_name = (?)',
                            (parameter.get("type"), value, component_id, parameter.get("parameter")))
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
                if is_component_parameter_in_database(component_id, parameter.get("parameter"), database):
                    # update parameter in parameter table
                    database.execute('UPDATE parameter SET parameter_type = (?), '
                                     'parameter_value = (?) WHERE component_id = (?) and parameter_name = (?)',
                                     parameter.get("type"), value, component_id, (parameter.get("parameter")))
                else:
                    # insert new parameter in parameter table
                    database.execute('INSERT INTO parameter (component_id, parameter_name, '
                                     'parameter_type, parameter_value) VALUES ((?), (?), (?), (?))',
                                     (component_id, parameter.get("parameter"), parameter.get("type"), value))


class ComponentsInfoFromFrontend(Resource):
    """
    Get the information about the made configuration from the frontend and insert everything into the right
    table of the database.
    """

    def post(self):
        frontend_request = request.get_json()
        configuration = frontend_request.get("configuration")
        current_configuration = configuration.get("1")
        components = current_configuration.get("components")
        decision_cards = current_configuration.get("decisionCards")

        database = get_db()
        # insert output json into database
        add_output_json_to_database(database, frontend_request)

        # inset decision cards
        insert_decision_cards_into_database(database, decision_cards)

        # insert visual components
        insert_visual_component_into_database(database, components)

        # commit all gathered database commands
        database.commit()
        return True


def is_component_in_database(component_name):
    """
    Check if a visual component with the given name is already stored in the database.

    :param component_name:  {String}    name of visual component
    :return:                {Boolean}   True if component already is in database, False otherwise
    """
    database = get_db()
    if database.execute('SELECT * FROM component WHERE config_id = (?) AND component_name = (?)',
                        (1, component_name)).fetchone() is not None:
        return True
    else:
        return False


def is_decision_card_in_database(decision_card_name):
    """
    Check if a decision card with the given name is already stored in the database.

    :param decision_card_name:  {String}    name of decision card
    :return:                    {Boolean}   True if decision card already is in database, False otherwise
    """
    database = get_db()
    if database.execute('SELECT * FROM decision_card WHERE config_id = (?) AND decision_card_name = (?)',
                        (1, decision_card_name)).fetchone() is not None:
        return True
    else:
        return False


def is_component_parameter_in_database(component_id, parameter_name, database):
    """
    Check if a parameter of a visual component with the given name is already stored in the database.

    :param component_id:    {Integer}   id of the parameter's visual component
    :param parameter_name:  {String}    name of parameter
    :param database:        {Database}  database object
    :return:                {Boolean}   True if parameter is already in database, False otherwise
    """
    query = database.execute('SELECT * FROM parameter WHERE component_id = (?) and parameter_name = (?)',
                             (component_id, parameter_name)).fetchone()
    if query is not None:
        return True
    else:
        return False


def is_decision_card_parameter_in_database(decision_card_id, parameter_name):
    """
    Check if a parameter of a decision card with the given name is already stored in the database.

    :param decision_card_id:    {Integer}   id of the parameter's decision card
    :param parameter_name:      {String}    name of parameter
    :return:                    {Boolean}   True if parameter is already in database, False otherwise
    """
    database = get_db()
    if database.execute('SELECT decision_card_id FROM parameter WHERE decision_card_id = (?) and parameter_name = (?)',
                        (decision_card_id, parameter_name)).fetchone() is not None:
        return True
    else:
        return False


class GetModels(Resource):
    """
    Extract all available models
    """

    def get(self):
        # database = get_db()
        # if database.execute('SELECT model_name from model').fetchone() is not None:
        #     models = database.execute('SELECT model_name from model')
        #     result = [item[0] for item in models.fetchall()]
        #     return result
        # else:
        #     return []
        return get_model_names()


class GetValueFromModelsAccordingToLocation(Resource):
    """
    Get the location of a desired model value from frontend, extract the value and return value back to frontend.
    """

    def post(self):
        frontend_response = request.get_json()
        return extract_value_from_models_according_to_location(frontend_response, False)


def extract_value_from_models_according_to_location(model_data_location, testing):
    """
    Extract model value according to the given location information

    :param model_data_location: {Dictionary}    model data location
    :param testing              {Boolean}       True if method is used for testing, False otherwise
    :return:                    {Dictionary}    the extracted value or None if location path is not valid
    """
    try:
        final_value = get_value_from_data_json(model_data_location.get('new_source'),
                                               model_data_location.get('node_path'), testing)
        return {'value': final_value}
    except():
        return {'value': None}


class GetCallbackFunctions(Resource):
    """
    This function is used for simulating the AUM system. However, it should be replaced in the future with a function
    that extracts all available callback function from the AUM system.
    """
    def get(self):
        return ['changeAverageVehicleLifetime', 'changePublicVehicles']


########################
# create API addresses #
########################
api.add_resource(StoreAndCloneGitRepoPath, '/config_api/general_settings_input')
api.add_resource(ExtractVisualComponentAndDecisionCardsInformationFromGitRepo, '/config_api/settings_input')
api.add_resource(ExtractGitRepoAddressFromDB, '/config_api/get_git_repo_address')
api.add_resource(NewPullAvailable, '/config_api/git_new_pull')
api.add_resource(PullFromRemoteGit, '/config_api/pull_from_remote')
api.add_resource(LocalGitRepoPath, '/config_api/local_git_repo_path')
api.add_resource(FileNames, '/config_api/filenames')
api.add_resource(ComponentsInfoFromFrontend, '/config_api/set_components')
api.add_resource(GetModels, '/config_api/get_models')
api.add_resource(GetValueFromModelsAccordingToLocation, '/config_api/get_value')
api.add_resource(GetCallbackFunctions, '/config_api/get_callback')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
