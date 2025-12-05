
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes('image');
      }
    });

    const [fields, files] = await form.parse(req);
    console.log('Parsed files:', files);
    
    if (!files.image || !files.image[0]) {
      console.log('No image file found in upload');
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = files.image[0];
    console.log('Processing file:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      filepath: file.filepath
    });

    // Read the file and convert to base64
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64Data = fileBuffer.toString('base64');
    const mimeType = file.mimetype;
    
    // Create data URL format for storing in database
    const imageDataUrl = `data:${mimeType};base64,${base64Data}`;
    
    console.log('Converted to base64, size:', base64Data.length);
    
    // Clean up the temporary file
    fs.unlinkSync(file.filepath);
    
    res.json({ 
      success: true, 
      imageUrl: imageDataUrl,
      message: 'Image converted to base64 successfully',
      size: base64Data.length
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
}