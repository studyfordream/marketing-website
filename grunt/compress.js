module.exports = {
  main: {
    options: {
      archive: 'temp/website-stable.tar.gz' // What you want to call your file
    },
    files: [
      {
        cwd: 'dist/',
        expand: true,
        src: ['**/**'], // What should be included in the zip
      },
    ]
  }
}