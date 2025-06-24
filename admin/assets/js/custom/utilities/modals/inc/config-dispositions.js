var userProfiles = [
    "Agent",
    "Supervisor",
    "Administrator"
];

var dispositionTemplates = {
    "Pending - Awaiting Customer Response": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Pending - Awaiting Customer Response"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Pending - Awaiting Customer Response",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": false
    },
    "Pending - Awaiting Internal Review": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Pending - Awaiting Internal Review"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Pending - Awaiting Internal Review",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": false
    },
    "Pending - Callback Required": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Pending - Callback Required"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Pending - Callback Required",
        "action": "connectedPersonalCallback",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": false
    },
    "Pending - Escalated to Supervisor": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Pending - Escalated to Supervisor"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Pending - Escalated to Supervisor",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": false
    },
    "Pending - Escalated to Support": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Pending - Escalated to Support"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "deletedAt": 0,
        "blockNumber": false,
        "name": "Pending - Escalated to Support",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": false
    },
    "Pending - System Error": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Pending - System Error"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Pending - System Error",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": false
    },
    "Resolved - Block Number": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Resolved - Block Number"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": true,
        "name": "Resolved - Block Number",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": true
    },
    "Resolved - Customer Disconnected": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Resolved - Customer Disconnected"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Resolved - Customer Disconnected",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": true
    },
    "Resolved - No Action Needed": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Resolved - No Action Needed"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Resolved - No Action Needed",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": true
    },
    "Resolved - Out of Scope": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Resolved - Out of Scope"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Resolved - Out of Scope",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": true
    },
    "Resolved - Request Cancelled": {
        "localizations": {
            "name": {
                "en": {
                    "language": "en",
                    "value": "Resolved - Request Cancelled"
                }
            }
        },
        "forceSurveyValidation": true,
        "forceContactAssignment": false,
        "blockNumber": false,
        "name": "Resolved - Request Cancelled",
        "useCampaignIdForDNC": false,
        "connectAgain": false,
        "resolved": true
    }
};