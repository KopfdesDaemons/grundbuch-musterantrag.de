# www.grundbuch-musterantrag.de

A website about German land registry law, with the option to generate free applications.
There is a user-friendly form. The user is guided through the form step by step. At the end, a .odt and a .pdf file are generated.

The website also offers a concise introduction to land registry law for laypeople.

> The website is live at [www.grundbuch-musterantrag.de](https://www.grundbuch-musterantrag.de).

It is a private website that does not represent any authority.

## Frameworks/Libraries/Tools/Dependencies

- Angular
- Express
- MySQL
- Google Charts
- LibreOffice
- Disqus
- [OdtTemplater](https://www.npmjs.com/package/odt-templater)

## Dashboard

![Dashboard](/public/images/readme/übersicht.avif)
![Dashboard Uploads](/public/images/readme/anträge.avif)
![Dashboard Statistic](/public/images/readme/statistik.avif)
![Dashboard userroles](/public/images/readme/user.avif)
![Dashboard userroles](/public/images/readme/user-roles.avif)

## Development

`docker compose -f docker-compose.dev.yml up --build`

## Deployment

github action "Deploy to Server"
