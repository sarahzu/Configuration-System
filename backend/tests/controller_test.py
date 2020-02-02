import shutil
import unittest

import sys
import os
from pathlib import Path

from ..configuration.configuration_controller import get_model_names, get_value_from_data_json, Controller

ROOT_DIR = os.path.abspath(os.curdir)

sys.path.append(ROOT_DIR + '/backend/configuration')


class ControllerTest(unittest.TestCase):

    def test_controller(self):
        clone_url = "https://github.com/sarahzu/Visual-Components-Testcase-2.git"
        local_repo_path = ROOT_DIR + "/backend/tests/testing-repos/local"
        controller = Controller(clone_url, local_repo_path)

        self.assertEqual(controller.git_repo_created, True)

        self.assertEqual(controller.is_new_pull_request_available(), False)

        self.assertEqual(controller.pull_from_remote_repo(), False)

        self.assertEqual(controller.get_file_names(), ["DonutChart"])

        expected_configuration_setting = {
            "components": ["DonutChart"],
            "componentsParameters": [{"name": "DonutChart",
                                      "rows": [{"parameter": "type", "type": "string", "value": "gradient"},
                                               {"parameter": "dataLabelsEnabled", "type": "boolean", "value": "true"}],
                                      "description": "bla"}],
            'decisionCards': ['Decision Card 1', 'Decision Card 2', 'Decision Card 3'],
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
                                                   'value': '8'}]}]}

        self.assertEqual(controller.get_configuration_settings_input(), expected_configuration_setting)

    def test_get_model_names(self):
        return_value = get_model_names()
        expected_value = ["aum.mfa.in.PublicVehicles", "aum.mfa.out.EndOfLifeMgmt", "aum.mfa.out.Energy",
                          "aum.mfa.out.Industry", "aum.mfa.out.Infrastructure", "aum.mfa.out.OtherBuildings",
                          "aum.mfa.out.PrivateVehicles", "aum.mfa.out.PublicVehicles",
                          "aum.mfa.out.ResidentialBuildings"]
        self.assertEqual(return_value.sort(), expected_value.sort())

    def test_get_value_from_data_json(self):
        value_origin = "aum.mfa.out.PublicVehicles"
        node_path_string = "value.1.value"
        return_value = get_value_from_data_json(value_origin, node_path_string, True)
        expected_value = 3300
        self.assertEqual(return_value, expected_value)

    @classmethod
    def tearDownClass(cls):
        """
        delete all created folders
        :return:
        """
        local_repo_path = Path(ROOT_DIR + "/backend/tests/testing-repos/local")
        if local_repo_path.exists() and local_repo_path.is_dir():
            shutil.rmtree(local_repo_path)


if __name__ == '__main__':
    unittest.main()
