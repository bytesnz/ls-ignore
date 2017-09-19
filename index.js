const pkgDir = require('pkg-dir');
const ignore = require('ignore');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const checkForFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.access(filename, fs.constants.R_OK, (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(filename);
    });
  });
};

module.exports = (ignorePath, searchSubdirectories) => {
  let foundNpmignore = false;

  return new Promise((resolve, reject) => {
    if (typeof ignorePath !== 'string') {
      pkgDir().then(rootDir => {
        let promise;

        if (ignorePath) {
          // Check for the existence of a .npmignore file
          promise = checkForFile(path.join(rootDir, '.npmignore')).then((filename) => {
            foundNpmignore = true;
            return filename;
          }, (error) => {
            if (error.code === 'ENOENT') {
              return checkForFile(path.join(rootDir, '.gitignore'));
            }

            return Promise.reject(error);
          });
        } else {
          promise = checkForFile(path.join(rootDir, '.gitignore'));
        }

        return promise.then((filename) => {
          let contents = fs.readFileSync(filename).toString();
          if (ignorePath) {
            contents = '.*.swp\n'
                + '._*\n'
                + '.DS_Store\n'
                + '.git\n'
                + '.hg\n'
                + '.npmrc\n'
                + '.lock-wscript\n'
                + '.svn\n'
                + '.wafpickle-*\n'
                + 'config.gypi\n'
                + 'CVS\n'
                + 'npm-debug.log\n'
                + 'node_modules\n'
                + contents;
          }

          const lg = ignore().add(contents);

          if  (searchSubdirectories) {
            glob(path.join(rootDir, `*/**/${ignorePath ? '.{git,npm}ignore' : '.gitignore'}`), (error, matches) => {
              let promises = [];
              matches.forEach((file) => {
                //Check if the file is in a folder that is ignored
                const fileDir = path.relative(rootDir, path.dirname(file));
                if(!lg.ignores(fileDir)) {
                  subContents = fs.readFileSync(file).toString().split(/[\r\n]+/);
                  // Map ignore to folder
                  let relativeIgnores = [];
                  subContents.forEach((line) => {
                    if (!line) {
                      return;
                    }

                    relativeIgnores.push(path.join(fileDir, line));
                  });

                  lg.add(subContents.join('\n'));
                }
              });
              resolve(lg);
            });
          } else {
            resolve(lg);
          }
        });
      }).catch((error) => {
        reject(error);
      });
    } else {
      return checkForFile(ignorePath).then((filename) => {
        resolve(ignore().add(fs.readFileSync(filename).toString()));
      }).catch((error) => reject(error));
    }
  });
};
