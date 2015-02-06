module.exports = {
  main: {
    options: {
      archive: 'temp/website-stable.zip' // What you want to call your file
    },
    files: [
      {
        src: ['dist/**'], // What should be included in the zip
        dest: './'        // Where the zipfile should go
      },
    ]
  }
}