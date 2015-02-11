module.exports = {
  target: {
    options: {
      questions: [
        {
          config: 'github-release.options.auth.user', // set the user to whatever is typed for this question
          type: 'input',
          message: 'GitHub username:'
        },
        {
          config: 'github-release.options.auth.password', // set the password to whatever is typed for this question
          type: 'password',
          message: 'GitHub password (or API/auth key password):'
        }
      ]
    }
  }
};