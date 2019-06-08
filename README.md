# parse-querystring-dotkey

## Installation

```bash
fibjs --install parse-querystring-dotkey
```

## Usage

```javascript
const parseQS = require('parse-querystring-dotkey')

parseQS('limit=1&offset=7&&where.user_id=2&where.session_id=9')
/**
 * 
 * {
 *  "limit": "1",
 *  "offset": "7",
 *  "where": {
 *      "user_id": "2",
 *      "session_id": "9"
 *  },
 * }
 */
```