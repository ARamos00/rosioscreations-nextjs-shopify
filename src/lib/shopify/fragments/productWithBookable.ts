import { productFragment } from "./product";

export const productWithBookableFragment = /* GraphQL */ `
  fragment productWithBookable on Product {
    ...product
    bookableMetafield: metafield(namespace: "custom", key: "bookable") {
      id
      key
      value
      type
      createdAt
      updatedAt
    }
    eventOrServiceChoice: metafield(namespace: "custom", key: "eventorservice") {
      id
      key
      value
      type
      createdAt
      updatedAt
    }
  }
  ${productFragment}
`;
