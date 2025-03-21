# Deep Merge Utility

A TypeScript utility for deeply merging objects and arrays with robust handling of complex nested structures.

## Installation

```bash
npm install
```

## Usage

```typescript
import { deepMerge } from './merge'

// Merge objects
const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 })
// Result: { a: 1, b: 3, c: 4 }

// Merge nested objects
const nestedResult = deepMerge({ a: 1, nested: { x: 1, y: 2 } }, { b: 2, nested: { y: 3, z: 4 } })
// Result: { a: 1, b: 2, nested: { x: 1, y: 3, z: 4 } }

// Merge arrays
const arrayResult = deepMerge({ arr: [1, 2, 3] }, { arr: [4, 5] })
// Result: { arr: [4, 5, 3] }

// Merge top-level arrays
const topLevelArrays = deepMerge([1, 2, { x: 1 }], [3, { y: 2 }])
// Result: [3, { y: 2 }, { x: 1 }]
```

## What Works

### Primitive Value Merging

```typescript
// Primitive values from source override target
deepMerge({ value: 1 }, { value: 2 })
// Result: { value: 2 }

// Booleans, strings, numbers all work
deepMerge({ bool: false, str: 'Hello', num: 123 }, { bool: true, str: 'World', num: 456 })
// Result: { bool: true, str: 'World', num: 456 }
```

### Deep Object Merging

```typescript
// Deeply nested objects are properly merged
deepMerge(
  { user: { profile: { name: 'John', age: 30 }, settings: { theme: 'dark' } } },
  { user: { profile: { age: 31, location: 'NY' }, notifications: true } }
)
/* Result: 
{
  user: {
    profile: { 
      name: 'John',
      age: 31,
      location: 'NY'
    },
    settings: { theme: 'dark' },
    notifications: true
  }
}
*/
```

### Array Element Merging

```typescript
// Arrays with objects merge correctly
deepMerge(
  {
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ],
  },
  { users: [{ id: 1, age: 30 }] }
)
/* Result:
{
  users: [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane' }
  ]
}
*/
```

### Mixed Type Handling

```typescript
// Converting between types works as expected
deepMerge({ value: 'string' }, { value: 123 })
// Result: { value: 123 }

deepMerge({ value: { nested: true } }, { value: 'primitive' })
// Result: { value: 'primitive' }
```

## What Doesn't Work

### Object References

```typescript
// Object references are not fully broken
const sharedObj = { value: 1 }
const target = { obj: sharedObj }
const source = { other: true }

const result = deepMerge(target, source)
// Now modify the original object
sharedObj.value = 999

// The merged result is affected by the change
console.log(result.obj.value) // 999, not 1
```

### Circular References

```typescript
// Circular references will cause a stack overflow
const circular = { name: 'circular' }
circular.self = circular

// This will cause a stack overflow error
try {
  deepMerge({ a: 1 }, { b: circular })
} catch (error) {
  console.error('Stack overflow occurred')
}
```

### Class Instances

```typescript
// Class methods and prototypes are not preserved
class User {
  name: string
  constructor(name: string) {
    this.name = name
  }

  greet() {
    return `Hello, ${this.name}!`
  }
}

const target = { user: new User('John') }
const source = { otherInfo: true }

const result = deepMerge(target, source)
// The result.user is now a plain object without the greet method
try {
  result.user.greet() // TypeError: result.user.greet is not a function
} catch (error) {
  console.error('Class methods are lost during merge')
}
```

### Special Objects

```typescript
// Special objects like Date, Map, Set are not handled properly
const target = { date: new Date('2023-01-01'), values: new Set([1, 2, 3]) }
const source = { other: true }

const result = deepMerge(target, source)
// result.date is now a plain object, not a Date instance
console.log(result.date instanceof Date) // false
// result.values is now a plain object, not a Set instance
console.log(result.values instanceof Set) // false
```

## Behavior

The `deepMerge` function has the following behaviors:

### Objects

- Properties from the source object override properties in the target object with the same key
- Properties unique to either object are preserved in the result
- Nested objects are recursively merged (not replaced)

### Arrays

- Arrays are merged by position (index-by-index)
- Source array elements replace target array elements at the same index
- If the target array is longer, elements beyond the source array length are preserved
- If the source array is longer, all its elements are included
- Objects within arrays at the same index position are recursively merged

### Special Cases

- Primitive values in the source object always override values in the target
- Null and undefined values in the source override values in the target
- Empty objects and arrays from the source will replace corresponding properties in the target

### Limitations

- References to objects are not fully broken - modifications to original nested objects after merging may affect the merged result
- Does not handle circular references
- Does not merge class instances (only plain objects)
- Special objects like Date, Map, Set lose their methods/prototype

## Testing

Run the test suite to verify all behaviors:

```bash
npm test
```

The tests cover:

- Basic object merging
- Deep nested object merging
- Array merging behavior
- Mixed value types
- Null/undefined handling
- Reference behavior
- Arrays of different lengths
- Empty objects and arrays
