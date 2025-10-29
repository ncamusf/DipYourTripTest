const API_ENDPOINT = 'https://us-central1-hemolyzer-ai-ca5bb.cloudfunctions.net/tripBrochureAgentGenerator';

const fileInput = document.getElementById('csvFile');
const fileLabel = document.getElementById('fileLabel');
const fileInfo = document.getElementById('fileInfo');
const uploadBtn = document.getElementById('uploadBtn');
const clearFileBtn = document.getElementById('clearFile');
const progressSection = document.getElementById('progressSection');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const downloadLink = document.getElementById('downloadLink');
const newUploadBtn = document.getElementById('newUpload');
const tryAgainBtn = document.getElementById('tryAgain');

let selectedFile = null;

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.classList.add('drag-over');
});

fileLabel.addEventListener('dragleave', () => {
    fileLabel.classList.remove('drag-over');
});

fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
        handleFileSelect(file);
    } else {
        showError('Please upload a valid CSV file.');
    }
});

function handleFileSelect(file) {
    if (!file.name.endsWith('.csv')) {
        showError('Please select a CSV file.');
        return;
    }

    selectedFile = file;
    
    fileLabel.style.display = 'none';
    fileInfo.classList.remove('hidden');
    fileInfo.querySelector('.file-name').textContent = file.name;
    uploadBtn.disabled = false;
}

clearFileBtn.addEventListener('click', () => {
    clearFileSelection();
});

function clearFileSelection() {
    selectedFile = null;
    fileInput.value = '';
    fileLabel.style.display = 'flex';
    fileInfo.classList.add('hidden');
    uploadBtn.disabled = true;
}

uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    try {
        hideAllSections();
        progressSection.classList.remove('hidden');
        uploadBtn.disabled = true;

        const base64Data = await fileToBase64(selectedFile);
        
        console.log('Base64 data length:', base64Data?.length);
        console.log('Base64 preview:', base64Data?.substring(0, 100));

        if (!base64Data) {
            throw new Error('Failed to read file data');
        }

        const requestBody = { csvData: base64Data };
        console.log('Sending request to:', API_ENDPOINT);
        console.log('Request body keys:', Object.keys(requestBody));
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.url) {
            window.location.href = result.url;
        } else {
            throw new Error('No PDF URL in response');
        }

    } catch (error) {
        console.error('Upload error:', error);
        hideAllSections();
        showError(error.message || 'Failed to upload and process the file. Please try again.');
        uploadBtn.disabled = false;
    }
});

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function showSuccess(result) {
    resultSection.classList.remove('hidden');
    
    const message = document.querySelector('.result-message');
    message.textContent = 'Your trip brochure has been generated successfully!';

    if (result.pdfUrl) {
        downloadLink.href = result.pdfUrl;
        downloadLink.style.display = 'inline-block';
    } else {
        downloadLink.style.display = 'none';
    }
}

function showError(message) {
    errorSection.classList.remove('hidden');
    document.querySelector('.error-message').textContent = message;
}

function hideAllSections() {
    progressSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

newUploadBtn.addEventListener('click', () => {
    clearFileSelection();
    hideAllSections();
});

tryAgainBtn.addEventListener('click', () => {
    hideAllSections();
    uploadBtn.disabled = false;
});

