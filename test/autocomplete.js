describe("should test autocomplete feature", function() {
	var scope;
	
	beforeEach(function() {
		module('app');
	});
	
	beforeEach(inject(function(_$controller_, $rootScope){
        $controller = _$controller_;
		scope = $rootScope.$new();
	}));
	
	it("should be true", function() {
		$controller('autoCompleteCtrl', { $scope: scope});
		expect(scope.trie.count).toEqual(12);
	});
});