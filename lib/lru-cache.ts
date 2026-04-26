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
interface LRUNode {
    key: string;
    value: RequestEntry;
    prev: LRUNode | null;
    next: LRUNode | null;

}
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
class LRUCache{
    private capacity: number;
    private cache: Map<string, LRUNode>;
    private head: LRUNode;
    private tail: LRUNode;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map<string, LRUNode>();
        this.head = { key: '', value: {} as RequestEntry, prev: null, next: null };
        this.tail = { key: '', value: {} as RequestEntry, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    private removeNode(node: LRUNode): void {
        if(!node.prev || !node.next) return;
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private insertAtFront(node: LRUNode): void {
        const oldFirst = this.head.next!;  // capture BEFORE we change head.next
        node.prev = this.head;
        node.next = oldFirst;
        this.head.next = node;
        oldFirst.prev = node;
    }

    get(key: string) : RequestEntry | null {
        const node = this.cache.get(key);
        if(!node) return null;
        this.removeNode(node);
        this.insertAtFront(node);
        return node.value;
    }

    put(key: string, value: RequestEntry): void {
        const existingNode = this.cache.get(key);
        if(existingNode) {
            existingNode.value = value;
            this.removeNode(existingNode);
            this.insertAtFront(existingNode);
            return;
        }
        const newNode: LRUNode = { key, value, prev: null, next: null };
        this.cache.set(key, newNode);
        this.insertAtFront(newNode);
        if(this.cache.size > this.capacity) {
            const lruNode = this.tail.prev;
            if(lruNode) {
                this.removeNode(lruNode);
                this.cache.delete(lruNode.key);
            }
        }
    }

    values(): RequestEntry[] {
        const result: RequestEntry[] = [];
        let current = this.head.next;
        while(current && current !== this.tail) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }

    
}

export const requestCache = new LRUCache(100);


// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS
// ─────────────────────────────────────────────────────────────────────────────
//
// Every time a network request is captured, we need somewhere to STORE it so
// the UI can display it. A plain array would work, but it has problems:
//   - It grows forever (memory leak if the user stays on the page for hours)
//   - No O(1) lookup by request ID when you want to update an entry
//
// An LRU Cache solves both:
//   - It automatically evicts the oldest entries once it's full (capacity = 100)
//   - O(1) lookup by key (the HashMap part)
//   - O(1) eviction of the least-recently-used entry (the Doubly-Linked List part)
//
// WHY NOT JUST USE AN ARRAY + SLICE?
//   Array.slice() to cap size = O(n) every insertion.
//   LRU eviction = O(1). For a tool that may capture hundreds of requests,
//   this matters.
//
// THE REAL-WORLD CONNECTION:
//   The browser's own HTTP cache IS an LRU cache with a TTL overlay.
//   When Chrome's disk cache is full, it evicts the least-recently-used
//   resources — the exact same algorithm you're implementing here.
//   This file makes that concept tangible and concrete.
//
// LEETCODE CONNECTION:
//   This is LeetCode #146 — one of the most commonly asked DSA problems in
//   technical interviews. Building it in a real project (vs. on a whiteboard)
//   cements the pattern far better than solving it in isolation.
// ─────────────────────────────────────────────────────────────────────────────
