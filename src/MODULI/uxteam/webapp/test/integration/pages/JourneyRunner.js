sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"z/uxteam/uxteam/test/integration/pages/UXTeamList",
	"z/uxteam/uxteam/test/integration/pages/UXTeamObjectPage"
], function (JourneyRunner, UXTeamList, UXTeamObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('z/uxteam/uxteam') + '/test/flp.html#app-preview',
        pages: {
			onTheUXTeamList: UXTeamList,
			onTheUXTeamObjectPage: UXTeamObjectPage
        },
        async: true
    });

    return runner;
});

