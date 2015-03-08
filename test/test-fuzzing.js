describe("Testing autocomplete feature", function() {
	var scope;

	beforeEach(function() {
		module('app');
	});

	beforeEach(inject(function(_$controller_, $rootScope){
		$controller = _$controller_;
		scope = $rootScope.$new();
	}));
	
	it("Number in trie", function() {
		$controller('autoCompleteCtrl', { $scope: scope});
		console.log(scope.trie.top(20));
		expect(scope.trie.count).toEqual(12);
	});

	it("Should lookup 1 entry", function() {
		$controller('autoCompleteCtrl', { $scope: scope});
		expect(scope.trie.lookup("De").length).toEqual(1);
	});

	it("Should lookup 2 entries", function() {
		$controller('autoCompleteCtrl', { $scope: scope});
		expect(scope.trie.lookup("a").length).toEqual(2);
	});

	it("Should check if the text is changed", function() {
		$controller('autoCompleteCtrl', { $scope: scope});
		scope.text = "a";
		scope.$digest();
		expect(scope.results.length).toEqual(2);
	});
});

var fuzzer = {
	random: {
		bool: function(prob) {
			var rnd = Math.random();
			if(rnd < prob) {
				return true;
			}
			else {
				return false;
			}
		},
		integer: function(start, end) {
			return (Math.random()*(end-start)) + start;
		}
	},
	mutate: {
		string: function(str) {
			var array = str.split("");

			if( fuzzer.random.bool(0.05) )
			{
				// REVERSE
				array = array.reverse();
			}
			if( fuzzer.random.bool(0.25) )
			{
				// REMOVE
				array = array.splice(fuzzer.random.integer(0, array.length-1), fuzzer.random.integer(0, array.length-1));
			}
			if( fuzzer.random.bool(0.25) )
			{
				debugger;
				var randomStr = "";
				var rndLength = fuzzer.random.integer(0, array.length-1);
				for(var i = 0; i < rndLength; i++) {
					randomStr += String.fromCharCode(Math.floor(fuzzer.random.integer(33,122)));
				}
				array.splice.apply(array, [fuzzer.random.integer(0, array.length-1), 0].concat(randomStr.split("")));
			}
			
			return array.join("");
		}
	}
}