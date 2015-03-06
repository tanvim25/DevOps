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
});