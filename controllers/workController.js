const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { Work } = require('../models');

const storage = multer.diskStorage({
  destination: 'public/media/img/main/originals',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 원래 확장자를 파일 이름에 추가
  }
});

const upload = multer({ storage: storage }).single('imagePath');

exports.getAllWorks = async (req, res) => {
  try {

    const works = await Work.findAll({
      order: [
        ['year', 'DESC'],  // 년도 내림차순으로 정렬
        ['title', 'ASC']   // 제목 오름차순으로 정렬
      ]
    });

    res.render('work', { 
      csrfToken: req.csrfToken() ,
      works  
    });
  } catch (error) {
    console.error("Error fetching works:", error);

    res.render('error', { error });
  }
};

exports.createWork = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // 썸네일 생성
    try {
      const imagePath = req.file.path.replace('public', '');      
      const thumbnailPath = path.join('/media/img/thumbnails', `thumbnail-${req.file.filename}.jpg`);

      // Sharp를 사용하여 썸네일 생성
      await sharp(req.file.path)
        .resize(500, 500, { fit: 'contain'})
        .withMetadata()
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/${thumbnailPath}`);

      // DB 저장 
      const createWork = await Work.create({
        title: req.body.title, 
        year: req.body.year, 
        medium : req.body.medium, 
        dimensions: req.body.dimensions, 
        pieces: req.body.pieces, 
        imagePath: imagePath, 
        thumbnailPath: thumbnailPath
      });

      res.json({ message: '작업이 성공적으로 저장되었습니다', work: createWork });
    } catch (error) {
      console.error('작업 저장 중 오류 발생:', error);
      
      // 오류 시 원본파일, 썸네일 저장하지 않고 삭제
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('원본 파일 삭제 중 오류 발생:', err);
        }
      });

      fs.unlink(fullThumbnailPath, (err) => {
        if (err) {
          console.error('썸네일 삭제 중 오류 발생:', err);
        }
      });

      res.status(500).send('서버 오류로 인해 작업 저장에 실패했습니다.');
    }
  });
};

exports.deleteWork = async (req, res) => {
  const workId = req.params.workId;

  try {
    // 작업 정보 조회
    const work = await Work.findOne({ where: {id: workId } });

    if(!work){
      return res.status(404).send('workId를 찾을 수 없습니다.')
    }

    // 관련 파일 경로
    const imagePath = path.join('public', work.imagePath);
    const thumbnailPath = path.join('public', work.thumbnailPath);

    // DB에서 workId 삭제
    await Work.destroy({
      where: { id: workId }
    })

    // 파일 삭제
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('원본 파일 삭제 중 오류 발생:', err);
      }
    });

    fs.unlink(thumbnailPath, (err) => {
      if (err) {
        console.error('썸네일 삭제 중 오류 발생:', err);
      }
    });

    res.send('workId 삭제 완료되었습니다.');
  } catch (error) {
      console.error('workId 삭제 중 오류 발생:', error);
      res.status(500).send('서버 오류로 인해 workId 삭제에 실패했습니다.');
  }
};

exports.updateWork = async (req, res) => {
  try {
    const workId = req.body.id;

    const updatedData = {
      title: req.body.title, 
      year: req.body.year, 
      medium: req.body.medium, 
      dimensions: req.body.dimensions, 
      pieces: req.body.pieces
    };

    const updateResult = await Work.update(updatedData, {
      where: { id: workId }
    });

    if (updateResult[0] > 0) { // 업데이트된 행의 수를 확인
      res.json({ message: '작업이 성공적으로 업데이트되었습니다.' });
    } else {
      res.status(404).send('해당 작업을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('작업 업데이트 중 오류 발생:', error);
    res.status(500).send('서버 오류로 인해 작업 업데이트에 실패했습니다.');
  }
};
