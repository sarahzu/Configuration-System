import os, json

# from configuration import model

from model import GitRepo, findJsFiles, getDC

# sys.path.append('/configuration')


class Controller:

    def __init__(self, gitRepoAddress):
        self.gitRepoAddress = gitRepoAddress
        self.local_repo_path = os.getcwd() + os.getenv("REPO_NAME")
        # clone_url = os.getenv("REPO_PATH")
        self.git_repo = GitRepo(self.local_repo_path, gitRepoAddress)

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

    def get_models(self):
        pass

    def get_configuration_settings_input(self):
        """
        return a json object with all information needed, to build the configuration frontend page
        :return: {json} input file
        """

        # path = os.getcwd() + "/configuration/testParser"
        # path = self.gitRepoAddress
        # test_repo_path = path
        components_list = findJsFiles(self.gitRepoAddress)
        components_names_list = []
        parameter_list = []
        for comp in components_list:
            comp_name = comp.get("name")
            components_names_list.append(comp_name)
            parameter_list.append({"name": comp_name, "rows": [], "description": "bla"})

        description_cards_info = getDC()

        json_test = {
            "components": components_names_list,
            "componentsParameters": parameter_list,
            "decisionCards": description_cards_info.get("decisionCards"),
            "decisionCardsParameters": description_cards_info.get("decisionCardsParameters")

        }

        json_input = {
            "components": [
                "Component 1",
                "Component 2",
                "Component 3",
                "Component 4",
                "Component 5",
                "Component 6"
            ],
            "componentsParameters": [
                {
                    "name": "Component 1",
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
                                    "id": "value2",
                                    "value": "Value 2"
                                },
                                {
                                    "id": "value3",
                                    "value": "Value 3"
                                }
                            ]
                        },
                        {
                            "parameter": "Parameter 2",
                            "value": "Value 1",
                            "issueTypes": [
                                {
                                    "id": "value1",
                                    "value": "Value 1"
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
                                }
                            ]
                        }
                    ],
                    "description": "bla bla bla"
                },
                {
                    "name": "Component 2",
                    "rows": [
                        {
                            "parameter": "Parameter 1",
                            "value": "Value 2",
                            "issueTypes": [
                                {
                                    "id": "value2",
                                    "value": "Value 2"
                                },
                                {
                                    "id": "value3",
                                    "value": "Value 3"
                                }
                            ]
                        },
                        {
                            "parameter": "Parameter 2",
                            "value": "Value 4",
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
                                    "id": "value4",
                                    "value": "Value 4"
                                }
                            ]
                        }
                    ],
                    "description": "bli bla"
                },
                {
                    "name": "Component 3",
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
                                    "id": "value2",
                                    "value": "Value 2"
                                },
                                {
                                    "id": "value3",
                                    "value": "Value 3"
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
                                    "id": "value5",
                                    "value": "Value 5"
                                }
                            ]
                        },
                        {
                            "parameter": "Parameter 4",
                            "value": "Value 4",
                            "issueTypes": [
                                {
                                    "id": "value4",
                                    "value": "Value 4"
                                },
                                {
                                    "id": "value5",
                                    "value": "Value 5"
                                },
                                {
                                    "id": "value6",
                                    "value": "Value 6"
                                }
                            ]
                        }
                    ],
                    "description": "bli bli bli bli"
                },
                {
                    "name": "Component 4",
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
                                    "id": "value2",
                                    "value": "Value 2"
                                },
                                {
                                    "id": "value3",
                                    "value": "Value 3"
                                },
                                {
                                    "id": "value4",
                                    "value": "Value 4"
                                },
                                {
                                    "id": "value5",
                                    "value": "Value 5"
                                }
                            ]
                        }
                    ],
                    "description": "blibli"
                },
                {
                    "name": "Component 5",
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
                                    "id": "value2",
                                    "value": "Value 2"
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
                                    "id": "value3",
                                    "value": "Value 3"
                                }
                            ]
                        }
                    ],
                    "description": "bla blaaaaa"
                },
                {
                    "name": "Component 6",
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
                                    "id": "value6",
                                    "value": "Value 6"
                                }
                            ]
                        }
                    ],
                    "description": "blaaaa"
                }
            ],
            "decisionCards": [
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
            ]
        }
        # return json_input
        return json_test


if __name__ == '__main__':
    controller = Controller()
    print(controller.get_configuration_settings_input())
