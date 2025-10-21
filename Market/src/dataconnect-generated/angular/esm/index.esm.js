export const ListPetOwnersDocument = `query ListPetOwners {
  petOwners {
    id
    fullName
    email
  }
}`;
export const CreatePetOwnerDocument = `mutation CreatePetOwner($owner: PetOwnerInput!) {
  addPetOwner(owner: $owner) {
    id
    fullName
    email
  }
}`;
