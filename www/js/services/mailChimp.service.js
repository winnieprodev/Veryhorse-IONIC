angular.module('app.mailChimpService', ['ngResource'])


.service('MailChimpService', [ '$resource', function($resource){
    
    return {
        mailchimp : mailchimp
    };


    function mailchimp(name, lastname, email, country, typelist = 'user') {
        var listId = (typelist == 'transportista') ? 'f8c96c8df2' : '139a322090';

        var params = {
            username: 'veryhorse',
            dc: 'us16',
            u: 'b734970e446209dbfbf684f82',
            c: 'JSON_CALLBACK',
            id: listId,
            FNAME: name,
            LNAME: lastname,
            EMAIL: email,
            COUNTRY: country
        }

        var url = '//'+ params.username +'.'+ params.dc +'.list-manage.com/subscribe/post-json';

        actions = {
            'save': {
                method: 'jsonp'
            }
        };
    
        MailChimpSubscription = $resource(url, params, actions);

        MailChimpSubscription.save(
            // Successfully sent data to MailChimp.
            function (response) {
                // Mailchimp returned an error.
                if (response.result === 'error') {
                    console.log('error');
                    console.log(response);
                    if (response.msg) {
                        // Remove error numbers, if any.
                        var errorMessageParts = response.msg.split(' - ');
                        if (errorMessageParts.length > 1) {
                            errorMessageParts.shift(); // Remove the error number
                        }
                        mailchimp.errorMessage = errorMessageParts.join(' ');
                    } else {
                        mailchimp.errorMessage = 'Sorry! An unknown error occured.';
                    }
                }
                // MailChimp returns a success.
                else if (response.result === 'success') {
                    console.log(response);
                }
            },
            // Error sending data to MailChimp
            function (error) {
                $log.error('MailChimp Error: %o', error);
            }
        );
    }
}]);