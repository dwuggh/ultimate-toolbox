import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { directoryPath } = await request.json();
    const videosDir = path.join(process.cwd(), 'public', directoryPath || 'videos');
    
    const files = await fs.readdir(videosDir);
    const videoFiles = files.filter(file => 
      ['.mp4', '.webm', '.mov'].includes(path.extname(file).toLowerCase())
    );
    
    const videos = videoFiles.map(file => ({
      name: path.parse(file).name,
      url: `/videos/${file}`
    }));
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return NextResponse.json(
      { error: 'Unable to scan videos directory' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Define the videos directory path
    const videosDir = path.join(process.cwd(), 'public', 'videos');
    
    // Read the directory contents
    const files = await fs.readdir(videosDir);
    
    // Filter for video files (you can add more extensions as needed)
    const videoFiles = files.filter(file => 
      ['.mp4', '.webm', '.mov'].includes(path.extname(file).toLowerCase())
    );
    
    // Create the response data
    const videos = videoFiles.map(file => ({
      name: path.parse(file).name,
      url: `/videos/${file}`
    }));
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return NextResponse.json(
      { error: 'Unable to scan videos directory' },
      { status: 500 }
    );
  }
}
