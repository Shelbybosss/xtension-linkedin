const profileLinks = [
  'https://www.linkedin.com/in/suhasmagar/',
  'https://www.linkedin.com/in/aashi-saxena-4765b4a9/',
  'https://www.linkedin.com/in/navneet-hingankar-495a6914b/'
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openProfiles') {
      openAndPostProfiles(profileLinks);
      sendResponse({ status: 'openingProfiles' });
  }
});

function openAndPostProfiles(links) {
  links.forEach((link, index) => {
      setTimeout(() => {
          chrome.tabs.create({ url: link }, tab => {
              console.log('Opened tab for profile:', link);
              scrapeProfile(link, tab.id);
          });
      }, index * 3000); // Delay to ensure tabs open in sequence
  });
}

function scrapeProfile(url, tabId) {
  chrome.scripting.executeScript(
      {
          target: { tabId: tabId },
          function: () => {
              return {
                  name: document.querySelector('.top-card-layout__title')?.innerText || '',
                  location: document.querySelector('.top-card__subline-item')?.innerText || '',
                  about: document.querySelector('.summary__text')?.innerText || '',
                  bio: document.querySelector('.top-card__headline')?.innerText || '',
                  followerCount: document.querySelector('.top-card__followers')?.innerText || '',
                  connectionCount: document.querySelector('.top-card__connections')?.innerText || '',
                  bioLine: document.querySelector('.top-card__tagline')?.innerText || ''
              };
          }
      },
      (results) => {
          if (results && results[0]) {
              postData(results[0]);
          } else {
              console.error('Failed to scrape profile:', url);
          }
      }
  );
}

async function postData(profileData) {
  try {
      const response = await fetch('http://localhost:3000/api/profiles', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
      });
      const data = await response.json();
      console.log('Profile data posted:', data);
  } catch (error) {
      console.error('Error posting data:', error);
  }
}
