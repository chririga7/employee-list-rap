sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheUXTeamList.iSeeThisPage();
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("firstname");
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("lastname");
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("age");
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("role");
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("salary");
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("currency");
            Then.onTheUXTeamList.onFilterBar().iCheckFilterField("active");
            Then.onTheUXTeamList.onTable().iCheckColumns(7, {"firstname":{"header":"First Name"},"lastname":{"header":"Last Name"},"age":{"header":"Age"},"role":{"header":"Role"},"salary":{"header":"Salary"},"currency":{"header":"Currency"},"active":{"header":"Active"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheUXTeamList.onFilterBar().iExecuteSearch();
            
            Then.onTheUXTeamList.onTable().iCheckRows();

            When.onTheUXTeamList.onTable().iPressRow(0);
            Then.onTheUXTeamObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});