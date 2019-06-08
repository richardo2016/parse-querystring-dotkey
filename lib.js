const qs = require('querystring')

function setPropertyByPath (target, breadcrumbs, value, splitor = '.') {
    if (typeof breadcrumbs === 'string') {
        breadcrumbs = breadcrumbs.split(splitor);
    } else if (!Array.isArray(breadcrumbs)) {
        return ;
    }

    let propName = breadcrumbs.shift();

    if (breadcrumbs.length == 0) {
        target[propName] = value;
        return ;
    }

    if (typeof target[propName] !== 'object') target[propName] = {};

    let currKey;
    let currObj = target[propName] = target[propName] || {};

    while (breadcrumbs.length > 0) {
        currKey = breadcrumbs.shift();

        currObj[currKey] = currObj[currKey] || {};

        if (breadcrumbs.length > 0) {
            currObj = currObj[currKey];
        } else if (currObj[currKey] !== value) {
            currObj[currKey] = value;
        }
    }
}

function transformStringValue (
    strValue,
    {
        // comma
        arrayFormat = 'comma'
    } = {}
) {
    if (arrayFormat === 'comma' && typeof strValue === 'string') {
        if (strValue.indexOf(',') > -1)
            strValue = strValue.split(',')
    }

    return strValue
}

module.exports = function parseDotQueryKey (
    input,
    {
        arrayFormat = 'comma'
    } = {}
) {
    if (!input)
        input = {}

    const target = {}
    
    let parsed = input
    if (typeof parsed === 'string')
        parsed = qs.parse(parsed).toJSON()
    else if (typeof parsed !== 'object')
        return target;
    else if (typeof parsed.toJSON === 'function')
        parsed = parsed.toJSON()

    Object.keys(parsed).sort().forEach((k) => {
        const value = transformStringValue(parsed[k], { arrayFormat })
        
        if (k.indexOf('.') > -1) {
            setPropertyByPath(target, k, value)
        } else {
            target[k] = value
        }
    })

    return target
}