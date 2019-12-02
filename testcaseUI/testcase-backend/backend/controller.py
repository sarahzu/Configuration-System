from model import GitRepo, findJsFiles


class Controller:

    def __init__(self, gitRepoAddress, local_repo_path):
        self.gitRepoAddress = gitRepoAddress
        self.local_repo_path = local_repo_path
        # clone_url = os.getenv("REPO_PATH")
        self.git_repo = GitRepo(self.local_repo_path, gitRepoAddress)

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

