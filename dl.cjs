const fs = require('fs');
const https = require('https');
const path = require('path');

const dest = path.join(__dirname, 'public', 'destinations');
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const images = {
  'makkah.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/The_Ka%27ba%2C_Great_Mosque_of_Mecca%2C_Saudi_Arabia.jpg/1024px-The_Ka%27ba%2C_Great_Mosque_of_Mecca%2C_Saudi_Arabia.jpg',
  'oman.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Grand_Mosque_Muscat_%2819%29_%2840275047024%29.jpg/1024px-Grand_Mosque_Muscat_%2819%29_%2840275047024%29.jpg',
  'egypt.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Egypt%2C_Giza.jpg/1024px-Egypt%2C_Giza.jpg',
  'socotra.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Dragon%27s_Blood_Trees%2C_Socotra_Island_%2812455632274%29_%28cropped%29.jpg/1024px-Dragon%27s_Blood_Trees%2C_Socotra_Island_%2812455632274%29_%28cropped%29.jpg',
  'malaysia.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/KLCC_illuminated_at_night.jpg/1024px-KLCC_illuminated_at_night.jpg'
};

Object.keys(images).forEach(filename => {
  const file = fs.createWriteStream(path.join(dest, filename));
  https.get(images[filename], {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  }, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${filename}`);
    });
  }).on('error', err => {
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
});
