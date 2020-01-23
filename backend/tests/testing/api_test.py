import unittest
import sys
import os

from configuration.configuration_model import GitRepo

ROOT_DIR = os.path.abspath(os.curdir)

sys.path.append(ROOT_DIR + '/backend/configuration')


class APITest(unittest.TestCase):
    clone_url = "https://github.com/sarahzu/Visual-Components-Testcase-2.git"
    local_repo_path = ROOT_DIR + "/testing/local"
    git_repo = GitRepo(local_repo_path, clone_url)

    def testEnterGitRepoAddressIntoDatabase(self):
        pass


if __name__ == '__main__':
    unittest.main()
