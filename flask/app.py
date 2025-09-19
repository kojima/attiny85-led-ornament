from flask import Flask, render_template, request, send_file
from flask_cors import cross_origin

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload/<string:user>", methods=["POST"])
@cross_origin(methods=["POST"])
def upload_file(user):
    code = request.form["code"]
    with open(f"{user}_onshaked_handler.ino", "w") as f:
        f.write(code)
    return {"status": 200, "text": "OK"}


@app.route("/download/<string:user>", methods=["GET"])
def download_code(user):

    downloadFileName = "onshaked_handler.ino"
    downloadFile = f"{user}_onshaked_handler.ino"

    return send_file(
        downloadFile,
        as_attachment=True,
        attachment_filename=downloadFileName,
        mimetype="text/plain",
    )
