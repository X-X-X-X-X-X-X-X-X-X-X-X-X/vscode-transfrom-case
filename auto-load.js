const fs = require('fs');
const path = require('path');

// 目标目录
// src\translate-provider\providers
const targetDir = path.join(__dirname, 'src', 'translate-provider', "providers");
// 生成的入口文件路径
const entryFile = path.join(__dirname, 'src', 'auto-loaded-effects.ts');

function generateEntryFile() {
    const files = fs.readdirSync(targetDir)
        .filter(file => file.endsWith('.ts')); // 只处理 .js 文件

    const importStatements = files.map(file => {
        const relativePath = `./translate-provider/providers/${file}`;
        return `import '${relativePath}';`;
    }).join('\n');

    fs.writeFileSync(entryFile, importStatements, 'utf8');

    console.log(`✅ Generated an entry file: ${entryFile}`);
}

generateEntryFile();