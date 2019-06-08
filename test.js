const test = require('test')
test.setup()

const querystring = require('querystring')
const http = require('http')

const parseDotQueryKey = require('./')

describe('parseDotQueryKey', () => {
    it('no dot key', () => {
        assert.deepEqual(
            parseDotQueryKey('a=1&b=2'),
            { a: "1", b: "2" }
        )
    })

    describe('where.', () => {
        it('level 2', () => {
            assert.deepEqual(
                parseDotQueryKey('a=1&where.a=2&where.b=4'),
                {
                    a: "1",
                    where: {
                        a: "2",
                        b: "4",
                    }
                }
            )


            assert.deepEqual(
                parseDotQueryKey({
                    a: "1",
                    'where.a': 2,
                    'where.b': 4,
                }),
                {
                    a: "1",
                    where: {
                        a: 2,
                        b: 4,
                    }
                }
            )
        })

        it('level 3', () => {
            assert.deepEqual(
                parseDotQueryKey('a=1&where.a.a=2&where.b.a=4&where.c.c=7'),
                {
                    "a": "1",
                    "where": {
                        "a": {
                            "a": "2"
                        },
                        "b": {
                            "a": "4"
                        },
                        "c": {
                            "c": "7"
                        }
                    }
                }
            )

            assert.deepEqual(
                parseDotQueryKey('a=1&where.a.a=2&where.b.a=4&where.c.c=7,8,9,10'),
                {
                    "a": "1",
                    "where": {
                        "a": {
                            "a": "2"
                        },
                        "b": {
                            "a": "4"
                        },
                        "c": {
                            "c": [
                                "7",
                                "8",
                                "9",
                                "10"
                            ]
                        }
                    }
                }
            )
        })

        it('level 4', () => {
            assert.deepEqual(
                parseDotQueryKey(querystring.parse('a=1&where.a.a=2&where.b.a=4&where.c.c.e=7,8,9,10')),
                {
                    "a": "1",
                    "where": {
                        "a": {
                            "a": "2"
                        },
                        "b": {
                            "a": "4"
                        },
                        "c": {
                            "c": {
                                "e": [
                                    "7",
                                    "8",
                                    "9",
                                    "10"
                                ]
                            }
                        }
                    }
                }
            )
        })

        it('level 4', () => {
            assert.deepEqual(
                parseDotQueryKey(querystring.parse('a=1&where.a.a=2&where.b.a=4&where.c.c.e=7,8,9,10')),
                {
                    "a": "1",
                    "where": {
                        "a": {
                            "a": "2"
                        },
                        "b": {
                            "a": "4"
                        },
                        "c": {
                            "c": {
                                "e": [
                                    "7",
                                    "8",
                                    "9",
                                    "10"
                                ]
                            }
                        }
                    }
                }
            )
        })
    })
    
    it('HttpRequest', () => {
        const request = new http.Request()
        request.queryString = 'limit=1&offset=7&&where.user_id=2&where.session_id=9'

        assert.deepEqual(
            parseDotQueryKey(request.query),
            {
                "limit": "1",
                "offset": "7",
                "where": {
                  "user_id": "2",
                  "session_id": "9"
                }
              }
        )

        const parsed = parseDotQueryKey(request.query)
        request.queryString = querystring.stringify(parsed)
        assert.deepEqual(
            request.queryString,
            'limit=1&offset=7&where=%5Bobject%20Object%5D'
        )

        request.queryString = querystring.stringify({
            limit: 1,
            offset: 7,
            where: JSON.stringify(parsed.where)
        })

        assert.deepEqual(
            request.queryString,
            'limit=1&offset=7&where=%7B%22session_id%22%3A%229%22%2C%22user_id%22%3A%222%22%7D'
        )
    })

    it('level 1 & level 3', () => {
        assert.deepEqual(
            parseDotQueryKey('where=1&where.a=2&where.b.c=4'),
            {
                "where": {
                  "a": "2",
                  "b": {
                    "c": "4"
                  }
                }
            }
        )

        assert.deepEqual(
            parseDotQueryKey('where=1&where.a=2&where.b.c=4'),
            // order of key is sorted
            parseDotQueryKey('where.a=2&where.b.c=4&where=1')
        )
    })

    it('where. with duplicated key', () => {
        assert.deepEqual(
            parseDotQueryKey('a=1&where.a=2&where.b=4&c=1&c=2'),
            {
                "a": "1",
                "where": {
                    "a": "2",
                    "b": "4"
                },
                "c": [
                    "1",
                    "2"
                ]
            }
        )
    })
})

test.run(console.DEBUG)