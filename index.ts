import { deepMerge } from './merge'

const a = {
  a: 1,
  b: 2,
  arr: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ],
  bool: true,
  str: 'Hello World',
}

const b = {
  b: 3,
  c: 4,
  arr: [
    { id: 5, name: 'John' },
    { id: 6, name: 'Jane' },
  ],
  d: {
    e: 5,
    arr: [
      { id: 3, name: 'Bob' },
      { id: 4, name: 'Alice' },
    ],
    bool: false,
    str: 'Goodbye World',
  },
}

const c = deepMerge(a, b)

console.log(JSON.stringify(c, null, 2))
