/// <reference types="@fibjs/types" />

declare module "parse-querystring-dotkey" {
    interface ParsedQS {[k: string]: any}

    function parseDotQueryKey (
        input: string | {[k: string]: any},
        opts?: { arrayFormat?: 'comma' }
    ): ParsedQS

    export = parseDotQueryKey;
}