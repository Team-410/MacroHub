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

// Handle upvotes and downvotes
router.post("/macro/:macroid/vote", async (req, res) => {
    const { macroid } = req.params;
    const { voteType, userId } = req.body;
    const voteValue = voteType ;
    

    try {
        // Tarkistetaan, onko käyttäjä jo äänestänyt
        const [existingVote] = await connection2.query(
            "SELECT * FROM vote WHERE userid = ? AND macroid = ?",
            [userId, macroid]
        );

        if (existingVote.length > 0) {
            // Käyttäjä on jo äänestänyt, päivitetään ääni
            await connection2.query(
                "UPDATE vote SET vote = ? WHERE userid = ? AND macroid = ?",
                [voteValue, userId, macroid]
            );
        } else {
            // Käyttäjä ei ole vielä äänestänyt, lisätään uusi ääni
            await connection2.query(
                "INSERT INTO vote (userid, macroid, vote) VALUES (?, ?, ?)",
                [userId, macroid, voteValue]
            );
        }

        res.status(200).json({ message: "Vote recorded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error processing vote" });
    }
});

export default router;