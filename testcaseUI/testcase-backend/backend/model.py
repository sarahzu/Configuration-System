import json
import mmap
import re
import shutil

from git import Repo
import os
import git

from dotenv import load_dotenv

load_dotenv()


def cloneGitRepo(cloneUrl, localRepoPath):
    """
    clone a git repo with the given url at the given path location.

    :param cloneUrl:        git remote repo url
    :param localRepoPath:   path to location, where remote repo should be cloned to
    :return:
    """
    Repo.clone_from(cloneUrl, localRepoPath)


def is_new_pull_available(local_repo_path):
    """
    check if a new pull is available for a given git repo.

    :param local_repo_path: path to the local git repo
    :return: {boolean} true if pull is available, false otherwise
    """
    g = git.cmd.Git(local_repo_path)
    git_remote_show_origin = g.execute(["git", "remote", "show", "origin"])
    regex = re.compile(r'master pushes to master \((.*)\)')
    match = re.search(regex, git_remote_show_origin)
    up_to_date_status = match.group(1)

    if up_to_date_status == 'local out of date':
        return True
    else:
        return False


def pull_from_remote(local_repo_path):
    """
    trigger git pull request for the given git repo

    :param local_repo_path: path to local git repo
    :return: {Boolean} true if pull was successful, false otherwise
    """
    repo = git.Repo(local_repo_path)
    if is_new_pull_available(local_repo_path):
        repo.remotes.origin.pull()
        return True
    else:
        return False


class GitRepo:
    """
    Creating and maintaining a given git Repo
    """

    def __init__(self, localRepoPath, cloneUrl):
        """
        if given git repo at the clone url is not already cloned, clone it. If it is already there, pull to check
        for new updates.

        :param localRepoPath:   path to local repo
        :param cloneUrl:        url used to clone the remote repo
        """
        self.localRepoPath = localRepoPath

        # if dir of localRepoPath does not exists
        if not os.path.isdir(self.localRepoPath):
            cloneGitRepo(cloneUrl, self.localRepoPath)
        # if dir of localRepPath exists but is empty
        elif len(os.listdir(self.localRepoPath)) == 0:
            cloneGitRepo(cloneUrl, self.localRepoPath)
        # if dir already exists and has content
        else:
            try:
                g = git.cmd.Git(self.localRepoPath)
                git_remote_show_origin = g.execute(["git", "remote", "show", "origin"])
                regex = re.compile(r'Fetch\sURL\:\s((https|git).*.git)')
                match = re.search(regex, git_remote_show_origin)
                current_clone_url = match.group(1)
                # if git repo in local repo path is not the same repo as given in the clone url
                if not current_clone_url == cloneUrl:
                    # remove all files form folder and clone new git repo from given clone url
                    shutil.rmtree(self.localRepoPath)
                    cloneGitRepo(cloneUrl, self.localRepoPath)
                # else:
                #     repo = git.Repo(self.localRepoPath)
                #     if isNewPullAvailable(repo):
                #         repo.remotes.origin.pull()
            except git.exc.InvalidGitRepositoryError:
                print("dir is full with non git related content")

    def get_visual_components_from_git(self):
        return findJsFiles(self.localRepoPath)


def findJsFiles(dirPath):
    """
    go through given path and find all visual components in all javascript files

    :param dirPath:     path to location which has to be searched for visual components
    :return: {list}     list of all components information in the form {'name': name, 'path': path}
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
                                r'\s\*[\s|\t]@props[\s|\t]{(.*)\}[\s|\t](.*?)[\s|\t]?(\[(.*)\])?[\s|\t](\((.*?)\))?[\s|\t]?({(.*?)\})?')
                            match = re.search(regex, line)
                            props_type = match.group(1)
                            props_name = match.group(2)

                            try:
                                default_value = match.group(4)
                            except():
                                default_value = ""

                            try:
                                value_dependent = match.group(8)
                                # add name of parameter to dependent value so that the frontend knows
                                # where to put the values
                                value_dependent = props_name + "--" + value_dependent
                            except TypeError:
                                value_dependent = ""

                            try:
                                value_origin = match.group(6)

                                default_value = get_value_from_origin_name(value_origin, None)

                            except (TypeError, AttributeError):
                                pass

                            parameter_list.append(
                                {'name': props_name, 'type': props_type, 'defaultValue': default_value,
                                 'dependentOn': value_dependent})
                        elif vis_comp_found and line.find(' */') != -1:
                            end_of_doc_string_found = True
                        elif vis_comp_found and end_of_doc_string_found and line.startswith('class'):
                            vis_comp_found = False
                            end_of_doc_string_found = False

                            regex = re.compile(r'class\s(\w+).*{')
                            match = re.search(regex, line)
                            component_name = match.group(1)

                            component_info = {'name': component_name, 'filename': os.path.basename(f.name).strip('.js'),
                                              'path': file_path, 'parameters': parameter_list}
                            vis_comp_name_list.append(component_info)
    return vis_comp_name_list


def get_value_from_origin_name(value_origin, node_path_string):
    """
    extract in or out value, filename, and tree node elements form given origin name

    :param node_path_string:    node path to value. None if path to value is included in value_origin
    :param value_origin:        origin of the value, e.g. aum.mfa.out.PrivateVehicles
    :return:                    final value
    """

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
    return get_value_from_data(input_or_output_file, filename, value_origin_tree_notes)


def get_value_from_data(input_or_output_file, filename, value_origin_tree_notes):
    """
    extract a value from a data json file

    :param input_or_output_file:    "in" if input, "out" if output file
    :param filename:                filename of the data json
    :param value_origin_tree_notes: list of all tree notes that have to be passed to get to the final value e.g.
                                    ["value", "1", "name"]
    :return:                        final value
    """
    try:
        if input_or_output_file == "in":
            data_file = open(os.path.dirname(os.path.abspath(__file__)) + os.getenv(
                "LOCAL_DEMO_DATA_PATH_IN") + "/" + filename + ".json", "r")
        else:
            data_file = open(os.path.dirname(os.path.abspath(__file__)) + os.getenv(
                "LOCAL_DEMO_DATA_PATH_OUT") + "/" + filename + ".json", "r")
        data = json.load(data_file)
    except FileNotFoundError:
        data = {}

    try:
        parent_node = data
        for node in value_origin_tree_notes:
            current_node = parent_node[node]
            parent_node = current_node
        return parent_node
    except KeyError:
        return "1"

