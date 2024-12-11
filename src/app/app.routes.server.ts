import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: 'antrag/:antragsart',
        renderMode: RenderMode.Prerender,
        async getPrerenderParams() {
            const params = [
                { antragsart: 'grundbuchausdruck' },
                { antragsart: 'namensberichtigung' },
                { antragsart: 'grundbuchberichtigung-sterbefall' },
                { antragsart: 'loeschung-abteilung2' },
                { antragsart: 'abschrift-bewilligung' },
                { antragsart: 'teilungserklaerung' }
            ]
            return params;
        },
    },
    { path: '**', renderMode: RenderMode.Server }
];
