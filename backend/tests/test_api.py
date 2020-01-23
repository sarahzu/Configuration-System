import sqlite3
import unittest
import sys
import os

from flask import Flask, request, current_app, g
from flask_restful import Resource, Api
from flask_cors import CORS

from configuration.configuration_model import GitRepo
from configuration.api import enterGitRepoAddressIntoDatabase, get_git_repo_address, is_component_in_database, \
    is_decision_card_in_database
from configuration.db import init_app

ROOT_DIR = os.path.abspath(os.curdir)

app = Flask(__name__)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'configuration-system.sqlite'),
)
api = Api(app)
CORS(app)

# initialize database
init_app(app)


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            ROOT_DIR + "/../instance/configuration-system.sqlite")
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
            self.assertEqual(self.clone_url, get_git_repo_address())

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
        pass
        # TODO


if __name__ == '__main__':
    unittest.main()
