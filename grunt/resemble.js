module.exports = {
  options: {
    screenshotRoot: 'screens',
    url: 'http://0.0.0.0:9000/dist',
    selector: '#outer-wrapper',
    gm: true
  },
  desktop: {
    options: {
      width: 1024,
      tolerance: 0.001
    },
    files: [
      {
      cwd: 'dist/',
      expand: true,
      src: [
        'free-trial/**/*.html',
        'mobile/**/*.html',
        'android/**/*.html',
        'pricing/**/*.html'
      ],
      dest: 'desktop'
      }
    ]
  },
  tablet: {
    options: {
      width: 800,
      tolerance: 0.001
    },
    files: [
      {
      cwd: 'dist/',
      expand: true,
      src: [
        'free-trial/**/*.html',
        'mobile/**/*.html',
        'android/**/*.html',
        'pricing/**/*.html'
      ],
      dest: 'tablet'
      }
    ]
  },
  mobile: {
    options: {
      width: 450,
      tolerance: 0.001
    },
    files: [
      {
      cwd: 'dist/',
      expand: true,
      src: [
        'free-trial/**/*.html',
        'mobile/**/*.html',
        'android/**/*.html',
        'pricing/**/*.html'
      ],
      dest: 'mobile'
      }
    ]
  }
};
