const glob = require('glob');
const { exec } = require('child_process');

const runTests = () => {
    const testFiles = glob.sync('./tests/**/*.test.js');
    if (!testFiles.length) {
        console.log('No test files found');
        return;
    }

    const jestCommand = `npx jest ${testFiles.join(' ')}`;

    const jestProcess = exec(jestCommand, (error, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if (error) {
            console.error(`Error running tests: ${error}`);
        }
    });

    jestProcess.on('exit', (code) => {
        console.log(`Tests completed with code ${code}`);
    });
};

runTests();
