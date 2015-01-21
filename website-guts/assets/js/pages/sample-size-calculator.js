window.optly = window.optly || {};
window.optly.mrkt = window.optly.mrkt || {};
window.optly.mrkt.anim = window.optly.mrkt.anim || {};

var boundModels = {},
  samplesizeUrlparams = window.optly.mrkt.utils.deparam(window.location.search),
  defaultVals = {
    conversion: 3,
    effect: 20,
    significance: 95
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
if($.isEmptyObject(samplesizeUrlparams)) {
  boundModels = defaultVals;
} else {
  // validate all the params
  $.each(samplesizeUrlparams, function(key, val) {
    val = key === 'new' ? val === 'true' : validateQueryParam(key, Number(val));

    if(key === 'conversion' || key === 'effect') {
      $('input[data-calc-model="' + key + '"]').val( val );
    } else if (key === 'significance') {
      $('input[data-slider="' + key + '"]').val( val );
    }

    boundModels[key] = val;
  });

  boundModels = $.extend(defaultVals, boundModels);
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
/* jshint ignore:start */
function roundToHundred(estimate) {
  return 100 * Math.floor((estimate + 50) / 100);
}
/* jshint ignore:end */
function sampleSizeEstimate(processedModels){
  var relativeMDE = processedModels.effect,
    significance = 1 - ( processedModels.significance / 100 ),
    baselineConversionRate = processedModels.conversion,
    absoluteMDE = baselineConversionRate * relativeMDE,
    c1 = baselineConversionRate,
    c2 = baselineConversionRate - absoluteMDE,
    theta = Math.abs(absoluteMDE),
    variance,
    sampleEstimate;

  // Note: This is the variance estimate for conversion events. If you want to have a sample size calculation for revenue, customers should provide variance
  variance = c1 * (1 - c1) + c2 * (1 - c2);

  // sampleEstimate = 2 * (1 - significance) * variance * Math.log(1/theta) / (theta * theta);
  sampleEstimate = 2 * (1 - significance) * variance * Math.log(1+Math.sqrt(variance)/theta) / (theta * theta);

  if (!$.isNumeric(sampleEstimate) || !isFinite(sampleEstimate) || sampleEstimate < 0) {
    return '---';
  }

  return Math.round(sampleEstimate);
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
      if (type === 'significance' ) {
        $('span[data-slider-label="' + type + '"]').text( models[type].toString() );
      }
      // update the model cache
      self.modelCache[type] = models[type];
    }
  }

  self.modelCache.lastSample = formatCommas( sampleSizeEstimate(self.modelCache) );
  return self.modelCache.lastSample;
}

processModels.modelCache = {};

// Initialize
$(function(){
  var sample = $('#sample'),
    updatedModels = {},
    samplesizeFields = ['conversion', 'effect', 'significance'],
    updatedPath,
    cachedVal;

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

        if(samplesizeFields.indexOf(key) === -1) {
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




