class CommandBlocklyElement extends BlocklyElement {
    _stroke = '#176cbf';
    _fill = '#1e90ff';
    _width = 235;

    d() {
        return `m 0,0  m 0,4 a 4 4 0 0,1 4,-4  h 8  c 2,0  3,1  4,2  l 4,4  c 1,1  2,2  4,2  h 12  c 2,0  3,-1  4,-2  l 4,-4  c 1,-1  2,-2  4,-2  h ${this._width} a 4 4 0 0,1 4,4  v 8  V 44  V 44 a 4 4 0 0,1 -4,4  h -${this._width}  c -2,0  -3,1  -4,2  l -4,4  c -1,1  -2,2  -4,2  h -12  c -2,0  -3,-1  -4,-2  l -4,-4  c -1,-1  -2,-2  -4,-2  h -8 a 4 4 0 0,1 -4,-4 z`;
    }
}

class PauseBlocklyElement extends CommandBlocklyElement {
    _width = 190

    _waitStartFrom = null;

    _foreignObject = null;
    _waitInMsInputWrapper = null;
    _waitInMsInput = null;
    _waitInMs = 500;

    d() {
        const extraH = this._waitInMsInput ? Math.max(0, (`${this._waitInMsInput.value}`.length - 3) * 10) : 0;
        if (this._waitInMsInput) {
            this._foreignObject.setAttribute('width', 74 + extraH);
            this._waitInMsInput.style.width = `${74 + extraH}px`;
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
        text.innerHTML = '一時停止 (ミリ秒)';
        g.appendChild(text);

        this._foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this._foreignObject.setAttribute('x', 148);
        this._foreignObject.setAttribute('y', -8);
        this._foreignObject.setAttribute('width', 74);
        this._foreignObject.setAttribute('height', 32);
        g.appendChild(this._foreignObject);

        this._waitInMsInputWrapper = document.createElement('div');
        this._waitInMsInputWrapper.className = 'wait-in-ms-wrapper';
        this._foreignObject.appendChild(this._waitInMsInputWrapper);

        this._waitInMsInput = document.createElement('input');
        this._waitInMsInput.value = this._waitInMs;
        this._waitInMsInput.setAttribute('type', 'number');
        this._waitInMsInput.setAttribute('min', 1);
        this._waitInMsInput.setAttribute('step', 1);
        this._waitInMsInput.addEventListener('focus', (e) => {
            e.target.select();
            e.target.parentNode.classList.add('focused');
            showContextList(
                this._waitInMsInput,
                [['0.1秒', 100], ['0.2秒', 200], ['0.5秒', 500], ['1秒', 1000], ['2秒', 2000]],
                this._fill
            );
        });
        this._waitInMsInput.addEventListener('blur', (e) => {
            e.target.parentNode.classList.remove('focused');
        });
        this._waitInMsInput.addEventListener('input', (e) => {
            this.render();
        });
        this._waitInMsInput.addEventListener('change', (e) => {
            if (e.target.value.length === 0) {
                e.target.value = this._waitInMs;
            } else {
                const value = Math.floor(e.target.value);
                if (this._waitInMs !== value) {
                    this._waitInMs = Math.floor(e.target.value);
                    e.target.value = this._waitInMs;
                    this.replaySimulator();
                }
            }
            saveBlocklyData();
            Editor.generateArduinoCode();
        });
        this._waitInMsInput.className = 'wait-in-ms non-draggable';
        this._waitInMsInputWrapper.appendChild(this._waitInMsInput);

        return g;
    }

    generateCode(level) {
        this._element.classList.remove('blockly-disabled');
        const indent = this.generateIndent(level);
        let code = indent + `// 一時停止 ${this._waitInMs} (ミリ秒)\n`;
        code += indent + `delay(${this._waitInMs});\n\n`;
        return code;
    }

    executeSimulator(elapsedTime) {
        if (!this._waitStartFrom) {
            this._waitStartFrom = elapsedTime;
            return [this, false];
        }
        if (elapsedTime - this._waitStartFrom >= this._waitInMs) {
            this._waitStartFrom = null;
            return [this, true];
        } else {
            return [this, false];
        }
    }

    resetSimulator() {
        this._waitStartFrom = null;
    }

    getBlocklyClass() {
        return PauseBlocklyElement;
    }

    toJson() {
        return Object.assign({
            waitInMs: this._waitInMs
        }, super.toJson());
    }

    fromJson(json) {
        super.fromJson(json);
        this._waitInMs = json['waitInMs'];
        this.render();
    }
}
