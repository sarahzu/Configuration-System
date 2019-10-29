import requests, os, json
from datetime import datetime,timedelta


class Controller:

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
        return ["Component 1", "Component 2", "Component 3", "Component 4", "Component 5", "Component 6"]

    def get_models(self):
        pass
