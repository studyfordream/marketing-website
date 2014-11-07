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
        'customers/**/*.html',
        'enterprises/**/*.html',
        'events/**/*.html','faq/**/*.html',
        'partners/technology/{,bizible/}*.html',
        'mobile/**/*.html',
        'partners/solutions/{,blue-acorn/}*.html',
        'press/**/*.html',
        'resources/{live-demo-webinar,sample-size-calculator}/*.html',
        'terms/**/*.html'
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
        'customers/**/*.html',
        'enterprises/**/*.html',
        'events/**/*.html','faq/**/*.html',
        'partners/technology/{,bizible/}*.html',
        'mobile/**/*.html',
        'partners/solutions/{,blue-acorn/}*.html',
        'press/**/*.html',
        'resources/{live-demo-webinar,sample-size-calculator}/*.html',
        'terms/**/*.html'
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
        'customers/**/*.html',
        'enterprises/**/*.html',
        'events/**/*.html','faq/**/*.html',
        'partners/technology/{,bizible/}*.html',
        'mobile/**/*.html',
        'partners/solutions/{,blue-acorn/}*.html',
        'press/**/*.html',
        'resources/{live-demo-webinar,sample-size-calculator}/*.html',
        'terms/**/*.html'
      ],
      dest: 'mobile'
      }
    ]
  }
};
