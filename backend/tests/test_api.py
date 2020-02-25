import json
import shutil
import sqlite3
import unittest
import sys
import os
from pathlib import Path

from flask import Flask, request, current_app, g
from flask_restful import Resource, Api
from flask_cors import CORS

from ..configuration.configuration_api import enterGitRepoAddressIntoDatabase, get_git_repo_address, is_component_in_database, \
    is_decision_card_in_database, is_component_parameter_in_database, is_decision_card_parameter_in_database, \
    LocalGitRepoPath, add_output_json_to_database, insert_decision_cards_into_database, \
    insert_visual_component_into_database, clone_git_repo_and_store_path_in_database, \
    ExtractVisualComponentAndDecisionCardsInformationFromGitRepo, \
    extract_visual_component_and_decision_cards_information_from_git_repo, ExtractGitRepoAddressFromDB, \
    erase_output_json_and_everything_from_parameter_component_and_dc_tables_in_db, \
    extract_value_from_models_according_to_location

from ..configuration.db import init_app

# print('__file__={0:<35} | __name__={1:<20} | __package__={2:<20}'.format(__file__, __name__, str(__package__)))

ROOT_DIR = os.path.abspath(os.curdir)

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(ROOT_DIR, 'backend', 'tests', 'instance', 'configuration-system.sqlite'),
)
api = Api(app)
CORS(app)

# initialize database
init_app(app)


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            ROOT_DIR + "/backend/tests/instance/configuration-system.sqlite")
        g.db.row_factory = sqlite3.Row

    return g.db


class APITest(unittest.TestCase):
    clone_url = "https://github.com/sarahzu/Visual-Components-Testcase-2.git"

    # local_repo_path = ROOT_DIR + "/local"
    # git_repo = GitRepo(local_repo_path, clone_url)

    def test_enter_git_repo_address_into_database_and_get_git_repo_address(self):
        with app.app_context():
            database = get_db()
            git_repo_link = self.clone_url
            enterGitRepoAddressIntoDatabase(database, git_repo_link)
            return_value_db = database.execute(
                'SELECT git_repo_address FROM general_settings WHERE config_id =1').fetchone()[0]
            self.assertEqual(self.clone_url, return_value_db)
            self.assertEqual(self.clone_url, get_git_repo_address(database))

    def test_is_component_in_database(self):
        with app.app_context():
            database = get_db()
            component_name = "testiDiTestTest"
            database.execute("INSERT INTO component (component_id, component_name, config_id, enabled, toolbox) VALUES "
                             "((?), (?), (?), (?), (?))",
                             (-1, component_name, 1, True, False))
            database.commit()
            result_after_insertion = is_component_in_database(component_name)
            self.assertEqual(True, result_after_insertion)

            database.execute("DELETE FROM component WHERE component_name=(?) AND component_id = (?)",
                             (component_name, -1))
            database.commit()
            result_after_deletion = is_component_in_database(component_name)
            self.assertEqual(False, result_after_deletion)

    def test_is_decision_card_in_database(self):
        with app.app_context():
            database = get_db()
            decision_card_name = "dcTestTest"
            database.execute("INSERT INTO decision_card (decision_card_id, decision_card_name, config_id, enabled) "
                             "VALUES ((?), (?), (?), (?))",
                             (-1, decision_card_name, 1, True))
            database.commit()
            result_after_insertion = is_decision_card_in_database(decision_card_name)
            self.assertEqual(True, result_after_insertion)

            database.execute("DELETE FROM decision_card WHERE decision_card_name=(?) AND decision_card_id = (?)",
                             (decision_card_name, -1))
            database.commit()
            result_after_deletion = is_decision_card_in_database(decision_card_name)
            self.assertEqual(False, result_after_deletion)

    def test_is_component_parameter_in_database(self):
        with app.app_context():
            database = get_db()
            comp_parameter_name = "compParamTestTest"
            database.execute("INSERT INTO parameter (parameter_id, parameter_name, parameter_type, parameter_value, "
                             "component_id) VALUES ((?), (?), (?), (?), (?))",
                             (-1, comp_parameter_name, "NoneType", "NoValue", -1))
            database.commit()
            result_after_insertion = is_component_parameter_in_database(-1, comp_parameter_name, database)
            self.assertEqual(True, result_after_insertion)

            database.execute("DELETE FROM parameter WHERE parameter_name = (?) AND parameter_id = (?) "
                             "AND component_id = (?)", (comp_parameter_name, -1, -1))
            database.commit()
            result_after_deletion = is_component_parameter_in_database(-1, comp_parameter_name, database)
            self.assertEqual(False, result_after_deletion)

    def test_is_decision_card_parameter_in_database(self):
        with app.app_context():
            database = get_db()
            dc_parameter_name = "dcParamTestTest"
            database.execute("INSERT INTO parameter (parameter_id, parameter_name, parameter_type, parameter_value, "
                             "decision_card_id) VALUES ((?), (?), (?), (?), (?))",
                             (-1, dc_parameter_name, "NoneType", "NoValue", -1))
            database.commit()
            result_after_insertion = is_decision_card_parameter_in_database(-1, dc_parameter_name)
            self.assertEqual(True, result_after_insertion)

            database.execute("DELETE FROM parameter WHERE parameter_name = (?) AND parameter_id = (?) "
                             "AND decision_card_id = (?)", (dc_parameter_name, -1, -1))
            database.commit()
            result_after_deletion = is_decision_card_parameter_in_database(-1, dc_parameter_name)
            self.assertEqual(False, result_after_deletion)

    def test_LocalGitRepoPath(self):
        with app.app_context():
            local_git_repo_path = LocalGitRepoPath()
            self.assertEqual('/../../frontend/src/pages/arrange_components/gitclone', local_git_repo_path.get())

    def test_add_output_json_to_database(self):
        with app.app_context():
            test_output_json = {"test": "test"}
            test_output_json_string = json.dumps(test_output_json)
            database = get_db()
            add_output_json_to_database(database, test_output_json)

            json_output_from_db = database.execute(
                'SELECT output_json FROM general_settings WHERE config_id =1').fetchone()[0]
            database.commit()
            self.assertEqual(json.loads(test_output_json_string), json.loads(json_output_from_db))

            # FIXME: something wrong with string parameter
            database.execute("DELETE FROM general_settings WHERE config_id = 1")
            add_output_json_to_database(database, test_output_json)
            database.commit()
            json_output_from_db_after_deletion = database.execute(
                'SELECT output_json FROM general_settings WHERE config_id =1').fetchone()[0]
            self.assertEqual(json.loads(test_output_json_string), json.loads(json_output_from_db_after_deletion))

    def test_insert_decision_cards_into_database(self):
        with app.app_context():
            decision_cards = [{'name': 'Decision Card 1',
                               'parameter': [{'parameter': 'name', 'type': 'string', 'value': 'dc 1'},
                                             {'parameter': 'value', 'type': 'integer', 'value': '2'},
                                             {'parameter': 'functionality', 'type': 'callback', 'value': 'showAlert'}],
                               'enabled': True}, {'name': 'Decision Card 2', 'parameter': [
                {'parameter': 'name', 'type': 'string', 'value': 'dc 2'},
                {'parameter': 'value', 'type': 'integer', 'value': '4'}], 'enabled': True}, {'name': 'Decision Card 3',
                                                                                             'parameter': [
                                                                                                 {'parameter': 'name',
                                                                                                  'type': 'string',
                                                                                                  'value': 'dc 3'},
                                                                                                 {'parameter': 'value',
                                                                                                  'type': 'integer',
                                                                                                  'value': '8'}],
                                                                                             'enabled': True}]
            database = get_db()
            insert_decision_cards_into_database(database, decision_cards)
            database.commit()

            #################################################################
            # no parameter and decision cards in database and add new ones ##
            #################################################################

            # select name and id of dcs after insertion
            dc_list = database.execute(
                'SELECT decision_card_name, decision_card_id FROM decision_card WHERE config_id =1').fetchall()
            decision_cards_name_result_list = []
            decision_cards_id_result_list = []
            for dc in dc_list:
                # extract all names and id into a separate list
                decision_cards_name_result_list.append(dc[0])
                decision_cards_id_result_list.append(dc[1])
            # check if all inserted names are correct
            self.assertEqual(['Decision Card 1', 'Decision Card 2', 'Decision Card 3'], decision_cards_name_result_list)

            # check if all parameters of first dc are correct
            first_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE decision_card_id = (?)',
                (decision_cards_id_result_list[0],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_dc_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual(['name', 'value', 'functionality'],
                             first_param_name_result_list)
            self.assertEqual(['string', 'integer', 'callback'],
                             first_param_type_result_list)
            self.assertEqual(['dc 1', '2', 'showAlert'],
                             first_param_value_result_list)

            # check if all parameters of second dc are correct
            second_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE decision_card_id = (?)',
                (decision_cards_id_result_list[1],)).fetchall()
            second_param_name_result_list = []
            second_param_type_result_list = []
            second_param_value_result_list = []
            for param in second_dc_param_list:
                second_param_name_result_list.append(param[0])
                second_param_type_result_list.append(param[1])
                second_param_value_result_list.append(param[2])
            self.assertEqual(['name', 'value'],
                             second_param_name_result_list)
            self.assertEqual(['string', 'integer'],
                             second_param_type_result_list)
            self.assertEqual(['dc 2', '4'],
                             second_param_value_result_list)

            # check if all parameters of third dc are correct
            third_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE decision_card_id = (?)',
                (decision_cards_id_result_list[2],)).fetchall()
            third_param_name_result_list = []
            third_param_type_result_list = []
            third_param_value_result_list = []
            for param in third_dc_param_list:
                third_param_name_result_list.append(param[0])
                third_param_type_result_list.append(param[1])
                third_param_value_result_list.append(param[2])
            self.assertEqual(['name', 'value'],
                             third_param_name_result_list)
            self.assertEqual(['string', 'integer'],
                             third_param_type_result_list)
            self.assertEqual(['dc 3', '8'],
                             third_param_value_result_list)

            ######################################################################
            # parameters and decision cards already in database and add new ones #
            ######################################################################

            new_decision_card = [{'name': 'Decision Card 4',
                                  'parameter': [{'parameter': 'new', 'type': 'boolean', 'value': 'true'}],
                                  'enabled': True}]
            insert_decision_cards_into_database(database, new_decision_card)
            database.commit()

            # select name and id of dcs after insertion
            dc_list = database.execute(
                'SELECT decision_card_name, decision_card_id FROM decision_card WHERE config_id =1').fetchall()
            decision_cards_name_result_list = []
            decision_cards_id_result_list = []
            for dc in dc_list:
                # extract all names and id into a separate list
                decision_cards_name_result_list.append(dc[0])
                decision_cards_id_result_list.append(dc[1])
            # check if all inserted names are correct
            self.assertEqual(['Decision Card 1', 'Decision Card 2', 'Decision Card 3', 'Decision Card 4'],
                             decision_cards_name_result_list)

            # check if all parameters of first dc are correct
            first_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE decision_card_id = (?)',
                (decision_cards_id_result_list[3],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_dc_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual(['new'],
                             first_param_name_result_list)
            self.assertEqual(['boolean'],
                             first_param_type_result_list)
            self.assertEqual(['true'],
                             first_param_value_result_list)

            ##########################################################
            # modify parameters of decision card already in database #
            ##########################################################

            new_decision_card = [{'name': 'Decision Card 4',
                                  'parameter': [{'parameter': 'new', 'type': 'string', 'value': 'blabla'}],
                                  'enabled': True}]
            insert_decision_cards_into_database(database, new_decision_card)
            database.commit()

            # select name and id of dcs after insertion
            dc_list = database.execute(
                'SELECT decision_card_name, decision_card_id FROM decision_card WHERE config_id =1').fetchall()
            decision_cards_name_result_list = []
            decision_cards_id_result_list = []
            for dc in dc_list:
                # extract all names and id into a separate list
                decision_cards_name_result_list.append(dc[0])
                decision_cards_id_result_list.append(dc[1])
            # check if all inserted names are correct
            self.assertEqual(['Decision Card 1', 'Decision Card 2', 'Decision Card 3', 'Decision Card 4'],
                             decision_cards_name_result_list)

            # check if all parameters of first dc are correct
            first_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE decision_card_id = (?)',
                (decision_cards_id_result_list[3],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_dc_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual(['new'],
                             first_param_name_result_list)
            self.assertEqual(['string'],
                             first_param_type_result_list)
            self.assertEqual(['blabla'],
                             first_param_value_result_list)

            ###############################################################
            # modify decision card already in database with no parameters #
            ###############################################################

            already_in_db_decision_card = [{'name': 'Decision Card 4',
                                            'parameter': [],
                                            'enabled': True}]
            insert_decision_cards_into_database(database, already_in_db_decision_card)
            database.commit()

            # select name and id of dcs after insertion
            dc_list = database.execute(
                'SELECT decision_card_name, decision_card_id FROM decision_card WHERE config_id =1').fetchall()
            decision_cards_name_result_list = []
            decision_cards_id_result_list = []
            for dc in dc_list:
                # extract all names and id into a separate list
                decision_cards_name_result_list.append(dc[0])
                decision_cards_id_result_list.append(dc[1])
            # check if all inserted names are correct
            self.assertEqual(['Decision Card 1', 'Decision Card 2', 'Decision Card 3', 'Decision Card 4'],
                             decision_cards_name_result_list)

            # check if all parameters of first dc are correct
            first_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE decision_card_id = (?)',
                (decision_cards_id_result_list[3],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_dc_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual([],
                             first_param_name_result_list)
            self.assertEqual([],
                             first_param_type_result_list)
            self.assertEqual([],
                             first_param_value_result_list)

    def test_insert_visual_component_into_database(self):
        with app.app_context():
            test_components = [{'name': 'Comp 1',
                                'parameter': [
                                    {'parameter': 'name', 'type': 'static', 'value': 'comp1'},
                                    {'parameter': 'value', 'type': 'dynamic', 'value': 'aum.mfa.out.PrivateVehicles'}
                                ],
                                'position': {'width': 6, 'height': 12, 'x': 0, 'y': 24}, 'enabled': True,
                                'toolbox': False},
                               {'name': 'Comp 2',
                                'parameter': [
                                    {'parameter': 'name', 'type': 'static', 'value': 'comp2'},
                                    {'parameter': 'value', 'type': 'dynamic', 'value': 'aum.mfa.out.Industries'}
                                ],
                                'position': {'width': 8, 'height': 22, 'x': 2, 'y': 5}, 'enabled': True,
                                'toolbox': True}
                               ]
            database = get_db()
            insert_visual_component_into_database(database, test_components)
            database.commit()

            ####################################################################
            # no parameter and visual components in database and add new ones ##
            ####################################################################

            # select name and id of components after insertion
            comp_list = database.execute(
                'SELECT component_name, component_id, width, height, x, y, enabled, toolbox '
                'FROM component WHERE config_id =1').fetchall()
            component_name_result_list = []
            component_id_result_list = []
            component_metadata_result_list = []
            for component in comp_list:
                # extract all names and id into a separate list
                component_name_result_list.append(component[0])
                component_id_result_list.append(component[1])
                component_metadata_result_list.append((component[2], component[3], component[4], component[5],
                                                       component[6], component[7]))
            # check if all inserted names are correct
            self.assertEqual(['Comp 1', 'Comp 2'], component_name_result_list)
            self.assertEqual([(6, 12, 0, 24, 1, 0), (8, 22, 2, 5, 1, 1)], component_metadata_result_list)

            # check if all parameters of first component are correct
            first_component_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE component_id = (?)',
                (component_id_result_list[0],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_component_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual(['name', 'value'],
                             first_param_name_result_list)
            self.assertEqual(['static', 'dynamic'],
                             first_param_type_result_list)
            self.assertEqual(['comp1', 'aum.mfa.out.PrivateVehicles'],
                             first_param_value_result_list)

            # check if all parameters of second component are correct
            second_component_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE component_id = (?)',
                (component_id_result_list[1],)).fetchall()
            second_param_name_result_list = []
            second_param_type_result_list = []
            second_param_value_result_list = []
            for param in second_component_param_list:
                second_param_name_result_list.append(param[0])
                second_param_type_result_list.append(param[1])
                second_param_value_result_list.append(param[2])
            self.assertEqual(['name', 'value'],
                             second_param_name_result_list)
            self.assertEqual(['static', 'dynamic'],
                             second_param_type_result_list)
            self.assertEqual(['comp2', 'aum.mfa.out.Industries'],
                             second_param_value_result_list)

            #########################################################################
            # parameters and visual components already in database and add new ones #
            #########################################################################
            new_component = [{'name': 'Comp 3',
                              'parameter': [
                                  {'parameter': 'name', 'type': 'dynamic', 'value': 'comp3'},
                              ],
                              'position': {'width': 2, 'height': 4, 'x': 9, 'y': 25}, 'enabled': True,
                              'toolbox': False}]
            insert_visual_component_into_database(database, new_component)
            database.commit()

            # select name and id of components after insertion
            comp_list = database.execute(
                'SELECT component_name, component_id, width, height, x, y, enabled, toolbox '
                'FROM component WHERE config_id =1').fetchall()
            components_name_result_list = []
            components_id_result_list = []
            component_metadata_result_list = []
            for components in comp_list:
                # extract all names and id into a separate list
                components_name_result_list.append(components[0])
                components_id_result_list.append(components[1])
                component_metadata_result_list.append((component[2], component[3], component[4], component[5],
                                                       component[6], component[7]))
            # check if all inserted names are correct
            self.assertEqual(['Comp 1', 'Comp 2', 'Comp 3'],
                             components_name_result_list)
            self.assertEqual([(6, 12, 0, 24, 1, 0), (8, 22, 2, 5, 1, 1), (2, 4, 9, 25, 1, 0)].sort(),
                             component_metadata_result_list.sort())

            # check if all parameters of new component are correct
            first_components_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE component_id = (?)',
                (components_id_result_list[2],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_components_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual(['name'],
                             first_param_name_result_list)
            self.assertEqual(['dynamic'],
                             first_param_type_result_list)
            self.assertEqual(['comp3'],
                             first_param_value_result_list)

            ##########################################################
            # modify parameters of decision card already in database #
            ##########################################################

            new_modified_component = [{'name': 'Comp 3',
                                       'parameter': [
                                           {'parameter': 'name', 'type': 'dependent', 'value': 'newValue'},
                                       ],
                                       'position': {'width': 8, 'height': 8, 'x': 8, 'y': 8}, 'enabled': False,
                                       'toolbox': True}]
            insert_visual_component_into_database(database, new_modified_component)
            database.commit()

            # select name and id of components after insertion
            comp_list = database.execute(
                'SELECT component_name, component_id, width, height, x, y, enabled, toolbox '
                'FROM component WHERE config_id =1').fetchall()
            components_name_result_list = []
            components_id_result_list = []
            component_metadata_result_list = []
            for component in comp_list:
                # extract all names and id into a separate list
                components_name_result_list.append(component[0])
                components_id_result_list.append(component[1])
                component_metadata_result_list.append((component[2], component[3], component[4], component[5],
                                                       component[6], component[7]))
            # check if all inserted names are correct
            self.assertEqual(['Comp 1', 'Comp 2', 'Comp 3'],
                             components_name_result_list)
            self.assertEqual([(6, 12, 0, 24, 1, 0), (8, 22, 2, 5, 1, 1), (8, 8, 8, 8, 0, 1)].sort(),
                             component_metadata_result_list.sort())

            # check if all parameters of first component are correct
            first_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE component_id = (?)',
                (components_id_result_list[2],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_dc_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual(['name'],
                             first_param_name_result_list)
            self.assertEqual(['dependent'],
                             first_param_type_result_list)
            self.assertEqual(['newValue'],
                             first_param_value_result_list)

            ##################################################################
            # modify visual component already in database with no parameters #
            ##################################################################

            already_in_db_decision_card = [{'name': 'Comp 3',
                                            'parameter': [],
                                            'position': {'width': 9, 'height': 9, 'x': 9, 'y': 9}, 'enabled': True,
                                            'toolbox': True}]
            insert_visual_component_into_database(database, already_in_db_decision_card)
            database.commit()

            # select name and id of components after insertion
            comp_list = database.execute(
                'SELECT component_name, component_id, width, height, x, y, enabled, toolbox '
                'FROM component WHERE config_id =1').fetchall()
            components_name_result_list = []
            components_id_result_list = []
            component_metadata_result_list = []
            for component in comp_list:
                # extract all names and id into a separate list
                components_name_result_list.append(component[0])
                components_id_result_list.append(component[1])
                component_metadata_result_list.append((component[2], component[3], component[4], component[5],
                                                       component[6], component[7]))
            # check if all inserted names are correct
            self.assertEqual(['Comp 1', 'Comp 2', 'Comp 3'],
                             components_name_result_list)
            self.assertEqual([(6, 12, 0, 24, 1, 0), (8, 22, 2, 5, 1, 1), (9, 9, 9, 9, 1, 1)].sort(),
                             component_metadata_result_list.sort())

            # check if all parameters of first component are correct
            first_dc_param_list = database.execute(
                'SELECT parameter_name, parameter_type, parameter_value FROM parameter WHERE component_id = (?)',
                (components_id_result_list[2],)).fetchall()
            first_param_name_result_list = []
            first_param_type_result_list = []
            first_param_value_result_list = []
            for param in first_dc_param_list:
                first_param_name_result_list.append(param[0])
                first_param_type_result_list.append(param[1])
                first_param_value_result_list.append(param[2])
            self.assertEqual([],
                             first_param_name_result_list)
            self.assertEqual([],
                             first_param_type_result_list)
            self.assertEqual([],
                             first_param_value_result_list)

    def test_clone_git_repo_and_store_path_in_database(self):
        with app.app_context():
            database = get_db()
            git_repo_address = "https://github.com/sarahzu/Visual-Components-Testcase-2"
            result = clone_git_repo_and_store_path_in_database(git_repo_address, database, "LOCAL_TEST_REPO_PATH")
            database.commit()
            self.assertEqual({'success': True}, result)
            git_repo_in_database = database.execute(
                'SELECT git_repo_address FROM general_settings WHERE config_id = 1').fetchone()[0]
            self.assertEqual(git_repo_address, git_repo_in_database)

    def test_extract_visual_component_and_decision_cards_information_from_git_repo(self):
        with app.app_context():
            env_string = "LOCAL_TEST_REPO_PATH"
            result = extract_visual_component_and_decision_cards_information_from_git_repo(env_string, self.clone_url)
            expected_result = {'input': {'components': ['DonutChart3'],
                                         'componentsParameters': [{'description': 'bla',
                                                                   'name': 'DonutChart3',
                                                                   'rows': [{'parameter': 'type',
                                                                             'type': 'string',
                                                                             'value': 'gradient'},
                                                                            {'parameter': 'dataLabelsEnabled',
                                                                             'type': 'boolean',
                                                                             'value': 'true'}]}],
                                         'decisionCards': ['Decision Card 1',
                                                           'Decision Card 2',
                                                           'Decision Card 3'],
                                         'decisionCardsParameters': [{'description': 'bliiiiii',
                                                                      'name': 'Decision Card 1',
                                                                      'rows': [{'parameter': 'name',
                                                                                'type': 'string',
                                                                                'value': 'dc 1'},
                                                                               {'parameter': 'value',
                                                                                'type': 'integer',
                                                                                'value': '2'},
                                                                               {'parameter': 'functionality',
                                                                                'type': 'callback',
                                                                                'value': 'showAlert'}]},
                                                                     {'description': 'blooob',
                                                                      'name': 'Decision Card 2',
                                                                      'rows': [{'parameter': 'name',
                                                                                'type': 'string',
                                                                                'value': 'dc 2'},
                                                                               {'parameter': 'value',
                                                                                'type': 'integer',
                                                                                'value': '4'}]},
                                                                     {'description': 'blob blob blob',
                                                                      'name': 'Decision Card 3',
                                                                      'rows': [{'parameter': 'name',
                                                                                'type': 'string',
                                                                                'value': 'dc 3'},
                                                                               {'parameter': 'value',
                                                                                'type': 'integer',
                                                                                'value': '8'}]}]}}
            self.assertEqual(expected_result, result)

    def test_get_git_repo_address(self):
        with app.app_context():
            database = get_db()
            git_path = get_git_repo_address(database)
            self.assertEqual(self.clone_url, git_path)

    def test_erase_output_json_and_everything_from_parameter_component_and_dc_tables_in_db(self):
        with app.app_context():
            database = get_db()
            erase_output_json_and_everything_from_parameter_component_and_dc_tables_in_db(database)
            database.commit()

            git_repo = database.execute("SELECT output_json From general_settings WHERE config_id = 1").fetchone()[0]
            comps = database.execute("SELECT * From component").fetchone()
            dcs = database.execute("SELECT * From decision_card").fetchone()
            params = database.execute("SELECT * From parameter").fetchone()

            self.assertEqual(None, git_repo)
            self.assertEqual(None, comps)
            self.assertEqual(None, params)
            self.assertEqual(None, dcs)

    def test_extract_value_from_models_according_to_location(self):
        with app.app_context():
            input_json = {'new_source': 'aum.mfa.out.OtherBuildings', 'node_path': 'value.10.value'}
            value = extract_value_from_models_according_to_location(input_json, True)
            self.assertEqual({'value': 300}, value)

    @classmethod
    def tearDownClass(cls):
        """
        clear database after all tests have run and delete created Github Repo
        :return:
        """
        with app.app_context():
            database = get_db()
            database.execute("DELETE FROM parameter")
            database.execute("DELETE FROM component")
            database.execute("DELETE FROM decision_card")
            database.execute("DELETE FROM general_settings")
            database.commit()

        # remove created github repo
        local_repo_path = Path(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_TEST_REPO_PATH"))
        if local_repo_path.exists() and local_repo_path.is_dir():
            shutil.rmtree(local_repo_path)


if __name__ == '__main__':
    unittest.main()
