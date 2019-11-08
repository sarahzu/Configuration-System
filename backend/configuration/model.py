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
        # if dir of localRepoPath does not exists
        if not os.path.isdir(localRepoPath):
            cloneGitRepo(cloneUrl, localRepoPath)
        # if dir of localRepPath exists but is empty
        elif len(os.listdir(localRepoPath)) == 0:
            cloneGitRepo(cloneUrl, localRepoPath)
        # if dir already exists and has content
        else:
            try:
                self.repo = git.Repo(localRepoPath)

                if isNewPullAvailable(self.repo):
                    self.repo.remotes.origin.pull()
            except git.exc.InvalidGitRepositoryError:
                print("dir is full with non git related content")


class GitRepoParser:
    """
    Parser class with scans a given folder for java script modules that contain visual components
    """

    def __init__(self, repo):
        self.repo = repo


if __name__ == '__main__':
    localRepoPath = os.getcwd() + "/gitclone"
    cloneUrl = os.getenv("REPO_PATH")
    gitRepo = GitRepo(localRepoPath, cloneUrl)


