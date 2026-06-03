const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

/*
=================================
GET ALL IDEAS
=================================
*/
router.get('/', async (req, res) => {

    try {

        const ideas =
            await Idea.find()
                .sort({ createdAt: -1 });

        res.status(200).json(ideas);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message:
                'Server error fetching ideas.'
        });

    }

});

/*
=================================
SUBMIT IDEA
=================================
*/
router.post('/submit', async (req, res) => {

    const {
        title,
        description,
        submittedBy,
        submittedByEmail,
        userId
    } = req.body;

    if (
        !title ||
        !description ||
        !submittedBy ||
        !userId
    ) {

        return res.status(400).json({
            message:
                'All fields are required.'
        });

    }

    try {

        const newIdea =
            new Idea({

                title,

                description,

                submittedBy,

                submittedByEmail,

                userId,

                interestedUsers: []

            });

        const savedIdea =
            await newIdea.save();

        res.status(201).json({

            success: true,

            message:
                'Idea submitted successfully!',

            ideaId:
                savedIdea._id

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                'Failed to submit idea.'

        });

    }

});

/*
=================================
GET SINGLE IDEA
=================================
*/
router.get('/:id', async (req, res) => {

    try {

        const idea =
            await Idea.findById(
                req.params.id
            );

        if (!idea) {

            return res.status(404).json({

                message:
                    'Idea not found.'

            });

        }

        res.status(200).json(idea);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                'Server error fetching idea.'

        });

    }

});

/*
=================================
REGISTER INTEREST (ONE LIKE PER USER)
=================================
*/
router.post('/:id/interest', async (req, res) => {

    const { userId } = req.body;

    try {

        if (!userId) {

            return res.status(400).json({
                success: false,
                message: 'User ID required.'
            });

        }

        const idea =
            await Idea.findById(
                req.params.id
            );

        if (!idea) {

            return res.status(404).json({

                success: false,

                message:
                    'Idea not found.'

            });

        }

        if (
            idea.interestedUsers.includes(
                userId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'You have already liked this idea.'

            });

        }

        idea.interestedUsers.push(
            userId
        );

        await idea.save();

        res.status(200).json({

            success: true,

            message:
                'Interest registered successfully.',

            interestCount:
                idea.interestedUsers.length

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                'Failed to register interest.'

        });

    }

});

/*
=================================
DELETE IDEA
=================================
*/
router.delete('/:id', async (req, res) => {

    try {

        const idea =
            await Idea.findById(
                req.params.id
            );

        if (!idea) {

            return res.status(404).json({

                message:
                    'Idea not found.'

            });

        }

        await Idea.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({

            success: true,

            message:
                'Idea deleted successfully.'

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                'Failed to delete idea.'

        });

    }

});

module.exports = router;