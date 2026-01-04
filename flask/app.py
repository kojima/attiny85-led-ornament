import csv
import os
from flask import Flask, render_template, request, send_file
from flask_cors import cross_origin

app = Flask(__name__)


def load_users():
    users = []
    if os.path.exists('users.csv'):
        with open(f"users.csv", "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            for username, display_name in reader:
                users.append({
                    "username": username,
                    "display_name": display_name
                })
        print(f"users = {users}")
    return users


@app.route("/")
def index():
    return render_template("index.html", users=load_users())


@app.route("/upload/<string:user>", methods=["POST"])
@cross_origin(methods=["POST"])
def upload_file(user):
    users = [user["username"] for user in load_users()]
    if user in users:
        code = request.form["code"]
        with open(f"{user}_onshaked_handler.ino", "w") as f:
            f.write(code)
        return {"text": "OK"}, 200
    else:
        return {"text": "Bad request", "message": "ユーザーを選択してください"}, 400


@app.route("/users", methods=["GET", "POST"])
@cross_origin(methods=["POST"])
def users():
    if request.method == "GET":
        users = ""
        if os.path.exists('users.csv'):
            users = open('users.csv', mode="r", encoding="utf-8").read()
        return render_template("users.html", users=users)
    else:
        ok = True
        error = False
        try:
            users = request.form["users"]
            with open(f"users.csv", "w", encoding="utf-8", newline="") as f:
                f.write(users)
            ok = True
        except:
            error = True
        return render_template("users.html", users=users, ok=ok, error=error)


@app.route("/download/users", methods=["GET"])
def download_users():
    return {"users": load_users()}, 200


@app.route("/download/<string:user>", methods=["GET"])
def download_code(user):

    download_file_name = "onshaked_handler.ino"
    download_file = f"{user}_onshaked_handler.ino"

    return send_file(
        download_file,
        as_attachment=True,
        download_name=download_file_name,
        mimetype="text/plain",
    )
