Picture a signup form that checks, on every keystroke, whether a username is already taken. Hitting the database each time is slow and expensive. What if a tiny in-memory structure could answer "this name is **definitely free**" for most inputs, and only send the unsure ones to the database?

That is exactly the job of a **Bloom filter**.

## What is a Bloom filter?

A Bloom filter (invented by Burton H. Bloom in 1970) is a **probabilistic set**. You can add items to it and ask "have I seen this item?". It only ever gives one of two answers:

- **"Definitely not in the set"**: always correct.
- **"Probably in the set"**: usually correct, but sometimes a false alarm.

So it can produce **false positives**, but never **false negatives**. In return, it uses a tiny amount of memory and every operation takes constant time.

## How it works

You need two things: a **bit array** of `m` bits (all zero at the start) and `k` **hash functions**, each turning an item into a position between `0` and `m - 1`.

- **Add:** hash the item `k` times and set those `k` bits to `1`.
- **Check:** hash the item `k` times. If **any** of those bits is `0`, it is definitely not in the set. If **all** are `1`, it is probably in the set.

A small walkthrough with `m = 10` and `k = 3` (the hash positions are made up for illustration):

```
index:        0 1 2 3 4 5 6 7 8 9
start:        0 0 0 0 0 0 0 0 0 0

add "cat"  -> 1, 4, 7
              0 1 0 0 1 0 0 1 0 0

add "dog"  -> 2, 4, 9
              0 1 1 0 1 0 0 1 0 1

check "cow" -> 3, 4, 8   bit 3 is 0      => definitely NOT in the set
check "eel" -> 1, 2, 9   all bits are 1  => "probably in the set"
```

"eel" was never added, yet all its bits were switched on by other items. That is a false positive. And it can never go the other way: once an item is added, its bits stay `1`, so a later check can never find a `0` there.

## Choosing the size

More bits and well-chosen `k` mean fewer false alarms. For `n` items and a target false-positive rate `p`:

```
m = -(n * ln p) / (ln 2)^2        # number of bits
k = (m / n) * ln 2                # number of hash functions
p ≈ (1 - e^(-k*n/m))^k            # actual error rate
```

You do not need to memorise this. Here is the practical result:

| Target false-positive rate | Bits per item | Hash functions |
| --- | --- | --- |
| 10% | about 4.8 | 3 |
| 1% | about 9.6 | 7 |
| 0.1% | about 14.4 | 10 |

At a 1% error rate, **one million items need only about 1.2 MB**. Storing a million 20-byte strings in a hash set would take around 20 MB, before counting the overhead.

## A tiny Python implementation

```python
import hashlib, math

class BloomFilter:
    def __init__(self, n_items, fp_rate=0.01):
        self.m = math.ceil(-n_items * math.log(fp_rate) / (math.log(2) ** 2))
        self.k = max(1, round(self.m / n_items * math.log(2)))
        self.bits = bytearray((self.m + 7) // 8)

    def _positions(self, item):
        data = str(item).encode()
        h1 = int(hashlib.sha256(data).hexdigest(), 16)
        h2 = int(hashlib.md5(data).hexdigest(), 16)
        # double hashing: k positions from just two hashes
        return [(h1 + i * h2) % self.m for i in range(self.k)]

    def add(self, item):
        for pos in self._positions(item):
            self.bits[pos // 8] |= 1 << (pos % 8)

    def __contains__(self, item):
        return all(self.bits[pos // 8] & (1 << (pos % 8))
                   for pos in self._positions(item))

bf = BloomFilter(n_items=1000, fp_rate=0.01)
bf.add("amit")
print("amit" in bf)       # True
print("sathvara" in bf)   # False (almost certainly)
```

Instead of `k` separate hash functions, the code derives all positions from two hashes. This trick, called double hashing, works well in practice.

## Where it is used

- **Databases built on LSM trees** (such as Cassandra, HBase and RocksDB) keep a filter for each data file. A read first asks the filter, and skips the file entirely if the answer is "definitely not here". That saves a lot of disk reads.
- **Caches and CDNs** can use a filter to cache an object only on its second request, so one-time requests do not fill the cache.
- **Web crawlers** use one to remember which URLs were already visited without storing every URL.
- **Blocklist checks**, like unsafe-URL lists, can run locally first and only call a slower service when the filter says "maybe".

## Limitations

- **No deletes.** A bit may be shared by several items, so you cannot switch it off. *Counting Bloom filters* and *cuckoo filters* exist for this case.
- **No listing.** It can say "maybe present", but it cannot give you the items back.
- **Size is fixed up front.** Adding far more items than planned pushes the error rate up quickly.
- **Needs good hashes.** Poorly distributed hashes cause more false positives.

## Key takeaways

- "No" is always right, "yes" means "probably".
- Use it when most lookups are misses and a false alarm costs only one extra check.
- About 10 bits per item buys you roughly a 1% error rate.

## Further reading

For another walkthrough with more real-world examples, see [What are Bloom Filters and Where are they Used?](https://blog.algomaster.io/p/bloom-filters) on the AlgoMaster newsletter.
