import germanMessages from "ra-language-german";

export const de = {
  ...germanMessages,
  ra: {
    ...germanMessages.ra,
    action: {
      ...germanMessages.ra.action,
      show_grid: "Als Gitter anzeigen",
      show_list: "Als Liste anzeigen",
    },
  },
  resources: {
    applications: {
      name: "Anwendung |||| Anwendungen",
      fields: {
        name: "Name",
        url: "URL",
        iconUrl: "Icon",
        clientId: "Client-ID",
        realm: "Realm",
        categories: "Kategorien",
        availableRoles: "Verfügbare Rollen",
      },
    },
    categories: {
      name: "Kategorie |||| Kategorien",
      fields: {
        name: "Name",
        description: "Beschreibung",
        sortOrder: "Sortierreihenfolge",
        applicationSortMode: "Sortiermodus",
      },
    },
    users: {
      name: "Benutzer |||| Benutzer",
      fields: {
        id: "ID",
        username: "Benutzername",
        email: "E-Mail",
        avatarUrl: "Avatar",
        providerUserId: "Anbieter-Benutzer-ID",
      },
    },
  },
  pages: {
    dashboard: "Dashboard",
    profile: "Profil",
    settings: "Einstellungen",
    applications: "Anwendungen",
    categories: "Kategorien",
    users: "Benutzer",
  },
  custom: {
    language: "Sprache",
    system: "System",
    en: "English",
    de: "Deutsch",
    export: "Exportieren",
    import: "Importieren",
    admin_operations: "Admin-Operationen",
    export_description:
      "Alle Anwendungen und Kategorien als JSON-Datei herunterladen.",
    import_description:
      "Das Importieren von Daten überschreibt vorhandene Anwendungen und Kategorien.",
    keycloak_config: "Keycloak-Konfiguration",
    link_status: "Verknüpfungsstatus",
    linked: "Verknüpft",
    not_linked: "Nicht verknüpft",
    application_roles: "Anwendungsrollen",
    new_role: "Neue Rolle",
    add: "Hinzufügen",
    roles_unsupported:
      "Rollen werden nur für verknüpfte Anwendungen unterstützt.",
    cancel: "Abbrechen",
    create_application: "Anwendung erstellen",
    create_category: "Kategorie erstellen",
    create_user: "Benutzer erstellen",
    back: "Zurück",
    order: "Reihenfolge",
    alphabetical: "Alphabetisch",
    custom: "Benutzerdefiniert",
    zoom: "Zoom",
    apply: "Anwenden",
    edit_icon: "Icon bearbeiten",
    linked_to_keycloak: "Verknüpft mit Keycloak",
    edit: "Bearbeiten",
    delete: "Löschen",
    delete_application_confirm:
      "Sind Sie sicher, dass Sie diese Anwendung löschen möchten?",
    delete_category_confirm:
      "Sind Sie sicher, dass Sie diese Kategorie löschen möchten?",
    application_deleted: "Anwendung gelöscht",
    category_deleted: "Kategorie gelöscht",
    add_actions: "Aktionen hinzufügen",
    user_profile: "Benutzerprofil",
    roles: "Rollen",
    logout: "Abmelden",
  },
};
