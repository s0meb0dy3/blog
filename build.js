const fs = require('fs');
const path = require('path');

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
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
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
    <a href="index.html" class="back-home">← 返回首页</a>
    <article>
        <h1>${title}</h1>
        ${date ? `<time class="post-date">${date}</time>` : ''}
        ${content}
    </article>
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
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1 { margin-bottom: 2rem; }
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
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header>
        <h1>我的博客</h1>
    </header>
    <main>
        ${postsList}
    </main>
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