import mmap
import re
import shutil
import sys
from os.path import isfile, join

from git import Repo
import os
import git

from dotenv import load_dotenv
import json

load_dotenv()

operating_system = sys.platform


def is_new_pull_available(local_repo_path):
    """
    check if a new pull is available for a given Github Repository.

    :param local_repo_path: {String}    path to the local git repo
    :return:                {Boolean}   True if pull is available, False otherwise
    """
    try:
        #  because on different operating systems the git commands do not return the exact same thing, I
        #  check for different operating systems differently for available pulls

        #  windows 10
        if operating_system == "win32":
            g = git.cmd.Git(local_repo_path)
            git_remote_show_origin = g.execute(["git", "status"])
            regex = re.compile(r'Your branch is up to date with')
            match = re.search(regex, git_remote_show_origin)
            if not match:
                return True
            else:
                return False

        #  Linux
        elif operating_system == "linux" or operating_system == "linux2":
            g = git.cmd.Git(local_repo_path)
            git_remote_show_origin = g.execute(["git", "diff", "master"])
            # regex = re.compile(r'Your branch is up to date with')
            #  match = re.search(regex, git_remote_show_origin)
            if git_remote_show_origin is not "":
                return True
            else:
                return False

        #  mac OS X and others
        else:
            g = git.cmd.Git(local_repo_path)
            git_remote_show_origin = g.execute(["git", "remote", "show", "origin"])
            regex = re.compile(r'master pushes to master \((.*)\)')
            match = re.search(regex, git_remote_show_origin)
            up_to_date_status = match.group(1)
            if up_to_date_status == 'local out of date':
                return True
            else:
                return False

    except (git.exc.GitCommandError, git.exc.GitCommandNotFound, AttributeError):
        return False


def clone_git_repo(cloneUrl, localRepoPath):
    """
    clone a Github Repo with the given url at the given path location.

    :param cloneUrl:        {String}    git remote repo url
    :param localRepoPath:   {String}    path to location, where remote repo should be cloned to
    :return:
    """
    Repo.clone_from(cloneUrl, localRepoPath)


class GitRepo:
    """
    Creating and maintaining a given Github Repository.
    """

    def __init__(self, local_repo_path, clone_url):
        """
        if given git repo at the clone url is not already cloned, clone it. If it is already there, pull to check
        for new updates.

        :param local_repo_path:   {String}  path to local repo
        :param clone_url:         {String}  url used to clone the remote repo
        """
        self.local_repo_path = local_repo_path

        # if dir of localRepoPath does not exists
        if not os.path.isdir(self.local_repo_path):
            clone_git_repo(clone_url, self.local_repo_path)
        # if dir of localRepPath exists but is empty
        elif len(os.listdir(self.local_repo_path)) == 0:
            clone_git_repo(clone_url, self.local_repo_path)
        # if dir already exists and has content
        else:
            try:
                g = git.cmd.Git(self.local_repo_path)
                git_remote_show_origin = g.execute(["git", "remote", "show", "origin"])
                regex = re.compile(r'Fetch\sURL\:\s((https|git).*.git)')
                match = re.search(regex, git_remote_show_origin)
                current_clone_url = match.group(1)
                # if git repo in local repo path is not the same repo as given in the clone url
                if not current_clone_url == clone_url:
                    # remove all files form folder and clone new git repo from given clone url
                    shutil.rmtree(self.local_repo_path)
                    clone_git_repo(clone_url, self.local_repo_path)
                # else:
                #     repo = git.Repo(self.localRepoPath)
                #     if isNewPullAvailable(repo):
                #         repo.remotes.origin.pull()
            except git.exc.InvalidGitRepositoryError:
                print("dir is full with non git related content")

    def get_visual_components_from_git(self):
        return find_js_files(self.local_repo_path)


def pull_from_remote(local_repo_path):
    """
    trigger git pull request for the given git repo

    :param local_repo_path: {String}    path to local git repo
    :return:                {Boolean}   True if pull was successful, False otherwise
    """
    repo = git.Repo(local_repo_path)
    if is_new_pull_available(local_repo_path):
        repo.remotes.origin.pull()
        return True
    else:
        return False


def find_js_files(dirPath, testing):
    """
    go through given path and find all visual components in all javascript files

    :param dirPath: {String}    path to location which has to be searched for visual components
    :param testing  {Boolean}   True if method used for testing, False otherwise
    :return:        {List}      list of all components information in the form {'name': name, 'path': path}
    """
    vis_comp_name_list = []
    for root, dirs, files in os.walk(dirPath):
        for file in files:
            if file.endswith(".js"):
                # print(os.path.join(root, file))
                file_path = os.path.join(root, file)
                # with open(file_path, 'rb', 0) as f, \
                #        mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as s:
                with open(file_path) as f:
                    vis_comp_found = False
                    end_of_doc_string_found = False
                    parameter_list = []
                    for line in f:
                        if line.find(' * @visComp') != -1:
                            vis_comp_found = True
                            # reset parameter list form previously found component
                            parameter_list = []
                        elif vis_comp_found and re.compile(r'\s\*\s@props.*').match(line):
                            regex = re.compile(
                                r'\s\*[\s|\t]@props[\s|\t]{(.*?)\}[\s|\t](.*?)[\s|\t]?(\[(.*)\])?[\s|\t](\((.*?)\))?[\s|\t]?({(.*?)\})?')
                            match = re.search(regex, line)
                            try:
                                props_type = match.group(1)
                                props_name = match.group(2)
                            except AttributeError:
                                props_type = ""
                                props_name = ""

                            try:
                                default_value = match.group(4)
                            except (AttributeError, TypeError):
                                default_value = ""

                            try:
                                value_dependent = match.group(8)
                                # add name of parameter to dependent value so that the frontend knows
                                # where to put the values
                                value_dependent = props_name + "--" + value_dependent
                            except Exception:
                                value_dependent = ""

                            try:
                                value_origin = match.group(6)

                                default_value = get_value_from_origin_name(value_origin, None, testing)

                            except (TypeError, AttributeError):
                                pass

                            parameter_list.append(
                                {'name': props_name, 'type': props_type, 'defaultValue': default_value,
                                 'dependentOn': value_dependent})
                        elif vis_comp_found and line.find(' */') != -1:
                            end_of_doc_string_found = True
                        elif vis_comp_found and end_of_doc_string_found and (
                                line.startswith('class') or line.startswith('function')):
                            vis_comp_found = False
                            end_of_doc_string_found = False

                            regex = re.compile(r'(class|function)\s(\w+).*{')
                            match = re.search(regex, line)
                            try:
                                component_name = match.group(2)
                            except Exception:
                                component_name = ""

                            # extract filename path after gitclone folder
                            regex_filename = re.compile(r'(.*?)gitclone(.*)')
                            match_filename = re.search(regex_filename, file_path)
                            try:
                                filename = match_filename.group(2)[:-3]
                                filename = filename[1:]
                                # filename = "src/components/CarbonBudget/CarbonBudget"
                            except Exception:
                                filename = os.path.basename(f.name).strip('.js')

                            component_info = {'name': component_name, 'filename': filename,
                                              'path': file_path, 'parameters': parameter_list}
                            vis_comp_name_list.append(component_info)
    return vis_comp_name_list


def get_value_from_origin_name(value_origin, node_path_string, testing):
    """
    extract in or out value, filename, and tree node elements form given origin name

    :param node_path_string:    {String}    node path to value. None if path to value is included in value_origin
    :param value_origin:        {String}    origin of the value, e.g. aum.mfa.out.PrivateVehicles
    :param testing              {Boolean}   True if method used for unit testing, False otherwise
    :return:                    {*}         final value
    """

    try:
        filename_regex = re.compile(r'(aum\.mfa\.(out|in)\..*?)(\.+(.+)|$)')
        filename_match = re.search(filename_regex, value_origin)
        filename = filename_match.group(1)
        input_or_output_file = filename_match.group(2)

        if node_path_string is not None:
            path = node_path_string
            value_origin_tree_notes = path.split('.')

        else:
            path = filename_match.group(4)
            value_origin_tree_notes = path.split('.')

        # get data from json file
        return get_value_from_data(input_or_output_file, filename, value_origin_tree_notes, testing)
    except AttributeError:
        return "1"


def get_value_from_data(input_or_output_file, filename, value_origin_tree_notes, testing):
    """
    extract a value from a data json file

    :param input_or_output_file:    {String}    "in" if input, "out" if output file
    :param filename:                {String}    filename of the data json
    :param value_origin_tree_notes: {List}      list of all tree notes that have to be passed to get to the final value
                                                e.g. ["value", "1", "name"]
    :param testing:                 {Boolean}   True if method is used for testing, False otherwise
    :return:                        {*}         final value
    """
    if not testing:
        data = open_data_file(input_or_output_file, filename, "LOCAL_DEMO_DATA_PATH_IN", "LOCAL_DEMO_DATA_PATH_OUT")
    else:
        data = open_data_file(input_or_output_file, filename, "LOCAL_TEST_DEMO_DATA_PATH_IN",
                              "LOCAL_TEST_DEMO_DATA_PATH_OUT")
    return get_parent_node_from_value_origin_tree(data, value_origin_tree_notes)


def get_parent_node_from_value_origin_tree(data, value_origin_tree_notes):
    """
    extract value from given model data tree

    :param data:                    {Dictionary} model data
    :param value_origin_tree_notes: {List} list of path nodes to the desired value
    :return:
    """
    try:
        parent_node = data
        for node in value_origin_tree_notes:
            current_node = parent_node[node]
            parent_node = current_node
        return parent_node
    except KeyError:
        return "1"


def open_data_file(input_or_output_file, filename, local_data_in_env_string, local_data_out_env_string):
    """
    open model file and return its file data

    :param input_or_output_file:        {String}    "in" if input, "out" if output file
    :param filename:                    {String}    name of the model file
    :param local_data_in_env_string:    {String}    name of the env parameter which stores the location of the input model files
    :param local_data_out_env_string:   {String}    name of the env parameter which stores the location of the output model files
    :return:
    """
    try:
        if input_or_output_file == "in":
            file_path = os.path.dirname(os.path.abspath(__file__)) + os.getenv(
                local_data_in_env_string)
            data_file = open(file_path + "/" + filename + ".json", "r")
        else:
            file_path = os.path.dirname(os.path.abspath(__file__)) + os.getenv(
                local_data_out_env_string)
            data_file = open(file_path + "/" + filename + ".json", "r")
        data_file_converted = json.load(data_file)
        data_file.close()
        return data_file_converted
    except FileNotFoundError:
        return {}


def get_all_model_names(model_path):
    """
    extract all models form the given path

    :param model_path:  {String}    path to the folder with all model json files
    :return:            {List}      list with all model filenames
    """
    try:
        filenames = [f for f in os.listdir(model_path) if
                     isfile(join(model_path, f)) and f.endswith(".json")]
        name_index = 0
        for name in filenames:
            # striped_name = name.strip('.json')
            striped_name = re.sub(r"\.json", "", name)
            filenames[name_index] = striped_name
            name_index += 1
        return filenames
    except FileNotFoundError:
        return []


def get_decision_cards():
    """
    This method return demo decision cards data. When the AUM system is ready, this method has to be replaced
    with a method that extract the decision cards data form the AUM system.

    :return:    {Dictionary}    all information about all available decision cards
    """
    return {"decisionCards": [
        "Decision Card 1",
        "Decision Card 2",
        "Decision Card 3"
    ],
        "decisionCardsParameters": [
            {
                "name": "Decision Card 1",
                "rows": [
                    {
                        "parameter": "name",
                        "type": "string",
                        "value": "dc 1"
                    },
                    {
                        "parameter": "value",
                        "type": "integer",
                        "value": "2"
                    },
                    {
                        "parameter": "functionality",
                        "type": "callback",
                        "value": "showAlert"
                    }
                ],
                "description": "bliiiiii"
            },
            {
                "name": "Decision Card 2",
                "rows": [
                    {
                        "parameter": "name",
                        "type": "string",
                        "value": "dc 2"
                    },
                    {
                        "parameter": "value",
                        "type": "integer",
                        "value": "4"
                    }
                ],
                "description": "blooob"
            },
            {
                "name": "Decision Card 3",
                "rows": [
                    {
                        "parameter": "name",
                        "type": "string",
                        "value": "dc 3"
                    },
                    {
                        "parameter": "value",
                        "type": "integer",
                        "value": "8"
                    }
                ],
                "description": "blob blob blob"
            }
        ]}
