"use strict";

// Class definition
var KTExportCampaign = function () {
	// Elements
	var modal;
	var modalEl;

	var stepper;
	var form;
	var formSubmitButton;
	var formContinueButton;
	var formBackButton;
	var formLogoutButton;

	// Variables
	var stepperObj;
	var validations = [];

	// Private Functions
	var initStepper = function () {
		// Initialize Stepper
		stepperObj = new KTStepper(stepper);

		// Stepper change event
		stepperObj.on('kt.stepper.changed', function (stepper) {
			if (stepperObj.getCurrentStepIndex() === 2) {
				formBackButton.classList.remove('d-none');
				formBackButton.classList.add('d-inline-block');
				formContinueButton.classList.remove('d-none');
				formContinueButton.classList.add('d-inline-block');
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.add('d-none');
				formLogoutButton.classList.remove('d-inline-block');
				formLogoutButton.classList.add('d-none');
			} else if (stepperObj.getCurrentStepIndex() === 3) {
				formBackButton.classList.remove('d-none');
				formBackButton.classList.add('d-inline-block');
				formContinueButton.classList.remove('d-inline-block');
				formContinueButton.classList.add('d-none');
				formSubmitButton.classList.remove('d-none');
				formSubmitButton.classList.add('d-inline-block');
				formLogoutButton.classList.remove('d-inline-block');
				formLogoutButton.classList.add('d-none');
			} else if (stepperObj.getCurrentStepIndex() === 4) {
				formBackButton.classList.remove('d-inline-block');
				formBackButton.classList.add('d-none');
				formContinueButton.classList.remove('d-inline-block');
				formContinueButton.classList.add('d-none');
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.add('d-none');
				formLogoutButton.classList.remove('d-inline-block');
				formLogoutButton.classList.add('d-none');
			} else {
				formBackButton.classList.remove('d-inline-block');
				formBackButton.classList.add('d-none');
			}
		});

		// Validation before going to next page
		stepperObj.on('kt.stepper.next', function (stepper) {

			// Validate form before change stepper step
			var validator = validations[stepper.getCurrentStepIndex() - 1]; // get validator for current step

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

		// Get action buttons
		let actionButtons = stepper.querySelectorAll('[data-kt-stepper-type="action"]');

		actionButtons.forEach(actionButton => {

			// Add event listener to action button
			actionButton.addEventListener('click', function (e) {

				// Validate form before change stepper step
				var validator = validations[0]; // get validator for last form

				validator.validate().then(function (status) {

					if (status == 'Valid') {
						// Prevent default button action
						e.preventDefault();

						// Disable button to avoid multiple click 
						actionButton.disabled = true;

						// Show loading indication
						actionButton.setAttribute('data-kt-indicator', 'on');

						// Simulate form submission
						setTimeout(function () {

							// Hide loading indication
							actionButton.removeAttribute('data-kt-indicator');

							// Enable button
							actionButton.disabled = false;

							// Check if Submit clicked
							if (actionButton.getAttribute('data-kt-stepper-action') == 'submit') {

								stepperObj.goNext();

								let output = stepper.querySelector('[name="export_campaign_output"]');
								output.value += `[INFO] Starting...\n`;

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
								let campaign = stepper.querySelector('[name="campaign"]');
								let reports = stepper.querySelector('[name="reports"]');
								let selected_reports = Array.from(reports.options).filter(function (report) {
									return report.selected;
								})

								let report_values = [];
								selected_reports.forEach(selected_report => {
									report_values.push(selected_report.value);
								});

								let home_tabs = stepper.querySelector('[name="home_tabs"]');
								let selected_home_tabs = Array.from(home_tabs.options).filter(function (home_tab) {
									return home_tab.selected;
								})

								let home_tab_values = [];
								selected_home_tabs.forEach(selected_home_tab => {
									home_tab_values.push(selected_home_tab.value);
								});

								let preserve_authentication = stepper.querySelector('[name="preserve_authentication"]');
								if (preserve_authentication.checked) {
									preserve_authentication.value = true;
								} else {
									preserve_authentication.value = false;
								}

								if (typeof (Worker) !== "undefined") {

									if (typeof (w) == "undefined") {

										const w = new Worker("assets/js/custom/utilities/modals/export-campaign-worker.js");
										w.onmessage = (event) => {

											if (typeof event.data === "object") {

												// Check if export complete
												if (
													event.data.action == "submit"
													&& event.data.status == "complete"
												) {

													// Download export file
													const JSONToFile = (obj, filename) => {
														const blob = new Blob([JSON.stringify(obj, null, 2)], {
															type: 'application/json',
														});
														const url = URL.createObjectURL(blob);
														const a = document.createElement('a');
														a.href = url;
														a.download = `${filename}.json`;
														a.click();
														URL.revokeObjectURL(url);
													};

													JSONToFile(event.data.config, event.data.config.campaigns[0].name);

													// Enable Switch Account button
													formLogoutButton.classList.remove('d-none');
													formLogoutButton.classList.add('d-inline-block');
												}
											} else {
												output.value += `${event.data}\n`;
												output.scrollTop = output.scrollHeight;
											}
										}
										w.postMessage(
											JSON.stringify(
												{
													"nccLocation": nccLocation,
													"nccToken": nccToken,
													"campaignId": campaign.value,
													"reportIds": report_values,
													"homeTabIds": home_tab_values,
													"preserveAuthentication": preserve_authentication.value,
												}
											));
									}
								} else {
									output.value += `Your browser does not support web workers, which is necessary to use this automation tool.\n`;
								}
							}
							// Check if Switch Account clicked
							else if (actionButton.getAttribute('data-kt-stepper-action') == 'logout') {
								window.location.href = 'sign-in.php';
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
		});
	}

	var initValidation = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/

		// Step 1
		validations.push(FormValidation.formValidation(
			form,
			{
				fields: {
					'campaign': {
						validators: {
							notEmpty: {
								message: 'Campaign is required'
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
	}

	return {
		// Public Functions
		init: function () {
			// Elements
			modalEl = document.querySelector('#kt_modal_export_campaign');

			if (modalEl) {
				modal = new bootstrap.Modal(modalEl);
			}

			stepper = document.querySelector('#kt_export_campaign_stepper');

			if (!stepper) {
				return;
			}

			form = stepper.querySelector('#kt_export_campaign_form');
			formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
			formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');
			formBackButton = stepper.querySelector('[data-kt-stepper-action="previous"]');
			formLogoutButton = stepper.querySelector('[data-kt-stepper-action="logout"]');

			initStepper();
			initValidation();
			handleForm();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	KTExportCampaign.init();
});