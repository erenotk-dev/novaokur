import fs from 'fs';
import path from 'path';

const pagesDir = path.join(process.cwd(), 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the entire nav-brand div
  // <div className="nav-brand">...</div>
  // The content inside might span multiple lines.
  
  const regex1 = /<div className="nav-brand">\s*<a href="\/".*?>\s*<BookOpen.*?<\/a>\s*<\/div>/gs;
  const regex2 = /<div className="nav-brand">\s*<a href="\/">.*?<\/a>\s*<\/div>/gs;
  const regex3 = /<div className="nav-brand">\s*<a href="\/">NovaOkur \(Yönetim Paneli\)<\/a>\s*<\/div>/gs;

  const newContent = `<div className="nav-brand">
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.svg" alt="NovaOkur Logo" className="brand-logo" />
          </a>
        </div>`;
        
  const newContentAdmin = `<div className="nav-brand">
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="NovaOkur Logo" className="brand-logo" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Yönetim Paneli</span>
          </a>
        </div>`;

  let updated = content;
  if (file === 'Admin.tsx') {
      updated = updated.replace(regex3, newContentAdmin);
      updated = updated.replace(regex2, newContentAdmin); // Fallback
  } else {
      updated = updated.replace(regex1, newContent);
      updated = updated.replace(regex2, newContent);
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${file}`);
  }
}
