document.getElementById('open-profiles-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'openProfiles' }, response => {
      if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
      } else {
          console.log('Profiles opening...');
      }
  });
});
