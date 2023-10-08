# Table of Contents

<small>Please note the plugin `Vue Language Features (Volar)` is not compatible with this project, as that plugin is `Vue 3` specific and does not work with `Vue.Extend`. Unfortunately, `VSCode` recommends this plugin even for `Vue 2` projects, so please do not install it or disable it when using scaffold.

Once we migrate to Vue 3, this will no longer be a problem and this plugin will work marvelously.</small>

- [Introduction](#intro)
- [Getting Started](#getting-started)
  - [Clone](#clone)
  - [Available Scripts](#available-scripts)
    - [Installation](#installation)
    - [Serving](#serving)
    - [Building](#building)
    - [Testing](#testing)
    - [Linting](#linting)
  - [Included Functionality](#included-functionality)
    - [How To Use](#how-to-use)
    - [How To Remove](#how-to-remove)
  - [Environment Files](#environment-files)
    - [Local](#env-local)
    - [Development](#env-development)
    - [Production](#env-production)
- [Module Federation](#module-federation)
    - [Provider](#module-federation-provider)
    - [Consumer](#module-federation-consumer)
- [Architecture](#architecture)
- [Contribute](#contribute)
- [FAQ](#faq)
    - [Locales](#faq-locales)
    - [Testing](#faq-testing)
        - [Global Mock](#faq-testing-global-mock)
        - [Isolated Mock](#faq-testing-isolated-mock)
    - [Utility vs Logic](#faq-utility-vs-logic)

### <a name="intro"></a>Introduction
This is a base setup for all future application development using VueJS + Webpack 5 + Module Federation... It is an improved scaffolding tool, to allow developers to code following the pre-defined globally recognized standards in the frontend development community at Maersk. 

### <a name="getting-started"></a>Getting Started


### <a name="clone"></a>Clone

`git clone https://github.com/Maersk-Global/scm-xpe-scaffold-vue2x-ts`
<br>

### <a name="available-scripts"></a>Available Scripts

##### <a name="installation"></a>Installation
```sh
npm install
```

##### <a name="serving"></a>Serving
```sh
npm run mock  
npm run serve  
npm run serve:mock
npm run serve:build
npm run serve:build:development
npm run serve:build:production
```

##### <a name="building"></a>Building
```sh
npm run build # for devops
npm run build:local
npm run build:development
npm run build:production
```

##### <a name="testing"></a>Testing
```sh
npm run test # for devops
npm run test:unit
npm run test:unit:watch
npm run test:unit:coverage
```

##### <a name="linting"></a>Linting
```sh
npm run lint
npm run lint:fix
npm run lint:print
npm run lint:styles
npm run lint:styles:fix
npm run lint:styles:print
npm run lint:all
npm run lint:all:fix
npm run lint:all:print
```

### <a name="included-functionality"></a>Included Functionality

This project contains the following out-of-the-box:

// TODO explain packages:         
"@scm-ui/filters": "1.4.7",
"@scm-ui/table": "1.35.1",
"@scm-ui/tools-panel": "1.6.2",

1) Fetch data over HTTP

2) Map received data to SCMTable Data Model

3) Show data in [SCMTable](https://github.com/Maersk-Global/scm-xpe-mdsc-components/tree/master/packages/table#table-package)

4) Allow Sorting and Filtering

#### <a name="how-to-use"></a>How To Use

The folder that contains code that demo's the table is in `src/components/scm-table-demo`, which also contains associated logic.

#### <a name="how-to-remove"></a>How To Remove

In order to remove this functionality and have more of a clean slate, follow these steps:

1. `npm uninstall @scm-ui/table`
2. Remove the `scm-table-demo` folder
3. Remove the `scm-table-demo` import from `./pages/Home.vue` file.

### <a name="environment-files"></a>Environment Files
You have the option of including .env files to your local project i.e.<br>  
```
.env.local  
.env.development  
.env.production
```

Here is a sample of what should be included within such files (replace variable values as needed)

#### <a name="env-local"></a>.env.local

    NODE_ENV = local
    PORT = 8080
    BASE_URL = http://localhost
    CONTEXT_PATH = /
    
    APP_KEY = [APP_KEY]
    API_PATH = /mock/api
    USER_PERM_API_PATH = [USER_PERM_API_PATH]
    USER_PERM_APP_KEY = /mock/api
    MSAL_CLIENT_ID = [MSAL_CLIENT_ID]
    MSAL_TENANT_ID = [MSAL_TENANT_ID]

#### <a name="env-development"></a>.env.development
    
    NODE_ENV = development
    PORT = 80
    BASE_URL = 
    CONTEXT_PATH = /

    APP_KEY = [APP_KEY]
    API_PATH = /mock/api
    USER_PERM_API_PATH = [USER_PERM_API_PATH]
    USER_PERM_APP_KEY = /mock/api
    MSAL_CLIENT_ID = [MSAL_CLIENT_ID]
    MSAL_TENANT_ID = [MSAL_TENANT_ID]

#### <a name="env-production"></a>.env.production

    NODE_ENV = production
    PORT = 80
    BASE_URL = 
    CONTEXT_PATH = /

    APP_KEY = [APP_KEY]
    API_PATH = /mock/api
    USER_PERM_API_PATH = [USER_PERM_API_PATH]
    USER_PERM_APP_KEY = /mock/api
    MSAL_CLIENT_ID = [MSAL_CLIENT_ID]
    MSAL_TENANT_ID = [MSAL_TENANT_ID]

### Important!
1.  **NOTE:** remember to ignore the .env files from your commits; they are only part of the package as examples
2.  .env files can be updated to support your environment setups
3.  .env.local is a good example of running the api's via the supplied mock server

### <a name="module-federation"></a>Module Federation

Configuration of module federation is done via `.federationrc.js` found in the project root.

#### <a name="module-federation-provider"></a>Provider
1.  git clone https://github.com/Maersk-Global/scm-xpe-scaffold-vue2x-ts
2.  Run the `npm install` command
3.  In `package.json` set the port value in the scripts section to a different one, incase multiple scaffolds are running simultaneously
4.  In `webpack.config.js` add your application name in `HtmlWebpackPlugin({ title: '', ...})`
5.  Define a `name` for your federated application and/or library in .`federationrc.js`
```js
    // .federationrc.js
    ...

   // meta (filename is static and should not be changed)
    name: '[federation-name]',      // add your federation name here...
    filename: 'remote-entry.js',    // no need to change the filename, it is static by default!
```
6.  Expose a component or script via the `.federationrc.js` `exposes` property (`alias` is the name of your federation, see comments in file)
```js
    // .federationrc.js
    ...

    // localized exports 
    exposes: {
        // [NOTE]: mandatory exports to run in the shell...
        './app': path.resolve(__dirname, './src/app'),
        './initialize': path.resolve(__dirname, './src/initialize'),

        // [NOTE]: displays the syntax to export your component and/or logic)
        // './my-component': path.resolve(__dirname, './src/components/my-component/my-component'),
    },
```
7.  Execute `npm run mock` and `npm run serve`

#### <a name="module-federation-consumer"></a>Consumer
1.  `git clone https://github.com/Maersk-Global/scm-xpe-scaffold-vue2x-ts`
2.  Run the `npm install` command
3.  In `package.json` set the port value in the scripts section to a different one, incase multiple scaffolds are running simultaneously
4.  In `webpack.config.js` add your application name in `HtmlWebpackPlugin({ title: '', ...})`
5.  Define a `name` for your federated application and/or library in .`federationrc.js`
6.  Consume a component or script via the `.federationrc.js` `proxy` property (see comments in file)
```js
    // .federationrc.js
    ...

    // dynamic remotes (specific to each environment...)
    proxy: {
        local: [
            {
                port: 9000,                 // the local application port running in webpack devserver (http & https are omitted by default)
                alias: 'shell',             // the federation name of the remote you would like to consume from
                url: 'http://localhost',    // the remote application url
                file: 'remote-entry.js',    // static name for the remote entry file of the remote federation you are trying to conume from
            },
            {
                port: 8090,
                alias: 'provider',          // [NOTE]: remember to update your typings in ./src/typings/shims-mock.d.ts
                url: 'http://localhost',
                file: 'remote-entry.js',
            },
        ],
        development: [
            /* [ADD REMOTES HERE] */
        ],
        production: [
            /* [ADD REMOTES HERE] */
        ],
    },
```
7.  Import a federated component using the ESNext dynamic import syntax i.e. 
```js
    // my-component.vue <script lang="ts">
    ...

    import store from 'shell/store';
    
    export default Vue.extend<IData, IMethods, IComputed, IProps>({
        components: { 
            'auto-complete': () => import('provider/auto-complete'), 
        }, 
        computed: {
            ...store.getters('user', {
                permissions: 'getUserPermissions',
            }),
        },
    }
```
8.  Use the federated component as you would any other inside you application   
```html
    <!-- my-component.vue <template>-->
    ...

    <template> 
        <auto-complete :throttle="3" /> 
    </template>
```
9.  Execute `npm run mock` and `npm run serve`

**[NOTE]:** if multiple applications are using the mock-server, simply increment the mock server port here: `mock-server\config\port.js`

#### <a name="architecture"></a>Architecture
1.  Initialization sequence:  
    * webpack -> .env.{environment} -> (federation) -> main -> bootstrap -> vue 
    <br>
2.  Integration with the **"scm-shell"**, requires federation of the following modules: 
    * initialize.js (initialization logic, found inside ./src/initialize.(js|ts))
    * app.vue (main vue application, found inside ./src/app.vue)
    <br>
3.  **[COMING SOON]**: Register you application via the configurator interface... 

#### <a name="semantics"></a>Semantics
1.  Naming conventions are as follows:
    * **files**:            
        - kebab case        => file-name.js
    * **variables**:        
        - camel case        => fileName
    * **enum keys** 
        - uppercase   => FILENAME
    * **classes**:          
        - pascal case       => FileName
    * **constants**:        
        - snake case        => FILE_NAME
    <br>
2.  Styles
    * follow the **kebab-case** naming convention (NOT BIM)
    <br>
3.  Vue SFC
    * see **eslintrc.js** for details



#### <a name="contribute"></a>Contribute
Everyone is welcome to contribute via `pull-requests`. Explain what your change does and why it is needed. If you have any questions, reach out to `Experience Engineering Team`.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

#### <a name="faq"></a>FAQ
Answers to commonly asked questions:

#### <a name="faq-locales"></a>Locales
First, create the locale `.json` files you need in `./src/i18n/locales/*`

Then import the vueI18n plugin instance into your application (see src/bootstrap.js).

Each instance of the resource plugin will be specific to your application and/or component. 

Now you can use $t as your translator function across the entire application. Namespace as the first argument is no longer required.

#### <a name="faq-testing"></a>Testing

When you start including federated code in your application, for example an import of the shell store

```ts
import shellStore from 'shell/store';
```

It's important to realize that this dependency is __only__ available at `run-time`. Why is that? Well, the code is essentially fetched via an HTTP request when the app is running, a call to shell's `remote-entry.js` file contains everything that shell has exposed to the outside world.

However, when we build or run tests, we're not in a run-time environment and thus federated code will not be available. That will ensure that the following error occurs:

```
 Cannot find module 'shell/store' from [some path to file that imports it]
```

So, the logical conclusion to this, is that we have to `mock` any 3rd party code not available at test-time i.e it's not available in `node_modules`.

##### <a name="faq-testing-global-mock"></a>Global Mock
1. Go inside `<rootdir>/jest/mocks`
2. Create a new folder that describes what you're trying to mock, for example `shell`
3. Crete a file that describes what you're trying to mock, for example `store.js`.
4. Now we have essentially mocked the `shell/store` import but we need to tell `Jest` about it.
5. Open `jest.config.js` and make a new entry in the `moduleNameMapper` property.
6. The key is the import we're trying to match against, and the value is the path to the mocked module.
7. For our purposes, it would be `'^shell/(.*)$': '<rootDir>/jest/mocks/shell/$1.js'`

Now every import that contains `shell` is pointed towards the `jest/mocks` folder and it tries to find the relevant file, i.e `shell/store` would look after a folder named `shell` inside of `jest/mocks` that contains  file named `store.js`.

Optionally, you can provide mock implementations if needed, by default exporting an empty object will suffice.

The same steps can be followed for any module, `shell/store` was just an example.

##### <a name="faq-testing-isolated-mock"></a>Isolated Mock
Isolated mock means that instead of mocking the thing globally, you do it inside your `*.spec.ts` file, thus the mock will only be available for that file. I highly recommend reading [this](https://jestjs.io/docs/mock-functions) article that shows how to do it.

#### <a name="faq-utility-vs-logic"></a>Utility vs Logic

I highly recommend reading [this](https://maersk-tools.atlassian.net/wiki/spaces/NSCP/pages/181587181797/Building+a+widget+and+or+a+reusable+component) article on Confluence. It contains a detailed description of this project, including utility vs logic and where to put where.

The section that addresses that question is available [here](https://maersk-tools.atlassian.net/wiki/spaces/NSCP/pages/181587181797/Building+a+widget+and+or+a+reusable+component#The-various-layers%2Ftiers) but I highly recommend reading the entire thing.
