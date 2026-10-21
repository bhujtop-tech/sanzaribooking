import fs from 'fs';
import path from 'path';
import https from 'https';

const dir = path.join(process.cwd(), 'public', 'img', 'places');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Curated high quality real Kashmir travel photos
const PLACE_URLS = {
  banner: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
  srinagar: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=500&q=80",
  dal: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=500&q=80",
  shankaracharya: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80",
  shalimar: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=500&q=80",
  mughal: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=500&q=80",
  nishat: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=500&q=80",
  hazratbal: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=500&q=80",
  ganderbal: "https://images.unsplash.com/photo-1605649487212-47bdab06cf3f?auto=format&fit=crop&w=500&q=80",
  sonamarg: "https://images.unsplash.com/photo-1605649487212-47bdab06cf3f?auto=format&fit=crop&w=500&q=80",
  gulmarg: "https://images.unsplash.com/photo-1616190419596-e2839e7380d7?auto=format&fit=crop&w=500&q=80",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80",
  saffron: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=500&q=80",
  batfactory: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=500&q=80",
  pahalgam: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80",
  aishmuqam: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=500&q=80"
};

async function download(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filePath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log("Fetching Kashmir place images...");
  for (const [key, url] of Object.entries(PLACE_URLS)) {
    const dest = path.join(dir, `${key}.jpg`);
    try {
      await download(url, dest);
      console.log(`Saved ${key}.jpg (${fs.statSync(dest).size} bytes)`);
    } catch(err) {
      console.error(`Failed ${key}:`, err.message);
    }
  }
}

run();
