import argparse
import os
import requests
from requests.auth import HTTPBasicAuth
import shutil
import subprocess
from subprocess import PIPE
import tkinter
import tkinter.ttk
from tkinter import messagebox

parser = argparse.ArgumentParser()
parser.add_argument(
    "--arduino-cli",
    required=True,
    type=str,
    metavar="/path/to/arduino-cli",
    help="Path to arduino-cli",
)
parser.add_argument(
    "--avrdude",
    required=True,
    type=str,
    metavar="/path/to/avrdude",
    help="Path to avrdude",
)
parser.add_argument(
    "--file-server",
    required=True,
    type=str,
    metavar="https://file-server.com",
    help="File server URL",
)

parser.add_argument(
    "--basic-auth-username",
    type=str,
    metavar="username",
    help="Username for basic auth (if needed)",
)

parser.add_argument(
    "--basic-auth-password",
    type=str,
    metavar="password",
    help="Password for basic auth (if needed)",
)

args = parser.parse_args()

if not os.path.exists(args.arduino_cli):
    raise FileNotFoundError(f"{args.arduino_cli} not found")

if not os.path.exists(args.avrdude):
    raise FileNotFoundError(f"{args.avrdude} not found")

if args.basic_auth_username and args.basic_auth_password:
    auth = HTTPBasicAuth(args.basic_auth_username, args.basic_auth_password)
else:
    auth = None

root = None
combobox = None
button = None

users = {}


def compile_and_flush_code():
    global combobox
    global button

    button.config(state="disabled")
    button.update()

    user = combobox.get()
    print(user, users[user])

    if os.path.exists("build"):
        shutil.rmtree("build")

    # download
    button.config(text="ダウンロード中...")
    button.update()
    print("ダウンロード中...")
    # download_file(users[user], './onshaked_handler.ino')
    url = args.file_server if args.file_server[-1] != "/" else args.file_server[:-1]
    url = f"{url}/download/{users[user]}"
    print(url)
    r = requests.get(url, allow_redirects=True, auth=auth)
    open("./onshaked_handler.ino", "wb").write(r.content)

    # compile
    command = f"{args.arduino_cli} compile --fqbn ATTinyCore:avr:attinyx5opti --build-path ./build"
    button.config(text="コンパイル中...")
    button.update()
    print("コンパイル中...")
    print(command)
    proc = subprocess.run(
        command,
        shell=True,
        stdout=PIPE,
        stderr=PIPE,
    )
    if proc.returncode != 0:
        stderror = proc.stderr.decode("utf-8")
        print(stderror)
        messagebox.showerror(title="エラー", message="コンパイルに失敗しました")
        button.config(text="コンパイル & 書き込み", state="normal")
        button.update()
        return
    else:
        stdout = proc.stdout.decode("utf-8")
        print(stdout)

    # flush
    command = f"{args.avrdude} -C./avrdude.conf -v -pattiny85 -cusbasp -Uflash:w:build/attiny85-led-ornament.ino.hex:i"
    button.config(text="書き込み中...")
    button.update()
    print("書き込み中...")
    print(command)
    proc = subprocess.run(
        command,
        shell=True,
        stdout=PIPE,
        stderr=PIPE,
    )
    if proc.returncode != 0:
        stderror = proc.stderr.decode("utf-8")
        print(stderror)
        messagebox.showerror(title="エラー", message="書き込みに失敗しました")
    else:
        stdout = proc.stdout.decode("utf-8")
        print(stdout)
        messagebox.showinfo(title="完了", message="コンパイルと書き込みが完了しました")

    button.config(text="コンパイル & 書き込み", state="normal")
    button.update()


url = args.file_server if args.file_server[-1] != "/" else args.file_server[:-1]
url = f"{url}/download/users"
r = requests.get(url, allow_redirects=True, auth=auth)
if r.status_code != 200:
    messagebox.showerror(title="エラー", message="サーバーにアクセスできません")
    exit(-1)
users = {user["username"]: user["display_name"] for user in r.json()["users"]}

root = tkinter.Tk()
root.title("LEDオーナメント | 書き込みツール")
root.geometry("320x160")
root.configure(background="#EEEEEE")

combobox = tkinter.ttk.Combobox(
    root, state="readonly", values=[key for key in users.keys()]
)
combobox.current(0)
combobox.pack(pady=24)

button = tkinter.Button(
    text="コンパイル & 書き込み", padx=24, pady=16, command=compile_and_flush_code
)
button.pack(pady=16)

root.mainloop()
