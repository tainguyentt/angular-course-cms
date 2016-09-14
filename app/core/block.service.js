(function () {
	'use strict';

	angular
		.module('app.core')
		.factory('blockService', blockService);

	blockService.$inject = ['$firebaseObject', '$firebaseArray', 'firebaseDataService'];

	function blockService($firebaseObject, $firebaseArray, firebaseDataService) {
		var service = {
			getById: getById,
			getAll: getAll,
			save: save,
			getBlocksOfQuestion: getBlocksOfQuestion,
			getBlocksOfSubQuestion: getBlocksOfSubQuestion,
			getBlocksSolutionOfSubQuestion: getBlocksSolutionOfSubQuestion
		};
		return service;

		function save(block) {
			//save block
			if(block.question){
				var blockId = firebaseDataService.blocks.push(block).key;
				firebaseDataService.questions.child(block.question).child('contents').child(blockId).set(true);
			}else if(block.subQuestion){
				if (block.blockType == 'content') {
					delete block.blockType;
					var blockId = firebaseDataService.blocks.push(block).key;
					firebaseDataService.subquestions.child(block.subQuestion).child('contents').child(blockId).set(true);
				} else if (block.blockType == 'answer') {
					console.log("TODO - Save ANSWER");
				} else if (block.blockType == 'solution') {
					delete block.blockType;
					var blockId = firebaseDataService.blocks.push(block).key;
					firebaseDataService.subquestions.child(block.subQuestion).child('solutions').child(blockId).set(true);
				}

			}
			
			//save blockId to questions.questionItem.contents
			
		}

		function getById(blockId) {
			return $firebaseObject(firebaseDataService.blocks.child(blockId));
		}

		//TODO - handle realtime change
		function getBlocksOfQuestion(questionId) {
			var questionRef = firebaseDataService.questions.child(questionId).child('contents');
			var blocks = [];
			questionRef.on('child_added', function (content) {
				var blockId = content.key;
				blocks.push($firebaseObject(firebaseDataService.blocks.child(blockId)));
			});

			return blocks;
		}

		//TODO - handle realtime change
		function getBlocksOfSubQuestion(subQuestionId) {
			var questionRef = firebaseDataService.subquestions.child(subQuestionId).child('contents');
			var blocks = [];
			questionRef.on('child_added', function (content) {
				var blockId = content.key;
				blocks.push($firebaseObject(firebaseDataService.blocks.child(blockId)));
			});

			return blocks;
		}

		//TODO - handle realtime change
		function getBlocksSolutionOfSubQuestion(subQuestionId) {
			var questionRef = firebaseDataService.subquestions.child(subQuestionId).child('solutions');
			var blocks = [];
			questionRef.on('child_added', function (content) {
				var blockId = content.key;
				blocks.push($firebaseObject(firebaseDataService.blocks.child(blockId)));
			});

			return blocks;
		}


		function getAll() {
			return $firebaseArray(firebaseDataService.blocks);
		}
	}

})();
