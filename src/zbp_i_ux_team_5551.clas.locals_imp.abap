CLASS lhc_UXTeam DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.

*    METHODS get_instance_features FOR INSTANCE FEATURES
*      IMPORTING keys REQUEST requested_features FOR UXTeam RESULT result.

    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION
      IMPORTING keys REQUEST requested_authorizations FOR UXTeam RESULT result.

    METHODS SetActive FOR MODIFY
      IMPORTING keys FOR ACTION UXTeam~SetActive RESULT result.

    METHODS changeSalary FOR DETERMINE ON SAVE
      IMPORTING keys FOR UXTeam~changeSalary.

    METHODS validateAge FOR VALIDATE ON SAVE
      IMPORTING keys FOR UXTeam~validateAge.

ENDCLASS.

CLASS lhc_UXTeam IMPLEMENTATION.

*  METHOD get_instance_features.
*
*    READ ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
*      ENTITY UXTeam
*      FIELDS ( active )
*      WITH CORRESPONDING #( keys )
*      RESULT DATA(members).
*
*    result = VALUE #(
*      FOR member IN members
*        ( %tky = member-%tky
*          %action-SetActive = COND #(
*            WHEN member-active = abap_true
*              THEN if_abap_behv=>fc-o-disabled
*            ELSE if_abap_behv=>fc-o-enabled ) ) ).
*
*  ENDMETHOD.

  METHOD get_instance_authorizations.
  ENDMETHOD.

  METHOD SetActive.

*Do background check
*Check references
*Onboard member
    MODIFY ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
      ENTITY UXTeam
      UPDATE
      FIELDS ( active )
      WITH VALUE #( FOR key IN keys
                     ( %tky = key-%tky
                      active = abap_true ) )
      FAILED failed
      REPORTED reported.

*Fill the response table
    READ ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
        ENTITY UXTeam
        ALL FIELDS WITH CORRESPONDING #( keys )
        RESULT DATA(members).

    result = VALUE #( FOR member IN members
                      LET status = COND #( WHEN member-active = abap_true
                                           THEN if_abap_behv=>fc-o-disabled
                                           ELSE if_abap_behv=>fc-o-enabled )
                                           IN
                      ( %tky   = member-%tky
                        %param = member ) ).

  ENDMETHOD.

  METHOD changeSalary.

    READ ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
      ENTITY UXTeam
      FIELDS ( Role )
      WITH CORRESPONDING #( keys )
      RESULT DATA(members).

    LOOP AT members INTO DATA(member).

      CASE member-role.
        WHEN 'UX Developer'.
          MODIFY ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
            ENTITY UXTeam
            UPDATE
            FIELDS ( salary )
            WITH VALUE #( ( %tky = member-%tky
                            salary = 7000 ) )
            FAILED DATA(failed_salary_dev)
            REPORTED DATA(reported_salary_dev).

        WHEN 'UX Lead'.
          MODIFY ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
            ENTITY UXTeam
            UPDATE
            FIELDS ( salary )
            WITH VALUE #( ( %tky = member-%tky
                            salary = 9000 ) )
            FAILED DATA(failed_salary_lead)
            REPORTED DATA(reported_salary_lead).
      ENDCASE.

    ENDLOOP.

  ENDMETHOD.

  METHOD validateAge.
    READ ENTITIES OF zi_uxteam_5551 IN LOCAL MODE
    ENTITY UXTeam FIELDS ( Age ) WITH CORRESPONDING #( keys )
    RESULT DATA(members).

    LOOP AT members INTO DATA(member).
      IF member-age < 21.
        APPEND VALUE #( %tky = member-%tky ) TO failed-uxteam.
      ENDIF.
    ENDLOOP.

  ENDMETHOD.

ENDCLASS.
