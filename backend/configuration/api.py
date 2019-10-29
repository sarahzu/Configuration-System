from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from controller import Controller

app = Flask(__name__)
api = Api(app)
CORS(app)


class ConfigurationAPI(Resource):

    def post(self):
        json_data = request.get_json()
        controller = Controller()
        reports = controller.get_components()
        return {'reports': reports}

class ConfigurationAPI_2(Resource):

    def get_comp_names(self):
        controller = Controller()
        return controller.get_visual_components_name_list()


api.add_resource(ConfigurationAPI, '/config_api')
api.add_resource(ConfigurationAPI, '/config_api/comp_names')

if __name__ == '__main__':
    app.run(debug=False)
