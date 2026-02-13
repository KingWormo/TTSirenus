// Show more options
function toggleOptions() {
  var button, chevron, label;
  button = document.getElementById('show-button-module');
  chevron = document.getElementById('show-chevron');
  label = document.getElementById('show-label');
  options = document.getElementById('more-options');
  var isHidden = window.getComputedStyle(options).display === "none";

  if (isHidden) {
    options.style.display = "block";
    label.innerHTML = 'Show Less';
    chevron.style.transform = "rotate(180deg)";
  } else {
    options.style.display = "none";
    label.innerHTML = 'Show More';
    chevron.style.transform = "rotate(0deg)";
  }
}

// Play requested sound
function playSound(soundFile) {
  fetch('/play', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({ 'sound_file': soundFile }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Kill sound playing
function stopSound() {
  fetch('/stop', {
  method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Filter search results
function searchSound() {
  var input, filter, sounds, a, i, textValue, label;
  input = document.getElementById('search-box');
  filter = input.value.toUpperCase();
  sounds = document.getElementById('button-container');
  results = sounds.getElementsByTagName('button');
  label = document.getElementById('msg-label');

  let anyVisible = false;
  label.style.display = "none";
  for (i = 0; i < results.length; i++) {
    textValue = results[i].textContent || results[i].innnerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      results[i].style.display = "";
      anyVisible = true;
      label.style.display = "none";
	  } else {
	    results[i].style.display = "none";
    }
    if (!anyVisible) {
      label.style.display = "";
      label.innerHTML = "<br> No matching sounds found";
    }
  }
}

// Handle TTS
function enableTTS(event) {
  var input = document.getElementById('tts-input');
  var text = input.value.trim();
  var button = document.getElementById('tts-button');
  // Check if the input is empty
  if (text !== "") {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
  if (event.key === 'Enter' && text !== "") {
    button.click();
  } else if (event.key === 'Enter' && text === "") {
    alert("Please enter some text to speak.");
  }
}

// Fire TTS
function speakText() {
  var input = document.getElementById('tts-input');
  var text = input.value.trim();
  fetch('/speak', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'text': text }),
  })
}

// Handle file selection
let selectedFile = null;

function handleFileSelect() {
  const fileInput = document.getElementById('file-input');
  const fileLabel = document.getElementById('file-label');
  const uploadButton = document.getElementById('upload-button');
  
  if (fileInput.files.length > 0) {
    selectedFile = fileInput.files[0];
    fileLabel.textContent = selectedFile.name;
    uploadButton.disabled = false;
  } else {
    selectedFile = null;
    fileLabel.textContent = 'Upload MP3 file...';
    uploadButton.disabled = true;
  }
}

// Upload file
function uploadFile() {
  if (!selectedFile) {
    console.error('No file selected');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', selectedFile);
  
  const uploadButton = document.getElementById('upload-button');
  const msgLabel = document.getElementById('msg-label');
  
  // Disable button during upload
  uploadButton.disabled = true;
  msgLabel.textContent = 'Uploading...';
  msgLabel.style.color = '#a3a3a3';
  
  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.status === 'success') {
      msgLabel.textContent = '✓ ' + data.message;
      msgLabel.style.color = '#14b8a6'; // teal
      // Reset form
      document.getElementById('file-input').value = '';
      document.getElementById('file-label').textContent = 'Upload MP3 file...';
      selectedFile = null;
      // Reload page after 2 seconds to show new file
      setTimeout(() => location.reload(), 2000);
    } else {
      msgLabel.textContent = '✗ ' + data.message;
      msgLabel.style.color = '#ef4444'; // red
      uploadButton.disabled = false;
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    msgLabel.textContent = '✗ Upload failed';
    msgLabel.style.color = '#ef4444';
    uploadButton.disabled = false;
  });
}
