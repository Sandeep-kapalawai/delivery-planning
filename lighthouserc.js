module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run serve',
            url: ['http://localhost:8093/#/scm/deliveryplanning/fcl'],
            numberOfRuns: 3,
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                'categories:performance': ['warn', { minScore: 0.9 }],
                'categories:accessibility': ['warn', { minScore: 0.9 }],
                'categories:pwa': 'off',
            },
        },
    },
};
