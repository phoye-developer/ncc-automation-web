"use strict";

// Class definition
var KTSigninGeneral = function () {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleValidation = function (e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'login_url': {
                        validators: {
                            uri: {
                                allowEmptyProtocol: true,
                                message: 'The login URI is not valid'
                            },
                            notEmpty: {
                                message: 'Login URI is required'
                            }
                        }
                    },
                    'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'The value is not a valid email address',
                            },
                            notEmpty: {
                                message: 'Email address is required'
                            }
                        }
                    },
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'The password is required'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
                }
            }
        );
    }

    var handleSubmitDemo = function (e) {
        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    submitButton.disabled = true;


                    // Simulate ajax request
                    setTimeout(function () {
                        // Hide loading indication
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;

                        // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "You have successfully logged in!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                form.querySelector('[name="email"]').value = "";
                                form.querySelector('[name="password"]').value = "";

                                //form.submit(); // submit form
                                var redirectUrl = form.getAttribute('data-kt-redirect-url');
                                if (redirectUrl) {
                                    location.href = redirectUrl;
                                }
                            }
                        });
                    }, 2000);
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });
    }

    var handleSubmitAjax = function (e) {
        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    submitButton.disabled = true;

                    // Get Login URI
                    const loginUri = form.querySelector('[name="login_url"]').value;

                    // Format credentials
                    const credentials = btoa(`${form.querySelector('[name="email"]').value}:${form.querySelector('[name="password"]').value}`);

                    // Get token with authorities
                    let xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;

                    xhr.open("GET", `https://${loginUri}/provider/token-with-authorities`, false);
                    xhr.setRequestHeader("Authorization", `Basic ${credentials}`);

                    try {
                        xhr.send();

                        // Check if success
                        if (xhr.status == 200) {

                            let nccLocation = "";
                            let nccToken = "";
                            let username = "";

                            const data = JSON.parse(xhr.responseText);

                            if (data.location) {
                                nccLocation = data.location;
                            }
                            if (data.token) {
                                nccToken = data.token;
                            }
                            if (data.token) {
                                username = form.querySelector('[name="email"]').value;
                            }

                            if (
                                nccLocation != ""
                                && nccToken != ""
                                && username != ""
                            ) {

                                // Search username
                                let xhr = new XMLHttpRequest();
                                xhr.withCredentials = true;

                                let searchTerm = username;
                                let index = username.indexOf("+");
                                if (index != -1) {
                                    searchTerm = username.substring(0, index);
                                }
                                xhr.open("GET", `${nccLocation}/data/api/types/user?q=${searchTerm}`, false);
                                xhr.setRequestHeader("Authorization", nccToken);

                                try {
                                    xhr.send();

                                    // Check if success
                                    if (xhr.status == 200) {

                                        const users = JSON.parse(xhr.responseText);

                                        // Check results
                                        let user = {};
                                        if (
                                            users.count
                                            && users.count > 0
                                        ) {
                                            let usersFound = users.objects;
                                            usersFound.forEach(userFound => {
                                                if (userFound.username == username) {
                                                    user = userFound;
                                                }
                                            });
                                        }

                                        if (Object.keys(user).length > 0) {

                                            // Get userProfileId
                                            let userProfileId = "";
                                            if (user.userProfileId) {
                                                userProfileId = user.userProfileId;
                                            }

                                            if (userProfileId != "") {

                                                // Get user profile
                                                let xhr = new XMLHttpRequest();
                                                xhr.withCredentials = true;

                                                xhr.open("GET", `${nccLocation}/data/api/types/userprofile/${userProfileId}`, false);
                                                xhr.setRequestHeader("Authorization", nccToken);

                                                try {
                                                    xhr.send();

                                                    // Check if success
                                                    if (xhr.status == 200) {

                                                        const userProfile = JSON.parse(xhr.responseText);

                                                        // Check user profile
                                                        if (
                                                            userProfile.name
                                                            && userProfile.name == "Administrator"
                                                        ) {

                                                            // Set cookie expiration date
                                                            let cookieExpiry = new Date();
                                                            cookieExpiry.setHours(cookieExpiry.getHours() + 24);
                                                            cookieExpiry = cookieExpiry.toUTCString();

                                                            // Set cookies
                                                            document.cookie = `nccLocation=${nccLocation}; expires=${cookieExpiry}; path=/`;
                                                            document.cookie = `nccToken=${nccToken}; expires=${cookieExpiry}; path=/`;
                                                            document.cookie = `username=${username}; expires=${cookieExpiry}; path=/`;
                                                            if (userProfile.tenantId) {
                                                                document.cookie = `tenantId=${userProfile.tenantId}; expires=${cookieExpiry}; path=/`;
                                                            }

                                                            // Redirect to home page
                                                            const redirectUrl = form.getAttribute('data-kt-redirect-url');

                                                            if (redirectUrl) {
                                                                location.href = redirectUrl;
                                                            }
                                                        } else {
                                                            Swal.fire({
                                                                text: "Sorry, but you need to be an administrator, please try again.",
                                                                icon: "error",
                                                                buttonsStyling: false,
                                                                confirmButtonText: "Ok, got it!",
                                                                customClass: {
                                                                    confirmButton: "btn btn-primary"
                                                                }
                                                            });

                                                            // Reset form
                                                            form.reset();

                                                            // Hide loading indication
                                                            submitButton.removeAttribute('data-kt-indicator');

                                                            // Enable button
                                                            submitButton.disabled = false;
                                                        }
                                                    } else {
                                                        Swal.fire({
                                                            text: "Sorry, something went wrong getting your user profile, please try again.",
                                                            icon: "error",
                                                            buttonsStyling: false,
                                                            confirmButtonText: "Ok, got it!",
                                                            customClass: {
                                                                confirmButton: "btn btn-primary"
                                                            }
                                                        });

                                                        // Reset form
                                                        form.reset();

                                                        // Hide loading indication
                                                        submitButton.removeAttribute('data-kt-indicator');

                                                        // Enable button
                                                        submitButton.disabled = false;
                                                    }
                                                } catch (error) {
                                                    Swal.fire({
                                                        text: "Sorry, something went wrong getting your user profile, please try again.",
                                                        icon: "error",
                                                        buttonsStyling: false,
                                                        confirmButtonText: "Ok, got it!",
                                                        customClass: {
                                                            confirmButton: "btn btn-primary"
                                                        }
                                                    });

                                                    // Reset form
                                                    form.reset();

                                                    // Hide loading indication
                                                    submitButton.removeAttribute('data-kt-indicator');

                                                    // Enable button
                                                    submitButton.disabled = false;
                                                }
                                            } else {
                                                Swal.fire({
                                                    text: "Sorry, something's wrong with your user, please try again.",
                                                    icon: "error",
                                                    buttonsStyling: false,
                                                    confirmButtonText: "Ok, got it!",
                                                    customClass: {
                                                        confirmButton: "btn btn-primary"
                                                    }
                                                });

                                                // Reset form
                                                form.reset();

                                                // Hide loading indication
                                                submitButton.removeAttribute('data-kt-indicator');

                                                // Enable button
                                                submitButton.disabled = false;
                                            }
                                        } else {
                                            Swal.fire({
                                                text: "Sorry, but your user wasn't found, please try again.",
                                                icon: "error",
                                                buttonsStyling: false,
                                                confirmButtonText: "Ok, got it!",
                                                customClass: {
                                                    confirmButton: "btn btn-primary"
                                                }
                                            });

                                            // Reset form
                                            form.reset();

                                            // Hide loading indication
                                            submitButton.removeAttribute('data-kt-indicator');

                                            // Enable button
                                            submitButton.disabled = false;
                                        }
                                    } else {
                                        Swal.fire({
                                            text: "Sorry, something went wrong with the search, please try again.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        });

                                        // Reset form
                                        form.reset();

                                        // Hide loading indication
                                        submitButton.removeAttribute('data-kt-indicator');

                                        // Enable button
                                        submitButton.disabled = false;
                                    }
                                } catch (error) {
                                    Swal.fire({
                                        text: "Sorry, something went wrong with the search, please try again.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });

                                    // Reset form
                                    form.reset();

                                    // Hide loading indication
                                    submitButton.removeAttribute('data-kt-indicator');

                                    // Enable button
                                    submitButton.disabled = false;
                                }
                            } else {
                                Swal.fire({
                                    text: "Sorry, something's wrong with your login info, please try again.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                });

                                // Reset form
                                form.reset();

                                // Hide loading indication
                                submitButton.removeAttribute('data-kt-indicator');

                                // Enable button
                                submitButton.disabled = false;
                            }
                        } else {
                            Swal.fire({
                                text: "Sorry, the email or password is incorrect, please try again.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });

                            // Reset form
                            form.reset();

                            // Hide loading indication
                            submitButton.removeAttribute('data-kt-indicator');

                            // Enable button
                            submitButton.disabled = false;
                        };
                    } catch (error) {
                        Swal.fire({
                            text: "Sorry, something went wrong with your log in, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });

                        // Reset form
                        form.reset();

                        // Hide loading indication
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;
                    }
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });
    }

    var isValidUrl = function (url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Public functions
    return {
        // Initialization
        init: function () {
            form = document.querySelector('#kt_sign_in_form');
            submitButton = document.querySelector('#kt_sign_in_submit');

            handleValidation();

            handleSubmitAjax();

            // if (isValidUrl(submitButton.closest('form').getAttribute('action'))) {
            //     handleSubmitAjax(); // use for ajax submit
            // } else {
            //     handleSubmitDemo(); // used for demo purposes only
            // }
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
});
