CLASS zcl_ce_role_vh DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_rap_query_provider.
ENDCLASS.

CLASS zcl_ce_role_vh IMPLEMENTATION.

  METHOD if_rap_query_provider~select.

    DATA lt_roles TYPE STANDARD TABLE OF zi_role_vh WITH EMPTY KEY.

    lt_roles = VALUE #(
      ( role = 'UX Developer' roletext = 'UX Developer' )
      ( role = 'UX Lead'      roletext = 'UX Lead' ) ).

    IF io_request->is_total_numb_of_rec_requested( ).
      io_response->set_total_number_of_records( lines( lt_roles ) ).
    ENDIF.

    IF io_request->is_data_requested( ).
      io_response->set_data( lt_roles ).
    ENDIF.

  ENDMETHOD.

ENDCLASS.
