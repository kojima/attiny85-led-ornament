const resizeBlocklyList = (list) => {
    const height = document.getElementById('blockly_tool_box_table').getBoundingClientRect().height;
    let maxWidth = Number.MIN_VALUE;
    list.querySelectorAll('.blockly-element').forEach((elm) => {
        maxWidth = Math.max(maxWidth, elm.getBoundingClientRect().width);
    });
    list.querySelector('.blockly-flyout-background').setAttribute('d', `M 0,0 h ${maxWidth + 48} a 8 8 0 0 1 8 8 v ${height - 16} a 8 8 0 0 1 -8 8 h -${maxWidth + 48} z`);
    list.style.width = `${maxWidth + 48 + 8}px`;
}

window.addEventListener('load', () => {
    const arduinoCode = document.getElementById('arduino_code');
    hljs.highlightElement(arduinoCode);

    /*
    const addButton = document.getElementById('add_tab_button');
    addButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const list = document.getElementById('tab_list');
        const tab = document.createElement('li');
        const deleteButton = document.createElement('span');
        deleteButton.classList.add('delete-tab-button');
        deleteButton.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            tab.remove();
            addButton.classList.remove('hidden');
        });
        tab.appendChild(deleteButton);
        list.appendChild(tab);
        const tabCount = list.querySelectorAll('li').length;
        if (tabCount >= 10) {
            addButton.classList.add('hidden');
        }
    });
    */

    document.getElementById('replay_simulator').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        Editor.simulatorStartedAt = null;
        Editor.animationId && window.cancelAnimationFrame(Editor.animationId);
        window.requestAnimationFrame(Editor.simulatorStep);
    });

    const BLOCKLY_EDITOR = 1;
    const ARDUINO_EDITOR = 2;
    let currentEditor = BLOCKLY_EDITOR;

    document.getElementById('editor_block').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        currentEditor = BLOCKLY_EDITOR;

        const slider = document.querySelector('#editor_switch #slider');
        slider.classList.remove('right');
        slider.classList.add('left');
        document.querySelector('#editor_block').classList.add('selected');
        document.querySelector('#editor_arduino').classList.remove('selected');

        document.querySelector('#blockly_editor_wrapper').classList.add('selected');
        document.querySelector('#arduino_editor_wrapper').classList.remove('selected');

        document.querySelector('#blockly_tool_box').classList.remove('hidden');

        document.querySelector('#copy_wrapper').classList.add('hidden');
        setTimeout(() => {
            document.querySelector('#copy_wrapper').classList.add('deep-hidden');
        }, 300);
    });

    document.getElementById('editor_arduino').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        currentEditor = ARDUINO_EDITOR;

        const slider = document.querySelector('#editor_switch #slider');
        slider.classList.remove('left');
        slider.classList.add('right');
        document.querySelector('#editor_arduino').classList.add('selected');
        document.querySelector('#editor_block').classList.remove('selected');

        document.querySelector('#arduino_editor_wrapper').classList.add('selected');
        document.querySelector('#blockly_editor_wrapper').classList.remove('selected');

        document.querySelector('#blockly_tool_box').classList.add('hidden');

        document.querySelector('#copy_wrapper').classList.remove('deep-hidden');
        setTimeout(() => {
            document.querySelector('#copy_wrapper').classList.remove('hidden');
        }, 10);
    });

    document.getElementById('copy_code').addEventListener(
        "click",
        (e) => {
            const codeElm = document.getElementById('arduino_code');
            const code = codeElm.innerText;
            setClipboard(code);
        }
    );

    async function setClipboard(text) {
      const type = "text/plain";
      const blob = new Blob([text], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      document.getElementById('copy_popup').classList.add('show');
      setTimeout(() => {
        document.getElementById('copy_popup').classList.remove('show');
      }, 3000);
    }

    /*
    document.getElementById('zoom_in').onclick = (e) => {
        e.preventDefault();
        if (currentEditor === BLOCKLY_EDITOR) {
            Editor.blocklyScale = Math.min(Editor.blocklyScale * 1.2, 10);
            document.querySelectorAll('#blockly_editor > g').forEach((elm) => {
                const id = elm.getAttribute('id');
                const block = blocks[id];
                block.updateTransform();
            });
        } else {
            Editor.arduinoScale = Math.min(Editor.arduinoScale * 1.2, 3);
            document.getElementById('arduino_code').style.transform = `scale(${Editor.arduinoScale})`;
        }
    };

    document.getElementById('zoom_out').onclick = (e) => {
        e.preventDefault();
        if (currentEditor === BLOCKLY_EDITOR) {
            Editor.blocklyScale = Math.max(Editor.blocklyScale * 0.8, 0.2);
            document.querySelectorAll('#blockly_editor > g').forEach((elm) => {
                const id = elm.getAttribute('id');
                const block = blocks[id];
                block.updateTransform();
            });
        } else {
            Editor.arduinoScale = Math.max(Editor.arduinoScale * 0.8, 0.5);
            document.getElementById('arduino_code').style.transform = `scale(${Editor.arduinoScale})`;
        }
    };
    */

    document.querySelectorAll('.blockly-tool-box-row').forEach((elm) => {
        const type = elm.getAttribute('data-blockly-type');
        const list = document.querySelector(`.blockly-tool-bow-list.${type}`);
        elm.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            document.querySelectorAll(`.blockly-tool-box-row:not(.${type}`).forEach((l) => l.classList.remove('selected'));
            elm.classList.contains('selected') ? elm.classList.remove('selected') : elm.classList.add('selected');

            document.querySelectorAll(`.blockly-tool-bow-list:not(.${type})`).forEach((l) => l.classList.remove('show'));
            list.classList.contains('show') ? list.classList.remove('show') : list.classList.add('show');

            resizeBlocklyList(list);
        });
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const user = urlParams.get('user') || 'anonymous';
    //const fileServer = urlParams.get('file_server');
    const fileServer = '.';
    if (user && fileServer) {
        const wrapper = document.getElementById('upload_wrapper');
        wrapper.classList.remove('hidden');
        const button = wrapper.querySelector('#upload_code');
        button.setAttribute('data-user', user);
        button.setAttribute('data-file_server', fileServer);
        button.setAttribute('data-file_server', fileServer);
    }

    document.getElementById('upload_code').addEventListener(
        "click",
        (e) => {
            const button = document.getElementById('upload_code');
            const user = button.getAttribute('data-user');
            const fileServer = button.getAttribute('data-file_server');
            button.setAttribute('disabled', true);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${fileServer}/upload/${user}`);
            xhr.responseType = 'json';
            let formData = new FormData();
            let code = Editor.triggerBlock.generateCode(0);
            const codeTemplate = document.getElementById('arduino_code_template').innerHTML;
            code = codeTemplate.replace('{{ code }}', code);
            formData.append('code', code);
            xhr.send(formData);
            xhr.onload = function() {
                const statusCode = xhr.status;
                if (statusCode === 200) {
                    document.getElementById('upload_popup').classList.add('show');
                    setTimeout(() => {
                    document.getElementById('upload_popup').classList.remove('show');
                    button.removeAttribute('disabled');
                    }, 3000);
                } else {
                    alert(xhr.response.message);
                    button.removeAttribute('disabled');
                }
            };
            xhr.onerror = function() {
                alert('ファイルサーバーアクセス中に、エラーが発生しました。');
                button.removeAttribute('disabled');
            };
        }
    );

    document.getElementById('users').addEventListener('change', (e) => {
        const user = e.target.value;
        const wrapper = document.getElementById('upload_wrapper');
        const url = new URL(window.location.href);
        if (user.length > 0) {
            url.searchParams.set('user', user);
            wrapper.classList.remove('hidden');
            const button = wrapper.querySelector('#upload_code');
            button.setAttribute('data-user', user);
        } else {
            url.searchParams.delete('user');
            wrapper.classList.add('hidden');
        }
        window.history.replaceState({}, '', url);
    });
});

window.addEventListener('resize', () => {
    const list = document.querySelector('.blockly-tool-bow-list.show');
    list && resizeBlocklyList(list);
});
