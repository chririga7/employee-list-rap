//@AbapCatalog.sqlViewName: 'ZZC_UXTEAM_5551'
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Consumption View for UX team'
@Search.searchable: true
@Metadata.allowExtensions: true
define root view entity ZC_UXTEAM_5551
  provider contract transactional_query
  as projection on ZI_UXTEAM_5551 as UXTeam
{
  key id,
      @EndUserText.label: 'First Name'
      @Search.defaultSearchElement: true
      firstname,
      @EndUserText.label: 'Last Name'
      @Search.defaultSearchElement: true
      lastname,
      @EndUserText.label: 'Age'
      @Search.defaultSearchElement: true
      age,
      @EndUserText.label: 'Role'
      @Consumption.valueHelpDefinition: [
      {
      entity: {
        name: 'ZI_ROLE_VH',
        element: 'Role'
      }
      }
      ]
      role,
      @EndUserText.label: 'Salary'
      @Search.defaultSearchElement: true
      salary,
      @EndUserText.label: 'Currency'
      currency,
      local_last_changed_at,
      @EndUserText.label: 'Active'
      active
}
