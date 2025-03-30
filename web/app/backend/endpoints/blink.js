import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const router = express.Router();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const uploadDir = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Endpoint videoiden yhdistämiseen
router.post('/blink/videos', upload.array('videos', 6), async (req, res) => {
    const videoFiles = req.files;
    if (!videoFiles || videoFiles.length < 2) {
        return res.status(400).json({ message: 'no need' });
    }

    if (videoFiles.length > 6) {
        return res.status(400).json({ message: 'too many videos to merge'})
    }

    const videoPaths = videoFiles.map(file => `./uploads/${file.filename}`);
    console.log("Video Paths:", videoPaths);

    const outputFilePath = `./uploads/merged_${Date.now()}.mp4`;

    const ffmpegCommand = ffmpeg();
    videoPaths.forEach(videoPath => {
        ffmpegCommand.input(videoPath);
    });

    ffmpegCommand
        .on('end', () => {
            console.log('Merge valmis');
            res.download(outputFilePath, 'merged_video.mp4', (err) => {
                if (err) {
                    console.error('Virhe tiedoston lähetyksessä:', err);
                    return res.status(500).json({ message: 'Tiedoston lataus epäonnistui' });
                }

                // Poistetaan kaikki ladatut videot ja yhdistetty video
                [...videoPaths, outputFilePath].forEach(file => {
                    fs.unlink(file, (err) => {
                        if (err) {
                            console.error(`Virhe poistettaessa tiedostoa ${file}:`, err);
                        } else {
                            console.log(`Tiedosto ${file} poistettu.`);
                        }
                    });
                });
            });
        })
        .on('error', (err) => {
            console.error('Virhe yhdistämisessä:', err);
            res.status(500).json({ message: 'Videoiden yhdistäminen epäonnistui.' });
        })
        .mergeToFile(outputFilePath, './temp');
});


export default router;
