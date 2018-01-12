const express = require('express');
const router = express.Router();

// 检查文件的MD5
router.get('/file', async (req, res) => {
    let query = req.query
    let fileName = query.fileName
    let fileMd5Value = query.fileMd5Value
    // 获取文件Chunk列表
    try {
        const chunkList = await getChunkList(
            path.join(uploadDir, fileName),
            path.join(uploadDir, fileMd5Value)
        );
        res.json(chunkList);
    } catch (error) {
        console.error(error);
        res.json({
            stat: 0,
            chunkList: [],
            desc: 'error happened'
        })
    }
})

// 检查chunk的MD5
router.get('/chunk', (req, res) => {
    const query = req.query
    const chunkIndex = query.index
    const md5 = query.md5
    const chunkPath = path.join(uploadDir, md5, chunkIndex);
    const exit = isExist(chunkPath);
    res.json({
        stat: 1,
        exit: exit,
        desc: 'Exit 1'
    })
})

module.exports = router;