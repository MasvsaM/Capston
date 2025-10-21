# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `Angular README`, you can find it at [`dataconnect-generated/angular/README.md`](./angular/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPet*](#getpet)
  - [*ListPetsBySpecies*](#listpetsbyspecies)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateVaccinationNotes*](#updatevaccinationnotes)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPet
You can execute the `GetPet` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPet(vars: GetPetVariables): QueryPromise<GetPetData, GetPetVariables>;

interface GetPetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPetVariables): QueryRef<GetPetData, GetPetVariables>;
}
export const getPetRef: GetPetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPet(dc: DataConnect, vars: GetPetVariables): QueryPromise<GetPetData, GetPetVariables>;

interface GetPetRef {
  ...
  (dc: DataConnect, vars: GetPetVariables): QueryRef<GetPetData, GetPetVariables>;
}
export const getPetRef: GetPetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPetRef:
```typescript
const name = getPetRef.operationName;
console.log(name);
```

### Variables
The `GetPet` query requires an argument of type `GetPetVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPetVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPet` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPetData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPetData {
  pet?: {
    name: string;
    species: string;
    breed: string;
    dateOfBirth: DateString;
  };
}
```
### Using `GetPet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPet, GetPetVariables } from '@dataconnect/generated';

// The `GetPet` query requires an argument of type `GetPetVariables`:
const getPetVars: GetPetVariables = {
  id: ..., 
};

// Call the `getPet()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPet(getPetVars);
// Variables can be defined inline as well.
const { data } = await getPet({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPet(dataConnect, getPetVars);

console.log(data.pet);

// Or, you can use the `Promise` API.
getPet(getPetVars).then((response) => {
  const data = response.data;
  console.log(data.pet);
});
```

### Using `GetPet`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPetRef, GetPetVariables } from '@dataconnect/generated';

// The `GetPet` query requires an argument of type `GetPetVariables`:
const getPetVars: GetPetVariables = {
  id: ..., 
};

// Call the `getPetRef()` function to get a reference to the query.
const ref = getPetRef(getPetVars);
// Variables can be defined inline as well.
const ref = getPetRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPetRef(dataConnect, getPetVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pet);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pet);
});
```

## ListPetsBySpecies
You can execute the `ListPetsBySpecies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPetsBySpecies(vars: ListPetsBySpeciesVariables): QueryPromise<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;

interface ListPetsBySpeciesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPetsBySpeciesVariables): QueryRef<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
}
export const listPetsBySpeciesRef: ListPetsBySpeciesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPetsBySpecies(dc: DataConnect, vars: ListPetsBySpeciesVariables): QueryPromise<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;

interface ListPetsBySpeciesRef {
  ...
  (dc: DataConnect, vars: ListPetsBySpeciesVariables): QueryRef<ListPetsBySpeciesData, ListPetsBySpeciesVariables>;
}
export const listPetsBySpeciesRef: ListPetsBySpeciesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPetsBySpeciesRef:
```typescript
const name = listPetsBySpeciesRef.operationName;
console.log(name);
```

### Variables
The `ListPetsBySpecies` query requires an argument of type `ListPetsBySpeciesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPetsBySpeciesVariables {
  species: string;
}
```
### Return Type
Recall that executing the `ListPetsBySpecies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPetsBySpeciesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPetsBySpeciesData {
  pets: ({
    id: UUIDString;
    name: string;
    breed: string;
  } & Pet_Key)[];
}
```
### Using `ListPetsBySpecies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPetsBySpecies, ListPetsBySpeciesVariables } from '@dataconnect/generated';

// The `ListPetsBySpecies` query requires an argument of type `ListPetsBySpeciesVariables`:
const listPetsBySpeciesVars: ListPetsBySpeciesVariables = {
  species: ..., 
};

// Call the `listPetsBySpecies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPetsBySpecies(listPetsBySpeciesVars);
// Variables can be defined inline as well.
const { data } = await listPetsBySpecies({ species: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPetsBySpecies(dataConnect, listPetsBySpeciesVars);

console.log(data.pets);

// Or, you can use the `Promise` API.
listPetsBySpecies(listPetsBySpeciesVars).then((response) => {
  const data = response.data;
  console.log(data.pets);
});
```

### Using `ListPetsBySpecies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPetsBySpeciesRef, ListPetsBySpeciesVariables } from '@dataconnect/generated';

// The `ListPetsBySpecies` query requires an argument of type `ListPetsBySpeciesVariables`:
const listPetsBySpeciesVars: ListPetsBySpeciesVariables = {
  species: ..., 
};

// Call the `listPetsBySpeciesRef()` function to get a reference to the query.
const ref = listPetsBySpeciesRef(listPetsBySpeciesVars);
// Variables can be defined inline as well.
const ref = listPetsBySpeciesRef({ species: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPetsBySpeciesRef(dataConnect, listPetsBySpeciesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.pets);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.pets);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email?: string | null;
  photoUrl?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., // optional
  photoUrl: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., // optional
  photoUrl: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., photoUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateVaccinationNotes
You can execute the `UpdateVaccinationNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateVaccinationNotes(vars: UpdateVaccinationNotesVariables): MutationPromise<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;

interface UpdateVaccinationNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVaccinationNotesVariables): MutationRef<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;
}
export const updateVaccinationNotesRef: UpdateVaccinationNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVaccinationNotes(dc: DataConnect, vars: UpdateVaccinationNotesVariables): MutationPromise<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;

interface UpdateVaccinationNotesRef {
  ...
  (dc: DataConnect, vars: UpdateVaccinationNotesVariables): MutationRef<UpdateVaccinationNotesData, UpdateVaccinationNotesVariables>;
}
export const updateVaccinationNotesRef: UpdateVaccinationNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVaccinationNotesRef:
```typescript
const name = updateVaccinationNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateVaccinationNotes` mutation requires an argument of type `UpdateVaccinationNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVaccinationNotesVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateVaccinationNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVaccinationNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVaccinationNotesData {
  vaccination_update?: Vaccination_Key | null;
}
```
### Using `UpdateVaccinationNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVaccinationNotes, UpdateVaccinationNotesVariables } from '@dataconnect/generated';

// The `UpdateVaccinationNotes` mutation requires an argument of type `UpdateVaccinationNotesVariables`:
const updateVaccinationNotesVars: UpdateVaccinationNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateVaccinationNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVaccinationNotes(updateVaccinationNotesVars);
// Variables can be defined inline as well.
const { data } = await updateVaccinationNotes({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVaccinationNotes(dataConnect, updateVaccinationNotesVars);

console.log(data.vaccination_update);

// Or, you can use the `Promise` API.
updateVaccinationNotes(updateVaccinationNotesVars).then((response) => {
  const data = response.data;
  console.log(data.vaccination_update);
});
```

### Using `UpdateVaccinationNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVaccinationNotesRef, UpdateVaccinationNotesVariables } from '@dataconnect/generated';

// The `UpdateVaccinationNotes` mutation requires an argument of type `UpdateVaccinationNotesVariables`:
const updateVaccinationNotesVars: UpdateVaccinationNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateVaccinationNotesRef()` function to get a reference to the mutation.
const ref = updateVaccinationNotesRef(updateVaccinationNotesVars);
// Variables can be defined inline as well.
const ref = updateVaccinationNotesRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVaccinationNotesRef(dataConnect, updateVaccinationNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vaccination_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vaccination_update);
});
```

