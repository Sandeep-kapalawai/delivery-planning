const loadModuleDynamically = async () => (await import('@/utilities/path')).default;

describe('path', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it.each([
        ['/', ''],
        ['/context-path', '/context-path'],
    ])('returns contextual route prefix', async (contextPath, contextualRoutePrefix) => {
        jest.doMock('@/static/environment', () => ({
            CONTEXT_PATH: contextPath,
        }));

        const path = await loadModuleDynamically();

        expect(path.contextualRoutePrefix).toEqual(contextualRoutePrefix);
    });
});
