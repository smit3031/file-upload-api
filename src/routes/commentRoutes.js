const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               imageId:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - userId
 *               - imageId
 *               - content
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   type: object
 *       500:
 *         description: Error creating comment
 * 
 * /comments/{commentId}/replies:
 *   post:
 *     summary: Create a reply to a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to reply to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - userId
 *               - content
 *     responses:
 *       201:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reply:
 *                   type: object
 *       500:
 *         description: Error adding reply
 * 
 * /comments/{imageId}:
 *   get:
 *     summary: Fetch comments and replies for a specific image
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         description: ID of the image to fetch comments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No comments found for this image
 *       500:
 *         description: Error fetching comments
 */

router.post('/', commentController.createComment);
router.post('/:commentId/replies', commentController.createReply);
router.get('/:imageId', commentController.getCommentsByImageId);

module.exports = router;