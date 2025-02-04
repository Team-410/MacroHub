import express from 'express';
import connection2 from '../connection.js';


const router = express.Router();

// Get total votes for a specific macro
router.get("/macro/:macroid/votes", async (req, res) => {
    const { macroid } = req.params;

    try {
        // Hae upvote-määrä
        const [[{ upcount }]] = await connection2.query(
            "SELECT COUNT(*) AS upcount FROM vote WHERE macroid = ? AND vote = 1",
            [macroid]
        );    

        // Hae downvote-määrä
        const [[{ downcount }]] = await connection2.query(
            "SELECT COUNT(*) AS downcount FROM vote WHERE macroid = ? AND vote = 0",
            [macroid]
        );    

        const voteTotal = upcount - downcount;

        res.status(200).json({ macroid, upvotes: upcount, downvotes: downcount, total: voteTotal });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving votes" });
    }
});

export default router;