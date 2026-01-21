// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

import glazmo_banner from './assets/glazmo/glazmo-banner.jpg';
import glazmo_logo from './assets/glazmo/glazmo-logo.jpg';

/**
 * When adding a new xeat preset, you need to rebuild app afterwards running `npm run build`.
 * This is because the presets are hardcoded in the app and not fetched from the server.
 * The asterisks are removed when running the app.
 */
const xeatPresets = [
    {
        play: [0, 1],
        note: 'C*o*n*g*r*a*t*u*l*a*t*i*o*n*s*!* *Y*o*u* *d*e*s*e*r*v*e* *t*h*e*s*e*.',
        xeat: '7*6*5*3',
        id: 'b*a*r*d*_*g*l*a*z*m*o*_*p*o*r*t*a*l*_*v*6',
        name: 'G*L*A*Z*M*O* *N*E*T*W*O*R*K*',
        banner: glazmo_banner,
        logo: glazmo_logo,
        xile: 'p*r*e*s*e*t*s/b*a*r*d*_*g*l*a*z*m*o*_*p*o*r*t*a*l*_*v*6.*w*a*v*e*b*a*r*d',
        content: '<b>J*o*i*n* *t*h*e* *g*l*a*z*m*o*_*n*e*t*w*o*r*k* *D*i*s*c*o*r*d*</b><b*r /><*a *ta*rg*et*="_*b*la*n*k*" h*r*ef="h*t*t*p*s*:*/*/*d*i*s*c*o*r*d*.*g*g*/*p*s*6*W*R*y*K*a*A*9*">h*t*t*p*s*:*/*/*d*i*s*c*o*r*d*.*g*g*/*p*s*6*W*R*y*K*a*A*9*</a>',
    },
    {
        play: [0, 3],
        note: 'C*o*n*g*r*a*t*u*l*a*t*i*o*n*s*!* *Y*o*u* *d*e*s*e*r*v*e* *t*h*e*s*e*.',
        xeat: 'k*a*s*t*l*e*b*d*r*u*m',
        id: 'k*a*s*t*l*e*-*d*r*u*m*-*b*e*t*a*-*2*0*2*5*-*0*4*-*2*5',
        name: 'K*a*s*t*l*e* *D*r*u*m* *B*e*t*a',
        xile: 'p*r*e*s*e*t*s*/*k*a*s*t*l*e*-*d*r*u*m*-*b*e*t*a*-*2*0*2*5*-*0*4*-*2*5*.*w*a*v*e*b*a*r*d'
    }
];

export default xeatPresets;