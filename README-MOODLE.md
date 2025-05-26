
# CIMENCAM Plus - Plugin Moodle

Ce projet génère une interface React moderne pour le plugin Moodle `local_cimencamplus`.

## Structure pour l'intégration Moodle

### Fichiers clés pour Moodle:
- `src/main-moodle.tsx` - Point d'entrée pour l'intégration
- `src/MoodleApp.tsx` - Application principale sans routing
- `src/services/moodleApi.ts` - Communication avec l'API Moodle
- `src/contexts/MoodleContext.tsx` - Gestion des données utilisateur Moodle
- `vite.config.moodle.ts` - Configuration de build pour Moodle

### Compilation pour Moodle

```bash
# Compiler pour l'intégration Moodle
npm run build:moodle

# Les fichiers générés seront dans dist-moodle/
# - cimencam-plus.js (bundle principal)
# - cimencam-plus.css (styles)
```

### Intégration dans Moodle

1. **Dans le plugin PHP** (`local/cimencamplus/`):

```php
// dashboard.php
$PAGE->requires->css('/local/cimencamplus/assets/cimencam-plus.css');
$PAGE->requires->js('/local/cimencamplus/assets/cimencam-plus.js');

echo '<div id="cimencam-plus-container"></div>';

$PAGE->requires->js_init_call('initCimencamPlus', [
    'cimencam-plus-container',
    [
        'moodle_config' => [
            'wwwroot' => $CFG->wwwroot,
            'sesskey' => sesskey()
        ],
        'current_user' => [
            'id' => $USER->id,
            'username' => $USER->username,
            'firstname' => $USER->firstname,
            'lastname' => $USER->lastname,
            'email' => $USER->email,
            'roles' => get_user_roles_names($USER->id),
            'capabilities' => get_user_capabilities()
        ]
    ]
]);
```

2. **Endpoints AJAX requis** dans le plugin:

```
/local/cimencamplus/ajax/
├── get_formations.php
├── create_formation.php
├── update_formation.php
├── delete_formation.php
├── get_enrollments.php
├── enroll_user.php
├── unenroll_user.php
├── create_attendance_session.php
├── mark_attendance.php
├── get_attendance_report.php
├── get_trainer_availability.php
├── set_trainer_availability.php
├── get_statistics.php
└── export_data.php
```

### Capacités Moodle requises

```php
// Dans db/access.php
$capabilities = [
    'local/cimencamplus:manage_formations' => [
        'captype' => 'write',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes' => [
            'manager' => CAP_ALLOW,
            'teacher' => CAP_ALLOW
        ]
    ],
    'local/cimencamplus:view_all_formations' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes' => [
            'manager' => CAP_ALLOW
        ]
    ],
    'local/cimencamplus:enroll_formations' => [
        'captype' => 'write',
        'contextlevel' => CONTEXT_SYSTEM,
        'archetypes' => [
            'student' => CAP_ALLOW,
            'user' => CAP_ALLOW
        ]
    ]
];
```

### Données attendues de Moodle

L'interface s'attend à recevoir:
- Utilisateur courant avec rôles et capacités
- Session key pour les requêtes AJAX sécurisées
- Configuration Moodle (wwwroot, etc.)

### Développement

Pour développer localement:
```bash
npm run dev
```

L'interface simulera les données Moodle pour le développement.
