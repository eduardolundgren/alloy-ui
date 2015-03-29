YUI().use('aui-base', function(Y) {
	var navCollapse = Y.one('.collapse.navbar-collapse');

	Y.one('button.navbar-toggle').on(
		'click',
		function(event) {
			navCollapse.toggleClass('collapse');
		}
	);
});