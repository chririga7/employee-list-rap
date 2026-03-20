@EndUserText.label: 'Role Value Help'
@ObjectModel.query.implementedBy: 'ABAP:ZCL_CE_ROLE_VH'
@ObjectModel.resultSet.sizeCategory: #XS
define custom entity ZI_ROLE_VH
{
  key Role     : abap.char(100);
      RoleText : abap.char(100);
}
