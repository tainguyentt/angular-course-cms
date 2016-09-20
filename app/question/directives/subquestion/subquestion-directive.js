(function () {
	'use strict';

	angular
		.module('app.library')
		.directive('subquestion', subquestion);

	function subquestion() {
		return {
			templateUrl: 'question/directives/subquestion/subquestion-template.html',
			restrict: 'E',
			controller: SubquestionController,
			controllerAs: 'vm',
			bindToController: true,
			scope: {
				question: '=',
				subquestion: '='
			}
		};
	}

	SubquestionController.$inject = ['$scope', 'subquestionService', 'answerService', 'SUBQUESTION_TYPE'];

	function SubquestionController($scope, subquestionService, answerService, SUBQUESTION_TYPE) {
		var vm = this;

		vm.subquestionTypes = [{
			value: SUBQUESTION_TYPE.SINGLE_CHOICE,
			text: SUBQUESTION_TYPE.SINGLE_CHOICE
		}, {
			value: SUBQUESTION_TYPE.FILL_TEXT,
			text: SUBQUESTION_TYPE.FILL_TEXT
		}, {
			value: SUBQUESTION_TYPE.ANIMATION,
			text: SUBQUESTION_TYPE.ANIMATION
		}];

		vm.updateSubquestionType = updateSubquestionType;
		vm.removeSubquestion = removeSubquestion;

		var subquestionId = vm.subquestion.$id;
		vm.answers = answerService.getAnswersOfSubquestion(subquestionId);

		/*Manage content dialog*/
		$scope.openContentDialogBox = function (block, blockId) {
				if (block) {
					block.$id = blockId;
					var data = {
						block: block,
						subquestion: vm.subquestion
					}
					$scope.$emit("subquestion-show-content-dialog-box", data);
				} else {
					$scope.$emit("subquestion-show-content-dialog-box", vm.subquestion);
				}

			}
			/*Manage answer dialog*/
		$scope.openAnswerDialogBox = function (answer) {
				if (answer) {
					var data = {
						block: answer,
						subquestion: vm.subquestion
					}
					$scope.$emit("subquestion-show-answer-dialog-box", data);
				} else {
					$scope.$emit("subquestion-show-answer-dialog-box", vm.subquestion);
				}
			}
			/*Manage solution dialog*/
		$scope.openSolutionDialogBox = function (block, blockId) {
			if (block) {
				block.$id = blockId;
				var data = {
					block: block,
					subquestion: vm.subquestion
				}
				$scope.$emit("subquestion-show-solution-dialog-box", data);
			} else {
				$scope.$emit("subquestion-show-solution-dialog-box", vm.subquestion);
			}
		}

		function removeSubquestion() {
			subquestionService.remove(vm.subquestion);
		}

		function updateSubquestionType(type) {
			var updateInfo = {
				type: type
			};
			subquestionService.update(vm.subquestion.$id, updateInfo);
		}
	}

})();
