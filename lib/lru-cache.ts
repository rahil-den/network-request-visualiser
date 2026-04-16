// ─────────────────────────────────────────────────────────────────────────────
// lib/lru-cache.ts
// LRU Cache — the same algorithm as LeetCode #146.
//
// 🧠 CONCEPT: LRU Cache (Least Recently Used)
//   The browser's HTTP cache is literally an LRU cache with a TTL overlay.
//   When it's full, the least-recently-used entry gets evicted.
//
//   We use this to store the last N captured requests in memory.
//   Structure: HashMap (for O(1) lookup) + Doubly-Linked List (for O(1) eviction)
//
//   HashMap alone = fast lookup but slow eviction (O(n) to find LRU)
//   DLL alone     = fast eviction but slow lookup (O(n) to find by key)
//   Combined      = both O(1) ← this is the trick!
// ─────────────────────────────────────────────────────────────────────────────

import type { RequestEntry } from './types';

// TODO 1: Define a type (or interface) called `LRUNode`.
//         This represents one node in the doubly-linked list.
//         Fields:
//           key   → string
//           value → RequestEntry
//           prev  → LRUNode | null   (pointer to previous node)
//           next  → LRUNode | null   (pointer to next node)

// TODO 2: Create a class called `LRUCache`.
//         It should have these private fields:
//           capacity → number           (max number of entries to store)
//           cache    → Map<string, LRUNode>  (HashMap for O(1) lookup by key)
//           head     → LRUNode          (dummy head node — always present, never holds real data)
//           tail     → LRUNode          (dummy tail node — always present, never holds real data)
//
//         💡 Dummy head & tail nodes simplify the code — you never have to
//            check "is this the first/last real node?".
//            The list always looks like: head ↔ [real nodes] ↔ tail

// TODO 3: Add a constructor(capacity: number).
//         - Store the capacity
//         - Initialise the Map
//         - Create dummy head and tail nodes (key='', value can be a type assertion)
//         - Link them: head.next = tail, tail.prev = head

// TODO 4: Add a private helper `removeNode(node: LRUNode): void`
//         Unlinks a node from the doubly-linked list.
//         💡 You need to update 4 pointers: the prev and next of its neighbours.

// TODO 5: Add a private helper `insertAtFront(node: LRUNode): void`
//         Inserts a node right after the dummy head (= most recently used position).
//         💡 Again 4 pointers to update.

// TODO 6: Add a `get(key: string): RequestEntry | null` method.
//         - If the key doesn't exist in the Map, return null
//         - If it does exist:
//             a. Remove the node from its current list position
//             b. Re-insert it at the front (marks it as most recently used)
//             c. Return node.value

// TODO 7: Add a `put(key: string, value: RequestEntry): void` method.
//         - If the key already exists, update its value and move to front
//         - If it's new:
//             a. Create a new LRUNode
//             b. Add it to the Map
//             c. Insert it at the front
//             d. If cache.size > capacity, evict the node just before tail
//                (that's the least-recently-used one) and delete it from the Map

// TODO 8: Add a `values(): RequestEntry[]` method.
//         Returns all cached entries in order from most-recent to least-recent.
//         💡 Walk the list from head.next to tail, collecting node.value

// TODO 9: Export a singleton: `export const requestCache = new LRUCache(100);`
//         100 = store the last 100 requests.
