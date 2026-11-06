const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, '../frontend/models');
const jsDir = path.join(__dirname, '../frontend/js');

if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

const filesToDownload = [
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/dist/face-api.min.js',
    dest: path.join(jsDir, 'face-api.min.js')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json',
    dest: path.join(modelsDir, 'ssd_mobilenetv1_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1',
    dest: path.join(modelsDir, 'ssd_mobilenetv1_model-shard1')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard2',
    dest: path.join(modelsDir, 'ssd_mobilenetv1_model-shard2')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
    dest: path.join(modelsDir, 'face_landmark_68_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
    dest: path.join(modelsDir, 'face_landmark_68_model-shard1')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json',
    dest: path.join(modelsDir, 'face_recognition_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1',
    dest: path.join(modelsDir, 'face_recognition_model-shard1')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json',
    dest: path.join(modelsDir, 'face_expression_model-weights_manifest.json')
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1',
    dest: path.join(modelsDir, 'face_expression_model-shard1')
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading face-api.js and models...');
  for (const item of filesToDownload) {
    if (!fs.existsSync(item.dest)) {
      console.log(`Downloading ${path.basename(item.dest)}...`);
      try {
        await downloadFile(item.url, item.dest);
      } catch (err) {
        console.error(`Error downloading ${item.dest}:`, err.message);
      }
    } else {
      console.log(`${path.basename(item.dest)} already exists.`);
    }
  }
  console.log('Done!');
}

run();
