export const arrayToMap = <Entity extends {}, Key extends keyof Entity>(entities: Entity[], key: Key) => {
  const map = new Map<Entity[Key], Entity>()
  entities.forEach(entity => map.set(entity[key], entity))

  return map
}