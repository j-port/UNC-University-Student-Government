# API Documentation

This document describes how the API documentation is set up and how to add documentation to new endpoints.

## Accessing the API Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:5000/api/docs
```

This provides a Swagger UI interface where you can:

-   Browse all available endpoints
-   See request/response schemas
-   Try out API calls directly from the browser
-   View authentication requirements

## Adding Documentation to New Endpoints

We use JSDoc comments with Swagger annotations to document our endpoints. Here's how to add documentation:

### Basic Structure

```javascript
/**
 * @swagger
 * /endpoint-path:
 *   httpMethod:
 *     tags: [TagName]
 *     summary: Brief description
 *     description: Detailed description
 *     responses:
 *       200:
 *         description: Success response
 */
router.httpMethod("/endpoint-path", middleware, handler);
```

### Example: Public Endpoint (No Auth)

```javascript
/**
 * @swagger
 * /announcements:
 *   get:
 *     tags: [Announcements]
 *     summary: Get all published announcements
 *     description: Retrieve all announcements with published status
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 */
router.get(
    "/",
    catchAsync(async (req, res) => {
        const data = await db.announcements.getAll();
        res.json({ success: true, data });
    })
);
```

### Example: Protected Endpoint (Admin Only)

```javascript
/**
 * @swagger
 * /announcements:
 *   post:
 *     tags: [Announcements]
 *     summary: Create a new announcement
 *     description: Create a new announcement (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Event, Accomplishment, News, Announcement, Other]
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         $ref: '#/components/schemas/Error'
 */
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(createAnnouncementSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.create(req.body);
        res.status(201).json({ success: true, data });
    })
);
```

### Example: Endpoint with Path Parameters

```javascript
/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     tags: [Announcements]
 *     summary: Get announcement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement details
 *       404:
 *         $ref: '#/components/schemas/Error'
 */
router.get(
    "/:id",
    validate(idParamSchema),
    catchAsync(async (req, res) => {
        const data = await db.announcements.getById(req.params.id);
        if (!data) throw new NotFoundError("Announcement");
        res.json({ success: true, data });
    })
);
```

## Components

### Schemas

Reusable schemas are defined in `src/config/swagger.js` under `components.schemas`. These can be referenced using:

```yaml
$ref: "#/components/schemas/SchemaName"
```

Available schemas:

-   `Error` - Standard error response
-   `ValidationError` - Validation error with details
-   `Feedback` - Feedback submission model
-   `Announcement` - Announcement model
-   `Officer` - Officer model

### Security

Protected endpoints should include:

```yaml
security:
    - bearerAuth: []
```

This indicates that a JWT Bearer token is required.

## Common Response Codes

### Success Responses

-   `200 OK` - Successful GET, PUT, DELETE
-   `201 Created` - Successful POST creating a resource

### Error Responses

-   `400 Bad Request` - Validation error
-   `401 Unauthorized` - Missing or invalid token
-   `403 Forbidden` - Valid token but insufficient permissions
-   `404 Not Found` - Resource doesn't exist
-   `429 Too Many Requests` - Rate limit exceeded
-   `500 Internal Server Error` - Server error

## Rate Limiting

Document rate limits in the description:

```yaml
description: Create a new feedback submission (rate limited - 5 per hour)
```

## Tags

Use these standard tags to organize endpoints:

-   `Health` - Health check endpoints
-   `Feedback` - Student feedback management
-   `Announcements` - News and announcements
-   `Officers` - Student government officers
-   `Organizations` - Student organizations
-   `Committees` - Student government committees
-   `Financial Transactions` - Financial transparency data
-   `Issuances` - Official issuances and documents
-   `Governance Documents` - Constitution, bylaws, and policies
-   `Site Content` - Dynamic site content
-   `Page Content` - Page content management
-   `Stats` - Statistics and metrics

## Testing Endpoints

### Using Swagger UI

1. Navigate to `http://localhost:5000/api/docs`
2. Find your endpoint
3. Click "Try it out"
4. Fill in parameters/body
5. Click "Execute"

### Using Authorization

For protected endpoints:

1. Get a JWT token from Supabase authentication
2. Click the "Authorize" button at the top
3. Enter: `Bearer YOUR_JWT_TOKEN`
4. Click "Authorize"
5. Now you can test protected endpoints

## Updating Swagger Config

To add new schemas or modify the configuration, edit:

```
backend/src/config/swagger.js
```

Changes include:

-   Adding new schema definitions
-   Modifying API info (title, description, version)
-   Adding server URLs
-   Configuring security schemes

## Best Practices

1. **Always document new endpoints** - Add JSDoc comments when creating routes
2. **Use standard response formats** - All responses should have `{ success, data/error }`
3. **Reference existing schemas** - Reuse schemas defined in swagger.js
4. **Document security requirements** - Clearly indicate if auth is required
5. **Provide examples** - Include example values in schemas
6. **Keep descriptions clear** - Write concise, helpful descriptions
7. **Document rate limits** - Mention rate limiting in descriptions
8. **List all possible responses** - Include all success and error responses

## Example: Complete Endpoint Documentation

```javascript
/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     tags: [Organizations]
 *     summary: Update an organization
 *     description: Update organization details (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Computer Science Society
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               logo_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(updateOrganizationSchema),
    catchAsync(async (req, res) => {
        const data = await db.organizations.update(req.params.id, req.body);
        if (!data) throw new NotFoundError("Organization");
        res.json({ success: true, data });
    })
);
```

## Maintenance

-   **Review regularly** - Keep documentation in sync with code changes
-   **Test examples** - Ensure example requests actually work
-   **Update schemas** - Add new schemas when creating new models
-   **Version control** - Update API version in swagger.js for breaking changes
