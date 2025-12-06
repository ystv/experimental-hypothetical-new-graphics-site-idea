import { GraphicsCollections } from "./collections/_index";

export type TGraphicsCollectionPath = {
  name: string;
};

export type TGraphicsCollection = {
  slug: string;
  name: string;
  description: string;
  components: GraphicsCollectionComponent[];
  data: {
    multi_texts?: Record<string, TGraphicsCollectionPath>;
    timers?: Record<string, TGraphicsCollectionPath>;
    visible_states?: Record<string, TGraphicsCollectionPath>;
    societies?: Record<string, TGraphicsCollectionPath>;
  };
};

export type GraphicsCollectionComponentProps = {
  graphics_collection_id: string;
};

export type GraphicsCollectionComponent = (
  props: GraphicsCollectionComponentProps,
) => JSX.Element;

export { GraphicsCollections };

export function getGraphicsCollections() {
  const keys = Object.keys(GraphicsCollections);

  return keys.map((k) => {
    return {
      key: k,
      value: GraphicsCollections[k as keyof typeof GraphicsCollections],
    };
  });
}

export function flattenRecord<InRecord extends Record<string, unknown>>(
  record?: InRecord,
): { key: keyof InRecord; value: InRecord[keyof InRecord] }[] {
  if (!record) return [];
  return Object.entries(record).map(([k, v]) => {
    return { key: k as keyof InRecord, value: v as InRecord[keyof InRecord] };
  });
}

export interface TGraphicsCollectionMappedPath extends TGraphicsCollectionPath {
  mapped_path: string;
}

export function getMappedPath(
  mapping: {
    multi_texts?: Record<string, TGraphicsCollectionMappedPath>;
    timers?: Record<string, TGraphicsCollectionMappedPath>;
    visible_states?: Record<string, TGraphicsCollectionMappedPath>;
    societies?: Record<string, TGraphicsCollectionMappedPath>;
  },
  mappingType: "multi_texts" | "timers" | "visible_states" | "societies",
  originalPath: string,
) {
  if (!new Object(mapping).hasOwnProperty(mappingType)) {
    throw new Error("No such mapping");
  }

  const found = new Object(mapping[mappingType]).hasOwnProperty(originalPath);

  if (!found) {
    throw new Error("No such mapping");
  }

  const mappedPath = mapping[mappingType]![originalPath]!.mapped_path;

  return mappedPath;
}
