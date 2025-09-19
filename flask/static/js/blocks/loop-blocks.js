class ForeverBlocklyElement extends ContainerBlocklyElement {
    _stroke = '#176cbf';
    _fill = '#1e90ff';
    _prependable = false;
    _appendable = false;

    getNumberOfEntry() {
        return 1;
    }

    d() {
        const totalInnerBlockHeight = this.totalInnerBlockHeight(0);
        const extraV = totalInnerBlockHeight > 0 ? totalInnerBlockHeight - 24 : 0;
        return `m 0,0  m 0,4 a 4 4 0 0,1 4,-4  h 152 a 4 4 0 0,1 4,4  v 4  V 8  V 40  V 44 a 4 4 0 0,1 -4,4  H 64  c -2,0  -3,1  -4,2  l -4,4  c -1,1  -2,2  -4,2  h -12  c -2,0  -3,-1  -4,-2  l -4,-4  c -1,-1  -2,-2  -4,-2  h -8 a 4 4 0 0,0 -4,4  v ${16 + extraV} a 4 4 0 0,0 4,4  h 8  c 2,0  3,1  4,2  l 4,4  c 1,1  2,2  4,2  h 12  c 2,0  3,-1  4,-2  l 4,-4  c 1,-1  2,-2  4,-2  H 156 a 4 4 0 0,1 4,4  V ${80 + extraV}  V ${100 + extraV} a 4 4 0 0,1 -4,4  h -152 a 4 4 0 0,1 -4,-4 z`;
    }

    get insertable() {
        return false;
    }

    generateInnerElement() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(8, 14.5)');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('blocklyText');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('x', 0);
        text.setAttribute('y', 9.5);
        text.innerHTML = 'ずっと';
        g.appendChild(text);
        return g;
    }
}


class LoopBlocklyElement extends ContainerBlocklyElement {
    _stroke = '#008000';
    _fill = '#00aa00';

    _foreignObject = null;
    _repeatCountInput = null;
    _repeatCount = 4;
    _svgText = null;

    getNumberOfEntry() {
        return 1;
    }

    d() {
        const extraH = this._repeatCountInput ? Math.max(0, (`${this._repeatCountInput.value}`.length - 1) * 10) : 0;
        if (this._repeatCountInput) {
            this._foreignObject.setAttribute('width', 40 + extraH);
            this._svgText.setAttribute('x', 136 + extraH);
            this._repeatCountInput.style.width = `${40 + extraH}px`;
        }
        const totalInnerBlockHeight = this.totalInnerBlockHeight(0);
        const extraV = totalInnerBlockHeight > 0 ? totalInnerBlockHeight - 24 : 0;
        return `m 0,0  m 0,4 a 4 4 0 0,1 4,-4  h 8  c 2,0  3,1  4,2  l 4,4  c 1,1  2,2  4,2  h 12  c 2,0  3,-1  4,-2  l 4,-4  c 1,-1  2,-2  4,-2  h ${125 + extraH} a 4 4 0 0,1 4,4  v 8  V 40  V 44 a 4 4 0 0,1 -4,4  H 64  c -2,0  -3,1  -4,2  l -4,4  c -1,1  -2,2  -4,2  h -12  c -2,0  -3,-1  -4,-2  l -4,-4  c -1,-1  -2,-2  -4,-2  h -8 a 4 4 0 0,0 -4,4  v ${16 + extraV} a 4 4 0 0,0 4,4  h 8  c 2,0  3,1  4,2  l 4,4  c 1,1  2,2  4,2  h 12  c 2,0  3,-1  4,-2  l 4,-4  c 1,-1  2,-2  4,-2  H ${173 + extraH} a 4 4 0 0,1 4,4  V ${76 + extraV}  V ${100 + extraV}  V ${100 + extraV} a 4 4 0 0,1 -4,4  h -${125 + extraH}  c -2,0  -3,1  -4,2  l -4,4  c -1,1  -2,2  -4,2  h -12  c -2,0  -3,-1  -4,-2  l -4,-4  c -1,-1  -2,-2  -4,-2  h -8 a 4 4 0 0,1 -4,-4 z`;
    }

    generateInnerElement() {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(8, 16.5)');

        const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text1.classList.add('blocklyText');
        text1.setAttribute('dominant-baseline', 'central');
        text1.setAttribute('x', 0);
        text1.setAttribute('y', 9.5);
        text1.innerHTML = 'くりかえし';
        g.appendChild(text1);


        this._svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        this._svgText.classList.add('blocklyText');
        this._svgText.setAttribute('dominant-baseline', 'central');
        this._svgText.setAttribute('x', 136);
        this._svgText.setAttribute('y', 9.5);
        this._svgText.innerHTML = '回';
        g.appendChild(this._svgText);

        this._foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        this._foreignObject.setAttribute('x', 88);
        this._foreignObject.setAttribute('y', -8);
        this._foreignObject.setAttribute('width', 40);
        this._foreignObject.setAttribute('height', 32);
        g.appendChild(this._foreignObject);

        this._repeatCountInput = document.createElement('input');
        this._repeatCountInput.value = this._repeatCount;
        this._repeatCountInput.setAttribute('type', 'number');
        this._repeatCountInput.setAttribute('min', 1);
        this._repeatCountInput.setAttribute('step', 1);
        this._repeatCountInput.addEventListener('focus', (e) => {
            e.target.select();
        });
        this._repeatCountInput.addEventListener('input', (e) => {
            this.render();
        });
        this._repeatCountInput.addEventListener('change', (e) => {
            if (e.target.value.length === 0) {
                e.target.value = this._repeatCount;
            } else {
                const value = Math.floor(e.target.value);
                if (this._repeatCount !== value) {
                    this._repeatCount = value;
                    e.target.value = this._repeatCount;
                    this.replaySimulator();
                    saveBlocklyData();
                    Editor.generateArduinoCode();
                }
            }
        });
        this._repeatCountInput.className = 'repeat-count non-draggable';
        this._foreignObject.appendChild(this._repeatCountInput);

        return g;
    }

    generateCode(level) {
        this._element.classList.remove('blockly-disabled');
        const indent = this.generateIndent(level);
        const index = Editor.getIndex();
        let code = indent + `// 繰り返し ${this._repeatCount} 回\n`;
        code += indent + `for (int ${index} = 0; ${index} < ${this._repeatCount}; ${index}++) {\n`;
        this._innerBlocks.forEach((nextBlock) => {
            while (nextBlock) {
                code += nextBlock.generateCode(level + 1);
                nextBlock = nextBlock.nextBlock;
            }
        });
        Editor.returnBackIndex(index);
        return code + indent + '}\n\n';
    }

    _currentInnerBlock = null;
    _currentIndex = 0;
    executeSimulator(elapsedTime) {
        if (!this._currentInnerBlock) {
            if (!this._innerBlocks[0]) return [this, true];
            this._currentInnerBlock = this._innerBlocks[0];
        }

        const [block, done] = this._currentInnerBlock.executeSimulator(elapsedTime);
        if (done) {
            this._currentInnerBlock = this._currentInnerBlock.nextBlock;
        }
        if (!this._currentInnerBlock) this._currentIndex += 1;
        if (this._currentIndex >= this._repeatCount) {
            this._currentIndex = 0;
            return [this, true];
        } else {
            return [this, false];
        }
    }

    resetSimulator() {
        this._currentInnerBlock = null;
        this._currentIndex = 0;
    }

    getBlocklyClass() {
        return LoopBlocklyElement;
    }

    toJson() {
        const innerBlocks = [];
        let block = this._innerBlocks[0];
        while (block) {
            innerBlocks.push(block.toJson());
            block = block.nextBlock;
        }
        return Object.assign({
            repeatCount: this._repeatCount,
            innerBlocks: [innerBlocks]
        }, super.toJson());
    }

    fromJson(json) {
        super.fromJson(json);
        this._repeatCount = json['repeatCount'];
        this.render();
    }
}