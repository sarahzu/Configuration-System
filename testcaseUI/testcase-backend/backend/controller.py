from .model import GitRepo, findJsFiles, is_new_pull_available, pull_from_remote


class Controller:

    def __init__(self, gitRepoAddress, local_repo_path):
        self.gitRepoAddress = gitRepoAddress
        self.local_repo_path = local_repo_path
        # clone_url = os.getenv("REPO_PATH")
        try:
            self.git_repo = GitRepo(self.local_repo_path, gitRepoAddress)
            self.git_repo_created = True
        except Exception:
            self.git_repo_created = False

    def get_file_names(self):
        """
        return a list with all file names from all components

        :return: {list} list containing all filenames
        """
        components_list = findJsFiles(self.local_repo_path)
        filenames_list = []
        for comp in components_list:
            filename = comp.get("filename")
            filenames_list.append(filename)
        return filenames_list

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

