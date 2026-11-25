const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');
const archiver = require('archiver');

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/outputs', express.static('outputs'));

// Create directories
const createDirs = async () => {
  await fs.mkdir('uploads', { recursive: true });
  await fs.mkdir('outputs', { recursive: true });
};

createDirs();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /mp3|wav|flac|ogg|m4a/;
    const isValidExtension = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    
    const isAudioMimeType = file.mimetype.startsWith('audio/') || 
                            file.mimetype === 'application/octet-stream' || 
                            file.mimetype === 'video/mp4'; 

    if (isValidExtension && isAudioMimeType) {
      return cb(null, true);
    } else {
      console.error(`Rejected file: ${file.originalname} | MIME: ${file.mimetype}`);
      cb(new Error('Only audio files are allowed!'));
    }
  }
});

// Job tracking
const jobs = new Map();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Music Separator API is running' });
});

// Upload and start processing
app.post('/api/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const outputFormat = req.body.outputFormat || 'wav'; 

    const jobId = Date.now().toString();
    const inputPath = req.file.path;
    const outputDir = path.join('outputs', jobId);

    jobs.set(jobId, {
      status: 'processing',
      progress: 0,
      inputPath,
      outputDir,
      stems: null
    });

    processAudio(jobId, inputPath, outputDir, outputFormat);

    res.json({
      jobId,
      message: 'Upload successful, processing started'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check progress
app.get('/api/progress/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    status: job.status,
    progress: job.progress,
    stems: job.stems
  });
});

// Download all stems as ZIP
app.get('/api/download/:jobId/all', async (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job || job.status !== 'completed') {
    return res.status(404).json({ error: 'Job not found or not completed' });
  }

  try {
    const zipFileName = `stems_${jobId}.zip`;
    
    // Explicitly set headers to force browser ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      if (!res.headersSent) res.status(500).send('Failed to create ZIP');
    });

    archive.pipe(res);

    // ==========================================
    // BULLETPROOF WINDOWS FIX:
    // ==========================================
    const songFolderName = path.basename(job.inputPath, path.extname(job.inputPath));
    const absoluteFolderToZip = path.resolve(__dirname, 'outputs', jobId, 'htdemucs', songFolderName);

    // Tell archiver to zip everything inside that folder
    archive.directory(absoluteFolderToZip, false);

    await archive.finalize();
  } catch (error) {
    console.error('ZIP creation error:', error);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to create ZIP' });
  }
});

// Download individual stem
app.get('/api/download/:jobId/:stem', (req, res) => {
  const { jobId, stem } = req.params;
  const job = jobs.get(jobId);

  if (!job || job.status !== 'completed') {
    return res.status(404).json({ error: 'Job not found or not completed' });
  }

  const stemUrl = job.stems[stem];
  
  if (!stemUrl) {
    return res.status(404).json({ error: 'Specific stem not found' });
  }

  // FIX: Resolve Absolute Paths for Windows
  const localPath = stemUrl.startsWith('/') ? stemUrl.substring(1) : stemUrl;
  const absolutePath = path.resolve(__dirname, localPath);
  const fileName = path.basename(absolutePath);
  
  res.download(absolutePath, fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
      }
    }
  });
});

// Process audio with Demucs and optionally convert format
async function processAudio(jobId, inputPath, outputDir, outputFormat) {
  const job = jobs.get(jobId);

  try {
    job.progress = 10;

    const PYTHON_PATH = '"C:\\Users\\oscur\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe"';

    job.progress = 20;

    const command = `${PYTHON_PATH} -m demucs.separate -n htdemucs -o "${outputDir}" "${inputPath}"`;

    console.log(`Running Demucs: ${command}`);

    const progressInterval = setInterval(() => {
      if (job.progress < 80) { 
        job.progress += 5;
      }
    }, 3000);

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 50 * 1024 * 1024 
    });

    clearInterval(progressInterval);
    console.log('Demucs output:', stdout);

    const stemsDir = path.join(outputDir, 'htdemucs', path.basename(inputPath, path.extname(inputPath)));
    
    // ==========================================
    // NEW FFmpeg CONVERSION LOGIC
    // ==========================================
    if (outputFormat !== 'wav') {
        job.progress = 85; 
        console.log(`Starting FFmpeg conversion to ${outputFormat.toUpperCase()}...`);
        
        const filesToConvert = await fs.readdir(stemsDir);
        
        for (const file of filesToConvert) {
            if (file.endsWith('.wav')) {
                const stemName = path.basename(file, '.wav');
                const inputWavPath = path.join(stemsDir, file);
                const outputConvertedPath = path.join(stemsDir, `${stemName}.${outputFormat}`);
                
                // FIX: Explicitly assign the correct codec to prevent corrupted audio files!
                let codecFlags = '';
                if (outputFormat === 'mp3') codecFlags = '-b:a 320k';
                else if (outputFormat === 'm4a') codecFlags = '-c:a aac -b:a 256k';
                else if (outputFormat === 'flac') codecFlags = '-c:a flac';
                
                // Note the -y flag aggressively overwrites to prevent hanging
                const convertCommand = `ffmpeg -y -i "${inputWavPath}" ${codecFlags} "${outputConvertedPath}"`;
                
                console.log(`Converting ${stemName}...`);
                await execAsync(convertCommand);
                
                await fs.unlink(inputWavPath); 
            }
        }
    }
    // ==========================================

    const stems = {};
    const finalFiles = await fs.readdir(stemsDir);
    const stemNames = ['vocals', 'drums', 'bass', 'other', 'guitar', 'piano'];

    for (const stemName of stemNames) {
      const stemFile = finalFiles.find(f => f.startsWith(stemName) && f.endsWith(`.${outputFormat}`));
      if (stemFile) {
        stems[stemName] = `/outputs/${jobId}/htdemucs/${path.basename(inputPath, path.extname(inputPath))}/${stemFile}`;
      }
    }

    job.status = 'completed';
    job.progress = 100;
    job.stems = stems;

    console.log(`Job ${jobId} completed successfully`);

    setTimeout(async () => {
      try {
        await fs.unlink(inputPath);
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }, 60 * 60 * 1000);

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    job.status = 'failed';
    job.error = error.message;
  }
}

app.listen(PORT, () => {
  console.log(`🎵 Music Separator API running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});