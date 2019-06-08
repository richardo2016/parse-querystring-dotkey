/// <reference types="@fibjs/types" />

declare module "parse-querystring-dotkey" {
    interface ParsedQS {[k: string]: any}

    function parseDotQueryKey (input: string | {[k: string]: any}, flatten_prefix: string): ParsedQS
}