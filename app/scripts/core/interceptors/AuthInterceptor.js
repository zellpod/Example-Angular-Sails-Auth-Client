  'use strict';

  angular.module('frontend.core.interceptors')
    .factory('AuthInterceptor', [
      '$q', '$injector', '$localStorage',
      function(
        $q, $injector, $localStorage
      ) {
        return {
          /**
           * Interceptor method for $http requests. Main purpose of this method is to add JWT token
           * to every request that application does.
           *
           * @param   {*} config  HTTP request configuration
           *
           * @returns {*}
           */
          request: function requestCallback(config) {
            var token;

            // Yeah we have some user data on local storage
            if ($localStorage.credentials) {
              // console.log('fuck')
              token = $localStorage.credentials.token;
            }

            // console.log('token is ' + token);
            // Yeah we have a token
            if (token) {
              if (!config.data) {
                config.data = {};
              }

              /**
               * Set token to actual data and headers. Note that we need bot ways because of socket cannot modify
               * headers anyway. These values are cleaned up in backend side policy (middleware).
               */
              config.data.token = token;
              config.headers.authorization = 'JWT ' + token;
            }


            return config;
          },

          /**
           * Interceptor method that is triggered whenever response error occurs on $http requests.
           *
           * @param   {*} response
           *
           * @returns {*|Promise}
           */
          responseError: function responseErrorCallback(response) {
            if (response.status === 401) {
              $localStorage.$reset();
              $injector.get('$state').go('login');
            }

            return $q.reject(response);
          }
        };
      }
    ]);
