import express from "express";
import fetch from 'node-fetch';
import cors from 'cors'


const app = express();
const PORT = process.env.PORT || 3000;


const extensionOrigin = 'chrome-extension://dejnlpaldigoeokfmgplffohdnlpojbm';

app.use(cors({
  origin: extensionOrigin
})
)

app.use(express.json());

app.post('/api/profiles', async (req, res) => {
  try {
    const { url } = req.body;
    const profileData = await scrapeProfile(url);
    res.json(profileData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function scrapeProfile(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return { html};
    
  } catch (error) {
    console.error('Error scraping profile:', error);
    throw new Error('Failed to scrape profile');
  }
}

console.log(html);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
