//@AbapCatalog.sqlViewName: 'ZZI_UXTEAM_5551'
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Interface view for UX team'
@Metadata.ignorePropagatedAnnotations: false
define root view entity ZI_UXTEAM_5551 as select from zrap_uxteam_5551
{
    key id as id,
    firstname,
    lastname,
    age,
    role,
    salary,
    currency,
    active,
    last_changed_at,
    local_last_changed_at
}
