"use strict";

// Class definition
var KTCreateCampaign = function () {
	// Elements
	var modal;
	var modalEl;

	var stepper;
	var form;
	var formSubmitButton;
	var formContinueButton;
	var formBackButton;

	// Variables
	var stepperObj;
	var validations = [];

	// Private Functions
	var initStepper = function () {
		// Initialize Stepper
		stepperObj = new KTStepper(stepper);

		// Stepper change event
		stepperObj.on('kt.stepper.changed', function (stepper) {
			if (stepperObj.getCurrentStepIndex() === 5) {
				formSubmitButton.classList.remove('d-none');
				formSubmitButton.classList.add('d-inline-block');
				formContinueButton.classList.add('d-none');
			} else if (stepperObj.getCurrentStepIndex() === 6) {
				formSubmitButton.classList.add('d-none');
				formContinueButton.classList.add('d-none');
				formBackButton.classList.add('d-none');
			} else {
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.remove('d-none');
				formContinueButton.classList.remove('d-none');
			}
		});

		// Validation before going to next page
		stepperObj.on('kt.stepper.next', function (stepper) {

			// Validate form before change stepper step
			var validator = validations[stepper.getCurrentStepIndex() - 1]; // get validator for currnt step

			if (validator) {
				validator.validate().then(function (status) {

					if (status == 'Valid') {
						stepper.goNext();

						KTUtil.scrollTop();
					} else {
						Swal.fire({
							text: "Sorry, looks like there are some errors detected, please try again.",
							icon: "error",
							buttonsStyling: false,
							confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn btn-light"
							}
						}).then(function () {
							KTUtil.scrollTop();
						});
					}
				});
			} else {
				stepper.goNext();

				KTUtil.scrollTop();
			}
		});

		// Prev event
		stepperObj.on('kt.stepper.previous', function (stepper) {

			stepper.goPrevious();
			KTUtil.scrollTop();
		});
	}

	var handleForm = function () {
		formSubmitButton.addEventListener('click', function (e) {
			// Validate form before change stepper step
			var validator = validations[1]; // get validator for last form

			validator.validate().then(function (status) {

				if (status == 'Valid') {
					// Prevent default button action
					e.preventDefault();

					// Disable button to avoid multiple click 
					formSubmitButton.disabled = true;

					// Show loading indication
					formSubmitButton.setAttribute('data-kt-indicator', 'on');

					// Simulate form submission
					setTimeout(function () {
						// Hide loading indication
						formSubmitButton.removeAttribute('data-kt-indicator');

						// Enable button
						formSubmitButton.disabled = false;

						stepperObj.goNext();

						// Set variables
						let nccLocation = "";
						let nccToken = "";
						const cookies = decodeURIComponent(document.cookie).split(";").map(cookie => cookie.trim());
						cookies.forEach(cookie => {
							if (cookie.startsWith("nccLocation=")) {
								nccLocation = cookie.substring(12);
							}
							if (cookie.startsWith("nccToken=")) {
								nccToken = cookie.substring(9);
							}
						});
						let output = stepper.querySelector('[name="output"]');
						let campaign_name = stepper.querySelector('[name="campaign_name"]');
						let business_name = stepper.querySelector('[name="business_name"]');
						let vertical = stepper.querySelector('[name="vertical"]');
						let workflow_type = stepper.querySelector('[name="workflow_type"]');
						let pstn_address = stepper.querySelector('[name="pstn_address"]').value != "" ? stepper.querySelector('[name="pstn_address"]') : false;
						let campaign_caller_id = stepper.querySelector('[name="campaign_caller_id"]');
						let dispositions = stepper.querySelector('[name="dispositions"]');
						let selected_dispositions = Array.from(dispositions.options).filter(function (disposition) {
							return disposition.selected;
						})

						let disposition_values = [];
						selected_dispositions.forEach(selected_disposition => {
							disposition_values.push(selected_disposition.value);
						});

						let assign_agents_queues = stepper.querySelector('[name="assign_agents_queues"]');
						if (assign_agents_queues.checked) {
							assign_agents_queues.value = true;
						} else {
							assign_agents_queues.value = false;
						}

						let assign_supervisors_queues = stepper.querySelector('[name="assign_supervisors_queues"]');
						if (assign_supervisors_queues.checked) {
							assign_supervisors_queues.value = true;
						} else {
							assign_supervisors_queues.value = false;
						}

						let assign_supervisors_campaign = stepper.querySelector('[name="assign_supervisors_campaign"]');
						if (assign_supervisors_campaign.checked) {
							assign_supervisors_campaign.value = true;
						} else {
							assign_supervisors_campaign.value = false;
						}

						let assign_agents_topics = stepper.querySelector('[name="assign_agents_topics"]');
						if (assign_agents_topics.checked) {
							assign_agents_topics.value = true;
						} else {
							assign_agents_topics.value = false;
						}

						let assign_supervisors_topics = stepper.querySelector('[name="assign_supervisors_topics"]');
						if (assign_supervisors_topics.checked) {
							assign_supervisors_topics.value = true;
						} else {
							assign_supervisors_topics.value = false;
						}

						if (typeof (Worker) !== "undefined") {

							if (typeof (w) == "undefined") {

								const w = new Worker("assets/js/custom/utilities/modals/create-campaign-worker.js");
								w.onmessage = (event) => {
									output.value += `${event.data}\n`;
									output.scrollTop = output.scrollHeight;
								}
								w.postMessage(
									JSON.stringify(
										{
											"nccLocation": nccLocation,
											"nccToken": nccToken,
											"campaignName": campaign_name.value,
											"businessName": business_name.value,
											"vertical": vertical.value,
											"workflowType": workflow_type.value,
											"pstnAddress": pstn_address.value,
											"campaignCallerId": campaign_caller_id.value,
											"dispositions": disposition_values,
											"assignAgentsQueues": assign_agents_queues.value,
											"assignSupervisorsQueues": assign_supervisors_queues.value,
											"assignSupervisorsCampaigns": assign_supervisors_campaign.value,
											"assignAgentsTopics": assign_agents_topics.value,
											"assignSupervisorsTopics": assign_supervisors_topics.value
										}
									));
							}
						} else {
							output.value += `Your browser does not support web workers, which is necessary to use this automation tool.\n`;
						}
					}, 2000);
				} else {
					Swal.fire({
						text: "Sorry, looks like there are some errors detected, please try again.",
						icon: "error",
						buttonsStyling: false,
						confirmButtonText: "Ok, got it!",
						customClass: {
							confirmButton: "btn btn-light"
						}
					}).then(function () {
						KTUtil.scrollTop();
					});
				}
			});
		});
	}

	var initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/

		// Step 1
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'campaign_name': {
						validators: {
							notEmpty: {
								message: 'Campaign name is required'
							}
						}
					},
					'business_name': {
						validators: {
							notEmpty: {
								message: 'Business name is required'
							}
						}
					},
					'vertical': {
						validators: {
							notEmpty: {
								message: 'Business vertical is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
						eleInvalidClass: '',
						eleValidClass: ''
					})
				}
			}
		));

		// Step 2
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'workflow_type': {
						validators: {
							notEmpty: {
								message: 'Workflow type is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
						eleInvalidClass: '',
						eleValidClass: ''
					})
				}
			}
		));

		// Step 3
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'campaign_caller_id': {
						validators: {
							notEmpty: {
								message: 'Campaign caller ID is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					// Bootstrap Framework Integration
					bootstrap: new FormValidation.plugins.Bootstrap5({
						rowSelector: '.fv-row',
						eleInvalidClass: '',
						eleValidClass: ''
					})
				}
			}
		));
	}

	return {
		// Public Functions
		init: function () {
			// Elements
			modalEl = document.querySelector('#kt_modal_create_campaign');

			if (modalEl) {
				modal = new bootstrap.Modal(modalEl);
			}

			stepper = document.querySelector('#kt_create_campaign_stepper');

			if (!stepper) {
				return;
			}

			form = stepper.querySelector('#kt_create_campaign_form');
			formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
			formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');
			formBackButton = stepper.querySelector('[data-kt-stepper-action="previous"]');

			initStepper();
			initValidation();
			handleForm();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	KTCreateCampaign.init();
});