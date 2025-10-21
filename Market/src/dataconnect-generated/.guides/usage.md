# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.


### Angular

The generated SDK creates injectable wrapper functions.

Here's an example:
```
import { injectCreateUser, injectGetPet, injectUpdateVaccinationNotes, injectListPetsBySpecies } from '@dataconnect/generated/angular';

@Component({
  selector: 'my-component',
  ...
})
class MyComponent {
  // The types of these injectors are available in angular/index.d.ts
  private readonly CreateUserOperation = injectCreateUser(createUserVars);
  private readonly GetPetOperation = injectGetPet(getPetVars);
  private readonly UpdateVaccinationNotesOperation = injectUpdateVaccinationNotes(updateVaccinationNotesVars);
  private readonly ListPetsBySpeciesOperation = injectListPetsBySpecies(listPetsBySpeciesVars);
  }
```

Each operation is a wrapper function around Tanstack Query Angular.

Here's an example:
```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'simple-example',
  template: `
    @if (movies.isPending()) {
      Loading...
    }
    @if (movies.error()) {
      An error has occurred: {{ movies.error().message }}
    }
    @if (movies.data(); as data) {
      @for (movie of data.movies ; track
        movie.id) {
      <h1>{{ movie.title }}</h1>
      <p>{{ movie.synopsis }}</p>
      }
    }
  `
})
export class SimpleExampleComponent {
  http = inject(HttpClient)

  movies = injectListMovies();
}
```




## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, getPet, updateVaccinationNotes, listPetsBySpecies } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation GetPet:  For variables, look at type GetPetVars in ../index.d.ts
const { data } = await GetPet(dataConnect, getPetVars);

// Operation UpdateVaccinationNotes:  For variables, look at type UpdateVaccinationNotesVars in ../index.d.ts
const { data } = await UpdateVaccinationNotes(dataConnect, updateVaccinationNotesVars);

// Operation ListPetsBySpecies:  For variables, look at type ListPetsBySpeciesVars in ../index.d.ts
const { data } = await ListPetsBySpecies(dataConnect, listPetsBySpeciesVars);


```