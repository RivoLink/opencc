<?php $token = trim(file_get_contents('private/token.txt')); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <title>Open CC | RivoLink</title>
    <meta name="description" content="Write, compile and explore your code."/>

    <meta property='og:title' content="Open CC, Open Code Compiler"/>
    <meta property='og:description' content="Write, compile and explore your code." />

    <meta property='og:type' content="website"/>
    <meta property='og:site_name' content="Open Code Compiler"/>

    <link rel="canonical" href="https://opencc.rivolink.mg"/>
    <link rel="icon" href="/assets/img/favicon.ico" type="image/x-icon"/>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/codemirror.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/theme/dracula.min.css"/>

    <link rel="stylesheet" href="/assets/css/style.css"/>
</head>
<body>
    <div class="presentation">
        <h1>Open Code Compiler</h1>
        <p>Write, compile and explore your code.</p>
    </div>
    <div class="card">
        <div class="loader hide">
            <div class="loading"></div>
        </div>
        <div class="toolbar">
            <div class="left-tools">
                <button class="run-button" onclick="runAction()">
                    <i class="material-symbols-rounded">play_circle</i>
                    <span>Compile</span>
                </button>
                <div class="actions">
                    <button class="action-button" onclick="toggleActionsPopup()">
                        <i class="material-symbols-rounded">arrow_drop_down</i>
                    </button>
                    <div class="action-select">
                        <a href="javascript:void(0)" onclick="changeAction('Compile')">Compile</a>
                        <a href="javascript:void(0)" onclick="changeAction('Format')">Format</a>
                    </div>
                </div>
            </div>
            <div class="right-tools">
                <select id="lang-select" onchange="selectLanguage()">
                    <option value="php">PHP</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                </select>
                <button id="toggle-button" onclick="toggleOutputPanel()">
                    <i class="material-symbols-rounded">adjust</i> <span>Output</span>
                </button>
            </div>
        </div>
        <div class="main">
            <div id="editor-panel" class="codemirror-panel">
            </div>
            <div id="output-panel">
                <button class="clear-output-button" onclick="clearOutput();togglePlaceholder(true)">
                    <i class="material-symbols-rounded fs-20">delete</i>
                </button>
                <div class="output-content">
                    <div id="output-placeholder" class="show">
                        <p># Code output goes here</p>
                    </div>
                    <div id="output-rows">
                    </div>
                    <div id="output-running">
                        <p class="running">
                        </p>
                    </div>
                </div>
            </div>
            <div class="fabs-container">
                <div class="inner-fabs">
                    <div class="fab" id="fab3" data-tooltip="Copy content"><i class="material-symbols-rounded fb-19">content_copy</i></div>
                    <div class="fab" id="fab2" data-tooltip="Switch case"><i class="material-symbols-rounded fb-19">match_case</i></div>
                    <div class="fab" id="fab1" data-tooltip="Json to PHP"><i class="material-symbols-rounded fb-19">data_object</i></div>
                </div>
                <div class="fab" id="fab0"><i class="material-symbols-rounded fb-29">add</i></div>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/clike/clike.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/php/php.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/python/python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/mode/css/css.min.js"></script>

    <script>
        window._token = '<?=$token?>';
    </script>

    <script src="/assets/js/script.js"></script>
</body>
</html>
