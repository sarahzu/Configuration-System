import mmap
import re

from git import Repo
import os
import git

from dotenv import load_dotenv

load_dotenv()


def isNewPullAvailable(repo):
    """
    check if a new pull is available for a given git repo.

    :param repo: {Repo} git repo object
    :return: {boolean}
    """
    count_modified_files = len(repo.index.diff(None))
    count_staged_files = len(repo.index.diff("HEAD"))

    if count_modified_files < 1 and count_staged_files < 1:
        return False
    else:
        return True


def cloneGitRepo(cloneUrl, localRepoPath):
    """
    clone a git repo with the given url at the given path location.

    :param cloneUrl:        git remote repo url
    :param localRepoPath:   path to location, where remote repo should be cloned to
    :return:
    """
    Repo.clone_from(cloneUrl, localRepoPath)


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
                self.repo = git.Repo(self.localRepoPath)

                if isNewPullAvailable(self.repo):
                    self.repo.remotes.origin.pull()
            except git.exc.InvalidGitRepositoryError:
                print("dir is full with non git related content")

    def get_visual_components_from_git(self):
        return findJsFiles(self.localRepoPath)


def findJsFiles(dirPath):
    """
    go through given path and find all visual components in all js files

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
                            regex = re.compile(r'\s\*[\s|\t]@props[\s|\t]{(.*)\}[\s|\t](.*)')
                            match = re.search(regex, line)
                            props_type = match.group(1)
                            props_name = match.group(2)
                            parameter_list.append({'name': props_name, 'type': props_type})
                        elif vis_comp_found and line.find(' */') != -1:
                            end_of_doc_string_found = True
                        elif vis_comp_found and end_of_doc_string_found and line.startswith('class'):
                            vis_comp_found = False
                            end_of_doc_string_found = False

                            regex = re.compile(r'class\s(\w+).*{')
                            match = re.search(regex, line)
                            component_name = match.group(1)

                            component_info = {'name': component_name, 'path': file_path, 'parameters': parameter_list}
                            vis_comp_name_list.append(component_info)
    return vis_comp_name_list


def getDC():
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
                        "parameter": "Parameter 1",
                        "value": "Value 4",
                        "issueTypes": [
                            {
                                "id": "value4",
                                "value": "Value 4"
                            },
                            {
                                "id": "value7",
                                "value": "Value 7"
                            }
                        ]
                    },
                    {
                        "parameter": "Parameter 2",
                        "value": "Value 2",
                        "issueTypes": [
                            {
                                "id": "value1",
                                "value": "Value 1"
                            },
                            {
                                "id": "value2",
                                "value": "Value 2"
                            },
                            {
                                "id": "value8",
                                "value": "Value 8"
                            }
                        ]
                    }
                ],
                "description": "bliiiiii"
            },
            {
                "name": "Decision Card 2",
                "rows": [
                    {
                        "parameter": "Parameter 1",
                        "value": "Value 1",
                        "issueTypes": [
                            {
                                "id": "value1",
                                "value": "Value 1"
                            },
                            {
                                "id": "value4",
                                "value": "Value 4"
                            }
                        ]
                    },
                    {
                        "parameter": "Parameter 2",
                        "value": "Value 2",
                        "issueTypes": [
                            {
                                "id": "value2",
                                "value": "Value 2"
                            },
                            {
                                "id": "value3",
                                "value": "Value 3"
                            },
                            {
                                "id": "value9",
                                "value": "Value 9"
                            }
                        ]
                    },
                    {
                        "parameter": "Parameter 3",
                        "value": "Value 3",
                        "issueTypes": [
                            {
                                "id": "value1",
                                "value": "Value 1"
                            },
                            {
                                "id": "value3",
                                "value": "Value 3"
                            },
                            {
                                "id": "value4",
                                "value": "Value 4"
                            }
                        ]
                    },
                    {
                        "parameter": "Parameter 4",
                        "value": "Value 4",
                        "issueTypes": [
                            {
                                "id": "value1",
                                "value": "Value 1"
                            },
                            {
                                "id": "value4",
                                "value": "Value 4"
                            }
                        ]
                    }
                ],
                "description": "blooob"
            },
            {
                "name": "Decision Card 3",
                "rows": [
                    {
                        "parameter": "Parameter 1",
                        "value": "Value 1",
                        "issueTypes": [
                            {
                                "id": "value1",
                                "value": "Value 1"
                            },
                            {
                                "id": "value10",
                                "value": "Value 10"
                            },
                            {
                                "id": "value11",
                                "value": "Value 11"
                            }
                        ]
                    }
                ],
                "description": "blob blob blob"
            }
        ]}


# if __name__ == '__main__':
#     localRepoPath = os.getcwd() + os.getenv("REPO_NAME")
#     cloneUrl = os.getenv("REPO_PATH")
#     gitRepo = GitRepo(localRepoPath, cloneUrl)
#
#     testRepoPath = os.getcwd() + "/testParser"
#     print(findJsFiles(testRepoPath))
