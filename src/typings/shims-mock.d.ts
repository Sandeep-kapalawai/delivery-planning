/* We use JS in some of our code but it's all related to the mock-server
   we don't want to run with allowJs in tsconfig, so we just declare
   the module we're using to avoid having to do so */

declare module 'destination/*';
declare module '@scm-ui/*';
declare module 'vee-validate/dist/vee-validate.full';
declare module '@maersk-global/telemetry-web-sdk';
