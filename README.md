## ATTiny85

-----------(PB2 as INT0)-------> Ground this pin to wake up

-----------(PB3)---------------> Neopixel data  (4 pixels)

-----------(PB4)---------------> Neopixel power (4 pixels)

## Flask server
### GET parameter
#### `user`
User name: `user1`|`user2`|`user3`|`user4`|`user5`|`user6`|`user7`|`user8`

example: http://192.168.1.1:8000?user=user1

### References
#### Editor
- Makecode micro:bit
https://makecode.microbit.org/#editor

#### Fonts
- MADE Tommy Soft
https://www.dafont.com/made-tommy-soft.font
- Font Awesome
https://fontawesome.com

#### JS library
- highlight.js
https://github.com/highlightjs/highlight.js
- jscolor
https://jscolor.com


## `compile_and_flush_code.py`
A Tkinter app for compiling and writing an Arduino led ornament project.

### paremeters
#### `--arduino-cli`
Path to the command `arduino-cli`
#### `--avrdude`
Path to the command `--avrdude`
#### `--file-server`
The URL of the Flask file server
#### Example
```
python compile_and_flush_code.py --arduino-cli=/path/to/arduino-cli --avrdude=/path/to/avrdude --file-server=http://192.168.1.1:8000/
```
