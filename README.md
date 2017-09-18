# ls-ignore
(Node.js) Command line utility for checking what files are ignored by
a project's `.gitignore` and `.npmignore` files. It uses the
[ignore](https://www.npmjs.com/package/ignore) package for its filtering
capabilities.


# Command Line Interface
```bash
ls-ignored

List files that are ignored or not ignored by .gitignore-like files. By default
only files not ignored by the ignore file will be printed

usage: ls-ignored [-n, --npmignore] [-r, --recursive [<level>]] [-f, --file <file>]
            [-t, --top-level] [-i, --ignored] [-v, --verbose] [files...]

    [files...]                 Files to check if will be ignored or not


    -n, --npmingore            Match files as npm would (using the .npmignore file
                               or the .gitignore file if a .npmignore file doesn't
                               exist)
    -r, --recursive [<level>]  Include the files/folders inside the given
                               files/folders. If <level> given, only recurse
                               up to <level> directories deep (0 is unlimited).
    -t, --top-level            Only look in the top level directory for the
                               .gitignore and .npmignore files
    -i, --ignored              Only print those files ignored
    -v, --verbose              Print all files, marking included files with a +
                               and ignored files with a -
    -f, --file <file>          Use <file> as the ignore file instead of .gitignore

    -h, --help                 Show this help
```

# Javascript Module
The Javascript module is a simple wrapper around the
[ignore](https://www.npmjs.com/package/ignore) package to load a projects
`.gitignore` or `.npmignore` files by default

```javascript
const lsIgnore = require('ls-ignore');

// To use the projects .gitignore file
const ignore = lsIgnore();

// To use the projects .npmignore file (or .gitignore if the .npmignore file
// doesn't exist)
const nignore = lsIgnore(true);

// To use a custom ignore file
const fignore = lsignore('somefile');

// To check if a file will be ignored
ignore.ignores('another.file');

// To filter out the files that will be ignored from a list of files
ignore.filter(['another.file', 'more.files', 'second.file']);
```
