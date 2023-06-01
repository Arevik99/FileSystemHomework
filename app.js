import process from 'process';
import { statSync } from 'fs';
import fs from 'fs';
import path from 'path';
import Table from 'cli-table';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.stdout.write(`Welcome ${process.env.USERNAME}! \n`);
process.stdin.on("data", (data) => {
    const operation = data.toString().trim().split(' ');
    switch (operation[0]) {
        case '.exit': process.stdout.write(`Thank you  ${process.env.USERNAME},goodbye!`);
            process.exit();
        case 'ls': getCurrentDirContent();
            break;
        case 'add': {
            fs.writeFile(`${__dirname}/${operation[1]}`, '', () => {
            });
        }
            break;
        case 'rn': {
            if (!fs.existsSync(operation[1])) {
                console.log("file is not founded.")
                process.exit()
            }
            fs.rename(operation[1], `${operation[1]}/${operation[2]}`, () => {
            })
            process.exit()
        }
        case 'cp': {
            if (!fs.existsSync(operation[1])) {
                console.log("file is not founded.")
                process.exit()
            }
            fs.copyFile(operation[1], operation[2], () => {
            })
        }
            break;
        case 'mv': {
            if (!fs.existsSync(operation[1])) {
                console.log("file is not founded.")
                process.exit()
            }
            fs.rename(operation[1], `${operation[2]}`, () => {
            })
            process.exit()
        }
        case 'rm': {
            if (!fs.existsSync(operation[1])) {
                console.log("file is not founded.")
                process.exit()
            }
            fs.unlink(operation[1], () => { })
        }
            break;
        default:
            process.stderr.write('Invalid input');
    }
});
function getCurrentDirContent() {
    const table = new Table({
        head: ['(index)', 'Name', 'Type'], colWidths: [10, 10, 10]
    });
    fs.readdir(__dirname, function (err, files) {
        if (err) {
            console.log('Unable to scan directory: ' + err);
        }
        files.sort().forEach(function (file) {
            const filePath = __dirname + '/' + file.toString();
            if (!statSync(filePath).isFile()) {
                files.splice(files.findIndex(element => element === file), 1)
                files.unshift(file);
            }
        });
        files.forEach((file, index) => {
            table.push([index, file, path.extname(file) ? 'file' : 'directory']);
        });
        setTimeout(() => {
            process.stdout.write(table.toString())
        }, 10000);
    });
}
function fileWalker(dir, high) {
    let list = fs.readdirSync(dir);
    let obj;
    if (!list.length) return {
        high: high,
        dirName: dir.toString()
    };
    let filesCount = 0;
    list.forEach(function (file) {
        const filePath = dir + '/' + file.toString();
        if (!statSync(filePath).isDirectory()) {
            filesCount++;
        }
        else {
            if (!obj) {
                obj = fileWalker(filePath, high + 1);
            }
            if (obj && fileWalker(filePath, high + 1).high > obj.high) {
                obj = fileWalker(filePath, high + 1);
            }
        }
    });
    if (filesCount === list.length) {
        return {
            high: high + 1,
            dirName: dir.toString()
        }
    }
    else {
        return obj;
    }
}
console.log(fileWalker('node_modules', 0));