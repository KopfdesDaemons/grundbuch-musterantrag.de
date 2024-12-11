# www.grundbuch-musterantrag.de

Eine Webseite über Grundbuchrecht, mit der Möglichkeit kostenfreie Musteranträge zu generieren.
Es gibt ein bunutzerfreundliches Formular. Der User wird Schritt für Schritt durch das Formular geleitet. Am Ende wird eine .docx und eine .pdf Datei erstellt.

Zudem bietet die Webseite einen kompakten Einstieg ins Grundbuchrecht für Laien.

> Die Webseite ist live unter [www.grundbuch-musterantrag.de](https://www.grundbuch-musterantrag.de).

Es ist eine private Webseite, welche keine Behörde repräsentiert.

## Verfügbare Musteranträge

- Antrag auf Erteilung eines Grundbuchsausdrucks
- Antrag auf Namensberichtigung einer natürlichen Person
- Antrag auf Grundbuchberichtigung aufgrund eines Sterbefalls
- Antrag auf Löschung von Lasten und Beschränkungen
- Antrag auf Erteilung von Abschriften einer Bewilligung
- Antrag auf Erteilung von Abschriften der Teilungserklärung, Abgeschlossenheitsbescheinigung und des Aufteilungsplans

## Frameworks

- **Javascript**: Angular
- **CSS**: keins bzw. eigenes Framework/Library

## Backend

- Apache
- Node.js
- Express

### Dashboard

![Dashboard](/src/assets/images/readme/dashboard-home.png)
![Dashboard](/src/assets/images/readme/dashboard-antragsliste.png)

# Wichtige Befehle

## Development

- `ng serve`

## Test build before deployment

- `npm run build --prod`
- `DASHBOARD_LOGIN_PASSWORD='admin' node dist/server/server.mjs`

## Deployment

- github action "Deploy to Server"

## pm2

- `pm2 delete1`
- `pm2 start server/server.mjs`
- `pm2 restart server/server.mjs`
