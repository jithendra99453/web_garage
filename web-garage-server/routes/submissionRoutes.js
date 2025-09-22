const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');

// @route   PUT /api/submissions/:id
// @desc    Review and update a submission
// @access  Private (Teacher)
router.put('/:id', auth, async (req, res) => {
    const { status, score, feedback } = req.body;
    try {
        let submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ msg: 'Submission not found' });
        }
        
        // Add authorization logic here if needed (e.g., check if req.user.id matches the teacher of the class)

        const updatedSubmission = await Submission.findByIdAndUpdate(
            req.params.id,
            { $set: { status, score, feedback } },
            { new: true }
        );
        res.json(updatedSubmission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
