# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal static blog generator built with Node.js. It converts Markdown files with Front Matter into a static HTML website with Chinese language support.

## Development Commands

- `npm install` - Install dependencies (only dependency is markdown-it)
- `npm run build` - Build the blog, generates HTML files from Markdown posts
- `npm run serve` - Start development server on port 8000
- `npm test` - No tests implemented (placeholder only)

## Architecture

### Core Components

1. **build.js** - Main build script that:
   - Parses Markdown files from `posts/` directory
   - Extracts Front Matter metadata (title, date)
   - Generates individual HTML pages for each post
   - Creates an index page listing all posts
   - Copies assets from `assets/` to `dist/`

2. **server.js** - Simple HTTP server for local development:
   - Serves static files from `dist/` directory
   - Handles proper MIME types
   - Runs on port 8000 with WSL-friendly network access

3. **posts/** - Source Markdown files with Front Matter:
   - Files use `.md` extension
   - Support Chinese filenames and content
   - Front Matter format: `---\ntitle: Title\ndate: YYYY-MM-DD\n---\n`

4. **dist/** - Generated static HTML output
5. **templates/** - Template directory (currently unused)

### Build Process

1. Scans `posts/` directory for `.md` files
2. Extracts metadata using Front Matter parsing
3. Converts Markdown to HTML using markdown-it
4. Generates individual post pages with embedded CSS
5. Creates index page with sorted post list
6. Copies any assets from `assets/` directory

### Deployment

The project includes GitHub Actions for automatic deployment to GitHub Pages:
- Triggered on pushes to main branch
- Builds using Node.js 18
- Deploys `dist/` directory to gh-pages branch
- Uses peaceiris/actions-gh-pages for deployment

## Key Features

- Zero configuration static site generation
- Chinese language support (filenames and content)
- Responsive design with mobile-first CSS
- Front Matter metadata extraction
- Automatic index page generation
- Asset copying support
- GitHub Pages deployment automation

## File Structure

```
├── posts/           # Markdown source files
├── dist/           # Generated HTML output
├── assets/         # Static assets (copied to dist)
├── build.js        # Main build script
├── server.js       # Development server
└── .github/workflows/deploy.yml  # GitHub Actions deployment
```

## Development Workflow

1. Create new Markdown post in `posts/` with Front Matter
2. Run `npm run build` to generate HTML
3. Run `npm run serve` for local preview
4. Commit changes to trigger automatic deployment