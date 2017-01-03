'use strict';

const Promise = require('bluebird');
const createAction = require('codepipeline-custom-action').createAction;
const verboseLog = require('codepipeline-custom-action').verboseLog;

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);

const lambda = new AWS.Lambda();

exports.handler = createAction((job, input) => {
	verboseLog('Received input:', JSON.stringify(input, null, 2));
	return [
		job,
		Promise.all(
			Object.keys(input)
				.map(key => {
					if (input[key].match(/^arn:aws:lambda:[^:]+:\d+:function:[^:]+$/)) {
						verboseLog(`- Found function for ${key}: ${input[key]}`);
						return input[key];
					}
				})
				.filter(item => !!item)
				.map(functionArn => {
					verboseLog(`- Publishing version for ${functionArn}`);
					return lambda.publishVersion({ FunctionName: functionArn })
						.promise();
				})
		),
	];
});
