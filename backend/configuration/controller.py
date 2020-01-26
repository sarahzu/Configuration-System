import os, json

# from configuration import model
import re

import git

# from configuration_model import GitRepo, is_new_pull_available, pull_from_remote, find_js_files, getDC, get_all_model_names, \
#    get_value_from_data, get_value_from_origin_name

from configuration.configuration_model import GitRepo, is_new_pull_available, pull_from_remote, find_js_files, getDC, get_all_model_names, \
    get_value_from_data, get_value_from_origin_name
# sys.path.append('/configuration')


def get_model_names():
    """
    extract all the modes in the demo data files

    :return:
    """
    input_models = get_all_model_names(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_DEMO_DATA_PATH_IN"))
    output_models = get_all_model_names(os.path.dirname(os.path.abspath(__file__)) + os.getenv("LOCAL_DEMO_DATA_PATH_OUT"))
    all_models = input_models + output_models
    return all_models


def get_value_from_data_json(source_name, node_path_string, testing):
    """
    extract a value from the given source

    :param source_name:     name of the source e.g. aum.mfa.out.ResidentialBuildings
    :param testing          True if method is used for unit testing, False otherwise
    :return:                final value
    """
    try:
        return get_value_from_origin_name(source_name, node_path_string, testing)
    except():
        return ""


class Controller:

    def __init__(self, git_repo_address, local_repo_path):
        self.git_repo_address = git_repo_address
        self.local_repo_path = local_repo_path
        # clone_url = os.getenv("REPO_PATH")
        try:
            self.git_repo = GitRepo(self.local_repo_path, self.git_repo_address)
            self.git_repo_created = True
        except Exception:
            self.git_repo_created = False

    def get_components(self):
        json_request = {
            "latitude": 0.0000,
            "longitude": 0.0000,
            "start_date": "2019-12-04",
            "end_date": "2019-12-05"
        }
        return json.dumps(json_request)

    def get_visual_components_name_list(self):
        """
        get a list with the names of all visual components
        :return: dummy values so far
        """
        return json.dumps({"visual components": ["Component 1", "Component 2", "Component 3", "Component 4",
                                                 "Component 5", "Component 6"]})

    def is_new_pull_request_available(self):
        """
        Check if new pull request is available for this local git repo

        :return: {Boolean} true if pull is available, false otherwise
        """
        return is_new_pull_available(self.local_repo_path)

    def pull_from_remote_repo(self):
        """
        trigger pull command for this local git repo

        :return: {Boolean} true if pull was successful, false otherwise
        """
        return pull_from_remote(self.local_repo_path)

    def get_file_names(self):
        """
        return a list with all file names from all components

        :return: {list} list containing all filenames
        """
        components_list = find_js_files(self.local_repo_path, False)
        filenames_list = []
        for comp in components_list:
            filename = comp.get("filename")
            filenames_list.append(filename)
        return filenames_list

    def get_configuration_settings_input(self):
        """
        return a json object with all information needed, to build the configuration frontend page
        :return: {json} input file
        """
        components_list = find_js_files(self.local_repo_path, False)
        components_names_list = []
        parameter_list = []
        for comp in components_list:
            comp_name = comp.get("name")
            param_list = comp.get("parameters")

            rows_content_list = []
            for param_dict in param_list:
                param_type = param_dict.get('type')
                if param_type == 'dependent':
                    # if parameter is dependent, set name to the parameter it depends on
                    param_name = param_dict.get('dependentOn')
                else:
                    # name of the parameter
                    param_name = param_dict.get('name')
                default_value = param_dict.get('defaultValue')

                row_dict = {'parameter': param_name, 'type': param_type, 'value': default_value}
                rows_content_list.append(row_dict)

            components_names_list.append(comp_name)
            parameter_list.append({"name": comp_name, "rows": rows_content_list, "description": "bla"})

        description_cards_info = getDC()

        json_test = {
            "components": components_names_list,
            "componentsParameters": parameter_list,
            "decisionCards": description_cards_info.get("decisionCards"),
            "decisionCardsParameters": description_cards_info.get("decisionCardsParameters")

        }
        # return json_input
        return json_test


# if __name__ == '__main__':
#     controller = Controller()
#     print(controller.get_configuration_settings_input())
