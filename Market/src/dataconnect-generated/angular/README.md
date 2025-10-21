# Generated Angular README
This README will guide you through the process of using the generated Angular SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/angular` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#angular).

# Table of Contents
- [**Overview**](#generated-angular-readme)
- [**TanStack Query Firebase & TanStack Angular Query**](#tanstack-query-firebase-tanstack-angular-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-angular-query-packages)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPet*](#getpet)
  - [*ListPetsBySpecies*](#listpetsbyspecies)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateVaccinationNotes*](#updatevaccinationnotes)

# TanStack Query Firebase & TanStack Angular Query
This SDK provides [Angular](https://angular.dev/) injectors generated specific to your application, for the operations found in the connector `example`. These injectors are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack Angular Query v5](https://tanstack.com/query/v5/docs/framework/angular/overview) and [AngularFire](https://github.com/angular/angularfire/tree/main).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated Angular SDK.

## Installing TanStack Query Firebase and TanStack Angular Query Packages
In order to use the Angular generated SDK, you must install `AngularFire` and select `Data Connect` during the setup.

You can install `AngularFire` using the [Angular CLI](https://angular.dev/installation#install-angular-cli). You can also follow the installation instructions from the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/angular#automatic-setup).

```bash
npm install -g @angular/cli
```
```bash
ng add @angular/fire
# select Data Connect during setup!
```

This should handle configuring your project to use TanStack Query. However, if you need to set up manually, please follow the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/angular#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, edit your `main.ts` file and your `app/app.config.ts` file and update your `provideDataConnect` provider:
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
... // other imports
// update your imports to include the function that connects to the emulator
import { getDataConnect, provideDataConnect, connectDataConnectEmulator } from '@angular/fire/data-connect';

// update the `provideDataConnect` provider to provide an instance of `DataConnect` which uses the emulator:
export const appConfig: ApplicationConfig = {
  providers: [
    ... // other providers
    // Firebase Data Connect providers
    ...
    provideDataConnect(() => {
      const dataConnect = getDataConnect(connectorConfig);
      connectDataConnectEmulator(dataConnect, 'localhost', 9399);
      return dataConnect;
    }),
  ],
};
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the injectors provided from your generated Angular SDK.

# Queries

The Angular generated SDK provides Query injectors that call [`injectDataConnectQuery`](https://react-query-firebase.invertase.dev/angular/data-connect/querying) from TanStack Query Firebase.

Calling these injectors will return a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these injectors and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/angular/data-connect/querying).

TanStack Angular Query caches the results of your Queries, so using the same Query injector in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query injectors execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/disabling-queries).

To learn more about TanStack Angular Query's Queries, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/queries).

## Using Query Injectors
Here's a general overview of how to use the generated Query injectors in your code:

- If the Query has no variables, the Query injector does not require arguments.
- If the Query has any required variables, the Query injector will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query injector does not require any arguments.
- The Angular generated SDK's Query injectors do not accept `DataConnect` instances as arguments.
- Query injector functions can be called with or without passing in an `options` argument, whose type is a function which returns an object. The type is generated alongside the operation's injector function in [dataconnect-generated/angular/index.d.ts](./index.d.ts). To learn more about the `options` argument, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query injector without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query injectors to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetPet
You can execute the `GetPet` Query using the following Query injector, which is defined in [dataconnect-generated/angular/index.d.ts](./index.d.ts):

```javascript
injectGetPet(args: GetPetArgs, options?: GetPetOptions, injector?: Injector): CreateDataConnectQueryResult<GetPetData, GetPetVariables>;
```

### Variables
The `GetPet` Query requires an argument of type `GetPetVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetPetVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetPet` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `GetPet` Query is of type `GetPetData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetPetData {
  pet?: {
    name: string;
    species: string;
    breed: string;
    dateOfBirth: DateString;
  };
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `GetPet`'s Query injector

```javascript
... // other imports
import { connectorConfig, GetPetVariables } from '@dataconnect/generated';
import { injectGetPet, GetPetOptions } from '@dataconnect/generated/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `GetPet` Query requires an argument of type `GetPetVariables`:
  getPetVars: GetPetVariables = {
    id: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectGetPet(this.getPetVars);
  // Variables can be defined inline as well.
  query = injectGetPet({ id: ..., });

  // You can also pass in an options function (not object) of type `GetPetOptions` to the Query injector function.
  options: GetPetOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectGetPet(this.getPetVars, this.options);
}
```

## ListPetsBySpecies
You can execute the `ListPetsBySpecies` Query using the following Query injector, which is defined in [dataconnect-generated/angular/index.d.ts](./index.d.ts):

```javascript
injectListPetsBySpecies(args: ListPetsBySpeciesArgs, options?: ListPetsBySpeciesOptions, injector?: Injector): CreateDataConnectQueryResult<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
```

### Variables
The `ListPetsBySpecies` Query requires an argument of type `ListPetsBySpeciesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListPetsBySpeciesVariables {
  species: string;
}
```
### Return Type
Recall that calling the `ListPetsBySpecies` Query injector returns a `CreateDataConnectQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `CreateDataConnectQueryResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectQueryResult.isPending()`, `CreateDataConnectQueryResult.isSuccess()`, and `CreateDataConnectQueryResult.isError()` functions.

To access the data returned by a Query, use the `CreateDataConnectQueryResult.data()` function. The data for the `ListPetsBySpecies` Query is of type `ListPetsBySpeciesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListPetsBySpeciesData {
  pets: ({
    id: UUIDString;
    name: string;
    breed: string;
  } & Pet_Key)[];
}
```

To learn more about the `CreateDataConnectQueryResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectQuery) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectquery).

### Using `ListPetsBySpecies`'s Query injector

```javascript
... // other imports
import { connectorConfig, ListPetsBySpeciesVariables } from '@dataconnect/generated';
import { injectListPetsBySpecies, ListPetsBySpeciesOptions } from '@dataconnect/generated/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Query. -->
    @if (query.isPending()) {
      Loading...
    }
    @if (query.error()) {
      An error has occurred: {{ query.error() }}
    }
    <!-- If the Query is successful, you can access the data returned using
      the CreateDataConnectQueryResult.data() function. -->
    @if (query.data(); as data) {
      <!-- use your data to display something -->
            <div>Query successful!</div>
    }
  `,
})
export class MyComponent {
  // The `ListPetsBySpecies` Query requires an argument of type `ListPetsBySpeciesVariables`:
  listPetsBySpeciesVars: ListPetsBySpeciesVariables = {
    species: ..., 
  };

  // Since the execution of the query is eager, you don't have to call `execute` to "execute" the Query.
  // Call the Query injector function to get a `CreateDataConnectQueryResult` object which holds the state of your Query.
  query = injectListPetsBySpecies(this.listPetsBySpeciesVars);
  // Variables can be defined inline as well.
  query = injectListPetsBySpecies({ species: ..., });

  // You can also pass in an options function (not object) of type `ListPetsBySpeciesOptions` to the Query injector function.
  options: ListPetsBySpeciesOptions = () => {
    return {
      staleTime: 5 * 1000
    };
  };
  query = injectListPetsBySpecies(this.listPetsBySpeciesVars, this.options);
}
```

# Mutations

The Angular generated SDK provides Mutations injectors that call [`injectDataConnectMutation`](https://react-query-firebase.invertase.dev/angular/data-connect/mutations) from TanStack Query Firebase.

Calling these injectors will return a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these injectors and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/angular/data-connect/mutations).

Mutation injectors do not execute their Mutations automatically when called. Rather, after calling the Mutation injector and getting a `CreateDataConnectMutationResult` object, you must call the `CreateDataConnectMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack Angular Query's Mutations, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/mutations).

## Using Mutation Injectors
Here's a general overview of how to use the generated Mutation injectors in your code:

- Mutation injectors are not called with the arguments to the Mutation. Instead, arguments are passed to `CreateDataConnectMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation injector does not require any arguments.
- The Angular generated SDK's Mutation injectors do not accept `DataConnect` instances as arguments.
- Mutation injector functions can be called with or without passing in an `options` argument, whose type is a function which returns an object. The type is generated alongside the operation's injector function in [dataconnect-generated/angular/index.d.ts](./index.d.ts). The type is generated alongside the operation's injector function. To learn more about the `options` argument, see the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/guides/mutations#mutation-side-effects).
  - `CreateDataConnectMutationResult.mutate()` also accepts an `options` argument. It's type is not a function which returns an object, but the object itself.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `CreateDataConnectMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation injectors to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateUser
You can execute the `CreateUser` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [dataconnect-generated/angular/index.d.ts](./index.d.ts)):
```javascript
injectCreateUser(options?: CreateUserOptions, injector?: Injector): CreateDataConnectMutationResult<CreateUserData, CreateUserVariables, CreateUserVariables>;
```

### Variables
The `CreateUser` Mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateUserVariables {
  displayName: string;
  email?: string | null;
  photoUrl?: string | null;
}
```
### Return Type
Recall that calling the `CreateUser` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `CreateUser` Mutation is of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUserData {
  user_insert: User_Key;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `CreateUser`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, CreateUserVariables } from '@dataconnect/generated';
import { injectCreateUser, CreateUserOptions } from '@dataconnect/generated/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectCreateUser();

  // You can also pass in a `CreateUserOptions` function (not object) to the Mutation injector function.
  options: CreateUserOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectCreateUser(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `CreateUser` Mutation requires an argument of type `CreateUserVariables`:
    const createUserVars: CreateUserVariables = {
      displayName: ..., 
      email: ..., // optional
      photoUrl: ..., // optional
    };
    this.mutation.mutate(createUserVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ displayName: ..., email: ..., photoUrl: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(createUserVars);

    // You can also pass in a `CreateUserOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(createUserVars, this.options());
  }
}
```

## UpdateVaccinationNotes
You can execute the `UpdateVaccinationNotes` Mutation using the `CreateDataConnectMutationResult` object returned by the following Mutation injector (which is defined in [dataconnect-generated/angular/index.d.ts](./index.d.ts)):
```javascript
injectUpdateVaccinationNotes(options?: UpdateVaccinationNotesOptions, injector?: Injector): CreateDataConnectMutationResult<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables, UpdateVaccinationNotesVariables>;
```

### Variables
The `UpdateVaccinationNotes` Mutation requires an argument of type `UpdateVaccinationNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateVaccinationNotesVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that calling the `UpdateVaccinationNotes` Mutation injector returns a `CreateDataConnectMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `CreateDataConnectMutationResult.status()` function. You can also check for pending / success / error status using the `CreateDataConnectMutationResult.isPending()`, `CreateDataConnectMutationResult.isSuccess()`, and `CreateDataConnectMutationResult.isError()` functions.

To execute the Mutation, call `CreateDataConnectMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation. 

To access the data returned by a Mutation, use the `CreateDataConnectMutationResult.data()` function. The data for the `UpdateVaccinationNotes` Mutation is of type `UpdateVaccinationNotesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateVaccinationNotesData {
  vaccination_update?: Vaccination_Key | null;
}
```

You can also call `CreateDataConnectMutationResult.mutateAsync()`, which executes the Mutation and returns a promise with the data returned from the Mutation. To learn more, see the [TanStack Angular Query documentation](https://tanstack.com/query/latest/docs/framework/angular/guides/mutations#promises).

To learn more about the `CreateDataConnectMutationResult` object, see the [TanStack Query Firebase documentation](https://docs.page/invertase/tanstack-query-firebase/angular/data-connect/functions/injectDataConnectMutation) and the [TanStack Angular Query documentation](https://tanstack.com/query/v5/docs/framework/angular/reference/functions/injectmutation).

### Using `UpdateVaccinationNotes`'s Mutation injector

```javascript
... // other imports
import { connectorConfig, UpdateVaccinationNotesVariables } from '@dataconnect/generated';
import { injectUpdateVaccinationNotes, UpdateVaccinationNotesOptions } from '@dataconnect/generated/angular'
import { DataConnect } from '@angular/fire/data-connect';
import { initializeApp } from '@angular/fire/app';

@Component({
  ... // other component fields
  template: `
    <!-- You can render your component dynamically based on the status of the Mutation. -->
    @if (mutation.isPending()) {
      Loading...
    }
    @if (mutation.error()) {
      An error has occurred: {{ mutation.error() }}
    }
    <!-- If the Mutation is successful, you can access the data returned using
      the CreateDataConnectMutationResult.data() function. -->
    @if (mutation.data(); as data) {
      <!-- Use your data to display something -->
      <div>Mutation successful!</div>
    }
    <!-- Let's create a button that executes our mutation when clicked. -->
    <button
      (disabled)="mutation.isPending()"
      (click)="executeMutation()"
    >
      {{ mutation.isPending() ? 'Pending...' : 'Mutate!' }}
    </button>
  `,
})
export class MyComponent {
  // Call the Mutation injector function to get a `CreateDataConnectMutationResult` object which holds the state of your Mutation.
  mutation = injectUpdateVaccinationNotes();

  // You can also pass in a `UpdateVaccinationNotesOptions` function (not object) to the Mutation injector function.
  options: UpdateVaccinationNotesOptions = () => {
    return {
      onSuccess: () => { console.log('Mutation succeeded!'); }
    };
  };
  mutation = injectUpdateVaccinationNotes(this.options);

  // After calling the Mutation injector function, you must call `CreateDataConnectMutationResult.mutate()` to execute the Mutation.
  executeMutation() {
    // The `UpdateVaccinationNotes` Mutation requires an argument of type `UpdateVaccinationNotesVariables`:
    const updateVaccinationNotesVars: UpdateVaccinationNotesVariables = {
      id: ..., 
      notes: ..., // optional
    };
    this.mutation.mutate(updateVaccinationNotesVars);
    // Variables can be defined inline as well.
    this.mutation.mutate({ id: ..., notes: ..., });

    // You can call `CreateDataConnectMutationResult.mutateAsync()` to execute the Mutation and return a promise with the data returned from the Mutation.
    this.mutation.mutateAsync(updateVaccinationNotesVars);

    // You can also pass in a `UpdateVaccinationNotesOptions` object (not function) to `CreateDataConnectMutationResult.mutate()`.
    this.mutation.mutate(updateVaccinationNotesVars, this.options());
  }
}
```

