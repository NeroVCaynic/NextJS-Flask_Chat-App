import random
from flask import Flask, request, session, redirect, url_for, jsonify
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from string import ascii_uppercase, ascii_lowercase

#Global decration and configeration

app = Flask(__name__) #->Flask App initialisation to file app
app.config['SECRET_KEY'] = 'You_CAnFInD+THIS1key' #->secret key, during development not import change later

serverIO = SocketIO(app, cors_allowed_origins="*") #->SocketIO server bound to Flask App

#collective variables and functions
members = []
messages = []

def _generateUserID(code_lenght):

    code = ''

    for _ in range(code_lenght):
        code += random.choice(ascii_lowercase)
    
    return code

#all routes and connections
@app.route("/api", methods=["POST", "GET"])
def connectionRequestForms():

    if request.method == "POST":
        requestData = request.get_json()

        if 'callConnectionRequest' in requestData.keys() and requestData['callConnectionRequest']:

            Client_ID = _generateUserID(5)

            members.append({'Client_Name': requestData["userName"], 'Client_Id': Client_ID, 'status': 1})
            return jsonify({'status': "Connected", "userName": requestData["userName"], 'clientId': Client_ID, 'ppl': members})
        
        if 'callCancelRequest' in requestData.keys() and requestData['callCancelRequest']:

            for index, userInfo in enumerate(members):
                if userInfo['Client_Name'] == requestData["userName"]:

                    members.pop(index)
                    return jsonify({'status': "Terminated", 'clientName': requestData["userName"], 'clientId': userInfo["Client_Id"], 'ppl': members})
                
            return jsonify({'status': "User Not Found"})
        
        if 'UserCheckRequest' in requestData.keys() and requestData['UserCheckRequest']:

            for index, userInfo in enumerate(members):
                if userInfo['Client_Name'] == requestData["userName"]:
                    return jsonify({'status': "Exists", 'clientName': requestData["userName"], 'clientId': userInfo["Client_Id"], 'ppl': members})
                
            return jsonify({'status': "User Does Not Exist"})
        
        return jsonify({'status': "Not Valid Request"})

#Server Control
@serverIO.on("connect")
def handle_connection(auth):
    emit('connection_event', f"{auth} has joined the chat!", broadcast=True)

@serverIO.on('message')
def handle_message(json):
    messages.append(json)
    send(messages, broadcast=True) 

@serverIO.on("disconnect")
def handle_disconnection():
    print("a user disconnect")

if __name__ == '__main__':
    serverIO.run(app, debug=True)



