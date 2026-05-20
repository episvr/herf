# Code Highlighting Demo

Shell Blog supports syntax highlighting for many languages.

## TypeScript

```typescript
interface Post {
  id: string
  title: string
  content: string
}

async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) throw new Error(`Post ${id} not found`)
  return res.json()
}
```

## Python

```python
def fibonacci(n: int) -> list[int]:
    """Generate first n Fibonacci numbers."""
    a, b = 0, 1
    result = []
    for _ in range(n):
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(10))
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Rust

```rust
fn main() {
    let primes: Vec<u32> = (2..100)
        .filter(|&n| {
            (2..=(n as f64).sqrt() as u32)
                .all(|d| n % d != 0)
        })
        .collect();

    println!("Primes under 100: {:?}", primes);
}
```

## SQL

```sql
SELECT category, COUNT(*) as post_count
FROM posts
WHERE date >= '2026-01-01'
GROUP BY category
HAVING COUNT(*) > 1
ORDER BY post_count DESC;
```

## Shell

```bash
# Find all markdown files with "TODO"
grep -rl "TODO" ./posts/ --include="*.md" | while read f; do
  echo "=== $f ==="
  grep -n "TODO" "$f"
done
```
