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


api.add_resource(ConfigurationAPI, '/config_api')
if __name__ == '__main__':
    app.run(debug=False)
