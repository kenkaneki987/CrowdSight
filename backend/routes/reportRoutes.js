/**
 * Report Routes - Simple CRUD operations for crowd reports
 * No AI dependencies, clean Express routes with full comments
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport,
  // Admin-specific controller functions
  getAllReportsForAdmin,
  updateReportStatusAdmin,
  deleteReportAdmin
} = require('../controllers/reportController');

// Import authentication middleware (optional for some routes)
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

/**
 * POST /api/reports
 * Create a new crowd report
 * 
 * Required body fields:
 * - title: String (report title)
 * - description: String (detailed description)
 * - location: String (location of incident)
 * - crowdLevel: String ('Low', 'Medium', 'High')
 * 
 * Optional body fields:
 * - crowdCount: Number (user-estimated crowd size)
 * - imageUrl: String (URL or path to image)
 * - userId: Number (will be set from auth token if available)
 */
router.post('/', authMiddleware, createReport);

/**
 * GET /api/reports
 * Retrieve all reports with optional filtering and pagination
 * 
 * Optional query parameters:
 * - search: String (search in title, description, location)
 * - status: String (filter by status: 'Pending', 'In Progress', 'Resolved')
 * - crowdLevel: String (filter by crowd level: 'Low', 'Medium', 'High')
 * - sortBy: String (sort field, default: 'createdAt')
 * - sortOrder: String ('asc' or 'desc', default: 'desc')
 * - page: Number (page number, default: 1)
 * - limit: Number (items per page, default: 10)
 * 
 * Example: GET /api/reports?status=Pending&crowdLevel=High&page=1&limit=5
 * 
 * NOTE: This endpoint now requires authentication and only returns reports 
 * created by the authenticated user. For admin access to all reports, 
 * use the /admin/reports endpoint.
 */
router.get('/', authMiddleware, getReports);

/**
 * PUT /api/reports/:id
 * Update a report's status (Admin Only)
 * 
 * URL parameters:
 * - id: Number (report ID)
 * 
 * Required body fields:
 * - status: String ('Pending', 'In Progress', 'Resolved')
 * 
 * Note: Only admin users can update report status
 * Example: PUT /api/reports/123 with body { "status": "Resolved" }
 */
router.put('/:id', authMiddleware, adminMiddleware, updateReportStatus);

/**
 * DELETE /api/reports/:id
 * Delete a specific report
 * 
 * URL parameters:
 * - id: Number (report ID to delete)
 * 
 * Example: DELETE /api/reports/123
 */
router.delete('/:id', authMiddleware, deleteReport);

/**
 * ADMIN ROUTES - Require admin role
 * All admin routes are protected by both authMiddleware and adminMiddleware
 */

/**
 * GET /api/reports/admin/reports
 * Get all reports for admin management (admin only)
 * 
 * Query parameters:
 * - status: String (optional filter by status)
 * - page: Number (pagination, default 1)
 * - limit: Number (items per page, default 20)
 * 
 * Returns all reports from all users with user information
 */
router.get('/admin/reports', authMiddleware, adminMiddleware, getAllReportsForAdmin);

/**
 * PUT /api/reports/admin/reports/:id/status
 * Update report status (admin only)
 * 
 * URL parameters:
 * - id: Number (report ID)
 * 
 * Body:
 * - status: String ("Pending", "In Progress", "Resolved")
 * 
 * Example: PUT /api/reports/admin/reports/123/status
 * Body: { "status": "Resolved" }
 */
router.put('/admin/reports/:id/status', authMiddleware, adminMiddleware, updateReportStatusAdmin);

/**
 * DELETE /api/reports/admin/reports/:id
 * Delete any report (admin only)
 * 
 * URL parameters:
 * - id: Number (report ID to delete)
 * 
 * Example: DELETE /api/reports/admin/reports/123
 */
router.delete('/admin/reports/:id', authMiddleware, adminMiddleware, deleteReportAdmin);

module.exports = router;