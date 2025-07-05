"use strict";

// Class definition
var KTImportCampaign = function () {
	// Elements
	var modal;
	var modalEl;

	var stepper;
	var form;
	var formBackButton;
	var formContinueButton;
	var formReviewButton;
	var formSubmitButton;
	var updatedIds = {};

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
				formContinueButton.classList.remove('d-inline-block');
				formContinueButton.classList.add('d-none');
				formReviewButton.classList.remove('d-none');
				formReviewButton.classList.add('d-inline-block');
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.add('d-none');
			} else if (stepperObj.getCurrentStepIndex() === 3) {
				formBackButton.classList.remove('d-none');
				formBackButton.classList.add('d-inline-block');
				formContinueButton.classList.remove('d-inline-block');
				formContinueButton.classList.add('d-none');
				formReviewButton.classList.remove('d-inline-block');
				formReviewButton.classList.add('d-none');
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.add('d-none');
			} else if (stepperObj.getCurrentStepIndex() === 4) {
				formBackButton.classList.remove('d-inline-block');
				formBackButton.classList.add('d-none');
				formContinueButton.classList.remove('d-inline-block');
				formContinueButton.classList.add('d-none');
				formReviewButton.classList.remove('d-inline-block');
				formReviewButton.classList.add('d-none');
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.add('d-none');
			} else {
				formBackButton.classList.remove('d-inline-block');
				formBackButton.classList.add('d-none');
				formContinueButton.classList.remove('d-none');
				formContinueButton.classList.add('d-inline-block');
				formReviewButton.classList.remove('d-inline-block');
				formReviewButton.classList.add('d-none');
				formSubmitButton.classList.remove('d-inline-block');
				formSubmitButton.classList.add('d-none');
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

		// Find Review and Submit buttons
		let actionButtons = stepper.querySelectorAll('[data-kt-stepper-type="action"]');

		// Attach import review and processing to buttons
		actionButtons.forEach(actionButton => {

			let action = actionButton.getAttribute('data-kt-stepper-action');

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

							if (
								action == "review"
								|| action == "submit"
							) {
								stepperObj.goNext();

								let output = stepper.querySelector(`[name="import_campaign_${action}_output"]`);
								output.value = `[INFO] Starting...\n`;

								// Set variables
								let nccLocation = "";
								let nccToken = "";
								let tenantId = "";
								let username = "";
								const cookies = decodeURIComponent(document.cookie).split(";").map(cookie => cookie.trim());
								cookies.forEach(cookie => {
									if (cookie.startsWith("nccLocation=")) {
										nccLocation = cookie.substring(12);
									}
									if (cookie.startsWith("nccToken=")) {
										nccToken = cookie.substring(9);
									}
									if (cookie.startsWith("tenantId=")) {
										tenantId = cookie.substring(9);
									}
									if (cookie.startsWith("username=")) {
										username = cookie.substring(9);
									}
								});
								let importFile = document.getElementById("import_file").files[0];
								let campaigns = stepper.querySelector('[name="campaigns"]');
								let dialPlans = stepper.querySelector('[name=dial_plans]');
								let templates = stepper.querySelector('[name="templates"]');
								let dispositions = stepper.querySelector('[name="dispositions"]');
								let entities = stepper.querySelector('[name="entities"]');
								let scorecards = stepper.querySelector('[name="scorecards"]');
								let classifications = stepper.querySelector('[name="classifications"]');
								let surveys = stepper.querySelector('[name="surveys"]');
								let surveyThemes = stepper.querySelector('[name="survey_themes"]');
								let workflows = stepper.querySelector('[name="workflows"]');
								let partitions = stepper.querySelector('[name="partitions"]');
								let whatsAppTemplates = stepper.querySelector('[name="whats_app_templates"]');
								let campaignScripts = stepper.querySelector('[name="campaign_scripts"]');
								let fieldMappings = stepper.querySelector('[name="field_mappings"]');
								let functions = stepper.querySelector('[name="functions"]');
								let restCalls = stepper.querySelector('[name="rest_calls"]');
								let scripts = stepper.querySelector('[name="scripts"]');
								let userProfiles = stepper.querySelector('[name="user_profiles"]');
								let queues = stepper.querySelector('[name="queues"]');
								let prompts = stepper.querySelector('[name="prompts"]');
								let categorySummaries = stepper.querySelector('[name="category_summaries"]');
								let categories = stepper.querySelector('[name="categories"]');
								let skills = stepper.querySelector('[name="skills"]');
								let music = stepper.querySelector('[name="music"]');
								let campaignGoals = stepper.querySelector('[name="campaign_goals"]');
								let stateDids = stepper.querySelector('[name="state_dids"]');
								let businessEvents = stepper.querySelector('[name="business_events"]');
								let timeEvents = stepper.querySelector('[name="time_events"]');
								let fileServers = stepper.querySelector('[name="file_servers"]');
								let filters = stepper.querySelector('[name="filters"]');
								let reports = stepper.querySelector('[name="reports"]');
								let homeTabs = stepper.querySelector('[name="home_tabs"]');
								let widgets = stepper.querySelector('[name="widgets"]');
								let dashboards = stepper.querySelector('[name="dashboards"');

								let reader = new FileReader();
								reader.onload = (e) => {
									let importData = e.target.result;

									if (typeof (Worker) !== "undefined") {

										if (typeof (w) == "undefined") {

											const w = new Worker("assets/js/custom/utilities/modals/import-campaign-worker.js");
											w.onmessage = (event) => {
												if (typeof event.data === "object") {

													let data = event.data;

													// Check if review
													if (
														data.action == "review"
														&& data.status == "complete"
														&& data.fileIsValid == true
													) {

														// Add Submit button
														formSubmitButton.classList.remove('d-none');
														formSubmitButton.classList.add('d-inline-block');

														// Store IDs that need updating
														updatedIds = data.updatedIds;
													}

												} else {
													output.value += `${event.data}\n`;
													output.scrollTop = output.scrollHeight;
												}
											}
											w.postMessage(
												JSON.stringify(
													{
														"action": action,
														"nccLocation": nccLocation,
														"nccToken": nccToken,
														"tenantId": tenantId,
														"username": username,
														"campaigns": campaigns.value,
														"dialPlans": dialPlans.value,
														"templates": templates.value,
														"dispositions": dispositions.value,
														"entities": entities.value,
														"scorecards": scorecards.value,
														"classifications": classifications.value,
														"surveys": surveys.value,
														"surveyThemes": surveyThemes.value,
														"workflows": workflows.value,
														"partitions": partitions.value,
														"whatsAppTemplates": whatsAppTemplates.value,
														"campaignScripts": campaignScripts.value,
														"fieldMappings": fieldMappings.value,
														"functions": functions.value,
														"restCalls": restCalls.value,
														"scripts": scripts.value,
														"userProfiles": userProfiles.value,
														"queues": queues.value,
														"prompts": prompts.value,
														"categorySummaries": categorySummaries.value,
														"categories": categories.value,
														"skills": skills.value,
														"music": music.value,
														"campaignGoals": campaignGoals.value,
														"stateDids": stateDids.value,
														"businessEvents": businessEvents.value,
														"timeEvents": timeEvents.value,
														"fileServers": fileServers.value,
														"filters": filters.value,
														"reports": reports.value,
														"homeTabs": homeTabs.value,
														"widgets": widgets.value,
														"dashboards": dashboards.value,
														"importData": importData,
														"updatedIds": updatedIds
													}
												));
										}
									} else {
										output.value += `Your browser does not support web workers, which is necessary to use this automation tool.\n`;
									}
								}
								reader.readAsText(importFile);
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
					'import_file': {
						validators: {
							notEmpty: {
								message: 'File is required'
							},
							file: {
								extension: 'json',
								message: 'File extension must be .json'
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
			modalEl = document.querySelector('#kt_modal_import_campaign');

			if (modalEl) {
				modal = new bootstrap.Modal(modalEl);
			}

			stepper = document.querySelector('#kt_import_campaign_stepper');

			if (!stepper) {
				return;
			}

			form = stepper.querySelector('#kt_import_campaign_form');
			formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
			formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');
			formBackButton = stepper.querySelector('[data-kt-stepper-action="previous"]');
			formReviewButton = stepper.querySelector('[data-kt-stepper-action="review"]');

			initStepper();
			initValidation();
			handleForm();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	KTImportCampaign.init();
});