const LANGS = {
    current: null,
    php: {
        text: 'PHP',
        code: 'php',
        mode: 'text/x-php',
        sample: '// echo \'runs\';\n',
        format: false,
        compile: true,
    },
    javascript: {
        text: 'JavaScript',
        code: 'javascript',
        mode: 'javascript',
        sample: '// console.log(\'runs\');\n',
        format: false,
        compile: true,
    },
    python: {
        text: 'Python',
        code: 'python',
        mode: 'python',
        sample: '# print(\'runs\')\n',
        format: false,
        compile: true,
    },
    html: {
        text: 'HTML',
        code: 'html',
        mode: 'htmlmixed',
        sample: '<!-- html -->\n',
        format: true,
        compile: false,
    },
    json: {
        text: 'JSON',
        code: 'json',
        mode: 'javascript',
        sample: '// json\n',
        format: true,
        compile: false,
    },
    css: {
        text: 'CSS',
        code: 'css',
        mode: 'css',
        sample: '/* css */\n',
        format: true,
        compile: false,
    },
};

LANGS.current = LANGS.php;

// eslint-disable-next-line no-undef
var editor = CodeMirror(document.getElementById('editor-panel'), {
    mode: LANGS.current.mode,
    lineNumbers: true,
    indentUnit: 4,
    theme: 'dracula'
});

editor.setSize('100%', '100%');
editor.setValue(LANGS.current.sample);
editor.setCursor(editor.lineCount(), 0);
editor.focus();

document.addEventListener('click', function (e) {
    switch (e.target.id || e.target.parentElement.id) {
    case 'fab0':
        toggleFabButtons();
        break;
    case 'fab1':
        runJsonToPhp();
        break;
    case 'fab2':
        runSwitchCase();
        break;
    case 'fab3':
        runCopyContent('fab3');
        break;
    default:
        toggleFabButtons(false);
        break;
    }
});

function isCompilation() {
    return getAction() == 'compile';
}

function getAction() {
    var action = document
        .querySelector('.run-button')
        .getAttribute('data-action');

    if (!action) {
        action = 'compile';
    }

    return action;
}

// eslint-disable-next-line no-unused-vars
function runAction() {
    isCompilation() ? compileCode() : formatCode();
}

function runJsonToPhp() {
    toggleOutputPanel(false);
    toggleFabButtons(false);
    toggleLoading(true);

    apiPrettier('jsontophp', editor.getValue(), showCode, toggleLoading);
}

function runSwitchCase() {
    toggleOutputPanel(false);
    toggleFabButtons(false);
    toggleLoading(true);

    apiPrettier('switchcase', editor.getValue(), showCode, toggleLoading);
}

function runCopyContent(id) {
    var fab = document.getElementById(id);
    var text = fab.getAttribute('data-tooltip');

    navigator.clipboard.writeText(editor.getValue());
    
    fab.setAttribute('data-tooltip', 'Copied');

    setTimeout(() => {
        fab.setAttribute('data-tooltip', text);
    }, 2000);
}

function compileCode() {
    var code = editor.getValue();
    apiAction(code, compileCheck, showError);
    togglePlaceholder(false);
    toggleRunning(true);
    toggleOutputPanel(true);
}

function formatCode() {
    var code = editor.getValue();
    apiAction(code, formatCheck, toggleLoading);
    toggleLoading(true);
    toggleOutputPanel(false);
}

function compileCheck(data) {
    function check(count, max) {
        apiCheck(data.compilation_id, showOutput, showError, function(error) {
            if (count < max){
                check(count + 1, max);
            } else {
                showError(error);
            }
        });
    }

    check(1, 5);
}

function formatCheck(data) {
    function check(count, max) {
        apiCheck(data.formatting_id, showCode, toggleLoading, function() {
            if (count < max){
                check(count + 1, max);
            } else {
                toggleLoading();
            }
        });
    }

    check(1, 5);
}

function showCode(data) {
    editor.setValue(data.output ?? '');
    editor.setCursor(editor.lineCount(), 0);
    editor.focus();

    toggleLoading(false);
}

function showOutput(data) {
    toggleRunning(false);
    createRow(
        'success',
        'Compilation success',
        data.output
    );
}

function showError(data) {
    toggleRunning(false);
    createRow(
        'error',
        'Compilation error',
        data.message
    );
}

// eslint-disable-next-line no-unused-vars
function clearOutput() {
    var outputRows = document.getElementById('output-rows');
    outputRows.innerHTML = '';
}

// eslint-disable-next-line no-unused-vars
function changeAction(action) {
    var select = document.querySelector('.action-select');
    select.style.display = 'none';

    setTimeout(() => {
        select.removeAttribute('style');
    }, 100);

    var runText = document.querySelector('.run-button span');
    var runButton = document.querySelector('.run-button');

    runText.innerText = action;
    runButton.setAttribute('data-action', action.toLowerCase());

    changeLanguages();
    selectLanguage();
    toggleOutputPanel(false);
    toggleActionsPopup(false);
    handleOutputButton(!isCompilation());
}

function selectLanguage() {
    var selected = document.getElementById('lang-select');

    if (LANGS[selected.value]) {
        LANGS.current = LANGS[selected.value];
        editor.setValue(LANGS.current.sample);
        editor.setOption('mode', LANGS.current.mode);
        editor.setCursor(editor.lineCount(), 0);
        editor.focus();
    }
}

function changeLanguages() {
    var action = getAction();

    var select = document.getElementById('lang-select');
    select.innerHTML = '';

    Object.entries(LANGS).map(function([, lang], index) {
        if (!lang[action]) {
            return;
        }

        var option = document.createElement('option');
        option.value = lang.code;
        option.innerText = lang.text;

        select.appendChild(option);

        if (index == 0) {
            option.setAttribute('selected', true);
        }
    });
}

function toggleLoading(show) {
    var loader = document.querySelector('div.loader');
    if (show === true) {
        loader.classList.remove('hide');
    } else {
        loader.classList.add('hide');
    }
}

function toggleRunning(show) {
    var outputRunning = document.getElementById('output-running');
    outputRunning.className = show ? 'show' : '';
}

function togglePlaceholder(show) {
    var outputPlaceholder = document.getElementById('output-placeholder');
    outputPlaceholder.className = show ? 'show' : '';
}

function toggleFabButtons(show) {
    var innerFabs = document.querySelector('.inner-fabs');
    if (show == undefined) {
        innerFabs.classList.toggle('show');
    } else if (show) {
        innerFabs.classList.add('show');
    } else {
        innerFabs.classList.remove('show');
    }
}

function toggleOutputPanel(show) {
    var outputPanel = document.getElementById('output-panel');
    if (show == undefined) {
        outputPanel.classList.toggle('show');
    } else if (show) {
        outputPanel.classList.add('show');
    } else {
        outputPanel.classList.remove('show');
    }
}

function toggleActionsPopup(show) {
    var actions = document.querySelector('.actions');
    if (show == undefined) {
        actions.classList.toggle('show');
    } else if (show) {
        actions.classList.add('show');
    } else {
        actions.classList.remove('show');
    }
}

function handleOutputButton(disable) {
    var outputButton = document.getElementById('toggle-button');
    if (disable == undefined) {
        outputButton.classList.toggle('disable');
    } if (disable) {
        outputButton.classList.add('disable');
    } else {
        outputButton.classList.remove('disable');
    }
}

function createRow(type, title, content) {
    var outputRow = document.createElement('p');

    var successSpan = document.createElement('span');
    successSpan.className = type;
    successSpan.textContent = title;

    var trimed = content ? content.trim() : '';
    var outputSpan = document.createElement('span');
    outputSpan.className = 'output';
    outputSpan.textContent = trimed;

    var inner = outputSpan.innerHTML;
    inner = inner.replace(/\n/g, '<br>');
    inner = inner.replace(/\\n/g, '<br>');
    outputSpan.innerHTML = inner;

    outputRow.appendChild(successSpan);
    outputRow.appendChild(outputSpan);

    var outputRows = document.getElementById('output-rows');
    outputRows.appendChild(outputRow);
}

function apiPrettier(prettier, code, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.rivolink.mg/api/prettier/v2/prettier', true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer '+window._token);

    xhr.onload = function() {
        var resp = null;
        try {
            resp = JSON.parse(xhr.responseText);
        } catch (e) {
            onError({message: 'Request failed.'});
        } if (resp) {
            onSuccess(resp);
        } else {
            onError(resp);
        }
    };

    xhr.onerror = function() {
        onError({message: 'Request failed.'});
    };

    xhr.send(JSON.stringify({
        prettier,
        code
    }));
}

function apiAction(code, onSuccess, onError) {
    var url = 'https://api.rivolink.mg/api/formatter/v1/format';

    if (isCompilation()) {
        url = 'https://api.rivolink.mg/api/compiler/v1/compile';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer '+window._token);

    xhr.onload = function() {
        var resp = null;
        try {
            resp = JSON.parse(xhr.responseText);
        } catch (e) {
            onError({message: 'Request failed.'});
        } if (resp.compilation_id) {
            onSuccess(resp);
        } else if (resp.formatting_id) {
            onSuccess(resp);
        } else {
            onError(resp);
        }
    };

    xhr.onerror = function() {
        onError({message: 'Request failed.'});
    };

    xhr.send(JSON.stringify({
        lang: LANGS.current.code,
        code
    }));
}

function apiCheck(action_id, onSuccess, onError, onPending) {
    var url = 'https://api.rivolink.mg/api/formatter/v1/check/';

    if (isCompilation()) {
        url = 'https://api.rivolink.mg/api/compiler/v1/check/';
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url+action_id, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer '+window._token);

    xhr.onload = function() {
        var resp = null;
        try {
            resp = JSON.parse(xhr.responseText);
        } catch (e) {
            onError({message: 'Request failed.'});
        } if (resp.code == 'PENDING') {
            onPending(resp);
        } else if (resp.code == 'SUCCESS') {
            onSuccess(resp);
        } else {
            onError(resp);
        }
    };

    xhr.onerror = function() {
        onError({message: 'Request failed.'});
    };

    xhr.send();
}
