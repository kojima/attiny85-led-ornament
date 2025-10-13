## PCB components
### U1: ATTiny85
https://akizukidenshi.com/catalog/g/g109574/

(1)-------(PB5 as RESET)------------> RESET

(2)-------(PB3)---------------------> Neopixel data  (1 pixel)

(3)-------(PB4)---------------------> Neopixel power 6V (1 pixel)

(4)-------(GND)---------------------> Ground

(5)-------(PB0 as MISO)-------------> MOSI

(6)-------(PB1 as MISO)-------------> MISO

(7)-------(PB2 as INT0 / SCK)-------> Ground this pin to wake up / SCK

(8)-------(VCC)---------------------> VCC 6V

### C1: 0.1uF
https://akizukidenshi.com/catalog/g/g113374/

### C2: 10uF
https://akizukidenshi.com/catalog/g/g113161/

### LED1: WS2812C-2020
https://akizukidenshi.com/catalog/g/g115068/

### PW1: CH291-1220LF
https://akizukidenshi.com/catalog/g/g109561/

### SW1: SW-18015P
https://amzn.asia/d/gpPyj5J

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

## First LED ornament PCB setup
1. Setup USBasp
2. Write a boot loader <-- This is mandatory before writing a LED ornament program
3. Write a LED ornament program

## `compile_and_flush_code.py`
A Tkinter app for compiling and writing an Arduino led ornament project.

### paremeters
#### `--arduino-cli`
Path to the command `arduino-cli`
#### `--avrdude`
Path to the command `--avrdude`
#### `--file-server`
The URL of the Flask file server
#### `--basic-auth-username`
The username of the basic authentication
#### `--basic-auth-password`
The password of the basic authentication
#### Example
```
python compile_and_flush_code.py --arduino-cli=/path/to/arduino-cli --avrdude=/path/to/avrdude --file-server=https://160.16.73.121/ --basic-auth-username <username> --basic-auth-password <password>
```
