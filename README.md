# Personal CMS

A modern, full-stack personal content management system built with JavaScript/TypeScript.

## Features

✨ **Rich Text Editor** - Create content with a powerful formatting toolbar  
📊 **Dashboard** - Overview of your content with statistics and recent posts  
🔍 **Search & Filter** - Find content quickly with search and category filters  
📁 **Category Management** - Organize content with colored categories  
📱 **Responsive Design** - Clean, mobile-friendly interface  
🚀 **Fast & Lightweight** - In-memory storage, perfect for personal use  

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Visit `http://localhost:3000`

## Development

To run in development mode with hot reload:

```bash
npm run dev
```

This starts:
- Server on port 3000 (API and static files)
- Client development server on port 5173 (with hot reload)

## Project Structure

```
personal-cms/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/       # Main pages
│   │   ├── lib/         # Utilities
│   │   └── index.css    # Global styles
│   └── index.html
├── server/           # Express backend
│   ├── index.ts     # Main server file
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Data storage
│   └── static.ts    # Static file serving
├── shared/          # Shared types and schemas
│   └── schema.ts
└── package.json
```

## Technology Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Express.js + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query
- **Validation:** Zod
- **Storage:** In-memory (with sample data)

## Usage

### Creating Content
1. Click "New Content" or use the sidebar button
2. Enter title, content, and select category
3. Use the rich text editor for formatting
4. Save as draft or publish immediately

### Managing Categories
- Categories are pre-loaded with sample data
- Each category has a color for easy identification
- Filter content by category from the content list

### Dashboard
- View content statistics
- See recent posts
- Quick access to create new content

## Customization

### Adding Sample Content
Edit `server/storage.ts` to modify the initial content and categories.

### Styling
- Main styles: `client/src/index.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Individual component files

### Data Model
Modify `shared/schema.ts` to change the data structure for content, categories, and media.

## Production Deployment

The application serves the built frontend from the `dist` directory and provides the API on the same port (3000).

For production deployment:
1. Build the frontend: `npm run build`
2. Start the server: `npm start`

## License

MIT License - feel free to use this for your personal projects!