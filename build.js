const fs = require('fs');
const path = require('path');

// Author and blog information
const authorInfo = {
  name: 'Yi\'s Blog',
  bio: '做热爱的事情~',
  avatar: 'assets/images/Gemini_Generated_Image_4uivll4uivll4uiv.png',
  links: [
    { name: 'GitHub', url: 'https://github.com/s0meb0dy3' },
  ]
};

function extractMetadata(markdownContent) {
    const metadata = {};
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdownContent.match(frontMatterRegex);

    if (match) {
        const frontMatter = match[1];
        const content = match[2];

        frontMatter.split('\n').forEach(line => {
            const [key, ...values] = line.split(':');
            if (key && values.length > 0) {
                metadata[key.trim()] = values.join(':').trim().replace(/^["']|["']$/g, '');
            }
        });

        return { metadata, content };
    }

    return { metadata: { title: 'Untitled' }, content: markdownContent };
}

function processAllPosts() {
    const postsDir = './posts';
    const outputDir = './dist';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const posts = [];
    const files = fs.readdirSync(postsDir);

    files.forEach(file => {
        if (file.endsWith('.md')) {
            const inputPath = path.join(postsDir, file);
            const outputPath = path.join(outputDir, file.replace('.md', '.html'));

            const markdownContent = fs.readFileSync(inputPath, 'utf8');
            const { metadata, content } = extractMetadata(markdownContent);
            const htmlContent = parseMarkdownContent(content);
            const htmlPage = generatePostHTML(metadata.title || file.replace('.md', ''), htmlContent, metadata.date);

            fs.writeFileSync(outputPath, htmlPage);
            posts.push({
                title: metadata.title || file.replace('.md', ''),
                date: metadata.date || new Date().toISOString().split('T')[0],
                url: file.replace('.md', '.html')
            });

            console.log(`Generated: ${outputPath}`);
        }
    });

    generateIndex(posts);
    copyAssets();
}

function generatePostHTML(title, content, date) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #fdfdfd;
            color: #333;
        }
        .post-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1, h2, h3 { margin-top: 2rem; margin-bottom: 1rem; }
        pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9em;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 1rem 0;
            padding-left: 1rem;
            color: #666;
        }
        .post-date {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 2rem;
        }
        .back-home {
            display: inline-block;
            margin-bottom: 2rem;
            color: #0066cc;
            text-decoration: none;
        }
        .back-home:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="post-container">
        <a href="index.html" class="back-home">← 返回首页</a>
        <article>
            <h1>${title}</h1>
            ${date ? `<time class="post-date">${date}</time>` : ''}
            ${content}
        </article>
    </div>
</body>
</html>`;
}

function parseMarkdownContent(content) {
    const MarkdownIt = require('markdown-it');
    const md = new MarkdownIt();
    return md.render(content);
}

function generateIndex(posts) {
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const postsList = posts.map(post => `
        <article class="post-item">
            <h3><a href="${encodeURIComponent(post.url)}">${post.title}</a></h3>
            <time class="post-date">${post.date}</time>
        </article>
    `).join('');

    const indexContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的博客</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #fdfdfd;
            color: #333;
        }
        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 2rem;
        }
        h1, h2, h3 { margin-top: 0; margin-bottom: 1rem; }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }

        /* Layout */
        .main-layout {
            display: flex;
            gap: 4rem;
        }
        .sidebar {
            flex: 0 0 240px;
        }
        .posts-list {
            flex: 1;
            min-width: 0; /* Prevents overflow in flex items */
        }

        /* Sidebar */
        .profile {
            text-align: left;
        }
        .profile .avatar-wrapper {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 1rem;
            display: inline-block;
        }
        .profile .avatar {
            width: 150px;  /* Make image larger than container */
            height: 150px; /* This will show more of the image */
            margin-left: 0px; /* Center the larger image */
            margin-top: 0px;
            object-fit: cover;
            object-position: 30% 60%;
        }
        .profile .author-name {
            font-size: 1.5rem;
            margin: 0;
        }
        .profile .author-bio {
            font-size: 1rem;
            color: #666;
            margin-bottom: 1.5rem;
        }
        .profile-links ul {
            list-style: none;
            padding: 0;
            margin: 0;
            text-align: left;
        }
        .profile-links li {
            margin-bottom: 0.5rem;
        }

        /* Posts List */
        .post-item {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #eee;
        }
        .post-item:last-child {
            border-bottom: none;
        }
        .post-item h3 {
            margin-bottom: 0.5rem;
        }
        .post-date {
            color: #666;
            font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 800px) {
            .main-layout {
                flex-direction: column;
                gap: 3rem;
            }
            .sidebar {
                flex: 0 0 auto;
                width: 100%;
                text-align: center;
            }
            .profile-links ul {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-layout">
            <aside class="sidebar">
                <div class="profile">
                    <div class="avatar-wrapper">
                        <img src="${authorInfo.avatar}" alt="Author Avatar" class="avatar">
                    </div>
                    <h2 class="author-name">${authorInfo.name}</h2>
                    <p class="author-bio">${authorInfo.bio}</p>
                    <div class="profile-links">
                        <ul>
                            ${authorInfo.links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </aside>
            <main class="posts-list">
                <header>
                    <h1>博客文章</h1>
                </header>
                ${postsList}
            </main>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync('./dist/index.html', indexContent);
    console.log('Generated: dist/index.html');
}

function copyAssets() {
    if (fs.existsSync('assets')) {
        const copyRecursive = (src, dest) => {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }

            const files = fs.readdirSync(src);
            files.forEach(file => {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);

                if (fs.statSync(srcPath).isDirectory()) {
                    copyRecursive(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            });
        };

        copyRecursive('assets', 'dist/assets');
        console.log('Copied assets to dist/');
    }
}

if (require.main === module) {
    console.log('Building blog...');
    processAllPosts();
    console.log('Blog built successfully!');
}

module.exports = { processAllPosts, extractMetadata };
