import { invoke, getName } from './invoke'

export function maintain (data = {
  db: 'rc',
  app: 'maintain'
}) {
  const name = getName()
  return invoke(data, name)
}
