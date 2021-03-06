module.exports = {
  options: {
    reporter: 'spec',
    timeout: 40000
  },
  'pricing': {
    src: ['test/{pricing,features-and-plans}/*-spec.js']
  },
  'dialogs': {
    src: ['test/dialogs/*-spec.js']
  },
  'free-trial': {
    src: ['test/free-trial/*-spec.js']
  },
  'mobile-mvpp': {
    src: ['test/mobile-mvpp/*-spec.js']
  },
  'homepage': {
    src: ['test/homepage/*-spec.js']
  },
  'features-and-plans': {
    src: ['test/features-and-plans/*-spec.js']
  },
  'marketing-events': {
    src: ['test/marketing-events/*-spec.js']
  },
  'misc': {
    src: ['test/misc/*-spec.js']
   },
  'sample': {
    src: ['test/sample/*-spec.js']
   }
};
