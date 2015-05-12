module.exports = {
    options: {
      key: '<%= aws.fastly_api_key %>'
    },
    production: {
      options: {
        purgeAll: true,
        serviceId: '<%= aws.fastly_service_id %>'
      }
    }
};
