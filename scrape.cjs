const https = require('https');

const getFirstImage = (query, name) => {
  https.get('https://unsplash.com/s/photos/' + encodeURIComponent(query), {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+[^\"]/);
      if (match) {
        console.log(`[${name}] ${match[0].split('?')[0]}?q=80&w=1200&auto=format&fit=crop`);
      } else {
        console.log(`[${name}] NOT FOUND`);
      }
    });
  });
};

getFirstImage('makkah-kaaba', 'Makkah');
getFirstImage('oman-muscat', 'Oman');
getFirstImage('socotra-island', 'Socotra');
getFirstImage('kuala-lumpur-petronas', 'Malaysia');
getFirstImage('giza-pyramids', 'Egypt');
