const gulp = require('gulp');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const chalk = require('chalk');
const archiver = require('archiver');
const stringify = require('json-stringify-pretty-compact');
const typescript = require('typescript');

const ts = require('gulp-typescript');
const less = require('gulp-less');
const sass = require('gulp-sass');
const git = require('gulp-git');
const eslint = require('gulp-eslint');
const replace = require('gulp-replace');
const del = require('del');

const rename = require("gulp-rename");
const gulpConcat = require('gulp-concat');
const gulpJsonminify = require('gulp-jsonminify');
const through = require('through2');
const Datastore = require('@seald-io/nedb');

const gulpPackContent = () => {
  return through.obj((vinylFile, _, callback) => {
    console.log('[1] vinylFile = ' + JSON.stringify(vinylFile));
    const transformedFile = vinylFile.clone();
    const fileName = transformedFile.path.substring(
      transformedFile.path.lastIndexOf('/'),
      transformedFile.path.lastIndexOf('.'),
    );
    console.log('[1] fileName = ' + fileName);
    //let jsonFilePath = `${transformedFile.base}/${fileName}.json`;
    let jsonFilePath = `${fileName}.json`;
    console.log('[2] jsonFilePath = ' + jsonFilePath);
    const javascriptContent = new String(transformedFile.contents);
    console.log('[2] javascriptContent = ' + javascriptContent);

    if (!fs.existsSync(jsonFilePath)) {
      jsonFilePath = `${transformedFile.base}/generic_macro.json`;
    }

    console.log('[3] Read jsonFilePath = ' + jsonFilePath);
    const file = fs.readFileSync(jsonFilePath);
    const jsonContent = JSON.parse(file);
    console.log('[4] Read jsonContent = ' + JSON.stringify(jsonContent));
    jsonContent.command = javascriptContent;
    console.log('[5] Read jsonContent = ' + JSON.stringify(jsonContent));
    transformedFile.contents = Buffer.from(JSON.stringify(jsonContent));
    console.log('[6] transformedFile.contents = ' + transformedFile.contents);
    // vinylFile.history = jsonFilePath;

    // console.log('[4] transformedFile = ' + transformedFile);
    callback(null, transformedFile);
  });
};
exports.gulpPackContent = gulpPackContent;


const importDocumentsToDb = async function(){
  const compendiums = ['5e'];
  for(const comp of compendiums){

    const db = new Datastore({ filename: `./dist/packs/macros-${comp}.db` })

    db.loadDatabase(function (error) {
      if (error) {
        console.log('FATAL: local database could not be loaded. Caused by: ' + error);
        throw error;
      }
      console.log('INFO: local database loaded successfully.');

      console.log(`./dist/packs/${comp}/*.js`);
      glob(`./dist/packs/${comp}/*.js`, function(err, files) { // read the folder or folders if you want: example json/**/*.json
        console.log('Files : ' + files.length);
        if(err) {
          console.error("cannot read the folder, something goes wrong with glob", err);
        }
        files.forEach(function(file) {
          fs.readFile(file, 'utf8', function (err, data) { // Read each file
            if(err) {
              console.log("cannot read the file, something goes wrong with the file", err);
            }
            console.log('File : ' + file);
            var doc = JSON.parse(data);
            db.insert(doc, function (err, newDoc) {   // Callback is optional
              // newDoc is the newly inserted document, including its _id
              // newDoc has no key called notToBeSaved since its value was undefined
              if (error) {
                console.log('ERROR: saving document: ' + JSON.stringify(doc) + '. Caused by: ' + error);
                throw error;
              }
              //console.log('INFO: successfully saved document: ' + JSON.stringify(newDoc));

            });
          });
        });
      });
    });
  }
}
exports.importDocumentsToDb = importDocumentsToDb;

const deleteDocuments = async function(){
  const compendiums = ['5e'];
  for(const comp of compendiums){
    console.log('Delete folder : ' + `./dist/packs/${comp}`);
    del(`./dist/packs/${comp}`, {force:true});
  }
}
exports.deleteDocuments = deleteDocuments;

/**
 * Gulp foundryCompilePack task
 *  - Generate .db foundry files
 * @param {function} done Done callback function
 * @returns
 */
async function foundryCompilePack(done) {
  const compendiums = ['5e'];
  for(const comp of compendiums){
    // glob(`${config.src}/packs/*[!\.md]`, (err, packs) => {
    glob(`./${comp}/*.js`, (err, packs) => {
      for (const pack of packs) {
        console.log(pack);
        gulp.src(`${pack}`)
          .pipe(gulpPackContent())
          // .pipe(rename(function (path) {
          //   path.extname = ".json";
          // }))
          .pipe(gulpJsonminify())
          .pipe(gulpConcat(pack.substring(pack.lastIndexOf('/'))))
          .pipe(gulp.dest(`./dist/packs/${comp}`));
      }
      done();
    });
  }
}
exports.foundryCompilePack = foundryCompilePack;

function getConfig() {
  const configPath = path.resolve(process.cwd(), 'foundryconfig.json');
  let config;

  if (fs.existsSync(configPath)) {
    config = fs.readJSONSync(configPath);
    return config;
  } else {
    return;
  }
}

function getManifest() {
  const json = {};

  if (fs.existsSync('src')) {
    json.root = 'src';
  } else {
    json.root = 'dist';
  }

  const modulePath = path.join(json.root, 'module.json');
  const systemPath = path.join(json.root, 'system.json');

  if (fs.existsSync(modulePath)) {
    json.file = fs.readJSONSync(modulePath);
    json.name = 'module.json';
  } else if (fs.existsSync(systemPath)) {
    json.file = fs.readJSONSync(systemPath);
    json.name = 'system.json';
  } else {
    return;
  }

  return json;
}

/**
 * TypeScript transformers
 * @returns {typescript.TransformerFactory<typescript.SourceFile>}
 */
function createTransformer() {
  /**
   * @param {typescript.Node} node
   */
  function shouldMutateModuleSpecifier(node) {
    if (!typescript.isImportDeclaration(node) && !typescript.isExportDeclaration(node)) return false;
    if (node.moduleSpecifier === undefined) return false;
    if (!typescript.isStringLiteral(node.moduleSpecifier)) return false;
    if (!node.moduleSpecifier.text.startsWith('./') && !node.moduleSpecifier.text.startsWith('../')) return false;
    if (path.extname(node.moduleSpecifier.text) !== '') return false;
    return true;
  }

  /**
   * Transforms import/export declarations to append `.js` extension
   * @param {typescript.TransformationContext} context
   */
  function importTransformer(context) {
    return (node) => {
      /**
       * @param {typescript.Node} node
       */
      function visitor(node) {
        if (shouldMutateModuleSpecifier(node)) {
          if (typescript.isImportDeclaration(node)) {
            const newModuleSpecifier = typescript.createLiteral(`${node.moduleSpecifier.text}.js`);
            return typescript.updateImportDeclaration(
              node,
              node.decorators,
              node.modifiers,
              node.importClause,
              newModuleSpecifier,
            );
          } else if (typescript.isExportDeclaration(node)) {
            const newModuleSpecifier = typescript.createLiteral(`${node.moduleSpecifier.text}.js`);
            return typescript.updateExportDeclaration(
              node,
              node.decorators,
              node.modifiers,
              node.exportClause,
              newModuleSpecifier,
            );
          }
        }
        return typescript.visitEachChild(node, visitor, context);
      }

      return typescript.visitNode(node, visitor);
    };
  }

  return importTransformer;
}

const tsConfig = ts.createProject('tsconfig.json', {
  getCustomTransformers: (_program) => ({
    after: [createTransformer()],
  }),
});

/********************/
/*		BUILD		*/
/********************/

/**
 * Build TypeScript
 */
 function buildTS() {
  return (
    gulp
      .src(['./**/*.ts','!./node_modules/**','!gulpfile.js'])
      .pipe(tsConfig())

      // // eslint() attaches the lint output to the "eslint" property
      // // of the file object so it can be used by other modules.
      // .pipe(eslint())
      // // eslint.format() outputs the lint results to the console.
      // // Alternatively use eslint.formatEach() (see Docs).
      // .pipe(eslint.format())
      // // To have the process exit with an error code (1) on
      // // lint error, return the stream and pipe to failAfterError last.
      // .pipe(eslint.failAfterError())

      .pipe(gulp.dest('dist'))
  );
}

/**
 * Build JavaScript
 */
function buildJS() {
  return (
    gulp
      .src(['./**/*.js','!./node_modules/**','!gulpfile.js'])

      // // eslint() attaches the lint output to the "eslint" property
      // // of the file object so it can be used by other modules.
      // .pipe(eslint())
      // // eslint.format() outputs the lint results to the console.
      // // Alternatively use eslint.formatEach() (see Docs).
      // .pipe(eslint.format())
      // // To have the process exit with an error code (1) on
      // // lint error, return the stream and pipe to failAfterError last.
      // .pipe(eslint.failAfterError())

      .pipe(gulp.dest('dist'))
  );
}

/**
 * Build Module JavaScript
 */
function buildMJS() {
  return (
    gulp
      .src(['./**/*.mjs','!./node_modules/**','!gulpfile.js'])

      // // eslint() attaches the lint output to the "eslint" property
      // // of the file object so it can be used by other modules.
      // .pipe(eslint())
      // // eslint.format() outputs the lint results to the console.
      // // Alternatively use eslint.formatEach() (see Docs).
      // .pipe(eslint.format())
      // // To have the process exit with an error code (1) on
      // // lint error, return the stream and pipe to failAfterError last.
      // .pipe(eslint.failAfterError())

      .pipe(gulp.dest('dist'))
  );
}

/**
 * Build Css
 */
function buildCSS() {
  return gulp.src(['./**/*.css','!./node_modules/**','!gulpfile.js']).pipe(gulp.dest('dist'));
}

/**
 * Build Less
 */
function buildLess() {
  return gulp.src(['./**/*.less','!./node_modules/**','!gulpfile.js']).pipe(less()).pipe(gulp.dest('dist'));
}

/**
 * Build SASS
 */
function buildSASS() {
  return gulp.src(['./**/*.scss','!./node_modules/**','!gulpfile.js']).pipe(sass().on('error', sass.logError)).pipe(gulp.dest('dist'));
}

/**
 * Build Replace
 */
function buildReplace() {
  return gulp.src('dist/**/*.js')
    .pipe(replace('export const game = getGame();', ''))
    .pipe(replace('export const canvas = getCanvas();', ''))
    .pipe(replace('import { canvas, game }', '//import { canvas, game }'))
    .pipe(replace('import { game }', '//import { game }'))
    .pipe(replace('import { canvas }', '//import { canvas }'))
    .pipe(gulp.dest('dist'));
};

/**
 * Copy static files
 */
 async function copyFiles() {
  const statics = ['lang', 'fonts', 'assets', 'icons', 'templates', 'packs', 'module.json', 'system.json', 'template.json'];
  try {
    for (const file of statics) {
      if (fs.existsSync(path.join('.', file))) {
        await fs.copy(path.join('.', file), path.join('dist', file));
      }
    }
    return Promise.resolve();
  } catch (err) {
    Promise.reject(err);
  }
}

/**
 * Watch for changes for each build step
 */
function buildWatch() {
  gulp.watch('./**/*.ts', { ignoreInitial: false }, buildTS);
  gulp.watch('./**/*.less', { ignoreInitial: false }, buildLess);
  gulp.watch('./**/*.scss', { ignoreInitial: false }, buildSASS);
  gulp.watch('./**/*.js', { ignoreInitial: false }, buildJS);
  gulp.watch('./**/*.mjs', { ignoreInitial: false }, buildMJS);
  gulp.watch('./**/*.css', { ignoreInitial: false }, buildCSS);
  gulp.watch(['./fonts', './lang', './templates', './*.json'], { ignoreInitial: false }, copyFiles);
}

/********************/
/*		CLEAN		*/
/********************/

gulp.task('clean', function(){
  clean();
});

/**
 * Remove built files from `dist` folder
 * while ignoring source files
 */
async function clean() {
  const name = path.basename(path.resolve('.'));
  const files = [];

  // If the project uses TypeScript
  if (fs.existsSync(path.join('.', `${name}.ts`))) {
    files.push(
      'languages',
      'lang',
      'templates',
      'packs',
      'assets',
      'icons',
      'module',
      'modules',
      `${name}.js`,
      'module.json',
      'system.json',
      'template.json',
    );
  }

  // If the project uses Less or SASS
  if (fs.existsSync(path.join('.', `${name}.less`)) || fs.existsSync(path.join('.', `${name}.scss`))) {
    files.push('fonts', `${name}.css`);
  }

  console.log(' ', chalk.yellow('Files to clean:'));
  console.log('   ', chalk.blueBright(files.join('\n    ')));

  // Attempt to remove the files
  try {
    for (const filePath of files) {
      await fs.remove(path.join('dist', filePath));
    }
    del('./dist/**', {force:true});
    return Promise.resolve();
  } catch (err) {
    Promise.reject(err);
  }
}

/********************/
/*		LINK		*/
/********************/

/**
 * Link build to User Data folder
 */
async function linkUserData() {
  const name = path.basename(path.resolve('.'));
  const config = fs.readJSONSync('foundryconfig.json');

  let destDir;
  try {
    if (
      fs.existsSync(path.resolve('.', 'dist', 'module.json')) ||
      fs.existsSync(path.resolve('.', '.', 'module.json'))
    ) {
      destDir = 'modules';
    } else if (
      fs.existsSync(path.resolve('.', 'dist', 'system.json')) ||
      fs.existsSync(path.resolve('.', '.', 'system.json'))
    ) {
      destDir = 'systems';
    } else {
      throw Error(`Could not find ${chalk.blueBright('module.json')} or ${chalk.blueBright('system.json')}`);
    }

    let linkDir;
    if (config.dataPath) {
      if (!fs.existsSync(path.join(config.dataPath, 'Data')))
        throw Error('User Data path invalid, no Data directory found');

      linkDir = path.join(config.dataPath, 'Data', destDir, name);
    } else {
      throw Error('No User Data path defined in foundryconfig.json');
    }

    if (argv.clean || argv.c) {
      console.log(chalk.yellow(`Removing build in ${chalk.blueBright(linkDir)}`));

      await fs.remove(linkDir);
    } else if (!fs.existsSync(linkDir)) {
      console.log(chalk.green(`Copying build to ${chalk.blueBright(linkDir)}`));
      await fs.symlink(path.resolve('./dist'), linkDir);
    }
    return Promise.resolve();
  } catch (err) {
    Promise.reject(err);
  }
}

/*********************/
/*		PACKAGE		 */
/*********************/

/**
 * Package build
 */
async function packageBuild() {
  const manifest = getManifest();

  return new Promise((resolve, reject) => {
    try {
      // Remove the package dir without doing anything else
      if (argv.clean || argv.c) {
        console.log(chalk.yellow('Removing all packaged files'));
        fs.removeSync('package');
        return;
      }

      // Ensure there is a directory to hold all the packaged versions
      fs.ensureDirSync('package');

      // Initialize the zip file
      const zipName = 'module.zip'; // `${manifest.file.name}-v${manifest.file.version}.zip`
      const zipFile = fs.createWriteStream(path.join('package', zipName));
      const zip = archiver('zip', { zlib: { level: 9 } });

      zipFile.on('close', () => {
        console.log(chalk.green(zip.pointer() + ' total bytes'));
        console.log(chalk.green(`Zip file ${zipName} has been written`));
        return resolve();
      });

      zip.on('error', (err) => {
        throw err;
      });

      zip.pipe(zipFile);

      // Add the directory with the final code
      zip.directory('dist/', manifest.file.name);

      zip.finalize();
    } catch (err) {
      return reject(err);
    }
  });
}

/*********************/
/*		PACKAGE		 */
/*********************/

/**
 * Update version and URLs in the manifest JSON
 */
function updateManifest(cb) {
  const packageJson = fs.readJSONSync('package.json');
  const config = getConfig(),
    manifest = getManifest(),
    rawURL = config.rawURL,
    repoURL = config.repository,
    manifestRoot = manifest.root;

  if (!config) cb(Error(chalk.red('foundryconfig.json not found')));
  if (!manifest) cb(Error(chalk.red('Manifest JSON not found')));
  if (!rawURL || !repoURL) cb(Error(chalk.red('Repository URLs not configured in foundryconfig.json')));

  try {
    const version = argv.update || argv.u;

    /* Update version */

    const versionMatch = /^(\d{1,}).(\d{1,}).(\d{1,})$/;
    const currentVersion = manifest.file.version;
    let targetVersion = '';

    if (!version) {
      cb(Error('Missing version number'));
    }

    if (versionMatch.test(version)) {
      targetVersion = version;
    } else {
      targetVersion = currentVersion.replace(versionMatch, (substring, major, minor, patch) => {
        console.log(substring, Number(major) + 1, Number(minor) + 1, Number(patch) + 1);
        if (version === 'major') {
          return `${Number(major) + 1}.0.0`;
        } else if (version === 'minor') {
          return `${major}.${Number(minor) + 1}.0`;
        } else if (version === 'patch') {
          return `${major}.${minor}.${Number(patch) + 1}`;
        } else {
          return '';
        }
      });
    }

    if (targetVersion === '') {
      return cb(Error(chalk.red('Error: Incorrect version arguments.')));
    }

    if (targetVersion === currentVersion) {
      return cb(Error(chalk.red('Error: Target version is identical to current version.')));
    }
    console.log(`Updating version number to '${targetVersion}'`);

    packageJson.version = targetVersion;
    manifest.file.version = targetVersion;

    /* Update URLs */

    const result = `${rawURL}/v${manifest.file.version}/package/${manifest.file.name}-v${manifest.file.version}.zip`;

    manifest.file.url = repoURL;
    manifest.file.manifest = `${rawURL}/master/${manifestRoot}/${manifest.name}`;
    manifest.file.download = result;

    const prettyProjectJson = stringify(manifest.file, {
      maxLength: 35,
      indent: '\t',
    });

    fs.writeJSONSync('package.json', packageJson, { spaces: '\t' });
    fs.writeFileSync(path.join(manifest.root, manifest.name), prettyProjectJson, 'utf8');

    return cb();
  } catch (err) {
    cb(err);
  }
}

function gitAdd() {
  return gulp.src('package').pipe(git.add({ args: '--no-all' }));
}

function gitCommit() {
  return gulp.src('./*').pipe(
    git.commit(`v${getManifest().file.version}`, {
      args: '-a',
      disableAppendPaths: true,
    }),
  );
}

function gitTag() {
  const manifest = getManifest();
  return git.tag(`v${manifest.file.version}`, `Updated to ${manifest.file.version}`, (err) => {
    if (err) throw err;
  });
}

const execGit = gulp.series(gitAdd, gitCommit, gitTag);

const execBuild = gulp.parallel(buildTS, buildJS, buildMJS, buildCSS, buildSASS, copyFiles);

//exports.build = gulp.series(clean, execBuild, foundryCompilePack, importDocumentsToDb);
exports.build = gulp.series(clean, foundryCompilePack, importDocumentsToDb);
exports.watch = buildWatch;
exports.clean = clean;
exports.postClean = deleteDocuments;
exports.link = linkUserData;
exports.package = packageBuild;
exports.update = updateManifest;
exports.publish = gulp.series(clean, updateManifest, execBuild, packageBuild, execGit);
