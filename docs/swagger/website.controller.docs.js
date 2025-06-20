/**
 * @swagger
 * components:
 *   schemas:
 *     ContactUs:
 *       type: object
 *       required:
 *         - email
 *         - phone
 *         - address
 *         - description
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         address:
 *           type: string
 *           description: Contact address
 *         description:
 *           type: string
 *           description: Message or description of the contact request
 */

/**
 * @swagger
 * /api/v1/website/contact-us:
 *   post:
 *     summary: Submit a contact us form
 *     tags: [Website]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactUs'
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Your message has been received
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Complain:
 *       type: object
 *       required:
 *         - email
 *         - phone
 *         - name
 *         - message
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Complainant's email address
 *         phone:
 *           type: string
 *           description: Complainant's phone number
 *         name:
 *           type: string
 *           description: Complainant's name
 *         message:
 *           type: string
 *           description: Complaint message
 */

/**
 * @swagger
 * /api/v1/website/complain:
 *   post:
 *     summary: Submit a complaint
 *     tags: [Website]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Complain'
 *     responses:
 *       200:
 *         description: Complaint submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Complain added successfully
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Certificate ID
 *         title:
 *           type: string
 *           description: Certificate title
 *         description:
 *           type: string
 *           description: Certificate description
 *         image_url:
 *           type: string
 *           description: URL to the certificate image
 *         image_base64:
 *           type: string
 *           description: Base64 encoded certificate image
 *         is_enabled:
 *           type: boolean
 *           description: Whether the certificate is enabled
 */

/**
 * @swagger
 * /api/v1/website/certificates:
 *   get:
 *     summary: Get all enabled certificates
 *     tags: [Website]
 *     responses:
 *       200:
 *         description: List of certificates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Certificate'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Newsletter:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Subscriber's email address
 */

/**
 * @swagger
 * /api/v1/website/newsletter:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Website]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Newsletter'
 *     responses:
 *       200:
 *         description: Successfully subscribed to newsletter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Successfully subscribed to newsletter
 *       400:
 *         description: Invalid request or email already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogComment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Comment ID
 *         name:
 *           type: string
 *           description: Commenter's name
 *         email:
 *           type: string
 *           format: email
 *           description: Commenter's email address
 *         comment:
 *           type: string
 *           description: The comment text
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Comment creation timestamp
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Blog ID
 *         title:
 *           type: string
 *           description: Blog title
 *         content:
 *           type: string
 *           description: Blog content
 *         image_url:
 *           type: string
 *           description: URL to the blog image
 *         image_base64:
 *           type: string
 *           description: Base64 encoded blog image
 *         allow_comments:
 *           type: boolean
 *           description: Whether comments are allowed
 *         is_published:
 *           type: boolean
 *           description: Whether the blog is published
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Blog creation timestamp
 *         comments:
 *           type: array
 *           description: Array of comments on the blog
 *           items:
 *             $ref: '#/components/schemas/BlogComment'
 */

/**
 * @swagger
 * /api/v1/website/blogs:
 *   get:
 *     summary: Get all published blogs
 *     tags: [Website]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of blogs
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       description: Number of items per page
 *                       example: 10
 *                     blogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 */

/**
 * @swagger
 * /api/v1/website/blog/{blog_id}:
 *   get:
 *     summary: Get a single published blog by ID
 *     tags: [Website]
 *     parameters:
 *       - in: path
 *         name: blog_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog to retrieve
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogCommentRequest:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - comment
 *         - blog_id
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Commenter's email address
 *         name:
 *           type: string
 *           description: Commenter's name
 *         comment:
 *           type: string
 *           description: The comment text
 *         blog_id:
 *           type: integer
 *           description: ID of the blog being commented on
 */

/**
 * @swagger
 * /api/v1/website/blog-comment:
 *   post:
 *     summary: Submit a comment on a blog
 *     tags: [Website]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogCommentRequest'
 *     responses:
 *       200:
 *         description: Comment submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Comment added successfully
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */ 