var langs = {
    current: null,
    php: {
        code: 'php',
        mode: 'text/x-php',
        sample: '// echo \'runs\';\n',
    },
    javascript: {
        code: 'javascript',
        mode: 'javascript',
        sample: '// console.log(\'runs\');\n',
    },
    python: {
        code: 'python',
        mode: 'python',
        sample: '# print(\'runs\')\n',
    },
};

langs.current = langs.php;

// eslint-disable-next-line no-undef
var editor = CodeMirror(document.getElementById('editor-panel'), {
    mode: langs.current.mode,
    lineNumbers: true,
    theme: 'dracula'
});

editor.setSize('100%', '100%');
editor.setValue(langs.current.sample);
editor.setCursor(editor.lineCount(), 0);
editor.focus();

// eslint-disable-next-line no-unused-vars
function compileCode() {
    var code = editor.getValue();
    apiCompile(code, checkOutput, showError);
    togglePlaceholder(false);
    toggleRunning(true);
    toggleOutputPanel(true);
}

function checkOutput(data) {
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

// eslint-disable-next-line no-unused-vars
function selectLanguage() {
    var selected = document.getElementById('lang-select');

    if (langs[selected.value]) {
        langs.current = langs[selected.value];
        editor.setValue(langs.current.sample);
        editor.setOption('mode', langs.current.mode);
        editor.setCursor(editor.lineCount(), 0);
        editor.focus();
    }
}

function toggleOutputPanel(show) {
    var outputPanel = document.getElementById('output-panel');
    if (show == undefined) {
        outputPanel.classList.toggle('show');
    } else {
        outputPanel.className = show ? 'show' : '';
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

// eslint-disable-next-line no-unused-vars
function clearOutput() {
    var outputRows = document.getElementById('output-rows');
    outputRows.innerHTML = '';
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

function apiCompile(code, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.rivolink.mg/api/compiler/v1/compile', true);

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
        } else {
            onError(resp);
        }
    };

    xhr.onerror = function() {
        onError({message: 'Request failed.'});
    };

    xhr.send(JSON.stringify({
        lang: langs.current.code,
        code
    }));
}

function apiCheck(compilation_id, onSuccess, onError, onPending) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.rivolink.mg/api/compiler/v1/check/'+compilation_id, true);

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
