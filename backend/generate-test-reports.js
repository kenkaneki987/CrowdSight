/**
 * Generate Test Reports Script
 * Creates multiple test reports to demonstrate pagination
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateTestReports() {
  try {
    console.log('🚀 Generating test reports for pagination demo...');
    
    // Sample locations
    const locations = [
      'Times Square, NYC',
      'Central Park, NYC', 
      'Brooklyn Bridge, NYC',
      'Union Square, NYC',
      'Madison Square Garden',
      'Grand Central Station',
      'Wall Street',
      'High Line Park',
      'Coney Island',
      'Yankee Stadium',
      'Empire State Building',
      'One World Trade Center',
      'Statue of Liberty',
      'Ellis Island',
      'Chinatown, NYC'
    ];
    
    // Sample titles and descriptions
    const reportTemplates = [
      {
        title: 'Heavy crowd gathering',
        description: 'Large number of people gathering in the area, causing congestion and safety concerns.'
      },
      {
        title: 'Festival crowd overflow',
        description: 'Street festival attracting more visitors than expected, sidewalks becoming overcrowded.'
      },
      {
        title: 'Rush hour congestion',
        description: 'Peak hour foot traffic creating bottlenecks at main entrances and exits.'
      },
      {
        title: 'Concert venue crowd',
        description: 'Concert-goers gathering before event, blocking pedestrian pathways.'
      },
      {
        title: 'Protest gathering',
        description: 'Peaceful demonstration drawing large crowds, affecting normal foot traffic.'
      },
      {
        title: 'Tourist attraction busy',
        description: 'Popular tourist spot experiencing unusually high visitor volume.'
      },
      {
        title: 'Emergency evacuation',
        description: 'Building evacuation causing temporary crowd buildup on sidewalk.'
      },
      {
        title: 'Sports event crowd',
        description: 'Fans gathering before major sporting event, creating crowd density issues.'
      },
      {
        title: 'Market day congestion',
        description: 'Weekend farmers market attracting large crowds, causing pedestrian delays.'
      },
      {
        title: 'Transportation delay',
        description: 'Subway service disruption causing crowd buildup at station entrances.'
      }
    ];
    
    const crowdLevels = ['Low', 'Medium', 'High'];
    const statuses = ['Pending', 'In Progress', 'Resolved'];
    
    // Get first user from database (or create a test user)
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // Create a test user if none exists
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('testpassword', 10);
      
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@crowdsight.com',
          password: hashedPassword
        }
      });
      
      console.log('✅ Created test user:', user.email);
    }
    
    // Generate 25 test reports to demonstrate pagination
    const reportsToCreate = [];
    
    for (let i = 1; i <= 25; i++) {
      const template = reportTemplates[Math.floor(Math.random() * reportTemplates.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const crowdLevel = crowdLevels[Math.floor(Math.random() * crowdLevels.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const crowdCount = Math.floor(Math.random() * 500) + 50; // 50-550 people
      
      // Create date within last 30 days
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
      
      reportsToCreate.push({
        title: `${template.title} #${i}`,
        description: template.description,
        location: location,
        crowdLevel: crowdLevel,
        crowdCount: crowdCount,
        status: status,
        userId: user.id,
        createdAt: createdAt
      });
    }
    
    // Insert all reports at once
    const createdReports = await prisma.report.createMany({
      data: reportsToCreate
    });
    
    console.log(`✅ Successfully created ${createdReports.count} test reports!`);
    console.log('\n📊 Pagination should now be visible:');
    console.log('👤 User Dashboard: Shows pagination (10 per page)');
    console.log('🛡️ Admin Portal: Shows pagination (20 per page)');
    console.log('\n🌐 Visit your app at:');
    console.log('- User Dashboard: http://localhost:3001/dashboard');
    console.log('- Admin Portal: http://localhost:3001/admin');
    
    // Show distribution
    const totalReports = await prisma.report.count();
    const statusDistribution = await prisma.report.groupBy({
      by: ['status'],
      _count: true
    });
    
    console.log(`\n📈 Total Reports: ${totalReports}`);
    console.log('📊 Status Distribution:');
    statusDistribution.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count} reports`);
    });
    
  } catch (error) {
    console.error('❌ Error generating test reports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateTestReports();