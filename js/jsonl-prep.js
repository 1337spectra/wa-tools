// Global state
let processing = false;
let results = [];
let errors = [];

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processingStatus = document.getElementById('processingStatus');
const processingText = document.getElementById('processingText');
const currentFile = document.getElementById('currentFile');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const errorContainer = document.getElementById('errorContainer');
const resultsContainer = document.getElementById('resultsContainer');
const includeSystem = document.getElementById('includeSystem');
const systemMessage = document.getElementById('systemMessage');
const systemMessageDiv = document.getElementById('systemMessageDiv');

// Event listeners
fileInput.addEventListener('change', handleFileSelect);
includeSystem.addEventListener('change', toggleSystemMessage);

// Drag and drop
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('drop', handleDrop);
uploadArea.addEventListener('dragenter', () => uploadArea.classList.add('dragover'));
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));

function toggleSystemMessage() {
    systemMessageDiv.style.display = includeSystem.checked ? 'block' : 'none';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFileSelect({ target: { files } });
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files).filter(file => file.type === 'application/json');

    if (files.length === 0) {
        showError('Please select valid JSON files');
        return;
    }

    if (files.length !== event.target.files.length) {
        showError(`${event.target.files.length - files.length} non-JSON files were ignored`);
    }

    processFiles(files);
}

function preprocessContent(content) {
    if (!content) return '';
    return content
        .trim()
        .replace(/['']/g, "'")
        .replace(/[""]/g, "'")
        .replace(/\\"/g, "'")
        .replace(/"/g, "'")
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

async function processFiles(fileList) {
    processing = true;
    results = [];
    errors = [];

    showProcessing();
    clearResults();

    const batchMode = fileList.length > 1;
    updateProcessingText(batchMode ? `Processing ${fileList.length} files...` : 'Processing your file...');

    for (let fileIndex = 0; fileIndex < fileList.length; fileIndex++) {
        const file = fileList[fileIndex];
        updateCurrentFile(file.name);

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            let messages = [];
            if (data.messages && Array.isArray(data.messages)) {
                messages = data.messages;
            } else {
                throw new Error(`Invalid ChatGPT file format in ${file.name} - no messages array found`);
            }

            const pairs = [];
            let currentPrompt = null;

            for (let i = 0; i < messages.length; i++) {
                const fileProgress = (fileIndex / fileList.length) * 100;
                const messageProgress = (i / messages.length) * (100 / fileList.length) * 0.5;
                updateProgress(fileProgress + messageProgress);

                const message = messages[i];
                if (message.role === 'Prompt') {
                    currentPrompt = preprocessContent(message.say);
                } else if (message.role === 'Response' && currentPrompt) {
                    const response = preprocessContent(message.say);
                    if (currentPrompt && response) {
                        pairs.push({
                            prompt: currentPrompt,
                            response: response
                        });
                    }
                    currentPrompt = null;
                }
            }

            if (pairs.length === 0) {
                throw new Error(`No valid prompt-response pairs found in ${file.name}`);
            }

            const jsonlLines = [];
            for (let i = 0; i < pairs.length; i++) {
                const fileProgress = (fileIndex / fileList.length) * 100;
                const pairProgress = (i / pairs.length) * (100 / fileList.length) * 0.5;
                updateProgress(fileProgress + 50 / fileList.length + pairProgress);

                const pair = pairs[i];
                const messages = [
                    { role: 'user', content: pair.prompt },
                    { role: 'assistant', content: pair.response }
                ];

                if (includeSystem.checked && systemMessage.value.trim()) {
                    messages.unshift({ role: 'system', content: systemMessage.value.trim() });
                }

                jsonlLines.push(JSON.stringify({ messages }));
            }

            const jsonlContent = jsonlLines.join('\n');

            results.push({
                filename: file.name.replace(/\.[^/.]+$/, '') + '.jsonl',
                content: jsonlContent,
                pairCount: pairs.length,
                originalMessages: messages.length,
                originalFilename: file.name
            });

        } catch (err) {
            errors.push({
                filename: file.name,
                error: err.message
            });
        }
    }

    updateProgress(100);
    hideProcessing();
    showResults();
}

function showProcessing() {
    processingStatus.classList.remove('hidden');
    uploadArea.style.display = 'none';
}

function hideProcessing() {
    processingStatus.classList.add('hidden');
    uploadArea.style.display = 'block';
}

function updateProcessingText(text) {
    processingText.textContent = text;
}

function updateCurrentFile(filename) {
    currentFile.textContent = `Current: ${filename}`;
}

function updateProgress(percent) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${Math.round(percent)}% complete`;
}

function showError(message) {
    errorContainer.innerHTML = `
        <div class="error-card">
            <i class="fas fa-exclamation-triangle"></i>
            <span class="font-weight-bold">Error:</span>
            <span>${message}</span>
        </div>
    `;
}

function clearResults() {
    errorContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
}

function showResults() {
    let html = '';

    // Show errors
    if (errors.length > 0) {
        html += '<div class="mt-4">';
        errors.forEach(error => {
            html += `
                <div class="error-card">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span class="font-weight-bold">Error in ${error.filename}:</span>
                    <span>${error.error}</span>
                </div>
            `;
        });
        html += '</div>';
    }

    // Show success
    if (results.length > 0) {
        const batchMode = results.length > 1;
        const totalPairs = results.reduce((sum, r) => sum + r.pairCount, 0);
        const totalMessages = results.reduce((sum, r) => sum + r.originalMessages, 0);

                                html += `
                <div class="success-card">
                    <i class="fas fa-check-circle text-success"></i>
                    <span class="font-weight-bold">
                        ${batchMode ? 'Batch Conversion Complete!' : 'Conversion Complete!'}
                    </span>
                    <div class="small mt-2">
                        ${batchMode ?
                            `<p style="margin: 0.25rem 0;">• ${results.length} files processed successfully</p>
                            <p style="margin: 0.25rem 0;">• ${totalPairs} total prompt-response pairs</p>
                            <p style="margin: 0.25rem 0;">• ${totalMessages} original messages processed</p>` :
                            `<p style="margin: 0.25rem 0;">• ${results[0].pairCount} prompt-response pairs extracted</p>
                            <p style="margin: 0.25rem 0;">• ${results[0].originalMessages} original messages processed</p>`
                        }
                        <p style="margin: 0.25rem 0;">• Ready for OpenAI fine-tuning</p>
                    </div>
                </div>
            `;

        // Individual file results for batch mode
        if (batchMode) {
                                        html += `
                    <div class="result-card">
                        <h6 class="text-light">Individual Files:</h6>
                        <div class="space-y-2">
                `;
                results.forEach((result, index) => {
                    html += `
                        <div class="d-flex justify-content-between align-items-center bg-dark p-3 border border-light">
                            <div class="flex-1 min-w-0">
                                <div class="font-weight-bold text-truncate text-light">${result.originalFilename}</div>
                                <div class="text-muted small">${result.pairCount} pairs • ${result.originalMessages} messages</div>
                            </div>
                            <button onclick="downloadResult(${index})" class="btn-primary">
                                Download
                            </button>
                        </div>
                    `;
                });
                html += '</div></div>';
        }

        // Download buttons
        html += '<div class="mt-3">';
        if (batchMode) {
            html += `
                <button onclick="downloadAllIndividually()" class="btn-secondary w-100 mb-2">
                    <i class="fas fa-download"></i> Download All Files Individually (${results.length} files)
                </button>
                <button onclick="downloadAsZip()" class="btn-primary w-100">
                    <i class="fas fa-download"></i> Download as Combined Archive
                </button>
            `;
        } else {
            html += `
                <button onclick="downloadResult(0)" class="btn-primary w-100">
                    <i class="fas fa-download"></i> Download ${results[0].filename}
                </button>
            `;
        }
        html += '</div>';
    }

    resultsContainer.innerHTML = html;
}

function downloadResult(index) {
    const result = results[index];
    const blob = new Blob([result.content], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAllIndividually() {
    if (results.length === 0) return;

    results.forEach((result, index) => {
        setTimeout(() => {
            downloadResult(index);
        }, index * 100);
    });
}

function downloadAsZip() {
    if (results.length === 0) return;

    let zipContent = '';
    results.forEach((result, index) => {
        zipContent += `--- FILE: ${result.filename} ---\n`;
        zipContent += result.content;
        zipContent += '\n\n';
    });

    const blob = new Blob([zipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_converted_${results.length}_files.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Legacy manual conversion function
function escapeJSON(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\[/g, '(')
        .replace(/\]/g, ')')
        .replace(/"/g, "'");
}

function convertToJSONL() {
    var systemMessage = document.getElementById('system_message').value;
    var userMessage = document.getElementById('user_message').value;
    var assistantMessage = document.getElementById('assistant_message').value;
    var includeSystemManual = document.getElementById('includeSystem').checked;
    var systemMessageSetting = document.getElementById('systemMessage').value;

    var messages = [];

    if (includeSystemManual && systemMessageSetting.trim()) {
        messages.push({ role: 'system', content: systemMessageSetting.trim() });
    }

    messages.push({ role: 'user', content: escapeJSON(userMessage) });
    messages.push({ role: 'assistant', content: escapeJSON(assistantMessage) });

    var jsonl = JSON.stringify({ messages });

    document.getElementById('jsonl-output').value = jsonl;
}

var copyButtons = document.querySelectorAll("[data-clipboard-target]");
var clipboard = new ClipboardJS(copyButtons);
