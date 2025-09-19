/*
 * Reference: https://googlechrome.github.io/samples/web-bluetooth/
 */
let bleDevice = null;
let codeCharacteristic = null;
let buttonCharacteristic = null;
const connectToBle = async () => {
    try {
        log('Requesting any Bluetooth Device...');
        bleDevice = await navigator.bluetooth.requestDevice(
            { filters: [{ services: ["00001553-1212-efde-1523-785feabcd123"] }] }
        );
        bleDevice.addEventListener('gattserverdisconnected', onDisconnected);

        log('Connecting to GATT Server...');
        const server = await bleDevice.gatt.connect();

        // Note that we could also get all services that match a specific UUID by
        // passing it to getPrimaryServices().
        log('Getting Services...');
        const services = await server.getPrimaryServices('00001553-1212-efde-1523-785feabcd123');

        log('Getting Characteristics...');
        for (const service of services) {
            log('> Service: ' + service.uuid);
            const characteristics = await service.getCharacteristics();

            characteristics.forEach(async (characteristic) => {
                log('>> Characteristic: ' + characteristic.uuid + ' ' +
                    getSupportedProperties(characteristic));
                if (characteristic.uuid === '00001554-1212-efde-1523-785feabcd123') {
                    codeCharacteristic = characteristic;
                } else if (characteristic.uuid === '00001555-1212-efde-1523-785feabcd123') {
                    log('> Register a notification handler');
                    buttonCharacteristic = characteristic;
                    await buttonCharacteristic.startNotifications();
                    buttonCharacteristic.addEventListener('characteristicvaluechanged',
                        handleButtonNotifications);
                }
            });
        }
        document.getElementById('connect').disabled = true;
        document.getElementById('disconnect').disabled = false;
    } catch (error) {
        log('Argh! ' + error);
    }
};

let buttonPushed = false;

const handleButtonDown = () => {
    const button = document.getElementById('push_button');
    button.classList.add('down');
};

const handleButtonUp = () => {
    const button = document.getElementById('push_button');
    button.classList.remove('down');
};

const handleButtonNotifications = (event) => {
    const value = event.target.value;
    const intValue = value.getUint8(0);

    if (intValue === 1 && !buttonPushed) {
        buttonPushed = true;
        handleButtonDown();
    } else if (intValue === 0 && buttonPushed) {
        buttonPushed = false;
        handleButtonUp();
    }
    log(`> button: ${intValue}`);
}

const disconnectFromBle = async () => {
    if (!bleDevice) {
        return;
    }
    log('Disconnecting from Bluetooth Device...');
    if (bleDevice.gatt.connected) {
        if (buttonCharacteristic) {
            try {
                await buttonCharacteristic.stopNotifications();
                log('> Notifications stopped');
                buttonCharacteristic.removeEventListener('characteristicvaluechanged',
                    handleButtonNotifications);
            } catch (error) {
                log('Argh! ' + error);
            }
        }
        bleDevice.gatt.disconnect();
        document.getElementById('connect').disabled = false;
        document.getElementById('disconnect').disabled = true;
    } else {
        log('> Bluetooth Device is already disconnected');
    }
};

const onDisconnected = (event) => {
    // Object event.target is Bluetooth Device getting disconnected.
    log('> Bluetooth Device disconnected');
};


/* Utils */

const getSupportedProperties = (characteristic) => {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
            supportedProperties.push(p.toUpperCase());
        }
    }
    return '[' + supportedProperties.join(', ') + ']';
};

const log = (str) => {
    const logElm = document.getElementById('log');
    logElm.innerText += `${str}\n`;
};

const turnOnLed = async () => {
    if (!codeCharacteristic) return;
    let value = new Uint8Array([1]);
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(ret);
};

const turnOffLed = async () => {
    if (!codeCharacteristic) return;
    const encoder = new TextEncoder();
    const value = encoder.encode("off");
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(ret);
};

const turnRedLed = async () => {
    if (!codeCharacteristic) return;
    const encoder = new TextEncoder();
    const value = encoder.encode("red");
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(ret);
};

const turnGreenLed = async () => {
    if (!codeCharacteristic) return;
    const encoder = new TextEncoder();
    const value = encoder.encode("green");
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(ret);
};

const turnBlueLed = async () => {
    if (!codeCharacteristic) return;
    const encoder = new TextEncoder();
    const value = encoder.encode("blue");
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(ret);
};

const sendText = async () => {
    if (!codeCharacteristic) return;
    const str = document.getElementById('text_value').value;
    if (str.length === 0) return;
    const encoder = new TextEncoder();
    const value = encoder.encode(str);
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(ret);
};

const handleSliderChanged = async () => {
    const brightness = document.getElementById('brightness').value;
    const encoder = new TextEncoder();
    const value = encoder.encode(brightness);
    const ret = await codeCharacteristic.writeValueWithResponse(value);
    log(brightness);
};

window.onload = () => {
}
