var queryStrings = '?uiTest=true&utm_campaign=utm_campaign_uitest&utm_content=utm_content_uitest&utm_medium=utm_medium_uitest&utm_source=utm_source_uitest&utm_keyword=utm_keyword_uitest&otm_campaign=otm_campaign_uitest&otm_content=btt&otm_medium=otm_medium_uitest&otm_source=otm_source_uitest&otm_keyword=otm_keyword_uitest&signup_platform=signup_platform_uitest';
module.exports = {
  firefox: {
    url: 'http://localhost:9000/dist/om/free-trial/fixture.html' + queryStrings,
    app: 'Firefox'
  }
};
