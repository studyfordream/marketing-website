window.optly = window.optly || {};
window.optly.mrkt = window.optly.mrkt || {};
window.optly.mrkt.anim = window.optly.mrkt.anim || {};

window.quantiles = {1: [-2.326347874,0.01253346952], 2: [-2.053748909,0.02506890829], 3: [-1.880793606,0.0376082877], 4: [-1.750686073,0.05015358351], 5: [-1.644853625,0.062706778], 6: [-1.554773595,0.07526986216], 7: [-1.47579103,0.08784483795], 8: [-1.405071561,0.1004337206], 9: [-1.340755033,0.1130385407], 10: [-1.281551564,0.1256613469], 11: [-1.226528119,0.138304208], 12: [-1.174986792,0.1509692155], 13: [-1.12639113,0.1636584862], 14: [-1.080319342,0.1763741647], 15: [-1.036433391,0.1891184262], 16: [-0.9944578841,0.201893479], 17: [-0.9541652535,0.2147015678], 18: [-0.9153650877,0.2275449764], 19: [-0.8778962945,0.2404260309], 20: [-0.8416212327,0.2533471029], 21: [-0.8064212461,0.2663106129], 22: [-0.7721932134,0.2793190341], 23: [-0.7388468486,0.2923748959], 24: [-0.7063025626,0.3054807878], 25: [-0.6744897502,0.3186393636], 26: [-0.6433454057,0.3318533461], 27: [-0.6128129915,0.3451255312], 28: [-0.5828415079,0.358458793], 29: [-0.5533847202,0.3718560892], 30: [-0.5244005133,0.3853204663], 31: [-0.4958503478,0.3988550656], 32: [-0.4676987994,0.4124631294], 33: [-0.4399131658,0.4261480079], 34: [-0.4124631294,0.4399131658], 35: [-0.3853204663,0.4537621904], 36: [-0.358458793,0.4676987994], 37: [-0.3318533461,0.48172685], 38: [-0.3054807878,0.4958503478], 39: [-0.2793190341,0.5100734575], 40: [-0.2533471029,0.5244005133], 41: [-0.2275449764,0.5388360309], 42: [-0.201893479,0.5533847202], 43: [-0.1763741647,0.568051499], 44: [-0.1509692155,0.5828415079], 45: [-0.1256613469,0.5977601266], 46: [-0.1004337206,0.6128129915], 47: [-0.07526986216,0.6280060148], 48: [-0.05015358351,0.6433454057], 49: [-0.02506890829,0.6588376929], 50: [0,0.6744897502], 51: [0.02506890829,0.6903088238], 52: [0.05015358351,0.7063025626], 53: [0.07526986216,0.7224790515], 54: [0.1004337206,0.7388468486], 55: [0.1256613469,0.7554150257], 56: [0.1509692155,0.7721932134], 57: [0.1763741647,0.7891916518], 58: [0.201893479,0.8064212461], 59: [0.2275449764,0.8238936294], 60: [0.2533471029,0.8416212327], 61: [0.2793190341,0.8596173635], 62: [0.3054807878,0.8778962945], 63: [0.3318533461,0.8964733636], 64: [0.358458793,0.9153650877], 65: [0.3853204663,0.9345892912], 66: [0.4124631294,0.9541652535], 67: [0.4399131658,0.9741138777], 68: [0.4676987994,0.9944578841], 69: [0.4958503478,1.015222034], 70: [0.5244005133,1.036433391], 71: [0.5533847202,1.058121619], 72: [0.5828415079,1.080319342], 73: [0.6128129915,1.103062557], 74: [0.6433454057,1.12639113], 75: [0.6744897502,1.150349381], 76: [0.7063025626,1.174986792], 77: [0.7388468486,1.200358857], 78: [0.7721932134,1.226528119], 79: [0.8064212461,1.253565437], 80: [0.8416212327,1.281551564], 81: [0.8778962945,1.310579111], 82: [0.9153650877,1.340755033], 83: [0.9541652535,1.372203809], 84: [0.9944578841,1.405071561], 85: [1.036433391,1.439531472], 86: [1.080319342,1.47579103], 87: [1.12639113,1.514101889], 88: [1.174986792,1.554773595], 89: [1.226528119,1.598193139], 90: [1.281551564,1.644853625], 91: [1.340755033,1.69539771], 92: [1.405071561,1.750686073], 93: [1.47579103,1.811910674], 94: [1.554773595,1.880793606], 95: [1.644853625,1.959963986], 96: [1.750686073,2.053748909], 97: [1.880793606,2.170090375], 98: [2.053748909,2.326347874], 99: [2.326347874,2.575829306]};

var boundModels = {},
  samplesizeUrlparams = window.optly.mrkt.utils.deparam(window.location.search),
  newFormula = samplesizeUrlparams.new && samplesizeUrlparams.new === 'true',
  defaultVals = {
    conversion: 3,
    effect: 20,
    power: 80,
    significance: 95,
    tails: 1
  };

// this is only necessary because JS multiplying by 100 sometimes calculated a decimal
// and to guard against ridiculously low params
// limits params to 4 decimal places
function checkDecPlaces(num) {
  // sometimes JS gives you an exponent
  var str = /e\-/.test( num.toString() ) ? '0.0001' : num.toString(),
    splitNum = str.split('.'),
    intSplit = splitNum[0] === '' ? '0' : splitNum[0],
    decSplit = splitNum[1],
    processedNum;

  if(splitNum.length === 2) {
    //if( Number(intSplit) === 0) {
      // round the number to nearest 3 decimal places
      if(decSplit.length > 3) {
        var pow = Math.pow(10, 4);
        // move the decimal places enough to round the number
        var rounded = Math.round( Number( intSplit + '.' + decSplit ) * pow );
        // move the decimal places back
        processedNum = rounded / pow;
      } else {
        processedNum = str;
      }

    return processedNum;
  } else {
    return num;
  }
}

function validateQueryParam(name, value) {
  var defaultVal = defaultVals[name],
    isValid = !isNaN(value);

  if(isValid) {
    switch(name) {
      case 'conversion':
        if(value <= 0) {
          value = defaultVal;
        } else if (value > 0 && value < 1) {
          value = checkDecPlaces(value);
        }
        break;
      case 'effect':
        if(value <= 0) {
          value = defaultVal;
        } else if (value > 0 && value < 1) {
          value = checkDecPlaces(value);
        }
        break;
      case 'power':
        if(value < 60 || value > 95) {
          value = defaultVal;
        }
        break;
      case 'significance':
        if(value < 80 || value > 99) {
          value = defaultVal;
        }
        break;
      case 'tails':
        if(value !== 1 && value !== 2) {
          value = defaultVal;
        }
        break;
    }

    return value;
  } else {
    return defaultVal;
  }
}

// check if query params are present or if the only query param is the new formula identifier and update the initial model
if($.isEmptyObject(samplesizeUrlparams) || (newFormula && Object.keys(samplesizeUrlparams).length === 1) ) {
  boundModels = defaultVals;
} else {
  // validate all the params
  $.each(samplesizeUrlparams, function(key, val) {
    val = key === 'new' ? val === 'true' : validateQueryParam(key, Number(val));

    if(key === 'conversion' || key === 'effect') {
      $('input[data-calc-model="' + key + '"]').val( val );
    } else if (key === 'power' || key === 'significance') {
      $('input[data-slider="' + key + '"]').val( val );
    } else if (key === 'tails') {
      $('[value="' + val + '"]').attr('checked', true);
    }

    boundModels[key] = val;
  });
  
  // set default for tails if it doesn't exist
  if(!samplesizeUrlparams.tails) {
    boundModels.tails = 1;
  }
}

function formatCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 *
 * New Formula
 *
 *
**/

function sampleSizeEstimate(processedModels){
  var relativeMDE=processedModels.effect,
    significance = processedModels.significance / 100,
    baselineConversionRate = processedModels.conversion,
    absoluteMDE = baselineConversionRate * relativeMDE,
    c1 = baselineConversionRate,
    c2 = baselineConversionRate - absoluteMDE,
    theta = Math.abs(absoluteMDE),
    variance,
    sampleEstimate;

  // Note: This is the variance estimate for conversion events. If you want to have a sample size calculation for revenue, customers should provide variance
  variance = c1 * (1 - c1) + c2 * (1 - c2);

  sampleEstimate = 2 * (1 - significance) * variance * Math.log(1/theta) / (theta * theta);

  if (!$.isNumeric(sampleEstimate) || !isFinite(sampleEstimate) || sampleEstimate < 0) {
    return '---';
  }

  return Math.round(sampleEstimate);
}

function calculateSample(processedModels) {
  if (!window.quantiles) {
    return '---';
  }

  var t_alpha = window.quantiles[processedModels.significance][processedModels.tails - 1],
    t_beta = Math.abs(window.quantiles[100 - processedModels.power][0]),
    sd_1 = Math.sqrt(2 * processedModels.conversion * (1 - processedModels.conversion)),
    sd_2 = Math.sqrt(processedModels.conversion * (1 - processedModels.conversion) + (processedModels.conversion + processedModels.delta) * (1 - processedModels.conversion - processedModels.delta)),
    numerator = t_alpha * sd_1 + t_beta * sd_2,
    sample = Math.pow(numerator, 2);

    sample = sample / Math.pow(processedModels.delta, 2);

    if (!$.isNumeric(sample) || !isFinite(sample) || sample < 0) {
      return '---';
    }

    return Math.round(sample);
}

function processModels(models) {
  var self = processModels;

  for(var type in models) {
    if (type === 'conversion' || type === 'effect') {
      //restrict between 0 and 100%
      if ( Number( models[type] ) < 0  ) {
        $('input[data-calc-model="' + type + '"]').val( Math.round( self.modelcache[type] * 100 ) );
        return self.modelCache.lastSample;
      } 
      //restrict empty spaces and non-numbers
      else if ( !models[type] ) {
        $('input[data-calc-model="' + type + '"]').val('');
        self.modelCache.lastSample = '---';
        return self.modelCache.lastSample;
      }
      self.modelCache[type] = models[type] / 100;
    } else {
      // update the slider values
      if ( type === 'power' || type === 'significance' ) {
        $('span[data-slider-label="' + type + '"]').text( models[type].toString() );
      }
      // update the model cache
      self.modelCache[type] = models[type];
    }
  }

  if(newFormula) {
    self.modelCache.new = 'true';
    self.modelCache.lastSample = formatCommas( sampleSizeEstimate(self.modelCache) );
  } else {
    self.modelCache.delta = self.modelCache.effect * self.modelCache.conversion;
    self.modelCache.lastSample = formatCommas( calculateSample(self.modelCache) );
  }

  return self.modelCache.lastSample;
}

processModels.modelCache = {};

// Initialize
$(function(){
  var sample = $('#sample'),
    updatedModels = {},
    samplesizeFields = ['conversion', 'effect', 'power', 'significance', 'tails', 'new'],
    updatedPath,
    cachedVal;

  if(newFormula) {
    document.body.classList.add('new-formula');
    $.each(samplesizeFields, function(i, field) {
      if(field === 'power' || field === 'tails') {
        samplesizeFields.splice(i, 1);
      }
    });
  }

  // set the sample text and the model cache
  sample.text( processModels(boundModels) );

  $('input[data-calc-model]').on('change input', function() {
    var changedModel = {};

    //convert value to number for validation purposes
    changedModel[ $(this).data('calc-model') ] = Number( $(this).val() ) || 1;

    sample.text( processModels(changedModel) );

    // if we can use HTML5 history then iterate through the updated model
    if (typeof history.replaceState !== 'undefined') {
      for(var key in processModels.modelCache) {

        if(newFormula && samplesizeFields.indexOf(key) === -1) {
          continue;
        }

        if(key === 'conversion' || key === 'effect') {
          cachedVal = checkDecPlaces( Number(processModels.modelCache[key]) * 100 );
        } else if (key === 'delta' || key === 'lastSample') {
          continue;
        } else {
          cachedVal = processModels.modelCache[key];
        }
        updatedModels[key] = cachedVal;

      }
      // update the query string params
      updatedPath = window.optly.mrkt.utils.param(window.location.origin + window.location.pathname, updatedModels, samplesizeFields);
      history.replaceState({}, '', updatedPath);
    }

  });

  $('button[data-slider]').one('click', function(e) {
    e.preventDefault();

    window.optly.mrkt.anim.leave( $(this) );
    window.optly.mrkt.anim.enter( $('input[data-slider="' + $(this).data('slider') + '"]') );
  });
});




