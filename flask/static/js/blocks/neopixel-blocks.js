class NeopixelBlocklyElement extends CommandBlocklyElement {
    _stroke = '#00183c';
    _fill = '#002050';

    _convertRgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s
          ? l === r
            ? (g - b) / s
            : l === g
              ? 2 + (b - r) / s
              : 4 + (r - g) / s
          : 0;
        return {
          h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
          s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
          l: (100 * (2 * l - s)) / 2
        };
    };

    _mix = (a, b, t) => { return a + (b - a) * t; }
    _step = (e, x) => { return x < e ? 0.0 : 1.0; }
    _convertRgbToHsv = (r, g, b) => {
      let s = this._step(b, g);
      const px = this._mix(b, g, s);
      const py = this._mix(g, b, s);
      const pz = this._mix(-1.0, 0.0, s);
      const pw = this._mix(0.6666666, -0.3333333, s);
      s = this._step(px, r);
      const qx = this._mix(px, r, s);
      const qz = this._mix(pw, pz, s);
      const qw = this._mix(r, px, s);
      const d = qx - Math.min(qw, py);
      return {
        h: Math.round(Math.abs(qz + (qw - py) / (6.0 * d + 1e-10)) * 65536),
        s: Math.round(d / (qx + 1e-10) * 255),
        v: Math.round(qx)
      };
    }
}


class TurnOnAllLedsWithColorsBlocklyElement extends NeopixelBlocklyElement {
    _width = 190;

    _colors = {
        led1: {r: 255, g: 0, b: 0},
    }
    _colorChanged = false;

    _onFocus = (e) => {
        e.target.jscolor.option('palette', Editor.colorPalette);
    }

    _onBlur = (e) => {
        if (Editor.colorPalette.indexOf(e.target.value) < 0) {
            Editor.colorPalette.shift();
            Editor.colorPalette.push(e.target.value);
        }
        this._colorChanged && this.replaySimulator();
    }

    _onChange = (e) => {
        const color = e.target.value;
        const led = e.target.getAttribute('data-led');
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this._colorChanged = this._colors[led].r !== r || this._colors[led].g !== g || this._colors[led].b !== b;
        if (this._colorChanged) {
            this._colors[led].r = r;
            this._colors[led].g = g;
            this._colors[led].b = b;
            saveBlocklyData();
            Editor.generateArduinoCode();
        }
    }

    generateInnerElement() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(8, 16.5)');

        const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text1.classList.add('blocklyText');
        text1.setAttribute('dominant-baseline', 'central');
        text1.setAttribute('x', 0);
        text1.setAttribute('y', 9.5);
        text1.innerHTML = 'LEDを';
        g.appendChild(text1);

        const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text2.classList.add('blocklyText');
        text2.setAttribute('dominant-baseline', 'central');
        text2.setAttribute('x', 92);
        text2.setAttribute('y', 7);
        text2.innerHTML = 'の色で点灯する';
        g.appendChild(text2);

        const fObj1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fObj1.setAttribute('x', 52);
        fObj1.setAttribute('y', -8);
        fObj1.setAttribute('width', 32);
        fObj1.setAttribute('height', 32);
        g.appendChild(fObj1);

        const color1 = document.createElement('input');
        color1.className = 'color non-draggable';
        color1.setAttribute('data-led', 'led1');
        color1.setAttribute('data-jscolor', '{value: "#ff0000"}');
        color1.setAttribute('tabindex', '-1');
        color1.style.width = '32px';
        color1.style.height = '32px';
        fObj1.appendChild(color1);

        const block = this;
        g.querySelectorAll('input.color').forEach((input) => {
            input.addEventListener('focus', block._onFocus);
            input.addEventListener('blur', block._onBlur);
            input.addEventListener('change', block._onChange);
        });

        setTimeout(() => {
            jscolor.presets.default = {
                backgroundColor: '#333',
                width: 250,
                palette: Editor.colorPalette,
                forceStyle: false,
            };
            jscolor.install();
        }, 1);

        return g;
    }

    generateCode(level) {
        this._element.classList.remove('blockly-disabled');
        const indent = this.generateIndent(level);
        let code = indent + '// LEDを点灯する\n';
        const hsv1 = this._convertRgbToHsv(this._colors.led1.r, this._colors.led1.g, this._colors.led1.b);
        code += indent + `led1 = {{${this._colors.led1.r}, ${this._colors.led1.g}, ${this._colors.led1.b}}, {${hsv1.h}, ${hsv1.s}, ${hsv1.v}}};\n`;
        code += indent + `pixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));\n`
        code += indent + 'pixels.setBrightness(255);\n';
        code += indent + 'pixels.show();\n\n';
        return code;
    }

    executeSimulator(elapsedTime) {
        Editor.simulatorLEDs[0].r = this._colors.led1.r, Editor.simulatorLEDs[0].g = this._colors.led1.g, Editor.simulatorLEDs[0].b = this._colors.led1.b;
        document.getElementById('led1').style.fill = `rgb(${this._colors.led1.r}, ${this._colors.led1.g}, ${this._colors.led1.b})`;
        return [this, true];
    }

    getBlocklyClass() {
        return TurnOnAllLedsWithColorsBlocklyElement;
    }

    toJson() {
        return Object.assign({
            led1: this._colors.led1,
        }, super.toJson());
    }

    fromJson(json) {
        super.fromJson(json);
        this._colors.led1 = json['led1'];

        setTimeout(() => {
            jscolor.install();
            const led1 = this.element.querySelector('input[data-led="led1"]');
            led1.jscolor.fromRGBA(this._colors.led1.r, this._colors.led1.g, this._colors.led1.b, 1);
            this.render();
        }, 1);
    }
}


class FadeInAllLedsWithColorsBlocklyElement extends NeopixelBlocklyElement {
    _width = 400;

    _colors = {
        led1: {r: 255, g: 0, b: 0},
    }
    _colorChanged = false;

    _fadeInStartFrom = null;

    _foreignObject = null;
    _fadeInInMsInputWrapper = null;
    _fadeInInMsInput = null;
    _fadeInInMs = 500;

    _onFocus = (e) => {
        e.target.jscolor.option('palette', Editor.colorPalette);
    }

    _onBlur = (e) => {
        if (Editor.colorPalette.indexOf(e.target.value) < 0) {
            Editor.colorPalette.shift();
            Editor.colorPalette.push(e.target.value);
        }
        this._colorChanged && this.replaySimulator();
    }

    _onChange = (e) => {
        const color = e.target.value;
        const led = e.target.getAttribute('data-led');
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        this._colorChanged = this._colors[led].r !== r || this._colors[led].g !== g || this._colors[led].b !== b;
        if (this._colorChanged) {
            this._colors[led].r = r;
            this._colors[led].g = g;
            this._colors[led].b = b;
            saveBlocklyData();
            Editor.generateArduinoCode();
        }
    }

    d() {
        const extraH = this._fadeInInMsInput ? Math.max(0, (`${this._fadeInInMsInput.value}`.length - 3) * 10) : 0;
        if (this._fadeInInMsInput) {
            this._foreignObject.setAttribute('width', 74 + extraH);
            this._fadeInInMsInput.style.width = `${74 + extraH}px`;
        }
        return `m 0,0  m 0,4 a 4 4 0 0,1 4,-4  h 8  c 2,0  3,1  4,2  l 4,4  c 1,1  2,2  4,2  h 12  c 2,0  3,-1  4,-2  l 4,-4  c 1,-1  2,-2  4,-2  h ${this._width + extraH} a 4 4 0 0,1 4,4  v 8  V 44  V 44 a 4 4 0 0,1 -4,4  h -${this._width + extraH}  c -2,0  -3,1  -4,2  l -4,4  c -1,1  -2,2  -4,2  h -12  c -2,0  -3,-1  -4,-2  l -4,-4  c -1,-1  -2,-2  -4,-2  h -8 a 4 4 0 0,1 -4,-4 z`;
    }

    generateInnerElement() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(8, 16.5)');

        const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text1.classList.add('blocklyText');
        text1.setAttribute('dominant-baseline', 'central');
        text1.setAttribute('x', 0);
        text1.setAttribute('y', 9.5);
        text1.innerHTML = 'LEDを';
        g.appendChild(text1);

        const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text2.classList.add('blocklyText');
        text2.setAttribute('dominant-baseline', 'central');
        text2.setAttribute('x', 92);
        text2.setAttribute('y', 8);
        text2.innerHTML = 'の色でフェードインする (ミリ秒)';
        g.appendChild(text2);

        const fObj1 = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fObj1.setAttribute('x', 52);
        fObj1.setAttribute('y', -8);
        fObj1.setAttribute('width', 32);
        fObj1.setAttribute('height', 32);
        g.appendChild(fObj1);

        const color1 = document.createElement('input');
        color1.className = 'color non-draggable';
        color1.setAttribute('data-led', 'led1');
        color1.setAttribute('data-jscolor', '{value: "#ff0000"}');
        color1.setAttribute('tabindex', '-1');
        color1.style.width = '32px';
        color1.style.height = '32px';
        fObj1.appendChild(color1);

        const block = this;
        g.querySelectorAll('input.color').forEach((input) => {
            input.addEventListener('focus', block._onFocus);
            input.addEventListener('blur', block._onBlur);
            input.addEventListener('change', block._onChange);
        });

        setTimeout(() => {
            jscolor.presets.default = {
                backgroundColor: '#333',
                width: 250,
                palette: Editor.colorPalette,
                forceStyle: false,
            };
            jscolor.install();
        }, 1);

        this._foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this._foreignObject.setAttribute('x', 350);
        this._foreignObject.setAttribute('y', -8);
        this._foreignObject.setAttribute('width', 74);
        this._foreignObject.setAttribute('height', 32);
        g.appendChild(this._foreignObject);

        this._fadeInInMsInputWrapper = document.createElement('div');
        this._fadeInInMsInputWrapper.className = 'fade-in-in-ms-wrapper';
        this._foreignObject.appendChild(this._fadeInInMsInputWrapper);

        this._fadeInInMsInput = document.createElement('input');
        this._fadeInInMsInput.value = this._fadeInInMs;
        this._fadeInInMsInput.setAttribute('type', 'number');
        this._fadeInInMsInput.setAttribute('min', 1);
        this._fadeInInMsInput.setAttribute('step', 1);
        this._fadeInInMsInput.addEventListener('focus', (e) => {
            e.target.select();
            e.target.parentNode.classList.add('focused');
            showContextList(
                this._fadeInInMsInput,
                [['0.1秒', 100], ['0.2秒', 200], ['0.5秒', 500], ['1秒', 1000], ['2秒', 2000]],
                this._fill
            );
        });
        this._fadeInInMsInput.addEventListener('blur', (e) => {
            e.target.parentNode.classList.remove('focused');
        });
        this._fadeInInMsInput.addEventListener('input', (e) => {
            this.render();
        });
        this._fadeInInMsInput.addEventListener('change', (e) => {
            if (e.target.value.length === 0) {
                e.target.value = this._fadeInInMs;
            } else {
                const value = Math.floor(e.target.value);
                if (this._fadeInInMs !== value) {
                    this._fadeInInMs = Math.floor(e.target.value);
                    e.target.value = this._fadeInInMs;
                    this.replaySimulator();
                    saveBlocklyData();
                    Editor.generateArduinoCode();
                }
            }
        });
        this._fadeInInMsInput.className = 'fade-in-in-ms non-draggable';
        this._fadeInInMsInputWrapper.appendChild(this._fadeInInMsInput);

        return g;
    }

    generateCode(level) {
        this._element.classList.remove('blockly-disabled');
        const indent = this.generateIndent(level);
        const hsv1 = this._convertRgbToHsv(this._colors.led1.r, this._colors.led1.g, this._colors.led1.b);
        let code = indent + `// LEDを ${this._fadeInInMs} ミリ秒でフェードインする\n`;
        code += indent + `led1 = {{${this._colors.led1.r}, ${this._colors.led1.g}, ${this._colors.led1.b}}, {${hsv1.h}, ${hsv1.s}, ${hsv1.v}}};\n`;
        code += indent + `for (int x = 1; x <= ${Math.floor(this._fadeInInMs / 10)}; x++) {\n`;
        code += indent + `\tfloat ratio = x / float(${Math.floor(this._fadeInInMs / 10)});\n`;
        // easeInQuad: https://easings.net/#easeInQuad
        code += indent + '\tratio = ratio * ratio;\n';
        code += indent + '\tpixels.clear();\n';
        code += indent + `\tpixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));\n`
        code += indent + '\tint brightness = floor(255 * ratio);\n';
        code += indent + '\tpixels.setBrightness(brightness);\n';
        code += indent + '\tpixels.show();\n';
        code += indent + '\tdelay(10);\n';
        code += indent + '}\n\n';
        return code;
    }

    executeSimulator(elapsedTime) {
        if (!this._fadeInStartFrom) {
            this._fadeInStartFrom = elapsedTime;
            return [this, false];
        }
        if (elapsedTime - this._fadeInStartFrom >= this._fadeInInMs) {
            this._fadeInStartFrom = null;
            Editor.simulatorLEDs[0].r = this._colors.led1.r, Editor.simulatorLEDs[0].g = this._colors.led1.g, Editor.simulatorLEDs[0].b = this._colors.led1.b;
            document.getElementById('led1').style.fill = `rgb(${Editor.simulatorLEDs[0].r}, ${Editor.simulatorLEDs[0].g}, ${Editor.simulatorLEDs[0].b})`;
            return [this, true];
        } else {
            let x = (elapsedTime - this._fadeInStartFrom) / parseFloat(this._fadeInInMs);
            x = 1 - (1 - x) * (1 - x);
            const alpha = x;
            document.getElementById('led1').style.fill = `rgba(${this._colors.led1.r}, ${this._colors.led1.g}, ${this._colors.led1.b}, ${alpha})`;
            return [this, false];
        }

    }

    resetSimulator() {
        this._fadeInStartFrom = null;
        Editor.simulatorLEDs = [
            {r: 206, g: 206, b: 206},
            {r: 206, g: 206, b: 206},
            {r: 206, g: 206, b: 206},
            {r: 206, g: 206, b: 206},
        ];
    }

    getBlocklyClass() {
        return FadeInAllLedsWithColorsBlocklyElement;
    }

    toJson() {
        return Object.assign({
            fadeInInMs: this._fadeInInMs,
            led1: this._colors.led1,
        }, super.toJson());
    }

    fromJson(json) {
        super.fromJson(json);
        this._fadeInInMs = json['fadeInInMs'];
        this._colors.led1 = json['led1'];

        setTimeout(() => {
            jscolor.install();
            const led1 = this.element.querySelector('input[data-led="led1"]');
            led1.jscolor.fromRGBA(this._colors.led1.r, this._colors.led1.g, this._colors.led1.b, 1);
            this.render();
        }, 1);
    }
}


class TurnOffAllLedsBlocklyElement extends NeopixelBlocklyElement {
    _width = 60;

    generateInnerElement() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(8, 16.5)');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('blocklyText');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('x', 0);
        text.setAttribute('y', 9.5);
        text.innerHTML = 'LEDを消す';
        g.appendChild(text);
        return g;
    }

    generateCode(level) {
        this._element.classList.remove('blockly-disabled');
        const indent = this.generateIndent(level);
        let code = indent + '// LEDを消す\n';
        code += indent + 'pixels.clear();\n';
        code += indent + 'pixels.show();\n\n';
        return code;
    }

    executeSimulator(elapsedTime) {
        document.getElementById('led1').style.fill = '#CECECE';
        return [this, true];
    }

    getBlocklyClass() {
        return TurnOffAllLedsBlocklyElement;
    }
}

class FadeOutAllLEDsBlocklyElement extends NeopixelBlocklyElement {
    _width = 290;

    _fadeOutStartFrom = null;

    _foreignObject = null;
    _fadeOutInMsInputWrapper = null;
    _fadeOutInMsInput = null;
    _fadeOutInMs = 500;

    d() {
        const extraH = this._fadeOutInMsInput ? Math.max(0, (`${this._fadeOutInMsInput.value}`.length - 3) * 10) : 0;
        if (this._fadeOutInMsInput) {
            this._foreignObject.setAttribute('width', 74 + extraH);
            this._fadeOutInMsInput.style.width = `${74 + extraH}px`;
        }
        return `m 0,0  m 0,4 a 4 4 0 0,1 4,-4  h 8  c 2,0  3,1  4,2  l 4,4  c 1,1  2,2  4,2  h 12  c 2,0  3,-1  4,-2  l 4,-4  c 1,-1  2,-2  4,-2  h ${this._width + extraH} a 4 4 0 0,1 4,4  v 8  V 44  V 44 a 4 4 0 0,1 -4,4  h -${this._width + extraH}  c -2,0  -3,1  -4,2  l -4,4  c -1,1  -2,2  -4,2  h -12  c -2,0  -3,-1  -4,-2  l -4,-4  c -1,-1  -2,-2  -4,-2  h -8 a 4 4 0 0,1 -4,-4 z`;
    }

    generateInnerElement() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(8, 16.5)');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('blocklyText');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('x', 0);
        text.setAttribute('y', 9.5);
        text.innerHTML = 'LEDをフェードアウト (ミリ秒)';
        g.appendChild(text);

        this._foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this._foreignObject.setAttribute('x', 240);
        this._foreignObject.setAttribute('y', -8);
        this._foreignObject.setAttribute('width', 74);
        this._foreignObject.setAttribute('height', 32);
        g.appendChild(this._foreignObject);

        this._fadeOutInMsInputWrapper = document.createElement('div');
        this._fadeOutInMsInputWrapper.className = 'fade-out-in-ms-wrapper';
        this._foreignObject.appendChild(this._fadeOutInMsInputWrapper);

        this._fadeOutInMsInput = document.createElement('input');
        this._fadeOutInMsInput.value = this._fadeOutInMs;
        this._fadeOutInMsInput.setAttribute('type', 'number');
        this._fadeOutInMsInput.setAttribute('min', 1);
        this._fadeOutInMsInput.setAttribute('step', 1);
        this._fadeOutInMsInput.addEventListener('focus', (e) => {
            e.target.select();
            e.target.parentNode.classList.add('focused');
            showContextList(
                this._fadeOutInMsInput,
                [['0.1秒', 100], ['0.2秒', 200], ['0.5秒', 500], ['1秒', 1000], ['2秒', 2000]],
                this._fill
            );
        });
        this._fadeOutInMsInput.addEventListener('blur', (e) => {
            e.target.parentNode.classList.remove('focused');
        });
        this._fadeOutInMsInput.addEventListener('input', (e) => {
            this.render();
        });
        this._fadeOutInMsInput.addEventListener('change', (e) => {
            if (e.target.value.length === 0) {
                e.target.value = this._fadeOutInMs;
            } else {
                const value = Math.floor(e.target.value);
                if (this._fadeOutInMs !== value) {
                    this._fadeOutInMs = Math.floor(e.target.value);
                    e.target.value = this._fadeOutInMs;
                    this.replaySimulator();
                    saveBlocklyData();
                    Editor.generateArduinoCode();
                }
            }
        });
        this._fadeOutInMsInput.className = 'fade-out-in-ms non-draggable';
        this._fadeOutInMsInputWrapper.appendChild(this._fadeOutInMsInput);

        return g;
    }

    generateCode(level) {
        this._element.classList.remove('blockly-disabled');

        const indent = this.generateIndent(level);
        let code = indent + `// LEDを ${this._fadeOutInMs} ミリ秒でフェードアウトする\n`;
        code += indent + `for (int x = 1; x <= ${Math.floor(this._fadeOutInMs / 10)}; x++) {\n`;
        code += indent + `\tfloat ratio = x / float(${Math.floor(this._fadeOutInMs / 10)});\n`;
        // easeOutQuad: https://easings.net/#easeOutQuad
        code += indent + '\tratio = 1 - (1 - ratio) * (1 - ratio);\n';
        code += indent + '\tpixels.clear();\n';
        code += indent + '\tpixels.setPixelColor(0, pixels.Color(led1.rgb.r, led1.rgb.g, led1.rgb.b));\n';
        code += indent + '\tint brightness = floor(255 * (1 - ratio));\n';
        code += indent + '\tpixels.setBrightness(brightness);\n';
        code += indent + '\tpixels.show();\n';
        code += indent + '\tdelay(10);\n';
        code += indent + '}\n';
        code += indent + 'led1 = {{0, 0, 0}, {0, 0, 0}};\n';
        return code;
    }

    executeSimulator(elapsedTime) {
        if (!this._fadeOutStartFrom) {
            this._fadeOutStartFrom = elapsedTime;
            return [this, false];
        }
        if (elapsedTime - this._fadeOutStartFrom >= this._fadeOutInMs) {
            this._fadeOutStartFrom = null;
            const alpha = 0;
            document.getElementById('led1').style.fill = `rgba(${Editor.simulatorLEDs[0].r}, ${Editor.simulatorLEDs[0].g}, ${Editor.simulatorLEDs[0].b}, ${alpha})`;
            Editor.simulatorLEDs = [
                {r: 206, g: 206, b: 206},
            ];
            return [this, true];
        } else {
            const x = (elapsedTime - this._fadeOutStartFrom) / this._fadeOutInMs;
            const alpha = 1.0 - x;
            document.getElementById('led1').style.fill = `rgba(${Editor.simulatorLEDs[0].r}, ${Editor.simulatorLEDs[0].g}, ${Editor.simulatorLEDs[0].b}, ${alpha})`;
            return [this, false];
        }
    }

    resetSimulator() {
        this._fadeOutStartFrom = null;
    }

    getBlocklyClass() {
        return FadeOutAllLEDsBlocklyElement;
    }

    toJson() {
        return Object.assign({
            fadeOutInMs: this._fadeOutInMs
        }, super.toJson());
    }

    fromJson(json) {
        super.fromJson(json);
        this._fadeOutInMs = json['fadeOutInMs'];
        this.render();
    }
}
