from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from controller import Controller

app = Flask(__name__)
api = Api(app)
CORS(app)


class Test(Resource):

    def post(self):
        json_data = request.get_json()
        controller = Controller()
        reports = controller.get_components()
        return {'reports': reports}


class ConfigurationSettingInput(Resource):

    def get(self):
        controller = Controller()
        settings_info = controller.get_configuration_settings_input()
        return {'input': settings_info}


api.add_resource(Test, '/config_api')
api.add_resource(ConfigurationSettingInput, '/config_api/settings_input')

if __name__ == '__main__':
    app.run(debug=False)
