export type DomainPrimitive<TName extends string> = {
  readonly kind: TName;
  readonly value: string;
};
