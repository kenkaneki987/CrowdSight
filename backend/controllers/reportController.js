/**
 * Report Controller - Handles all CRUD operations for crowd reports
 * Simple and clean implementation without AI dependencies
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new crowd report
 * POST /api/reports
 */
const createReport = async (req, res) => {
  try {
    console.log('Creating new report with data:', req.body);
    
    // Extract data from request body
    const { 
      title, 
      description, 
      location, 
      crowdLevel, 
      crowdCount, 
      imageUrl 
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !crowdLevel) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, location, and crowdLevel are required'
      });
    }

    // Validate crowdLevel enum
    const validCrowdLevels = ['Low', 'Medium', 'High'];
    if (!validCrowdLevels.includes(crowdLevel)) {
      return res.status(400).json({
        success: false,
        message: 'crowdLevel must be one of: Low, Medium, High'
      });
    }

    // Get user ID from auth middleware (if available)
    const userId = req.user?.id || null;

    // Create new report in database
    const newReport = await prisma.report.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        crowdLevel,
        crowdCount: crowdCount ? parseInt(crowdCount) : null,
        imageUrl: imageUrl || null,
        userId
      },
      // Include user data in response (exclude password)
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Report created successfully:', newReport.id);

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: newReport
    });

  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error: error.message
    });
  }
};

/**
 * Get all reports with optional filtering, sorting, and pagination
 * GET /api/reports
 */
const getReports = async (req, res) => {
  try {
    console.log('Fetching reports with query params:', req.query);
    console.log('User ID from auth middleware:', req.user?.id);

    // Extract query parameters
    const {
      search,        // Search in title, description, location
      status,        // Filter by status
      crowdLevel,    // Filter by crowd level
      sortBy = 'createdAt',  // Sort field
      sortOrder = 'desc',    // Sort direction
      page = 1,      // Page number
      limit = 10     // Items per page
    } = req.query;

    // Build where clause for filtering
    const where = {};
    
    // 🚨 SECURITY FIX: Only show reports created by the authenticated user
    if (req.user?.id) {
      where.userId = req.user.id;
    } else {
      // If no authenticated user, return empty result
      return res.status(401).json({
        success: false,
        message: 'Authentication required to view reports'
      });
    }
    
    // Add search filter (case-insensitive)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add crowd level filter
    if (crowdLevel) {
      where.crowdLevel = crowdLevel;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build order by clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Fetch reports from database
    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.report.count({ where })
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / take);
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    console.log(`Found ${reports.length} reports (page ${page} of ${totalPages})`);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: take,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

/**
 * Update a report's status (Admin Only)
 * PUT /api/reports/:id
 * Note: Only admin users can update report status, regular users cannot edit their reports
 */
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`User ${req.user?.email} attempting to update report ${id} status to: ${status}`);

    // Check if user has admin permissions
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only administrators can update report status.',
        hint: 'Regular users can only view and delete their own reports'
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: Pending, In Progress, Resolved'
      });
    }

    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    console.log('Report status updated successfully');

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: updatedReport
    });

  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report',
      error: error.message
    });
  }
};

/**
 * Delete a report
 * DELETE /api/reports/:id
 */
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Deleting report with ID: ${id}`);

    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Delete report from database
    await prisma.report.delete({
      where: { id: parseInt(id) }
    });

    console.log('Report deleted successfully');

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};

/**
 * ADMIN FUNCTIONS
 * These functions are only accessible to users with admin role
 */

/**
 * Get all reports for admin management
 * GET /api/reports/admin/reports
 */
const getAllReportsForAdmin = async (req, res) => {
  try {
    console.log('Admin fetching all reports');
    
    // Extract query parameters for filtering and pagination
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build where clause for filtering
    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch reports with user information
    const reports = await prisma.report.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      },
      skip,
      take: parseInt(limit)
    });
    
    // Get total count for pagination
    const totalReports = await prisma.report.count({ where });
    
    res.json({
      success: true,
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReports / parseInt(limit)),
        totalReports,
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Admin get all reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

/**
 * Update report status (admin only)
 * PUT /api/reports/admin/reports/:id/status
 */
const updateReportStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Admin updating report ${id} status to: ${status}`);
    
    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: Pending, In Progress, Resolved'
      });
    }
    
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Update report status
    const updatedReport = await prisma.report.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Report status updated successfully',
      report: updatedReport
    });
    
  } catch (error) {
    console.error('Admin update report status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report status',
      error: error.message
    });
  }
};

/**
 * Delete any report (admin only)
 * DELETE /api/reports/admin/reports/:id
 */
const deleteReportAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Admin deleting report: ${id}`);
    
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    
    // Delete the report
    await prisma.report.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
    
  } catch (error) {
    console.error('Admin delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport,
  // Admin functions
  getAllReportsForAdmin,
  updateReportStatusAdmin,
  deleteReportAdmin
};