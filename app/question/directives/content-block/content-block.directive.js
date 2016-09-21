(function () {
	'use strict';

	angular
		.module('app.library')
		.directive('contentBlock', contentBlock);

	function contentBlock() {
		return {
			templateUrl: 'question/directives/content-block/content-block.template.html',
			restrict: 'E',
			controller: ContentBlockController,
			controllerAs: 'vm',
			bindToController: true,
			scope: {
				question: '='
			}
		};
	}

	ContentBlockController.$inject = ['$scope', 'subquestionService', 'questionService', 'answerService', 'BLOCK_TYPE', 'SUBQUESTION_TYPE'];

	function ContentBlockController($scope, subquestionService, questionService, answerService, BLOCK_TYPE, SUBQUESTION_TYPE) {
		var vm = this;
		var isSubquestion = false;
		var isEditQuestionBlock = false;
		var createContent, blockObject, blockType, editBlock, answerType;
		initData();
		$scope.isShowContentDialog = false;
		$scope.blockTypes = blockTypes();
		$scope.isSingleChoiceType = isSingleChoiceType;
		$scope.isAnimationType = isAnimationType;
		$scope.isFillTextType = isFillTextType;
		vm.save = save;
		vm.close = close;
		$scope.ckeditorOptions = configCkeditor();
		$scope.createTextContent = createTextContent;

		//question event
		$scope.$on("question-manage-show-content-dialog-box", function (event, data) {
			showDialogBox();
			isSubquestion = false;
			createContent = data;
		});
		$scope.$on("question-manage-edit-block-dialog-box", function (event, data) {
			$scope.block.contents = contentsToArray(data.contents);
			$scope.block.images = imagesToArray(data.images);
			$scope.block.audios = audiosToArray(data.audios);
			$scope.block.type = data.type;
			isEditQuestionBlock = true;
			blockObject = data;
			showDialogBox();
		});

		//subquestion event
		$scope.$on("subquestion-manage-show-content-dialog-box", function (event, data) {
			showDialogBox();
			isSubquestion = true;
			blockType = BLOCK_TYPE.CONTENT;
			if (data.block) {
				editBlock = data.subquestion;
				blockObject = data.block;
				$scope.block.contents = contentsToArray(data.block.contents);
				$scope.block.images = imagesToArray(data.block.images);
				$scope.block.audios = audiosToArray(data.audios);
				$scope.block.type = data.block.type;
			} else {
				createContent = data;
			}
		});
		$scope.$on("subquestion-manage-show-answer-dialog-box", function (event, data) {
			showDialogBox();
			isSubquestion = true;
			blockType = BLOCK_TYPE.ANSWER;
			if (data.block) {
				editBlock = data.subquestion;
				blockObject = data.block;
				$scope.block.contents = contentsToArray(data.block.contents);
				$scope.block.images = imagesToArray(data.block.images);
				$scope.block.audios = audiosToArray(data.audios);
				$scope.block.type = data.block.type;
				answerType = data.subquestion.type;
			} else {
				createContent = data;
				answerType = data.type;
			}
		});
		$scope.$on("subquestion-manage-show-solution-dialog-box", function (event, data) {
			showDialogBox();
			isSubquestion = true;
			blockType = BLOCK_TYPE.SOLUTION;
			if (data.block) {
				editBlock = data.subquestion;
				blockObject = data.block;
				$scope.block.contents = contentsToArray(data.block.contents);
				$scope.block.images = imagesToArray(data.block.images);
				$scope.block.audios = audiosToArray(data.audios);
				$scope.block.type = data.block.type;
			} else {
				createContent = data;
			}
		});

		function isSingleChoiceType() {
			return answerType === SUBQUESTION_TYPE.SINGLE_CHOICE;
		}

		function isFillTextType() {
			return answerType === SUBQUESTION_TYPE.FILL_TEXT;
		}

		function isAnimationType() {
			return answerType === SUBQUESTION_TYPE.ANIMATION;
		}

		function imagesToArray(obj) {
			var imageArray = [];
			angular.forEach(obj, function (value, key) {
				var element = {
					$id: key,
					name: value.name,
					path: value.path
				}
				this.push(element);
			}, imageArray);
			return imageArray;
		}

		function audiosToArray(obj) {
			var audioArray = [];
			angular.forEach(obj, function (value, key) {
				var element = {
					$id: key,
					name: value.name,
					path: value.path
				}
				this.push(element);
			}, audioArray);
			return audioArray;
		}

		function contentsToArray(obj) {
			var array = [];
			angular.forEach(obj, function (value, key) {
				var element = {
					$id: key,
					text: value.text
				};
				/*value.$id = key;*/
				this.push(element);
			}, array);
			return array;
		}

		function configCkeditor() {
			//config ckeditor
			return {
				height: 100,
				removeButtons: '',
				toolbar: [{
					name: 'basicstyles',
					items: ['Bold', 'Italic', 'Underline']
				}, {
					name: 'insert',
					items: ['Image', 'Insertvariable']
				}],
				extraPlugins: 'insertvariable',
				allowedContent: true,
				autoParagraph: false,
				enterMode: CKEDITOR.ENTER_BR,
				contentsCss: ['bower_components/ckeditor/contents.css', 'content/ckeditor/ckeditor.css'],
				skin: 'moono,/content/ckeditor/skins/moono/' //to display button label
			};
		}

		function save() {
			if (isSubquestion) {
				//create subquestion content
				if (blockType === BLOCK_TYPE.CONTENT) {
					if (editBlock) {
						blockObject.contents = $scope.block.contents;
						blockObject.images = $scope.block.images;
						blockObject.audios = $scope.block.audios;
						blockObject.type = $scope.block.type;
						subquestionService.updateContent(editBlock.$id, blockObject);
						console.log("subquestion update content", blockObject);

					} else {
						createSubquestionContent(createContent);
					}
				}
				//create subquestion solution
				if (blockType === BLOCK_TYPE.SOLUTION) {
					if (editBlock) {
						blockObject.contents = $scope.block.contents;
						blockObject.images = $scope.block.images;
						blockObject.audios = $scope.block.audios;
						blockObject.type = $scope.block.type;
						subquestionService.updateSolution(editBlock.$id, blockObject);
					} else {
						createSubquestionSolution(createContent);
					}
				}
				//create subquestion answer
				if (blockType === BLOCK_TYPE.ANSWER) {
					if (editBlock) {
						blockObject.contents = $scope.block.contents;
						blockObject.images = $scope.block.images;
						blockObject.type = $scope.block.type;
						blockObject.audios = $scope.block.audios;
						answerService.updateAnswer(blockObject.$id, blockObject);
					} else {
						createSubquestionAnswer(createContent);
					}
				}
			} else if (isEditQuestionBlock) {
				//edit question
				blockObject.contents = $scope.block.contents;
				blockObject.images = $scope.block.images;
				blockObject.audios = $scope.block.audios;
				blockObject.type = $scope.block.type;
				questionService.updateContent(blockObject.questionId, blockObject);
			} else {
				//create question
				questionService.createContent(createContent, $scope.block);
			}
			hideDialogBox();
			initData();
		}

		function createSubquestionContent(subquestion) {
			subquestionService.createContent(subquestion.$id, $scope.block);
		}

		function createSubquestionAnswer(subquestion) {
			answerService.createAnswer(subquestion.$id, $scope.block);
		}

		function createSubquestionSolution(subquestion) {
			subquestionService.createSolution(subquestion.$id, $scope.block);
		}

		function createTextContent() {
			$scope.block.contents.push({
				text: ""
			});
		}

		function close() {
			hideDialogBox();
			initData();
		}

		function initData() {
			$scope.block = {
				contents: [{
					text: ""
				}],
				images: [],
				audios: [],
				type: 1
			};
			answerType = null;
			isSubquestion = false;
			isEditQuestionBlock = false;
			blockObject = null;
			createContent = null;
			blockType = null;
			editBlock = null;
		}

		function blockTypes() {
			return [{
				value: 1,
				text: '1'
			}, {
				value: 2,
				text: '2'
			}, {
				value: 3,
				text: '3'
			}, {
				value: 4,
				text: '4'
			}, {
				value: 5,
				text: '5'
			}, {
				value: 6,
				text: '6'
			}, {
				value: 7,
				text: '7'
			}];
		}

		function hideDialogBox() {
			$("#myModal").modal('hide');
			$scope.isShowContentDialog = false;
		}

		function showDialogBox() {
			$("#myModal").modal('show');
			$scope.isShowContentDialog = true;
		}
	}

})();
