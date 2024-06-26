//NBTedit
var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
    }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function(status, toThrow) {
    throw toThrow
};
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (Module["ENVIRONMENT"]) {
    throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)")
}
var scriptDirectory = "";
function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle;
var nodeFS;
var nodePath;
if (ENVIRONMENT_IS_NODE) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/"
    } else {
        scriptDirectory = __dirname + "/"
    }
    read_ = function shell_read(filename, binary) {
        if (!nodeFS)
            nodeFS = require("fs");
        if (!nodePath)
            nodePath = require("path");
        filename = nodePath["normalize"](filename);
        return nodeFS["readFileSync"](filename, binary ? null : "utf8")
    }
    ;
    readBinary = function readBinary(filename) {
        var ret = read_(filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        assert(ret.buffer);
        return ret
    }
    ;
    if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/")
    }
    arguments_ = process["argv"].slice(2);
    if (typeof module !== "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    });
    process["on"]("unhandledRejection", abort);
    quit_ = function(status) {
        process["exit"](status)
    }
    ;
    Module["inspect"] = function() {
        return "[Emscripten Module object]"
    }
} else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != "undefined") {
        read_ = function shell_read(f) {
            return read(f)
        }
    }
    readBinary = function readBinary(f) {
        var data;
        if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f))
        }
        data = read(f, "binary");
        assert(typeof data === "object");
        return data
    }
    ;
    if (typeof scriptArgs != "undefined") {
        arguments_ = scriptArgs
    } else if (typeof arguments != "undefined") {
        arguments_ = arguments
    }
    if (typeof quit === "function") {
        quit_ = function(status) {
            quit(status)
        }
    }
    if (typeof print !== "undefined") {
        if (typeof console === "undefined")
            console = {};
        console.log = print;
        console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    {
        read_ = function shell_read(url) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText
        }
        ;
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = function readBinary(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response)
            }
        }
        readAsync = function readAsync(url, onload, onerror) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function xhr_onload() {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                    onload(xhr.response);
                    return
                }
                onerror()
            }
            ;
            xhr.onerror = onerror;
            xhr.send(null)
        }
    }
    setWindowTitle = function(title) {
        document.title = title
    }
} else {
    throw new Error("environment detection error")
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
    }
}
moduleOverrides = null;
if (Module["arguments"])
    arguments_ = Module["arguments"];
if (!Object.getOwnPropertyDescriptor(Module, "arguments"))
    Object.defineProperty(Module, "arguments", {
        configurable: true,
        get: function() {
            abort("Module.arguments has been replaced with plain arguments_")
        }
    });
if (Module["thisProgram"])
    thisProgram = Module["thisProgram"];
if (!Object.getOwnPropertyDescriptor(Module, "thisProgram"))
    Object.defineProperty(Module, "thisProgram", {
        configurable: true,
        get: function() {
            abort("Module.thisProgram has been replaced with plain thisProgram")
        }
    });
if (Module["quit"])
    quit_ = Module["quit"];
if (!Object.getOwnPropertyDescriptor(Module, "quit"))
    Object.defineProperty(Module, "quit", {
        configurable: true,
        get: function() {
            abort("Module.quit has been replaced with plain quit_")
        }
    });
assert(typeof Module["memoryInitializerPrefixURL"] === "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["pthreadMainPrefixURL"] === "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["cdInitializerPrefixURL"] === "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["filePackagePrefixURL"] === "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["read"] === "undefined", "Module.read option was removed (modify read_ in JS)");
assert(typeof Module["readAsync"] === "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
assert(typeof Module["readBinary"] === "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
assert(typeof Module["setWindowTitle"] === "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
assert(typeof Module["TOTAL_MEMORY"] === "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
if (!Object.getOwnPropertyDescriptor(Module, "read"))
    Object.defineProperty(Module, "read", {
        configurable: true,
        get: function() {
            abort("Module.read has been replaced with plain read_")
        }
    });
if (!Object.getOwnPropertyDescriptor(Module, "readAsync"))
    Object.defineProperty(Module, "readAsync", {
        configurable: true,
        get: function() {
            abort("Module.readAsync has been replaced with plain readAsync")
        }
    });
if (!Object.getOwnPropertyDescriptor(Module, "readBinary"))
    Object.defineProperty(Module, "readBinary", {
        configurable: true,
        get: function() {
            abort("Module.readBinary has been replaced with plain readBinary")
        }
    });
if (!Object.getOwnPropertyDescriptor(Module, "setWindowTitle"))
    Object.defineProperty(Module, "setWindowTitle", {
        configurable: true,
        get: function() {
            abort("Module.setWindowTitle has been replaced with plain setWindowTitle")
        }
    });
var STACK_ALIGN = 16;
var stackSave;
var stackRestore;
var stackAlloc;
stackSave = stackRestore = stackAlloc = function() {
    abort("cannot use the stack before compiled code is ready to run, and has provided stack access")
}
;
function dynamicAlloc(size) {
    assert(DYNAMICTOP_PTR);
    var ret = HEAP32[DYNAMICTOP_PTR >> 2];
    var end = ret + size + 15 & -16;
    assert(end <= HEAP8.length, "failure to dynamicAlloc - memory growth etc. is not supported there, call malloc/sbrk directly");
    HEAP32[DYNAMICTOP_PTR >> 2] = end;
    return ret
}
function getNativeTypeSize(type) {
    switch (type) {
    case "i1":
    case "i8":
        return 1;
    case "i16":
        return 2;
    case "i32":
        return 4;
    case "i64":
        return 8;
    case "float":
        return 4;
    case "double":
        return 8;
    default:
        {
            if (type[type.length - 1] === "*") {
                return 4
            } else if (type[0] === "i") {
                var bits = Number(type.substr(1));
                assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                return bits / 8
            } else {
                return 0
            }
        }
    }
}
function warnOnce(text) {
    if (!warnOnce.shown)
        warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text)
    }
}
var asm2wasmImports = {
    "f64-rem": function(x, y) {
        return x % y
    },
    "debugger": function() {
        debugger
    }
};
var jsCallStartIndex = 1;
var functionPointers = new Array(0);
function convertJsFunctionToWasm(func, sig) {
    if (typeof WebAssembly.Function === "function") {
        var typeNames = {
            "i": "i32",
            "j": "i64",
            "f": "f32",
            "d": "f64"
        };
        var type = {
            parameters: [],
            results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
        };
        for (var i = 1; i < sig.length; ++i) {
            type.parameters.push(typeNames[sig[i]])
        }
        return new WebAssembly.Function(type,func)
    }
    var typeSection = [1, 0, 1, 96];
    var sigRet = sig.slice(0, 1);
    var sigParam = sig.slice(1);
    var typeCodes = {
        "i": 127,
        "j": 126,
        "f": 125,
        "d": 124
    };
    typeSection.push(sigParam.length);
    for (var i = 0; i < sigParam.length; ++i) {
        typeSection.push(typeCodes[sigParam[i]])
    }
    if (sigRet == "v") {
        typeSection.push(0)
    } else {
        typeSection = typeSection.concat([1, typeCodes[sigRet]])
    }
    typeSection[1] = typeSection.length - 2;
    var bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(typeSection, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
    var module = new WebAssembly.Module(bytes);
    var instance = new WebAssembly.Instance(module,{
        "e": {
            "f": func
        }
    });
    var wrappedFunc = instance.exports["f"];
    return wrappedFunc
}
var freeTableIndexes = [];
var functionsInTableMap;
var funcWrappers = {};
function dynCall(sig, ptr, args) {
    if (args && args.length) {
        assert(args.length === sig.substring(1).replace(/j/g, "--").length);
        assert("dynCall_" + sig in Module, "bad function pointer type - no table for sig '" + sig + "'");
        return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
    } else {
        assert(sig.length == 1);
        assert("dynCall_" + sig in Module, "bad function pointer type - no table for sig '" + sig + "'");
        return Module["dynCall_" + sig].call(null, ptr)
    }
}
var tempRet0 = 0;
var setTempRet0 = function(value) {
    tempRet0 = value
};
var getTempRet0 = function() {
    return tempRet0
};
var wasmBinary;
if (Module["wasmBinary"])
    wasmBinary = Module["wasmBinary"];
if (!Object.getOwnPropertyDescriptor(Module, "wasmBinary"))
    Object.defineProperty(Module, "wasmBinary", {
        configurable: true,
        get: function() {
            abort("Module.wasmBinary has been replaced with plain wasmBinary")
        }
    });
var noExitRuntime;
if (Module["noExitRuntime"])
    noExitRuntime = Module["noExitRuntime"];
if (!Object.getOwnPropertyDescriptor(Module, "noExitRuntime"))
    Object.defineProperty(Module, "noExitRuntime", {
        configurable: true,
        get: function() {
            abort("Module.noExitRuntime has been replaced with plain noExitRuntime")
        }
    });
if (typeof WebAssembly !== "object") {
    abort("No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.")
}
function setValue(ptr, value, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*")
        type = "i32";
    switch (type) {
    case "i1":
        HEAP8[ptr >> 0] = value;
        break;
    case "i8":
        HEAP8[ptr >> 0] = value;
        break;
    case "i16":
        HEAP16[ptr >> 1] = value;
        break;
    case "i32":
        HEAP32[ptr >> 2] = value;
        break;
    case "i64":
        tempI64 = [value >>> 0, (tempDouble = value,
        +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
        HEAP32[ptr >> 2] = tempI64[0],
        HEAP32[ptr + 4 >> 2] = tempI64[1];
        break;
    case "float":
        HEAPF32[ptr >> 2] = value;
        break;
    case "double":
        HEAPF64[ptr >> 3] = value;
        break;
    default:
        abort("invalid type for setValue: " + type)
    }
}
var wasmMemory;
var wasmTable = new WebAssembly.Table({
    "initial": 1364,
    "maximum": 1364,
    "element": "anyfunc"
});
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text)
    }
}
function getCFunc(ident) {
    var func = Module["_" + ident];
    assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
    return func
}
function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
        "string": function(str) {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len)
            }
            return ret
        },
        "array": function(arr) {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
        }
    };
    function convertReturnValue(ret) {
        if (returnType === "string")
            return UTF8ToString(ret);
        if (returnType === "boolean")
            return Boolean(ret);
        return ret
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    assert(returnType !== "array", 'Return type should not be "array".');
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
                if (stack === 0)
                    stack = stackSave();
                cArgs[i] = converter(args[i])
            } else {
                cArgs[i] = args[i]
            }
        }
    }
    var ret = func.apply(null, cArgs);
    ret = convertReturnValue(ret);
    if (stack !== 0)
        stackRestore(stack);
    return ret
}
var ALLOC_NONE = 3;
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heap[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
    if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr))
    } else {
        var str = "";
        while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
                if ((u0 & 248) != 240)
                    warnOnce("Invalid UTF-8 leading byte 0x" + u0.toString(16) + " encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!");
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0)
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
        }
    }
    return str
}
function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0))
        return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx)
                break;
            heap[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx)
                break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx)
                break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx)
                break;
            if (u >= 2097152)
                warnOnce("Invalid Unicode code point 0x" + u.toString(16) + " encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).");
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
    assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}
function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
            u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127)
            ++len;
        else if (u <= 2047)
            len += 2;
        else if (u <= 65535)
            len += 3;
        else
            len += 4
    }
    return len
}
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
function UTF16ToString(ptr, maxBytesToRead) {
    assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
    var endPtr = ptr;
    var idx = endPtr >> 1;
    var maxIdx = idx + maxBytesToRead / 2;
    while (!(idx >= maxIdx) && HEAPU16[idx])
        ++idx;
    endPtr = idx << 1;
    if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr))
    } else {
        var i = 0;
        var str = "";
        while (1) {
            var codeUnit = HEAP16[ptr + i * 2 >> 1];
            if (codeUnit == 0 || i == maxBytesToRead / 2)
                return str;
            ++i;
            str += String.fromCharCode(codeUnit)
        }
    }
}
function stringToUTF16(str, outPtr, maxBytesToWrite) {
    assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
    assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
    if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647
    }
    if (maxBytesToWrite < 2)
        return 0;
    maxBytesToWrite -= 2;
    var startPtr = outPtr;
    var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
    for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2
    }
    HEAP16[outPtr >> 1] = 0;
    return outPtr - startPtr
}
function lengthBytesUTF16(str) {
    return str.length * 2
}
function UTF32ToString(ptr, maxBytesToRead) {
    assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
    var i = 0;
    var str = "";
    while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[ptr + i * 4 >> 2];
        if (utf32 == 0)
            break;
        ++i;
        if (utf32 >= 65536) {
            var ch = utf32 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        } else {
            str += String.fromCharCode(utf32)
        }
    }
    return str
}
function stringToUTF32(str, outPtr, maxBytesToWrite) {
    assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
    assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
    if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647
    }
    if (maxBytesToWrite < 4)
        return 0;
    var startPtr = outPtr;
    var endPtr = startPtr + maxBytesToWrite - 4;
    for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
            var trailSurrogate = str.charCodeAt(++i);
            codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr)
            break
    }
    HEAP32[outPtr >> 2] = 0;
    return outPtr - startPtr
}
function lengthBytesUTF32(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343)
            ++i;
        len += 4
    }
    return len
}
function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret)
        stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}
function writeArrayToMemory(array, buffer) {
    assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
    HEAP8.set(array, buffer)
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === str.charCodeAt(i) & 255);
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull)
        HEAP8[buffer >> 0] = 0
}
var WASM_PAGE_SIZE = 65536;
function alignUp(x, multiple) {
    if (x % multiple > 0) {
        x += multiple - x % multiple
    }
    return x
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
}
var STACK_BASE = 45664
  , STACK_MAX = 5288544
  , DYNAMIC_BASE = 5288544
  , DYNAMICTOP_PTR = 45456;
assert(STACK_BASE % 16 === 0, "stack must start aligned");
assert(DYNAMIC_BASE % 16 === 0, "heap must start aligned");
var TOTAL_STACK = 5242880;
if (Module["TOTAL_STACK"])
    assert(TOTAL_STACK === Module["TOTAL_STACK"], "the stack size can no longer be determined at runtime");
var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
if (!Object.getOwnPropertyDescriptor(Module, "INITIAL_MEMORY"))
    Object.defineProperty(Module, "INITIAL_MEMORY", {
        configurable: true,
        get: function() {
            abort("Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY")
        }
    });
assert(INITIAL_INITIAL_MEMORY >= TOTAL_STACK, "INITIAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_INITIAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined, "JS engine does not provide full typed array support");
if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"]
} else {
    wasmMemory = new WebAssembly.Memory({
        "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
        "maximum": 2147483648 / WASM_PAGE_SIZE
    })
}
if (wasmMemory) {
    buffer = wasmMemory.buffer
}
INITIAL_INITIAL_MEMORY = buffer.byteLength;
assert(INITIAL_INITIAL_MEMORY % WASM_PAGE_SIZE === 0);
assert(65536 % WASM_PAGE_SIZE === 0);
updateGlobalBufferAndViews(buffer);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
function writeStackCookie() {
    assert((STACK_MAX & 3) == 0);
    HEAPU32[(STACK_MAX >> 2) - 1] = 34821223;
    HEAPU32[(STACK_MAX >> 2) - 2] = 2310721022;
    HEAP32[0] = 1668509029
}
function checkStackCookie() {
    var cookie1 = HEAPU32[(STACK_MAX >> 2) - 1];
    var cookie2 = HEAPU32[(STACK_MAX >> 2) - 2];
    if (cookie1 != 34821223 || cookie2 != 2310721022) {
        abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" + cookie2.toString(16) + " " + cookie1.toString(16))
    }
    if (HEAP32[0] !== 1668509029)
        abort("Runtime error: The application has corrupted its heap memory area (address zero)!")
}
function abortStackOverflow(allocSize) {
    abort("Stack overflow! Attempted to allocate " + allocSize + " bytes on the stack, but stack has only " + (STACK_MAX - stackSave() + allocSize) + " bytes available!")
}
(function() {
    var h16 = new Int16Array(1);
    var h8 = new Int8Array(h16.buffer);
    h16[0] = 25459;
    if (h8[0] !== 115 || h8[1] !== 99)
        throw "Runtime error: expected the system to be little-endian!"
}
)();
function abortFnPtrError(ptr, sig) {
    var possibleSig = "";
    for (var x in debug_tables) {
        var tbl = debug_tables[x];
        if (tbl[ptr]) {
            possibleSig += 'as sig "' + x + '" pointing to function ' + tbl[ptr] + ", "
        }
    }
    abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). This pointer might make sense in another type signature: " + possibleSig)
}
function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback(Module);
            continue
        }
        var func = callback.func;
        if (typeof func === "number") {
            if (callback.arg === undefined) {
                Module["dynCall_v"](func)
            } else {
                Module["dynCall_vi"](func, callback.arg)
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg)
        }
    }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
            Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}
function initRuntime() {
    checkStackCookie();
    assert(!runtimeInitialized);
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.init.initialized)
        FS.init();
    TTY.init();
    callRuntimeCallbacks(__ATINIT__)
}
function preMain() {
    checkStackCookie();
    FS.ignorePermissions = false;
    callRuntimeCallbacks(__ATMAIN__)
}
function exitRuntime() {
    checkStackCookie();
    runtimeExited = true
}
function postRun() {
    checkStackCookie();
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
            Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}
function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}
function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_min = Math.min;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
var runDependencyTracking = {};
function getUniqueRunDependency(id) {
    var orig = id;
    while (1) {
        if (!runDependencyTracking[id])
            return id;
        id = orig + Math.random()
    }
}
function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (id) {
        assert(!runDependencyTracking[id]);
        runDependencyTracking[id] = 1;
        if (runDependencyWatcher === null && typeof setInterval !== "undefined") {
            runDependencyWatcher = setInterval(function() {
                if (ABORT) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                    return
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                    if (!shown) {
                        shown = true;
                        err("still waiting on run dependencies:")
                    }
                    err("dependency: " + dep)
                }
                if (shown) {
                    err("(end of list)")
                }
            }, 1e4)
        }
    } else {
        err("warning: run dependency added without ID")
    }
}
function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (id) {
        assert(runDependencyTracking[id]);
        delete runDependencyTracking[id]
    } else {
        err("warning: run dependency removed without ID")
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what)
    }
    what += "";
    out(what);
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    var output = "abort(" + what + ") at " + stackTrace();
    what = output;
    throw new WebAssembly.RuntimeError(what)
}
function hasPrefix(str, prefix) {
    return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
    return hasPrefix(filename, dataURIPrefix)
}
var fileURIPrefix = "file://";
function isFileURI(filename) {
    return hasPrefix(filename, fileURIPrefix)
}
var wasmBinaryFile = "NBT.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}
function getBinary() {
    try {
        if (wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(wasmBinaryFile)
        } else {
            throw "both async and sync fetching of the wasm failed"
        }
    } catch (err) {
        abort(err)
    }
}
function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
        return fetch(wasmBinaryFile, {
            credentials: "same-origin"
        }).then(function(response) {
            if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
            }
            return response["arrayBuffer"]()
        }).catch(function() {
            return getBinary()
        })
    }
    return new Promise(function(resolve, reject) {
        resolve(getBinary())
    }
    )
}
function createWasm() {
    var info = {
        "env": asmLibraryArg,
        "wasi_snapshot_preview1": asmLibraryArg,
        "global": {
            "NaN": NaN,
            Infinity: Infinity
        },
        "global.Math": Math,
        "asm2wasm": asm2wasmImports
    };
    function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate");
    var trueModule = Module;
    function receiveInstantiatedSource(output) {
        assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
        trueModule = null;
        receiveInstance(output["instance"])
    }
    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function(binary) {
            return WebAssembly.instantiate(binary, info)
        }).then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
        })
    }
    function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
            fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function(response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiatedSource, function(reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    instantiateArrayBuffer(receiveInstantiatedSource)
                })
            })
        } else {
            return instantiateArrayBuffer(receiveInstantiatedSource)
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }
    instantiateAsync();
    return {}
}
Module["asm"] = createWasm;
var tempDouble;
var tempI64;
__ATINIT__.push({
    func: function() {
        globalCtors()
    }
});
var tempDoublePtr = 45648;
function demangle(func) {
    warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
    return func
}
function demangleAll(text) {
    var regex = /\b__Z[\w\d_]+/g;
    return text.replace(regex, function(x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]"
    })
}
function jsStackTrace() {
    var err = new Error;
    if (!err.stack) {
        try {
            throw new Error
        } catch (e) {
            err = e
        }
        if (!err.stack) {
            return "(no stack trace available)"
        }
    }
    return err.stack.toString()
}
function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"])
        js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js)
}
function ___cxa_allocate_exception(size) {
    return _malloc(size)
}
var ___exception_infos = {};
var ___exception_caught = [];
function ___exception_addRef(ptr) {
    if (!ptr)
        return;
    var info = ___exception_infos[ptr];
    info.refcount++
}
function ___exception_deAdjust(adjusted) {
    if (!adjusted || ___exception_infos[adjusted])
        return adjusted;
    for (var key in ___exception_infos) {
        var ptr = +key;
        var adj = ___exception_infos[ptr].adjusted;
        var len = adj.length;
        for (var i = 0; i < len; i++) {
            if (adj[i] === adjusted) {
                return ptr
            }
        }
    }
    return adjusted
}
function ___cxa_begin_catch(ptr) {
    var info = ___exception_infos[ptr];
    if (info && !info.caught) {
        info.caught = true;
        __ZSt18uncaught_exceptionv.uncaught_exceptions--
    }
    if (info)
        info.rethrown = false;
    ___exception_caught.push(ptr);
    ___exception_addRef(___exception_deAdjust(ptr));
    return ptr
}
var ___exception_last = 0;
function ___cxa_free_exception(ptr) {
    try {
        return _free(ptr)
    } catch (e) {
        err("exception during cxa_free_exception: " + e)
    }
}
function ___exception_decRef(ptr) {
    if (!ptr)
        return;
    var info = ___exception_infos[ptr];
    assert(info.refcount > 0);
    info.refcount--;
    if (info.refcount === 0 && !info.rethrown) {
        if (info.destructor) {
            Module["dynCall_vi"](info.destructor, ptr)
        }
        delete ___exception_infos[ptr];
        ___cxa_free_exception(ptr)
    }
}
function ___cxa_end_catch() {
    _setThrew(0);
    var ptr = ___exception_caught.pop();
    if (ptr) {
        ___exception_decRef(___exception_deAdjust(ptr));
        ___exception_last = 0
    }
}
function ___cxa_find_matching_catch_2() {
    var thrown = ___exception_last;
    if (!thrown) {
        return (setTempRet0(0),
        0) | 0
    }
    var info = ___exception_infos[thrown];
    var throwntype = info.type;
    if (!throwntype) {
        return (setTempRet0(0),
        thrown) | 0
    }
    var typeArray = Array.prototype.slice.call(arguments);
    var pointer = ___cxa_is_pointer_type(throwntype);
    var buffer = 45632;
    HEAP32[buffer >> 2] = thrown;
    thrown = buffer;
    for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && ___cxa_can_catch(typeArray[i], throwntype, thrown)) {
            thrown = HEAP32[thrown >> 2];
            info.adjusted.push(thrown);
            return (setTempRet0(typeArray[i]),
            thrown) | 0
        }
    }
    thrown = HEAP32[thrown >> 2];
    return (setTempRet0(throwntype),
    thrown) | 0
}
function ___cxa_find_matching_catch_3() {
    var thrown = ___exception_last;
    if (!thrown) {
        return (setTempRet0(0),
        0) | 0
    }
    var info = ___exception_infos[thrown];
    var throwntype = info.type;
    if (!throwntype) {
        return (setTempRet0(0),
        thrown) | 0
    }
    var typeArray = Array.prototype.slice.call(arguments);
    var pointer = ___cxa_is_pointer_type(throwntype);
    var buffer = 45632;
    HEAP32[buffer >> 2] = thrown;
    thrown = buffer;
    for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && ___cxa_can_catch(typeArray[i], throwntype, thrown)) {
            thrown = HEAP32[thrown >> 2];
            info.adjusted.push(thrown);
            return (setTempRet0(typeArray[i]),
            thrown) | 0
        }
    }
    thrown = HEAP32[thrown >> 2];
    return (setTempRet0(throwntype),
    thrown) | 0
}
function ___cxa_rethrow() {
    var ptr = ___exception_caught.pop();
    ptr = ___exception_deAdjust(ptr);
    if (!___exception_infos[ptr].rethrown) {
        ___exception_caught.push(ptr);
        ___exception_infos[ptr].rethrown = true
    }
    ___exception_last = ptr;
    throw ptr
}
function ___cxa_throw(ptr, type, destructor) {
    ___exception_infos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
    };
    ___exception_last = ptr;
    if (!("uncaught_exception"in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exceptions = 1
    } else {
        __ZSt18uncaught_exceptionv.uncaught_exceptions++
    }
    throw ptr
}
function ___cxa_uncaught_exceptions() {
    return __ZSt18uncaught_exceptionv.uncaught_exceptions
}
function ___gxx_personality_v0() {}
function setErrNo(value) {
    HEAP32[___errno_location() >> 2] = value;
    return value
}
function ___map_file(pathname, size) {
    setErrNo(63);
    return -1
}
function ___resumeException(ptr) {
    if (!___exception_last) {
        ___exception_last = ptr
    }
    throw ptr
}
var PATH = {
    splitPath: function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    },
    normalizeArray: function(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..")
            }
        }
        return parts
    },
    normalize: function(path) {
        var isAbsolute = path.charAt(0) === "/"
          , trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
        }), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    },
    dirname: function(path) {
        var result = PATH.splitPath(path)
          , root = result[0]
          , dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    },
    basename: function(path) {
        if (path === "/")
            return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1)
            return path;
        return path.substr(lastSlash + 1)
    },
    extname: function(path) {
        return PATH.splitPath(path)[3]
    },
    join: function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"))
    },
    join2: function(l, r) {
        return PATH.normalize(l + "/" + r)
    }
};
var PATH_FS = {
    resolve: function() {
        var resolvedPath = ""
          , resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
            return !!p
        }), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    },
    relative: function(from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "")
                    break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "")
                    break
            }
            if (start > end)
                return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    }
};
var TTY = {
    ttys: [],
    init: function() {},
    shutdown: function() {},
    register: function(dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    },
    stream_ops: {
        open: function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(43)
            }
            stream.tty = tty;
            stream.seekable = false
        },
        close: function(stream) {
            stream.tty.ops.flush(stream.tty)
        },
        flush: function(stream) {
            stream.tty.ops.flush(stream.tty)
        },
        read: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(6)
                }
                if (result === null || result === undefined)
                    break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        },
        write: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60)
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                }
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        }
    },
    default_tty_ops: {
        get_char: function(tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
                    var bytesRead = 0;
                    try {
                        bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null)
                    } catch (e) {
                        if (e.toString().indexOf("EOF") != -1)
                            bytesRead = 0;
                        else
                            throw e
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        },
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0)
                    tty.output.push(val)
            }
        },
        flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    },
    default_tty1_ops: {
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0)
                    tty.output.push(val)
            }
        },
        flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    }
};
var MEMFS = {
    ops_table: null,
    mount: function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    },
    createNode: function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node
        }
        return node
    },
    getFileDataAsRegularArray: function(node) {
        if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i)
                arr.push(node.contents[i]);
            return arr
        }
        return node.contents
    },
    getFileDataAsTypedArray: function(node) {
        if (!node.contents)
            return new Uint8Array(0);
        if (node.contents.subarray)
            return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    },
    expandFileStorage: function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity)
            return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
        if (prevCapacity != 0)
            newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0)
            node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
        return
    },
    resizeFileStorage: function(node, newSize) {
        if (node.usedBytes == newSize)
            return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return
        }
        if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize;
            return
        }
        if (!node.contents)
            node.contents = [];
        if (node.contents.length > newSize)
            node.contents.length = newSize;
        else
            while (node.contents.length < newSize)
                node.contents.push(0);
        node.usedBytes = newSize
    },
    node_ops: {
        getattr: function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        },
        setattr: function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        },
        lookup: function(parent, name) {
            throw FS.genericErrors[44]
        },
        mknod: function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        },
        rename: function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(55)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir
        },
        unlink: function(parent, name) {
            delete parent.contents[name]
        },
        rmdir: function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(55)
            }
            delete parent.contents[name]
        },
        readdir: function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        },
        symlink: function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        },
        readlink: function(node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28)
            }
            return node.link
        }
    },
    stream_ops: {
        read: function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes)
                return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++)
                    buffer[offset + i] = contents[position + i]
            }
            return size
        },
        write: function(stream, buffer, offset, length, position, canOwn) {
            assert(!(buffer instanceof ArrayBuffer));
            if (buffer.buffer === HEAP8.buffer) {
                if (canOwn) {
                    warnOnce("file packager has copied file data into memory, but in memory growth we are forced to copy it again (see --no-heap-copy)")
                }
                canOwn = false
            }
            if (!length)
                return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    assert(position === 0, "canOwn must imply no weird position inside the file");
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = buffer.slice(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray)
                node.contents.set(buffer.subarray(offset, offset + length), position);
            else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        },
        llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(28)
            }
            return position
        },
        allocate: function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        },
        mmap: function(stream, buffer, offset, length, position, prot, flags) {
            assert(!(buffer instanceof ArrayBuffer));
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents.buffer === buffer.buffer) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < contents.length) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                var fromHeap = buffer.buffer == HEAP8.buffer;
                ptr = _malloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(48)
                }
                (fromHeap ? HEAP8 : buffer).set(contents, ptr)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        },
        msync: function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43)
            }
            if (mmapFlags & 2) {
                return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        }
    }
};
var ERRNO_MESSAGES = {
    0: "Success",
    1: "Arg list too long",
    2: "Permission denied",
    3: "Address already in use",
    4: "Address not available",
    5: "Address family not supported by protocol family",
    6: "No more processes",
    7: "Socket already connected",
    8: "Bad file number",
    9: "Trying to read unreadable message",
    10: "Mount device busy",
    11: "Operation canceled",
    12: "No children",
    13: "Connection aborted",
    14: "Connection refused",
    15: "Connection reset by peer",
    16: "File locking deadlock error",
    17: "Destination address required",
    18: "Math arg out of domain of func",
    19: "Quota exceeded",
    20: "File exists",
    21: "Bad address",
    22: "File too large",
    23: "Host is unreachable",
    24: "Identifier removed",
    25: "Illegal byte sequence",
    26: "Connection already in progress",
    27: "Interrupted system call",
    28: "Invalid argument",
    29: "I/O error",
    30: "Socket is already connected",
    31: "Is a directory",
    32: "Too many symbolic links",
    33: "Too many open files",
    34: "Too many links",
    35: "Message too long",
    36: "Multihop attempted",
    37: "File or path name too long",
    38: "Network interface is not configured",
    39: "Connection reset by network",
    40: "Network is unreachable",
    41: "Too many open files in system",
    42: "No buffer space available",
    43: "No such device",
    44: "No such file or directory",
    45: "Exec format error",
    46: "No record locks available",
    47: "The link has been severed",
    48: "Not enough core",
    49: "No message of desired type",
    50: "Protocol not available",
    51: "No space left on device",
    52: "Function not implemented",
    53: "Socket is not connected",
    54: "Not a directory",
    55: "Directory not empty",
    56: "State not recoverable",
    57: "Socket operation on non-socket",
    59: "Not a typewriter",
    60: "No such device or address",
    61: "Value too large for defined data type",
    62: "Previous owner died",
    63: "Not super-user",
    64: "Broken pipe",
    65: "Protocol error",
    66: "Unknown protocol",
    67: "Protocol wrong type for socket",
    68: "Math result not representable",
    69: "Read only file system",
    70: "Illegal seek",
    71: "No such process",
    72: "Stale file handle",
    73: "Connection timed out",
    74: "Text file busy",
    75: "Cross-device link",
    100: "Device not a stream",
    101: "Bad font file fmt",
    102: "Invalid slot",
    103: "Invalid request code",
    104: "No anode",
    105: "Block device required",
    106: "Channel number out of range",
    107: "Level 3 halted",
    108: "Level 3 reset",
    109: "Link number out of range",
    110: "Protocol driver not attached",
    111: "No CSI structure available",
    112: "Level 2 halted",
    113: "Invalid exchange",
    114: "Invalid request descriptor",
    115: "Exchange full",
    116: "No data (for no delay io)",
    117: "Timer expired",
    118: "Out of streams resources",
    119: "Machine is not on the network",
    120: "Package not installed",
    121: "The object is remote",
    122: "Advertise error",
    123: "Srmount error",
    124: "Communication error on send",
    125: "Cross mount point (not really error)",
    126: "Given log. name not unique",
    127: "f.d. invalid for this operation",
    128: "Remote address changed",
    129: "Can   access a needed shared lib",
    130: "Accessing a corrupted shared lib",
    131: ".lib section in a.out corrupted",
    132: "Attempting to link in too many libs",
    133: "Attempting to exec a shared library",
    135: "Streams pipe error",
    136: "Too many users",
    137: "Socket type not supported",
    138: "Not supported",
    139: "Protocol family not supported",
    140: "Can't send after socket shutdown",
    141: "Too many references",
    142: "Host is down",
    148: "No medium (in tape drive)",
    156: "Level 2 not synchronized"
};
var ERRNO_CODES = {
    EPERM: 63,
    ENOENT: 44,
    ESRCH: 71,
    EINTR: 27,
    EIO: 29,
    ENXIO: 60,
    E2BIG: 1,
    ENOEXEC: 45,
    EBADF: 8,
    ECHILD: 12,
    EAGAIN: 6,
    EWOULDBLOCK: 6,
    ENOMEM: 48,
    EACCES: 2,
    EFAULT: 21,
    ENOTBLK: 105,
    EBUSY: 10,
    EEXIST: 20,
    EXDEV: 75,
    ENODEV: 43,
    ENOTDIR: 54,
    EISDIR: 31,
    EINVAL: 28,
    ENFILE: 41,
    EMFILE: 33,
    ENOTTY: 59,
    ETXTBSY: 74,
    EFBIG: 22,
    ENOSPC: 51,
    ESPIPE: 70,
    EROFS: 69,
    EMLINK: 34,
    EPIPE: 64,
    EDOM: 18,
    ERANGE: 68,
    ENOMSG: 49,
    EIDRM: 24,
    ECHRNG: 106,
    EL2NSYNC: 156,
    EL3HLT: 107,
    EL3RST: 108,
    ELNRNG: 109,
    EUNATCH: 110,
    ENOCSI: 111,
    EL2HLT: 112,
    EDEADLK: 16,
    ENOLCK: 46,
    EBADE: 113,
    EBADR: 114,
    EXFULL: 115,
    ENOANO: 104,
    EBADRQC: 103,
    EBADSLT: 102,
    EDEADLOCK: 16,
    EBFONT: 101,
    ENOSTR: 100,
    ENODATA: 116,
    ETIME: 117,
    ENOSR: 118,
    ENONET: 119,
    ENOPKG: 120,
    EREMOTE: 121,
    ENOLINK: 47,
    EADV: 122,
    ESRMNT: 123,
    ECOMM: 124,
    EPROTO: 65,
    EMULTIHOP: 36,
    EDOTDOT: 125,
    EBADMSG: 9,
    ENOTUNIQ: 126,
    EBADFD: 127,
    EREMCHG: 128,
    ELIBACC: 129,
    ELIBBAD: 130,
    ELIBSCN: 131,
    ELIBMAX: 132,
    ELIBEXEC: 133,
    ENOSYS: 52,
    ENOTEMPTY: 55,
    ENAMETOOLONG: 37,
    ELOOP: 32,
    EOPNOTSUPP: 138,
    EPFNOSUPPORT: 139,
    ECONNRESET: 15,
    ENOBUFS: 42,
    EAFNOSUPPORT: 5,
    EPROTOTYPE: 67,
    ENOTSOCK: 57,
    ENOPROTOOPT: 50,
    ESHUTDOWN: 140,
    ECONNREFUSED: 14,
    EADDRINUSE: 3,
    ECONNABORTED: 13,
    ENETUNREACH: 40,
    ENETDOWN: 38,
    ETIMEDOUT: 73,
    EHOSTDOWN: 142,
    EHOSTUNREACH: 23,
    EINPROGRESS: 26,
    EALREADY: 7,
    EDESTADDRREQ: 17,
    EMSGSIZE: 35,
    EPROTONOSUPPORT: 66,
    ESOCKTNOSUPPORT: 137,
    EADDRNOTAVAIL: 4,
    ENETRESET: 39,
    EISCONN: 30,
    ENOTCONN: 53,
    ETOOMANYREFS: 141,
    EUSERS: 136,
    EDQUOT: 19,
    ESTALE: 72,
    ENOTSUP: 138,
    ENOMEDIUM: 148,
    EILSEQ: 25,
    EOVERFLOW: 61,
    ECANCELED: 11,
    ENOTRECOVERABLE: 56,
    EOWNERDEAD: 62,
    ESTRPIPE: 135
};
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: {
        openFlags: {
            READ: 1,
            WRITE: 2
        }
    },
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    handleFSError: function(e) {
        if (!(e instanceof FS.ErrnoError))
            throw e + " : " + stackTrace();
        return setErrNo(e.errno)
    },
    lookupPath: function(path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path)
            return {
                path: "",
                node: null
            };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        for (var key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key]
            }
        }
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32)
        }
        var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
        }), false);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(32)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    },
    getPath: function(node) {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path)
                    return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    },
    hashName: function(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    },
    hashAddNode: function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    },
    hashRemoveNode: function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    },
    lookupNode: function(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
            throw new FS.ErrnoError(errCode,parent)
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    },
    createNode: function(parent, name, mode, rdev) {
        var node = new FS.FSNode(parent,name,mode,rdev);
        FS.hashAddNode(node);
        return node
    },
    destroyNode: function(node) {
        FS.hashRemoveNode(node)
    },
    isRoot: function(node) {
        return node === node.parent
    },
    isMountpoint: function(node) {
        return !!node.mounted
    },
    isFile: function(mode) {
        return (mode & 61440) === 32768
    },
    isDir: function(mode) {
        return (mode & 61440) === 16384
    },
    isLink: function(mode) {
        return (mode & 61440) === 40960
    },
    isChrdev: function(mode) {
        return (mode & 61440) === 8192
    },
    isBlkdev: function(mode) {
        return (mode & 61440) === 24576
    },
    isFIFO: function(mode) {
        return (mode & 61440) === 4096
    },
    isSocket: function(mode) {
        return (mode & 49152) === 49152
    },
    flagModes: {
        "r": 0,
        "rs": 1052672,
        "r+": 2,
        "w": 577,
        "wx": 705,
        "xw": 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        "a": 1089,
        "ax": 1217,
        "xa": 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
    },
    modeStringToFlags: function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
        }
        return flags
    },
    flagsToPermissionString: function(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    },
    nodePermissions: function(node, perms) {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return 2
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return 2
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return 2
        }
        return 0
    },
    mayLookup: function(dir) {
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode)
            return errCode;
        if (!dir.node_ops.lookup)
            return 2;
        return 0
    },
    mayCreate: function(dir, name) {
        try {
            var node = FS.lookupNode(dir, name);
            return 20
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    },
    mayDelete: function(dir, name, isdir) {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
            return errCode
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 54
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 31
            }
        }
        return 0
    },
    mayOpen: function(node, flags) {
        if (!node) {
            return 44
        }
        if (FS.isLink(node.mode)) {
            return 32
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    },
    MAX_OPEN_FDS: 4096,
    nextfd: function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(33)
    },
    getStream: function(fd) {
        return FS.streams[fd]
    },
    createStream: function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
            FS.FSStream = function() {}
            ;
            FS.FSStream.prototype = {
                object: {
                    get: function() {
                        return this.node
                    },
                    set: function(val) {
                        this.node = val
                    }
                },
                isRead: {
                    get: function() {
                        return (this.flags & 2097155) !== 1
                    }
                },
                isWrite: {
                    get: function() {
                        return (this.flags & 2097155) !== 0
                    }
                },
                isAppend: {
                    get: function() {
                        return this.flags & 1024
                    }
                }
            }
        }
        var newStream = new FS.FSStream;
        for (var p in stream) {
            newStream[p] = stream[p]
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    },
    closeStream: function(fd) {
        FS.streams[fd] = null
    },
    chrdev_stream_ops: {
        open: function(stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        },
        llseek: function() {
            throw new FS.ErrnoError(70)
        }
    },
    major: function(dev) {
        return dev >> 8
    },
    minor: function(dev) {
        return dev & 255
    },
    makedev: function(ma, mi) {
        return ma << 8 | mi
    },
    registerDevice: function(dev, ops) {
        FS.devices[dev] = {
            stream_ops: ops
        }
    },
    getDevice: function(dev) {
        return FS.devices[dev]
    },
    getMounts: function(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    },
    syncfs: function(populate, callback) {
        if (typeof populate === "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(errCode)
        }
        function done(errCode) {
            if (errCode) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach(function(mount) {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        })
    },
    mount: function(type, opts, mountpoint) {
        if (typeof type === "string") {
            throw type
        }
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(10)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    },
    unmount: function(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(function(hash) {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.indexOf(current.mount) !== -1) {
                    FS.destroyNode(current)
                }
                current = next
            }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1)
    },
    lookup: function(parent, name) {
        return parent.node_ops.lookup(parent, name)
    },
    mknod: function(path, mode, dev) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28)
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    },
    create: function(path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    },
    mkdir: function(path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    },
    mkdirTree: function(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i])
                continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != 20)
                    throw e
            }
        }
    },
    mkdev: function(path, mode, dev) {
        if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    },
    symlink: function(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44)
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    },
    rename: function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        try {
            lookup = FS.lookupPath(old_path, {
                parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
                parent: true
            });
            new_dir = lookup.node
        } catch (e) {
            throw new FS.ErrnoError(10)
        }
        if (!old_dir || !new_dir)
            throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28)
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10)
        }
        if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
                throw new FS.ErrnoError(errCode)
            }
        }
        try {
            if (FS.trackingDelegate["willMovePath"]) {
                FS.trackingDelegate["willMovePath"](old_path, new_path)
            }
        } catch (e) {
            err("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
        try {
            if (FS.trackingDelegate["onMovePath"])
                FS.trackingDelegate["onMovePath"](old_path, new_path)
        } catch (e) {
            err("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
    },
    rmdir: function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"])
                FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    },
    readdir: function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54)
        }
        return node.node_ops.readdir(node)
    },
    unlink: function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"])
                FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    },
    readlink: function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(44)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28)
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    },
    stat: function(path, dontFollow) {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63)
        }
        return node.node_ops.getattr(node)
    },
    lstat: function(path) {
        return FS.stat(path, true)
    },
    chmod: function(path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    },
    lchmod: function(path, mode) {
        FS.chmod(path, mode, true)
    },
    fchmod: function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chmod(stream.node, mode)
    },
    chown: function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    },
    lchown: function(path, uid, gid) {
        FS.chown(path, uid, gid, true)
    },
    fchown: function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chown(stream.node, uid, gid)
    },
    truncate: function(path, len) {
        if (len < 0) {
            throw new FS.ErrnoError(28)
        }
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28)
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    },
    ftruncate: function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28)
        }
        FS.truncate(stream.node, len)
    },
    utime: function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    },
    open: function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
            throw new FS.ErrnoError(44)
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path === "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(20)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
        }
        if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
                throw new FS.ErrnoError(errCode)
            }
        }
        if (flags & 512) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        }, fd_start, fd_end);
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles)
                FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                err("FS.trackingDelegate error on read file: " + path)
            }
        }
        try {
            if (FS.trackingDelegate["onOpenFile"]) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ
                }
                if ((flags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE
                }
                FS.trackingDelegate["onOpenFile"](path, trackingFlags)
            }
        } catch (e) {
            err("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
        }
        return stream
    },
    close: function(stream) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (stream.getdents)
            stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
        stream.fd = null
    },
    isClosed: function(stream) {
        return stream.fd === null
    },
    llseek: function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70)
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    },
    read: function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking)
            stream.position += bytesRead;
        return bytesRead
    },
    write: function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28)
        }
        if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking)
            stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"])
                FS.trackingDelegate["onWriteToFile"](stream.path)
        } catch (e) {
            err("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message)
        }
        return bytesWritten
    },
    allocate: function(stream, offset, length) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138)
        }
        stream.stream_ops.allocate(stream, offset, length)
    },
    mmap: function(stream, buffer, offset, length, position, prot, flags) {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43)
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    },
    munmap: function(stream) {
        return 0
    },
    ioctl: function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    },
    readFile: function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "r";
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    },
    writeFile: function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "w";
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
            throw new Error("Unsupported data type")
        }
        FS.close(stream)
    },
    cwd: function() {
        return FS.currentPath
    },
    chdir: function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(44)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54)
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        FS.currentPath = lookup.path
    },
    createDefaultDirectories: function() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    },
    createDefaultDevices: function() {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: function() {
                return 0
            },
            write: function(stream, buffer, offset, length, pos) {
                return length
            }
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device;
        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
            var randomBuffer = new Uint8Array(1);
            random_device = function() {
                crypto.getRandomValues(randomBuffer);
                return randomBuffer[0]
            }
        } else if (ENVIRONMENT_IS_NODE) {
            try {
                var crypto_module = require("crypto");
                random_device = function() {
                    return crypto_module["randomBytes"](1)[0]
                }
            } catch (e) {}
        } else {}
        if (!random_device) {
            random_device = function() {
                abort("no cryptographic support found for random_device. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };")
            }
        }
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    },
    createSpecialDirectories: function() {
        FS.mkdir("/proc");
        FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: function() {
                var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: function(parent, name) {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream)
                            throw new FS.ErrnoError(8);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: function() {
                                    return stream.path
                                }
                            }
                        };
                        ret.parent = ret;
                        return ret
                    }
                };
                return node
            }
        }, {}, "/proc/self/fd")
    },
    createStandardStreams: function() {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", "r");
        var stdout = FS.open("/dev/stdout", "w");
        var stderr = FS.open("/dev/stderr", "w");
        assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
        assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
        assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")")
    },
    ensureErrnoError: function() {
        if (FS.ErrnoError)
            return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function(errno) {
                this.errno = errno;
                for (var key in ERRNO_CODES) {
                    if (ERRNO_CODES[key] === errno) {
                        this.code = key;
                        break
                    }
                }
            }
            ;
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];
            if (this.stack) {
                Object.defineProperty(this, "stack", {
                    value: (new Error).stack,
                    writable: true
                });
                this.stack = demangleAll(this.stack)
            }
        }
        ;
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach(function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        })
    },
    staticInit: function() {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS
        }
    },
    init: function(input, output, error) {
        assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    },
    quit: function() {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush)
            fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    },
    getMode: function(canRead, canWrite) {
        var mode = 0;
        if (canRead)
            mode |= 292 | 73;
        if (canWrite)
            mode |= 146;
        return mode
    },
    joinPath: function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == "/")
            path = path.substr(1);
        return path
    },
    absolutePath: function(relative, base) {
        return PATH_FS.resolve(base, relative)
    },
    standardizePath: function(path) {
        return PATH.normalize(path)
    },
    findObject: function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object
        } else {
            setErrNo(ret.error);
            return null
        }
    },
    analyzePath: function(path, dontResolveLastLink) {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    },
    createFolder: function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode)
    },
    createPath: function(parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part)
                continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    },
    createFile: function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode)
    },
    createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data === "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i)
                    arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, "w");
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    },
    createDevice: function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major)
            FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: function(stream) {
                stream.seekable = false
            },
            close: function(stream) {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            },
            read: function(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6)
                    }
                    if (result === null || result === undefined)
                        break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            },
            write: function(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            }
        });
        return FS.mkdev(path, mode, dev)
    },
    createLink: function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path)
    },
    forceLoadFile: function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
            return true;
        var success = true;
        if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
        } else if (read_) {
            try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                success = false
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
        if (!success)
            setErrNo(29);
        return success
    },
    createLazyFile: function(parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        }
        ;
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        }
        ;
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing)
                chunkSize = datalength;
            var doXHR = function(from, to) {
                if (from > to)
                    throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1)
                    throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize)
                    xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                if (typeof Uint8Array != "undefined")
                    xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
                    throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                } else {
                    return intArrayFromString(xhr.responseText || "", true)
                }
            };
            var lazyArray = this;
            lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] === "undefined")
                    throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        }
        ;
        if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    }
                },
                chunkSize: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    }
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: function() {
                    return this.contents.length
                }
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                    throw new FS.ErrnoError(29)
                }
                return fn.apply(null, arguments)
            }
        });
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(29)
            }
            var contents = stream.node.contents;
            if (position >= contents.length)
                return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        }
        ;
        node.stream_ops = stream_ops;
        return node
    },
    createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);
        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish)
                    preFinish();
                if (!dontCreateFile) {
                    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                }
                if (onload)
                    onload();
                removeRunDependency(dep)
            }
            var handled = false;
            Module["preloadPlugins"].forEach(function(plugin) {
                if (handled)
                    return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, function() {
                        if (onerror)
                            onerror();
                        removeRunDependency(dep)
                    });
                    handled = true
                }
            });
            if (!handled)
                finish(byteArray)
        }
        addRunDependency(dep);
        if (typeof url == "string") {
            Browser.asyncLoad(url, function(byteArray) {
                processData(byteArray)
            }, onerror)
        } else {
            processData(url)
        }
    },
    indexedDB: function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    },
    DB_NAME: function() {
        return "EM_FS_" + window.location.pathname
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: function(paths, onload, onerror) {
        onload = onload || function() {}
        ;
        onerror = onerror || function() {}
        ;
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            out("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
        }
        ;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0
              , fail = 0
              , total = paths.length;
            function finish() {
                if (fail == 0)
                    onload();
                else
                    onerror()
            }
            paths.forEach(function(path) {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = function putRequest_onsuccess() {
                    ok++;
                    if (ok + fail == total)
                        finish()
                }
                ;
                putRequest.onerror = function putRequest_onerror() {
                    fail++;
                    if (ok + fail == total)
                        finish()
                }
            });
            transaction.onerror = onerror
        }
        ;
        openRequest.onerror = onerror
    },
    loadFilesFromDB: function(paths, onload, onerror) {
        onload = onload || function() {}
        ;
        onerror = onerror || function() {}
        ;
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                onerror(e);
                return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0
              , fail = 0
              , total = paths.length;
            function finish() {
                if (fail == 0)
                    onload();
                else
                    onerror()
            }
            paths.forEach(function(path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path)
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                    ok++;
                    if (ok + fail == total)
                        finish()
                }
                ;
                getRequest.onerror = function getRequest_onerror() {
                    fail++;
                    if (ok + fail == total)
                        finish()
                }
            });
            transaction.onerror = onerror
        }
        ;
        openRequest.onerror = onerror
    }
};
var SYSCALLS = {
    mappings: {},
    DEFAULT_POLLMASK: 5,
    umask: 511,
    calculateAt: function(dirfd, path) {
        if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
                dir = FS.cwd()
            } else {
                var dirstream = FS.getStream(dirfd);
                if (!dirstream)
                    throw new FS.ErrnoError(8);
                dir = dirstream.path
            }
            path = PATH.join2(dir, path)
        }
        return path
    },
    doStat: function(func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -54
            }
            throw e
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        tempI64 = [stat.size >>> 0, (tempDouble = stat.size,
        +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
        HEAP32[buf + 40 >> 2] = tempI64[0],
        HEAP32[buf + 44 >> 2] = tempI64[1];
        HEAP32[buf + 48 >> 2] = 4096;
        HEAP32[buf + 52 >> 2] = stat.blocks;
        HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 76 >> 2] = 0;
        tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino,
        +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
        HEAP32[buf + 80 >> 2] = tempI64[0],
        HEAP32[buf + 84 >> 2] = tempI64[1];
        return 0
    },
    doMsync: function(addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags)
    },
    doMkdir: function(path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/")
            path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    },
    doMknod: function(path, mode, dev) {
        switch (mode & 61440) {
        case 32768:
        case 8192:
        case 24576:
        case 4096:
        case 49152:
            break;
        default:
            return -28
        }
        FS.mknod(path, mode, dev);
        return 0
    },
    doReadlink: function(path, buf, bufsize) {
        if (bufsize <= 0)
            return -28;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len
    },
    doAccess: function(path, amode) {
        if (amode & ~7) {
            return -28
        }
        var node;
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        node = lookup.node;
        if (!node) {
            return -44
        }
        var perms = "";
        if (amode & 4)
            perms += "r";
        if (amode & 2)
            perms += "w";
        if (amode & 1)
            perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -2
        }
        return 0
    },
    doDup: function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest)
            FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd
    },
    doReadv: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr;
            if (curr < len)
                break
        }
        return ret
    },
    doWritev: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0)
                return -1;
            ret += curr
        }
        return ret
    },
    varargs: undefined,
    get: function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    },
    getStr: function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret
    },
    getStreamFromFD: function(fd) {
        var stream = FS.getStream(fd);
        if (!stream)
            throw new FS.ErrnoError(8);
        return stream
    },
    get64: function(low, high) {
        if (low >= 0)
            assert(high === 0);
        else
            assert(high === -1);
        return low
    }
};
function syscallMunmap(addr, len) {
    if ((addr | 0) === -1 || len === 0) {
        return -28
    }
    var info = SYSCALLS.mappings[addr];
    if (!info)
        return 0;
    if (len === info.len) {
        var stream = FS.getStream(info.fd);
        if (info.prot & 2) {
            SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset)
        }
        FS.munmap(stream);
        SYSCALLS.mappings[addr] = null;
        if (info.allocated) {
            _free(info.malloc)
        }
    }
    return 0
}
function ___sys_munmap(addr, len) {
    try {
        return syscallMunmap(addr, len)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return -e.errno
    }
}
function ___syscall91(a0, a1) {
    return ___sys_munmap(a0, a1)
}
function _fd_write(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doWritev(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
            abort(e);
        return e.errno
    }
}
function ___wasi_fd_write(a0, a1, a2, a3) {
    return _fd_write(a0, a1, a2, a3)
}
function getShiftFromSize(size) {
    switch (size) {
    case 1:
        return 0;
    case 2:
        return 1;
    case 4:
        return 2;
    case 8:
        return 3;
    default:
        throw new TypeError("Unknown type size: " + size)
    }
}
function embind_init_charCodes() {
    var codes = new Array(256);
    for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i)
    }
    embind_charCodes = codes
}
var embind_charCodes = undefined;
function readLatin1String(ptr) {
    var ret = "";
    var c = ptr;
    while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]]
    }
    return ret
}
var awaitingDependencies = {};
var registeredTypes = {};
var typeDependencies = {};
var char_0 = 48;
var char_9 = 57;
function makeLegalFunctionName(name) {
    if (undefined === name) {
        return "_unknown"
    }
    name = name.replace(/[^a-zA-Z0-9_]/g, "$");
    var f = name.charCodeAt(0);
    if (f >= char_0 && f <= char_9) {
        return "_" + name
    } else {
        return name
    }
}
function createNamedFunction(name, body) {
    name = makeLegalFunctionName(name);
    return new Function("body","return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body)
}
function extendError(baseErrorType, errorName) {
    var errorClass = createNamedFunction(errorName, function(message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
            this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "")
        }
    });
    errorClass.prototype = Object.create(baseErrorType.prototype);
    errorClass.prototype.constructor = errorClass;
    errorClass.prototype.toString = function() {
        if (this.message === undefined) {
            return this.name
        } else {
            return this.name + ": " + this.message
        }
    }
    ;
    return errorClass
}
var BindingError = undefined;
function throwBindingError(message) {
    throw new BindingError(message)
}
var InternalError = undefined;
function throwInternalError(message) {
    throw new InternalError(message)
}
function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
    myTypes.forEach(function(type) {
        typeDependencies[type] = dependentTypes
    });
    function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
            throwInternalError("Mismatched type converter count")
        }
        for (var i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i])
        }
    }
    var typeConverters = new Array(dependentTypes.length);
    var unregisteredTypes = [];
    var registered = 0;
    dependentTypes.forEach(function(dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt]
        } else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) {
                awaitingDependencies[dt] = []
            }
            awaitingDependencies[dt].push(function() {
                typeConverters[i] = registeredTypes[dt];
                ++registered;
                if (registered === unregisteredTypes.length) {
                    onComplete(typeConverters)
                }
            })
        }
    });
    if (0 === unregisteredTypes.length) {
        onComplete(typeConverters)
    }
}
function registerType(rawType, registeredInstance, options) {
    options = options || {};
    if (!("argPackAdvance"in registeredInstance)) {
        throw new TypeError("registerType registeredInstance requires argPackAdvance")
    }
    var name = registeredInstance.name;
    if (!rawType) {
        throwBindingError('type "' + name + '" must have a positive integer typeid pointer')
    }
    if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
            return
        } else {
            throwBindingError("Cannot register type '" + name + "' twice")
        }
    }
    registeredTypes[rawType] = registeredInstance;
    delete typeDependencies[rawType];
    if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function(cb) {
            cb()
        })
    }
}
function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
    var shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": function(wt) {
            return !!wt
        },
        "toWireType": function(destructors, o) {
            return o ? trueValue : falseValue
        },
        "argPackAdvance": 8,
        "readValueFromPointer": function(pointer) {
            var heap;
            if (size === 1) {
                heap = HEAP8
            } else if (size === 2) {
                heap = HEAP16
            } else if (size === 4) {
                heap = HEAP32
            } else {
                throw new TypeError("Unknown boolean type size: " + name)
            }
            return this["fromWireType"](heap[pointer >> shift])
        },
        destructorFunction: null
    })
}
function ClassHandle_isAliasOf(other) {
    if (!(this instanceof ClassHandle)) {
        return false
    }
    if (!(other instanceof ClassHandle)) {
        return false
    }
    var leftClass = this.$$.ptrType.registeredClass;
    var left = this.$$.ptr;
    var rightClass = other.$$.ptrType.registeredClass;
    var right = other.$$.ptr;
    while (leftClass.baseClass) {
        left = leftClass.upcast(left);
        leftClass = leftClass.baseClass
    }
    while (rightClass.baseClass) {
        right = rightClass.upcast(right);
        rightClass = rightClass.baseClass
    }
    return leftClass === rightClass && left === right
}
function shallowCopyInternalPointer(o) {
    return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType
    }
}
function throwInstanceAlreadyDeleted(obj) {
    function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name
    }
    throwBindingError(getInstanceTypeName(obj) + " instance already deleted")
}
var finalizationGroup = false;
function detachFinalizer(handle) {}
function runDestructor($$) {
    if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr)
    } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr)
    }
}
function releaseClassHandle($$) {
    $$.count.value -= 1;
    var toDelete = 0 === $$.count.value;
    if (toDelete) {
        runDestructor($$)
    }
}
function attachFinalizer(handle) {
    if ("undefined" === typeof FinalizationGroup) {
        attachFinalizer = function(handle) {
            return handle
        }
        ;
        return handle
    }
    finalizationGroup = new FinalizationGroup(function(iter) {
        for (var result = iter.next(); !result.done; result = iter.next()) {
            var $$ = result.value;
            if (!$$.ptr) {
                console.warn("object already deleted: " + $$.ptr)
            } else {
                releaseClassHandle($$)
            }
        }
    }
    );
    attachFinalizer = function(handle) {
        finalizationGroup.register(handle, handle.$$, handle.$$);
        return handle
    }
    ;
    detachFinalizer = function(handle) {
        finalizationGroup.unregister(handle.$$)
    }
    ;
    return attachFinalizer(handle)
}
function ClassHandle_clone() {
    if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this)
    }
    if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this
    } else {
        var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
            $$: {
                value: shallowCopyInternalPointer(this.$$)
            }
        }));
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone
    }
}
function ClassHandle_delete() {
    if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this)
    }
    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion")
    }
    detachFinalizer(this);
    releaseClassHandle(this.$$);
    if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = undefined;
        this.$$.ptr = undefined
    }
}
function ClassHandle_isDeleted() {
    return !this.$$.ptr
}
var delayFunction = undefined;
var deletionQueue = [];
function flushPendingDeletes() {
    while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]()
    }
}
function ClassHandle_deleteLater() {
    if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this)
    }
    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion")
    }
    deletionQueue.push(this);
    if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes)
    }
    this.$$.deleteScheduled = true;
    return this
}
function init_ClassHandle() {
    ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
    ClassHandle.prototype["clone"] = ClassHandle_clone;
    ClassHandle.prototype["delete"] = ClassHandle_delete;
    ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
    ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater
}
function ClassHandle() {}
var registeredPointers = {};
function ensureOverloadTable(proto, methodName, humanName) {
    if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function() {
            if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!")
            }
            return proto[methodName].overloadTable[arguments.length].apply(this, arguments)
        }
        ;
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
    }
}
function exposePublicSymbol(name, value, numArguments) {
    if (Module.hasOwnProperty(name)) {
        if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
            throwBindingError("Cannot register public name '" + name + "' twice")
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
            throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!")
        }
        Module[name].overloadTable[numArguments] = value
    } else {
        Module[name] = value;
        if (undefined !== numArguments) {
            Module[name].numArguments = numArguments
        }
    }
}
function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
    this.name = name;
    this.constructor = constructor;
    this.instancePrototype = instancePrototype;
    this.rawDestructor = rawDestructor;
    this.baseClass = baseClass;
    this.getActualType = getActualType;
    this.upcast = upcast;
    this.downcast = downcast;
    this.pureVirtualFunctions = []
}
function upcastPointer(ptr, ptrClass, desiredClass) {
    while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
            throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name)
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass
    }
    return ptr
}
function constNoSmartPtrRawPointerToWireType(destructors, handle) {
    if (handle === null) {
        if (this.isReference) {
            throwBindingError("null is not a valid " + this.name)
        }
        return 0
    }
    if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
    }
    if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
    }
    var handleClass = handle.$$.ptrType.registeredClass;
    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    return ptr
}
function genericPointerToWireType(destructors, handle) {
    var ptr;
    if (handle === null) {
        if (this.isReference) {
            throwBindingError("null is not a valid " + this.name)
        }
        if (this.isSmartPointer) {
            ptr = this.rawConstructor();
            if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr)
            }
            return ptr
        } else {
            return 0
        }
    }
    if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
    }
    if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
    }
    if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name)
    }
    var handleClass = handle.$$.ptrType.registeredClass;
    ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
            throwBindingError("Passing raw pointer to smart pointer is illegal")
        }
        switch (this.sharingPolicy) {
        case 0:
            if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr
            } else {
                throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name)
            }
            break;
        case 1:
            ptr = handle.$$.smartPtr;
            break;
        case 2:
            if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr
            } else {
                var clonedHandle = handle["clone"]();
                ptr = this.rawShare(ptr, __emval_register(function() {
                    clonedHandle["delete"]()
                }));
                if (destructors !== null) {
                    destructors.push(this.rawDestructor, ptr)
                }
            }
            break;
        default:
            throwBindingError("Unsupporting sharing policy")
        }
    }
    return ptr
}
function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
    if (handle === null) {
        if (this.isReference) {
            throwBindingError("null is not a valid " + this.name)
        }
        return 0
    }
    if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
    }
    if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
    }
    if (handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name)
    }
    var handleClass = handle.$$.ptrType.registeredClass;
    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    return ptr
}
function simpleReadValueFromPointer(pointer) {
    return this["fromWireType"](HEAPU32[pointer >> 2])
}
function RegisteredPointer_getPointee(ptr) {
    if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr)
    }
    return ptr
}
function RegisteredPointer_destructor(ptr) {
    if (this.rawDestructor) {
        this.rawDestructor(ptr)
    }
}
function RegisteredPointer_deleteObject(handle) {
    if (handle !== null) {
        handle["delete"]()
    }
}
function downcastPointer(ptr, ptrClass, desiredClass) {
    if (ptrClass === desiredClass) {
        return ptr
    }
    if (undefined === desiredClass.baseClass) {
        return null
    }
    var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
    if (rv === null) {
        return null
    }
    return desiredClass.downcast(rv)
}
function getInheritedInstanceCount() {
    return Object.keys(registeredInstances).length
}
function getLiveInheritedInstances() {
    var rv = [];
    for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
            rv.push(registeredInstances[k])
        }
    }
    return rv
}
function setDelayFunction(fn) {
    delayFunction = fn;
    if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes)
    }
}
function init_embind() {
    Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
    Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
    Module["flushPendingDeletes"] = flushPendingDeletes;
    Module["setDelayFunction"] = setDelayFunction
}
var registeredInstances = {};
function getBasestPointer(class_, ptr) {
    if (ptr === undefined) {
        throwBindingError("ptr should not be undefined")
    }
    while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass
    }
    return ptr
}
function getInheritedInstance(class_, ptr) {
    ptr = getBasestPointer(class_, ptr);
    return registeredInstances[ptr]
}
function makeClassHandle(prototype, record) {
    if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType")
    }
    var hasSmartPtrType = !!record.smartPtrType;
    var hasSmartPtr = !!record.smartPtr;
    if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified")
    }
    record.count = {
        value: 1
    };
    return attachFinalizer(Object.create(prototype, {
        $$: {
            value: record
        }
    }))
}
function RegisteredPointer_fromWireType(ptr) {
    var rawPointer = this.getPointee(ptr);
    if (!rawPointer) {
        this.destructor(ptr);
        return null
    }
    var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
    if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]()
        } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv
        }
    }
    function makeDefaultHandle() {
        if (this.isSmartPointer) {
            return makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this.pointeeType,
                ptr: rawPointer,
                smartPtrType: this,
                smartPtr: ptr
            })
        } else {
            return makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this,
                ptr: ptr
            })
        }
    }
    var actualType = this.registeredClass.getActualType(rawPointer);
    var registeredPointerRecord = registeredPointers[actualType];
    if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this)
    }
    var toType;
    if (this.isConst) {
        toType = registeredPointerRecord.constPointerType
    } else {
        toType = registeredPointerRecord.pointerType
    }
    var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
    if (dp === null) {
        return makeDefaultHandle.call(this)
    }
    if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp,
            smartPtrType: this,
            smartPtr: ptr
        })
    } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp
        })
    }
}
function init_RegisteredPointer() {
    RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
    RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
    RegisteredPointer.prototype["argPackAdvance"] = 8;
    RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
    RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
    RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType
}
function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
    this.name = name;
    this.registeredClass = registeredClass;
    this.isReference = isReference;
    this.isConst = isConst;
    this.isSmartPointer = isSmartPointer;
    this.pointeeType = pointeeType;
    this.sharingPolicy = sharingPolicy;
    this.rawGetPointee = rawGetPointee;
    this.rawConstructor = rawConstructor;
    this.rawShare = rawShare;
    this.rawDestructor = rawDestructor;
    if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
            this["toWireType"] = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null
        } else {
            this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null
        }
    } else {
        this["toWireType"] = genericPointerToWireType
    }
}
function replacePublicSymbol(name, value, numArguments) {
    if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol")
    }
    if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value
    } else {
        Module[name] = value;
        Module[name].argCount = numArguments
    }
}
function embind__requireFunction(signature, rawFunction) {
    signature = readLatin1String(signature);
    function makeDynCaller(dynCall) {
        var args = [];
        for (var i = 1; i < signature.length; ++i) {
            args.push("a" + i)
        }
        var name = "dynCall_" + signature + "_" + rawFunction;
        var body = "return function " + name + "(" + args.join(", ") + ") {\n";
        body += "    return dynCall(rawFunction" + (args.length ? ", " : "") + args.join(", ") + ");\n";
        body += "};\n";
        return new Function("dynCall","rawFunction",body)(dynCall, rawFunction)
    }
    var dc = Module["dynCall_" + signature];
    var fp = makeDynCaller(dc);
    if (typeof fp !== "function") {
        throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction)
    }
    return fp
}
var UnboundTypeError = undefined;
function getTypeName(type) {
    var ptr = ___getTypeName(type);
    var rv = readLatin1String(ptr);
    _free(ptr);
    return rv
}
function throwUnboundTypeError(message, types) {
    var unboundTypes = [];
    var seen = {};
    function visit(type) {
        if (seen[type]) {
            return
        }
        if (registeredTypes[type]) {
            return
        }
        if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return
        }
        unboundTypes.push(type);
        seen[type] = true
    }
    types.forEach(visit);
    throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]))
}
function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
    name = readLatin1String(name);
    getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
    if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast)
    }
    if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast)
    }
    rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
    var legalFunctionName = makeLegalFunctionName(name);
    exposePublicSymbol(legalFunctionName, function() {
        throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType])
    });
    whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
        base = base[0];
        var baseClass;
        var basePrototype;
        if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype
        } else {
            basePrototype = ClassHandle.prototype
        }
        var constructor = createNamedFunction(legalFunctionName, function() {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
                throw new BindingError("Use 'new' to construct " + name)
            }
            if (undefined === registeredClass.constructor_body) {
                throw new BindingError(name + " has no accessible constructor")
            }
            var body = registeredClass.constructor_body[arguments.length];
            if (undefined === body) {
                throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!")
            }
            return body.apply(this, arguments)
        });
        var instancePrototype = Object.create(basePrototype, {
            constructor: {
                value: constructor
            }
        });
        constructor.prototype = instancePrototype;
        var registeredClass = new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);
        var referenceConverter = new RegisteredPointer(name,registeredClass,true,false,false);
        var pointerConverter = new RegisteredPointer(name + "*",registeredClass,false,false,false);
        var constPointerConverter = new RegisteredPointer(name + " const*",registeredClass,false,true,false);
        registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
        };
        replacePublicSymbol(legalFunctionName, constructor);
        return [referenceConverter, pointerConverter, constPointerConverter]
    })
}
function new_(constructor, argumentList) {
    if (!(constructor instanceof Function)) {
        throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function")
    }
    var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
    dummy.prototype = constructor.prototype;
    var obj = new dummy;
    var r = constructor.apply(obj, argumentList);
    return r instanceof Object ? r : obj
}
function runDestructors(destructors) {
    while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr)
    }
}
function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
    var argCount = argTypes.length;
    if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")
    }
    var isClassMethodFunc = argTypes[1] !== null && classType !== null;
    var needsDestructorStack = false;
    for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
            needsDestructorStack = true;
            break
        }
    }
    var returns = argTypes[0].name !== "void";
    var argsList = "";
    var argsListWired = "";
    for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired"
    }
    var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";
    if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n"
    }
    var dtorStack = needsDestructorStack ? "destructors" : "null";
    var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
    var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
    if (isClassMethodFunc) {
        invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n"
    }
    for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2])
    }
    if (isClassMethodFunc) {
        argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired
    }
    invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
    if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n"
    } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
            if (argTypes[i].destructorFunction !== null) {
                invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
                args1.push(paramName + "_dtor");
                args2.push(argTypes[i].destructorFunction)
            }
        }
    }
    if (returns) {
        invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n"
    } else {}
    invokerFnBody += "}\n";
    args1.push(invokerFnBody);
    var invokerFunction = new_(Function, args1).apply(null, args2);
    return invokerFunction
}
function heap32VectorToArray(count, firstElement) {
    var array = [];
    for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i])
    }
    return array
}
function __embind_register_class_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, fn) {
    var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    methodName = readLatin1String(methodName);
    rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
    whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;
        function unboundTypesHandler() {
            throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes)
        }
        var proto = classType.registeredClass.constructor;
        if (undefined === proto[methodName]) {
            unboundTypesHandler.argCount = argCount - 1;
            proto[methodName] = unboundTypesHandler
        } else {
            ensureOverloadTable(proto, methodName, humanName);
            proto[methodName].overloadTable[argCount - 1] = unboundTypesHandler
        }
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
            var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
            var func = craftInvokerFunction(humanName, invokerArgsArray, null, rawInvoker, fn);
            if (undefined === proto[methodName].overloadTable) {
                func.argCount = argCount - 1;
                proto[methodName] = func
            } else {
                proto[methodName].overloadTable[argCount - 1] = func
            }
            return []
        });
        return []
    })
}
function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
    var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    methodName = readLatin1String(methodName);
    rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
    whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;
        if (isPureVirtual) {
            classType.registeredClass.pureVirtualFunctions.push(methodName)
        }
        function unboundTypesHandler() {
            throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes)
        }
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
            unboundTypesHandler.argCount = argCount - 2;
            unboundTypesHandler.className = classType.name;
            proto[methodName] = unboundTypesHandler
        } else {
            ensureOverloadTable(proto, methodName, humanName);
            proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler
        }
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
            var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
            if (undefined === proto[methodName].overloadTable) {
                memberFunction.argCount = argCount - 2;
                proto[methodName] = memberFunction
            } else {
                proto[methodName].overloadTable[argCount - 2] = memberFunction
            }
            return []
        });
        return []
    })
}
var emval_free_list = [];
var emval_handle_array = [{}, {
    value: undefined
}, {
    value: null
}, {
    value: true
}, {
    value: false
}];
function __emval_decref(handle) {
    if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle)
    }
}
function count_emval_handles() {
    var count = 0;
    for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
            ++count
        }
    }
    return count
}
function get_first_emval() {
    for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
            return emval_handle_array[i]
        }
    }
    return null
}
function init_emval() {
    Module["count_emval_handles"] = count_emval_handles;
    Module["get_first_emval"] = get_first_emval
}
function __emval_register(value) {
    switch (value) {
    case undefined:
        {
            return 1
        }
    case null:
        {
            return 2
        }
    case true:
        {
            return 3
        }
    case false:
        {
            return 4
        }
    default:
        {
            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
            emval_handle_array[handle] = {
                refcount: 1,
                value: value
            };
            return handle
        }
    }
}
function __embind_register_emval(rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": function(handle) {
            var rv = emval_handle_array[handle].value;
            __emval_decref(handle);
            return rv
        },
        "toWireType": function(destructors, value) {
            return __emval_register(value)
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: null
    })
}
function _embind_repr(v) {
    if (v === null) {
        return "null"
    }
    var t = typeof v;
    if (t === "object" || t === "array" || t === "function") {
        return v.toString()
    } else {
        return "" + v
    }
}
function floatReadValueFromPointer(name, shift) {
    switch (shift) {
    case 2:
        return function(pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2])
        }
        ;
    case 3:
        return function(pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3])
        }
        ;
    default:
        throw new TypeError("Unknown float type: " + name)
    }
}
function __embind_register_float(rawType, name, size) {
    var shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": function(value) {
            return value
        },
        "toWireType": function(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
                throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
            }
            return value
        },
        "argPackAdvance": 8,
        "readValueFromPointer": floatReadValueFromPointer(name, shift),
        destructorFunction: null
    })
}
function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
    var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    name = readLatin1String(name);
    rawInvoker = embind__requireFunction(signature, rawInvoker);
    exposePublicSymbol(name, function() {
        throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes)
    }, argCount - 1);
    whenDependentTypesAreResolved([], argTypes, function(argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
        return []
    })
}
function integerReadValueFromPointer(name, shift, signed) {
    switch (shift) {
    case 0:
        return signed ? function readS8FromPointer(pointer) {
            return HEAP8[pointer]
        }
        : function readU8FromPointer(pointer) {
            return HEAPU8[pointer]
        }
        ;
    case 1:
        return signed ? function readS16FromPointer(pointer) {
            return HEAP16[pointer >> 1]
        }
        : function readU16FromPointer(pointer) {
            return HEAPU16[pointer >> 1]
        }
        ;
    case 2:
        return signed ? function readS32FromPointer(pointer) {
            return HEAP32[pointer >> 2]
        }
        : function readU32FromPointer(pointer) {
            return HEAPU32[pointer >> 2]
        }
        ;
    default:
        throw new TypeError("Unknown integer type: " + name)
    }
}
function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
    name = readLatin1String(name);
    if (maxRange === -1) {
        maxRange = 4294967295
    }
    var shift = getShiftFromSize(size);
    var fromWireType = function(value) {
        return value
    };
    if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = function(value) {
            return value << bitshift >>> bitshift
        }
    }
    var isUnsignedType = name.indexOf("unsigned") != -1;
    registerType(primitiveType, {
        name: name,
        "fromWireType": fromWireType,
        "toWireType": function(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
                throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
            }
            if (value < minRange || value > maxRange) {
                throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!")
            }
            return isUnsignedType ? value >>> 0 : value | 0
        },
        "argPackAdvance": 8,
        "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
        destructorFunction: null
    })
}
function __embind_register_memory_view(rawType, dataTypeIndex, name) {
    var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
    var TA = typeMapping[dataTypeIndex];
    function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(buffer,data,size)
    }
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": decodeMemoryView,
        "argPackAdvance": 8,
        "readValueFromPointer": decodeMemoryView
    }, {
        ignoreDuplicateRegistrations: true
    })
}
function __embind_register_std_string(rawType, name) {
    name = readLatin1String(name);
    var stdStringIsUTF8 = name === "std::string";
    registerType(rawType, {
        name: name,
        "fromWireType": function(value) {
            var length = HEAPU32[value >> 2];
            var str;
            if (stdStringIsUTF8) {
                var decodeStartPtr = value + 4;
                for (var i = 0; i <= length; ++i) {
                    var currentBytePtr = value + 4 + i;
                    if (HEAPU8[currentBytePtr] == 0 || i == length) {
                        var maxRead = currentBytePtr - decodeStartPtr;
                        var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                        if (str === undefined) {
                            str = stringSegment
                        } else {
                            str += String.fromCharCode(0);
                            str += stringSegment
                        }
                        decodeStartPtr = currentBytePtr + 1
                    }
                }
            } else {
                var a = new Array(length);
                for (var i = 0; i < length; ++i) {
                    a[i] = String.fromCharCode(HEAPU8[value + 4 + i])
                }
                str = a.join("")
            }
            _free(value);
            return str
        },
        "toWireType": function(destructors, value) {
            if (value instanceof ArrayBuffer) {
                value = new Uint8Array(value)
            }
            var getLength;
            var valueIsOfTypeString = typeof value === "string";
            if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                throwBindingError("Cannot pass non-string to std::string")
            }
            if (stdStringIsUTF8 && valueIsOfTypeString) {
                getLength = function() {
                    return lengthBytesUTF8(value)
                }
            } else {
                getLength = function() {
                    return value.length
                }
            }
            var length = getLength();
            var ptr = _malloc(4 + length + 1);
            HEAPU32[ptr >> 2] = length;
            if (stdStringIsUTF8 && valueIsOfTypeString) {
                stringToUTF8(value, ptr + 4, length + 1)
            } else {
                if (valueIsOfTypeString) {
                    for (var i = 0; i < length; ++i) {
                        var charCode = value.charCodeAt(i);
                        if (charCode > 255) {
                            _free(ptr);
                            throwBindingError("String has UTF-16 code units that do not fit in 8 bits")
                        }
                        HEAPU8[ptr + 4 + i] = charCode
                    }
                } else {
                    for (var i = 0; i < length; ++i) {
                        HEAPU8[ptr + 4 + i] = value[i]
                    }
                }
            }
            if (destructors !== null) {
                destructors.push(_free, ptr)
            }
            return ptr
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function(ptr) {
            _free(ptr)
        }
    })
}
function __embind_register_std_wstring(rawType, charSize, name) {
    name = readLatin1String(name);
    var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
    if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = function() {
            return HEAPU16
        }
        ;
        shift = 1
    } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = function() {
            return HEAPU32
        }
        ;
        shift = 2
    }
    registerType(rawType, {
        name: name,
        "fromWireType": function(value) {
            var length = HEAPU32[value >> 2];
            var HEAP = getHeap();
            var str;
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
                var currentBytePtr = value + 4 + i * charSize;
                if (HEAP[currentBytePtr >> shift] == 0 || i == length) {
                    var maxReadBytes = currentBytePtr - decodeStartPtr;
                    var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                    if (str === undefined) {
                        str = stringSegment
                    } else {
                        str += String.fromCharCode(0);
                        str += stringSegment
                    }
                    decodeStartPtr = currentBytePtr + charSize
                }
            }
            _free(value);
            return str
        },
        "toWireType": function(destructors, value) {
            if (!(typeof value === "string")) {
                throwBindingError("Cannot pass non-string to C++ string type " + name)
            }
            var length = lengthBytesUTF(value);
            var ptr = _malloc(4 + length + charSize);
            HEAPU32[ptr >> 2] = length >> shift;
            encodeString(value, ptr + 4, length + charSize);
            if (destructors !== null) {
                destructors.push(_free, ptr)
            }
            return ptr
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function(ptr) {
            _free(ptr)
        }
    })
}
function __embind_register_void(rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
        isVoid: true,
        name: name,
        "argPackAdvance": 0,
        "fromWireType": function() {
            return undefined
        },
        "toWireType": function(destructors, o) {
            return undefined
        }
    })
}
function _abort() {
    abort()
}
function _emscripten_get_heap_size() {
    return HEAPU8.length
}
var _emscripten_get_now;
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function() {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else if (typeof dateNow !== "undefined") {
    _emscripten_get_now = dateNow
} else
    _emscripten_get_now = function() {
        return performance.now()
    }
    ;
function emscripten_realloc_buffer(size) {
    try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1
    } catch (e) {
        console.error("emscripten_realloc_buffer: Attempted to grow heap from " + buffer.byteLength + " bytes to " + size + " bytes, but got error: " + e)
    }
}
function _emscripten_resize_heap(requestedSize) {
    requestedSize = requestedSize >>> 0;
    var oldSize = _emscripten_get_heap_size();
    assert(requestedSize > oldSize);
    var PAGE_MULTIPLE = 65536;
    var maxHeapSize = 2147483648;
    if (requestedSize > maxHeapSize) {
        err("Cannot enlarge memory, asked to go up to " + requestedSize + " bytes, but the limit is " + maxHeapSize + " bytes!");
        return false
    }
    var minHeapSize = 16777216;
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), PAGE_MULTIPLE));
        var t0 = _emscripten_get_now();
        var replacement = emscripten_realloc_buffer(newSize);
        var t1 = _emscripten_get_now();
        console.log("Heap resize call from " + oldSize + " to " + newSize + " took " + (t1 - t0) + " msecs. Success: " + !!replacement);
        if (replacement) {
            return true
        }
    }
    err("Failed to grow the heap from " + oldSize + " bytes to " + newSize + " bytes, not enough memory!");
    return false
}
var ENV = {};
function _getenv(name) {
    if (name === 0)
        return 0;
    name = UTF8ToString(name);
    if (!ENV.hasOwnProperty(name))
        return 0;
    if (_getenv.ret)
        _free(_getenv.ret);
    _getenv.ret = allocateUTF8(ENV[name]);
    return _getenv.ret
}
function _llvm_bswap_i64(l, h) {
    var retl = _llvm_bswap_i32(h) >>> 0;
    var reth = _llvm_bswap_i32(l) >>> 0;
    return (setTempRet0(reth),
    retl) | 0
}
function _llvm_stackrestore(p) {
    var self = _llvm_stacksave;
    var ret = self.LLVM_SAVEDSTACKS[p];
    self.LLVM_SAVEDSTACKS.splice(p, 1);
    stackRestore(ret)
}
function _llvm_stacksave() {
    var self = _llvm_stacksave;
    if (!self.LLVM_SAVEDSTACKS) {
        self.LLVM_SAVEDSTACKS = []
    }
    self.LLVM_SAVEDSTACKS.push(stackSave());
    return self.LLVM_SAVEDSTACKS.length - 1
}
function _llvm_trap() {
    abort("trap!")
}
function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest, src, src + num)
}
function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}
function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]) {}
    return sum
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1)
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1)
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
        }
    }
    return newDate
}
function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[tm + 40 >> 2];
    var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[tm + 4 >> 2],
        tm_hour: HEAP32[tm + 8 >> 2],
        tm_mday: HEAP32[tm + 12 >> 2],
        tm_mon: HEAP32[tm + 16 >> 2],
        tm_year: HEAP32[tm + 20 >> 2],
        tm_wday: HEAP32[tm + 24 >> 2],
        tm_yday: HEAP32[tm + 28 >> 2],
        tm_isdst: HEAP32[tm + 32 >> 2],
        tm_gmtoff: HEAP32[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule,"g"), EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function leadingSomething(value, digits, character) {
        var str = typeof value === "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str
        }
        return str
    }
    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
    }
    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate())
            }
        }
        return compare
    }
    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
        case 0:
            return new Date(janFourth.getFullYear() - 1,11,29);
        case 1:
            return janFourth;
        case 2:
            return new Date(janFourth.getFullYear(),0,3);
        case 3:
            return new Date(janFourth.getFullYear(),0,2);
        case 4:
            return new Date(janFourth.getFullYear(),0,1);
        case 5:
            return new Date(janFourth.getFullYear() - 1,11,31);
        case 6:
            return new Date(janFourth.getFullYear() - 1,11,30)
        }
    }
    function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900,0,1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(),0,4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1,0,4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1
            } else {
                return thisDate.getFullYear()
            }
        } else {
            return thisDate.getFullYear() - 1
        }
    }
    var EXPANSION_RULES_2 = {
        "%a": function(date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function(date) {
            return WEEKDAYS[date.tm_wday]
        },
        "%b": function(date) {
            return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function(date) {
            return MONTHS[date.tm_mon]
        },
        "%C": function(date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
        },
        "%d": function(date) {
            return leadingNulls(date.tm_mday, 2)
        },
        "%e": function(date) {
            return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function(date) {
            return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function(date) {
            return getWeekBasedYear(date)
        },
        "%H": function(date) {
            return leadingNulls(date.tm_hour, 2)
        },
        "%I": function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0)
                twelveHour = 12;
            else if (twelveHour > 12)
                twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
        },
        "%j": function(date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
        },
        "%m": function(date) {
            return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function(date) {
            return leadingNulls(date.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM"
            } else {
                return "PM"
            }
        },
        "%S": function(date) {
            return leadingNulls(date.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(date) {
            return date.tm_wday || 7
        },
        "%U": function(date) {
            var janFirst = new Date(date.tm_year + 1900,0,1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date.tm_year + 1900,date.tm_mon,date.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
        },
        "%V": function(date) {
            var janFourthThisYear = new Date(date.tm_year + 1900,0,4);
            var janFourthNextYear = new Date(date.tm_year + 1901,0,4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date.tm_year + 1900,0,1), date.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return "53"
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return "01"
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
            } else {
                daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2)
        },
        "%w": function(date) {
            return date.tm_wday
        },
        "%W": function(date) {
            var janFirst = new Date(date.tm_year,0,1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date.tm_year + 1900,date.tm_mon,date.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
        },
        "%y": function(date) {
            return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(date) {
            return date.tm_year + 1900
        },
        "%z": function(date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function(date) {
            return date.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
            pattern = pattern.replace(new RegExp(rule,"g"), EXPANSION_RULES_2[rule](date))
        }
    }
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
}
function _strftime_l(s, maxsize, format, tm) {
    return _strftime(s, maxsize, format, tm)
}
var FSNode = function(parent, name, mode, rdev) {
    if (!parent) {
        parent = this
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
    read: {
        get: function() {
            return (this.mode & readMode) === readMode
        },
        set: function(val) {
            val ? this.mode |= readMode : this.mode &= ~readMode
        }
    },
    write: {
        get: function() {
            return (this.mode & writeMode) === writeMode
        },
        set: function(val) {
            val ? this.mode |= writeMode : this.mode &= ~writeMode
        }
    },
    isFolder: {
        get: function() {
            return FS.isDir(this.mode)
        }
    },
    isDevice: {
        get: function() {
            return FS.isChrdev(this.mode)
        }
    }
});
FS.FSNode = FSNode;
FS.staticInit();
embind_init_charCodes();
BindingError = Module["BindingError"] = extendError(Error, "BindingError");
InternalError = Module["InternalError"] = extendError(Error, "InternalError");
init_ClassHandle();
init_RegisteredPointer();
init_embind();
UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
init_emval();
var ASSERTIONS = true;
function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull)
        u8array.length = numBytesWritten;
    return u8array
}
var debug_table_di = [0, "__ZN3nbt12PrimitiveTagIdLc6EE8getValueEv"];
var debug_table_dii = [0, "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIdLc6EEEFdvEdPS4_JEE6invokeERKS6_S7_"];
var debug_table_diii = [0, "__ZNSt3__215__num_get_floatIeEET_PKcS3_Rj", "__ZNSt3__215__num_get_floatIdEET_PKcS3_Rj", 0];
var debug_table_fi = [0, "__ZN3nbt12PrimitiveTagIfLc5EE8getValueEv"];
var debug_table_fii = [0, "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIfLc5EEEFfvEfPS4_JEE6invokeERKS6_S7_"];
var debug_table_fiii = [0, "__ZNSt3__215__num_get_floatIfEET_PKcS3_Rj"];
var debug_table_i = [0, "__ZNSt3__26__clocEv", "__ZNSt3__26locale5__imp12make_classicEv", "__ZNSt3__26locale5__imp11make_globalEv", "__ZNSt3__26locale8__globalEv", 0, 0, 0];
var debug_table_ii = [0, "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE4syncEv", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE9showmanycEv", "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE9underflowEv", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE5uflowEv", "__ZNK3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE7tagTypeEv", "__ZNK3nbt6EndTag7tagTypeEv", "__ZNK3nbt12PrimitiveTagIaLc1EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagIsLc2EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagIiLc3EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagIxLc4EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagIfLc5EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagIdLc6EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagINS_5ArrayIhEELc7EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagINS_7TagHashELc10EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagINS_5ArrayIiEELc11EE7tagTypeEv", "__ZNK3nbt12PrimitiveTagINS_5ArrayIxEELc12EE7tagTypeEv", "___emscripten_stdout_close", "__ZNKSt9bad_alloc4whatEv", "__ZNKSt11logic_error4whatEv", "__ZNKSt13runtime_error4whatEv", "__ZNKSt8bad_cast4whatEv", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE9underflowEv", "__ZNKSt3__219__iostream_category4nameEv", "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE13do_date_orderEv", "__ZNKSt3__220__time_get_c_storageIcE7__weeksEv", "__ZNKSt3__220__time_get_c_storageIcE8__monthsEv", "__ZNKSt3__220__time_get_c_storageIcE7__am_pmEv", "__ZNKSt3__220__time_get_c_storageIcE3__cEv", "__ZNKSt3__220__time_get_c_storageIcE3__rEv", "__ZNKSt3__220__time_get_c_storageIcE3__xEv", "__ZNKSt3__220__time_get_c_storageIcE3__XEv", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE13do_date_orderEv", "__ZNKSt3__220__time_get_c_storageIwE7__weeksEv", "__ZNKSt3__220__time_get_c_storageIwE8__monthsEv", "__ZNKSt3__220__time_get_c_storageIwE7__am_pmEv", "__ZNKSt3__220__time_get_c_storageIwE3__cEv", "__ZNKSt3__220__time_get_c_storageIwE3__rEv", "__ZNKSt3__220__time_get_c_storageIwE3__xEv", "__ZNKSt3__220__time_get_c_storageIwE3__XEv", "__ZNKSt3__210moneypunctIcLb0EE16do_decimal_pointEv", "__ZNKSt3__210moneypunctIcLb0EE16do_thousands_sepEv", "__ZNKSt3__210moneypunctIcLb0EE14do_frac_digitsEv", "__ZNKSt3__210moneypunctIcLb1EE16do_decimal_pointEv", "__ZNKSt3__210moneypunctIcLb1EE16do_thousands_sepEv", "__ZNKSt3__210moneypunctIcLb1EE14do_frac_digitsEv", "__ZNKSt3__210moneypunctIwLb0EE16do_decimal_pointEv", "__ZNKSt3__210moneypunctIwLb0EE16do_thousands_sepEv", "__ZNKSt3__210moneypunctIwLb0EE14do_frac_digitsEv", "__ZNKSt3__210moneypunctIwLb1EE16do_decimal_pointEv", "__ZNKSt3__210moneypunctIwLb1EE16do_thousands_sepEv", "__ZNKSt3__210moneypunctIwLb1EE14do_frac_digitsEv", "__ZNKSt3__27codecvtIDic11__mbstate_tE11do_encodingEv", "__ZNKSt3__27codecvtIDic11__mbstate_tE16do_always_noconvEv", "__ZNKSt3__27codecvtIDic11__mbstate_tE13do_max_lengthEv", "__ZNKSt3__27codecvtIwc11__mbstate_tE11do_encodingEv", "__ZNKSt3__27codecvtIwc11__mbstate_tE16do_always_noconvEv", "__ZNKSt3__27codecvtIwc11__mbstate_tE13do_max_lengthEv", "__ZNKSt3__28numpunctIcE16do_decimal_pointEv", "__ZNKSt3__28numpunctIcE16do_thousands_sepEv", "__ZNKSt3__28numpunctIwE16do_decimal_pointEv", "__ZNKSt3__28numpunctIwE16do_thousands_sepEv", "__ZNKSt3__27codecvtIcc11__mbstate_tE11do_encodingEv", "__ZNKSt3__27codecvtIcc11__mbstate_tE16do_always_noconvEv", "__ZNKSt3__27codecvtIcc11__mbstate_tE13do_max_lengthEv", "__ZNKSt3__27codecvtIDsc11__mbstate_tE11do_encodingEv", "__ZNKSt3__27codecvtIDsc11__mbstate_tE16do_always_noconvEv", "__ZNKSt3__27codecvtIDsc11__mbstate_tE13do_max_lengthEv", "__ZN3nbt7makeTagEc", "__ZN10emscripten8internal13getActualTypeIN3nbt3TagEEEPKvPT_", "__ZNK3nbt3Tag10getHasNameEv", "__ZNK3nbt3Tag13getStartIndexEv", "__ZNK3nbt3Tag11getEndIndexEv", "__ZN10emscripten8internal13getActualTypeIN3nbt5ArrayIhEEEEPKvPT_", "__ZNK3nbt5ArrayIhE8getCountEv", "__ZN10emscripten8internal13getActualTypeIN3nbt5ArrayIiEEEEPKvPT_", "__ZNK3nbt5ArrayIiE8getCountEv", "__ZN10emscripten8internal13getActualTypeIN3nbt5ArrayIxEEEEPKvPT_", "__ZNK3nbt5ArrayIxE8getCountEv", "__ZN10emscripten8internal13getActualTypeIN3nbt7TagHashEEEPKvPT_", "__ZN3nbt7TagHash7jsAtEndEv", "__ZN3nbt7TagHash6getTagEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagIaLc1EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagIaLc1EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagIaLc1EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagIaLc1EE8getValueEv", "__ZN3nbt12PrimitiveTagIaLc1EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagIsLc2EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagIsLc2EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagIsLc2EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagIsLc2EE8getValueEv", "__ZN3nbt12PrimitiveTagIsLc2EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagIiLc3EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagIiLc3EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagIiLc3EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagIiLc3EE8getValueEv", "__ZN3nbt12PrimitiveTagIiLc3EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagIxLc4EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagIxLc4EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagIxLc4EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagIxLc4EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagIfLc5EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagIfLc5EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagIfLc5EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagIfLc5EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagIdLc6EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagIdLc6EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagIdLc6EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagIdLc6EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagINSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEELc8EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagINSt3__212basic_stringIcNS6_11char_traitsIcEENS6_9allocatorIcEEEELc8EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagINSt3__212basic_stringIcNS6_11char_traitsIcEENS6_9allocatorIcEEEELc8EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagINS2_7TagHashELc10EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagINS1_7TagHashELc10EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagINS1_7TagHashELc10EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagINS1_5ArrayIhEELc7EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagINS1_5ArrayIhEELc7EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagINS1_5ArrayIiEELc11EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagINS1_5ArrayIiEELc11EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagINS1_5ArrayIxEELc12EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagINS1_5ArrayIxEELc12EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEEEPKvPT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerINS1_12PrimitiveTagINSt3__26vectorINS6_10shared_ptrIS2_EENS6_9allocatorIS9_EEEELc9EEES2_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt3TagEE14convertPointerIS2_NS1_12PrimitiveTagINSt3__26vectorINS6_10shared_ptrIS2_EENS6_9allocatorIS9_EEEELc9EEEEEPT0_PT_", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE11getValuePtrEv", "__ZN10emscripten8internal13getActualTypeIN3nbt7ListTagEEEPKvPT_", "__ZN10emscripten4baseIN3nbt12PrimitiveTagINSt3__26vectorINS3_10shared_ptrINS1_3TagEEENS3_9allocatorIS7_EEEELc9EEEE14convertPointerINS1_7ListTagESB_EEPT0_PT_", "__ZN10emscripten4baseIN3nbt12PrimitiveTagINSt3__26vectorINS3_10shared_ptrINS1_3TagEEENS3_9allocatorIS7_EEEELc9EEEE14convertPointerISB_NS1_7ListTagEEEPT0_PT_", "__ZN3nbt7ListTag10addElementEv", "__ZN3nbt7ListTag8getCountEv", "__ZNK3nbt7ListTag12getEntryKindEv", "__Znwm", "_deflateEnd", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_iidiiii = [0, "_fmt_fp"];
var debug_table_iii = [0, "__ZNKSt3__220__shared_ptr_pointerIPN3nbt3TagENS_14default_deleteIS2_EENS_9allocatorIS2_EEE13__get_deleterERKSt9type_info", "__ZNKSt3__220__shared_ptr_pointerIPxNS_14default_deleteIxEENS_9allocatorIxEEE13__get_deleterERKSt9type_info", "__ZNKSt3__220__shared_ptr_pointerIPiNS_14default_deleteIiEENS_9allocatorIiEEE13__get_deleterERKSt9type_info", "__ZNKSt3__220__shared_ptr_pointerIPhNS_14default_deleteIhEENS_9allocatorIhEEE13__get_deleterERKSt9type_info", "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE9pbackfailEi", "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE8overflowEi", "_deflate_stored", "_deflate_fast", "_deflate_slow", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE9pbackfailEi", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE8overflowEi", "__ZNKSt3__25ctypeIcE10do_toupperEc", "__ZNKSt3__25ctypeIcE10do_tolowerEc", "__ZNKSt3__25ctypeIcE8do_widenEc", "__ZNKSt3__25ctypeIwE10do_toupperEw", "__ZNKSt3__25ctypeIwE10do_tolowerEw", "__ZNKSt3__25ctypeIwE8do_widenEc", "__ZN10emscripten8internal7InvokerIPN3nbt3TagEJcEE6invokeEPFS4_cEc", "__ZN10emscripten8internal13MethodInvokerIMN3nbt3TagEKFNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEvESA_PKS3_JEE6invokeERKSC_SE_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt3TagEKFbvEbPKS3_JEE6invokeERKS5_S7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt3TagEKFmvEmPKS3_JEE6invokeERKS5_S7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt3TagEKFcvEcPKS3_JEE6invokeERKS5_S7_", "__ZNK3nbt5ArrayIhE10getElementEm", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIhEEKFmvEmPKS4_JEE6invokeERKS6_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIhEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZNK3nbt5ArrayIiE10getElementEm", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIiEEKFmvEmPKS4_JEE6invokeERKS6_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIiEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIxEEKFmvEmPKS4_JEE6invokeERKS6_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIxEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFbvEbPS3_JEE6invokeERKS5_S6_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEvESA_PS3_JEE6invokeERKSC_SD_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFPNS2_3TagEvES5_PS3_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIaLc1EEEFavEaPS4_JEE6invokeERKS6_S7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIaLc1EEEFPavES5_PS4_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIaLc1EEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIsLc2EEEFsvEsPS4_JEE6invokeERKS6_S7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIsLc2EEEFPsvES5_PS4_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIsLc2EEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIiLc3EEEFivEiPS4_JEE6invokeERKS6_S7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIiLc3EEEFPivES5_PS4_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIiLc3EEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIxLc4EEEFxvExPS4_JEE6invokeERKS6_S7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIxLc4EEEFPxvES5_PS4_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIxLc4EEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIfLc5EEEFPfvES5_PS4_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIfLc5EEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIdLc6EEEFPdvES5_PS4_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIdLc6EEEKFNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEvESB_PKS4_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEELc8EEEFSA_vESA_PSB_JEE6invokeERKSD_SE_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEELc8EEEFPSA_vESC_PSB_JEE6invokeERKSE_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEELc8EEEKFSA_vESA_PKSB_JEE6invokeERKSD_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_7TagHashELc10EEEFS4_vES4_PS5_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_7TagHashELc10EEEFPS4_vES6_PS5_JEE6invokeERKS8_S9_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_7TagHashELc10EEEKFNSt3__212basic_stringIcNS6_11char_traitsIcEENS6_9allocatorIcEEEEvESC_PKS5_JEE6invokeERKSE_SG_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEFS5_vES5_PS6_JEE6invokeERKS8_S9_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEFPS5_vES7_PS6_JEE6invokeERKS9_SA_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEKFNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEEvESD_PKS6_JEE6invokeERKSF_SH_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEFS5_vES5_PS6_JEE6invokeERKS8_S9_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEFPS5_vES7_PS6_JEE6invokeERKS9_SA_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEKFNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEEvESD_PKS6_JEE6invokeERKSF_SH_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEFS5_vES5_PS6_JEE6invokeERKS8_S9_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEFPS5_vES7_PS6_JEE6invokeERKS9_SA_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEKFNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEEvESD_PKS6_JEE6invokeERKSF_SH_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEFSB_vESB_PSC_JEE6invokeERKSE_SF_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEFPSB_vESD_PSC_JEE6invokeERKSF_SG_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEKFNS4_12basic_stringIcNS4_11char_traitsIcEENS9_IcEEEEvESH_PKSC_JEE6invokeERKSJ_SL_", "__ZN3nbt7ListTag10getElementEm", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEFPNS2_3TagEvES5_PS3_JEE6invokeERKS7_S8_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEFmvEmPS3_JEE6invokeERKS5_S6_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEKFcvEcPKS3_JEE6invokeERKS5_S7_", "__ZNSt3__26__treeINS_12__value_typeINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS_10shared_ptrIN3nbt3TagEEEEENS_19__map_value_compareIS7_SC_NS_4lessIS7_EELb1EEENS5_ISC_EEE4findIS7_EENS_15__tree_iteratorISC_PNS_11__tree_nodeISC_PvEElEERKT_", "__ZNSt3__26__treeINS_12__value_typeINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS_10shared_ptrIN3nbt3TagEEEEENS_19__map_value_compareIS7_SC_NS_4lessIS7_EELb1EEENS5_ISC_EEE5eraseENS_21__tree_const_iteratorISC_PNS_11__tree_nodeISC_PvEElEE", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEaSERKS5_", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6assignEPKc", "__ZNSt3__213basic_istreamIcNS_11char_traitsIcEEErsERx", "__ZNKSt3__26locale9use_facetERNS0_2idE", "__ZNSt3__213basic_istreamIcNS_11char_traitsIcEEErsERi", "__ZNSt3__213basic_ostreamIcNS_11char_traitsIcEEElsEi", "__ZNSt3__213basic_ostreamIcNS_11char_traitsIcEEElsEj", "_deflate", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_iiii = [0, "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE6setbufEPcl", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE6xsgetnEPcl", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE6xsputnEPKcl", "___stdio_write", "_sn_write", "__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv", "__ZNK10__cxxabiv123__fundamental_type_info9can_catchEPKNS_16__shim_type_infoERPv", "__ZNK10__cxxabiv119__pointer_type_info9can_catchEPKNS_16__shim_type_infoERPv", "__ZNKSt3__214error_category10equivalentEiRKNS_15error_conditionE", "__ZNKSt3__214error_category10equivalentERKNS_10error_codeEi", "__ZNKSt3__27collateIcE7do_hashEPKcS3_", "__ZNKSt3__27collateIwE7do_hashEPKwS3_", "__ZNKSt3__28messagesIcE7do_openERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERKNS_6localeE", "__ZNKSt3__28messagesIwE7do_openERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERKNS_6localeE", "__ZNKSt3__25ctypeIcE10do_toupperEPcPKc", "__ZNKSt3__25ctypeIcE10do_tolowerEPcPKc", "__ZNKSt3__25ctypeIcE9do_narrowEcc", "__ZNKSt3__25ctypeIwE5do_isEtw", "__ZNKSt3__25ctypeIwE10do_toupperEPwPKw", "__ZNKSt3__25ctypeIwE10do_tolowerEPwPKw", "__ZNKSt3__25ctypeIwE9do_narrowEwc", "__ZN10emscripten8internal7InvokerINSt3__212basic_stringIhNS2_11char_traitsIhEENS2_9allocatorIhEEEEJPN3nbt3TagEcEE6invokeEPFS8_SB_cESB_c", "__ZN3nbt3Tag11deserializeENSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEbc", "__ZN3nbt3Tag21deserializeCompressedENSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEbc", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIhEEKFhmEhPKS4_JmEE6invokeERKS6_S8_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIiEEKFimEiPKS4_JmEE6invokeERKS6_S8_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIxEEKFxmExPKS4_JmEE6invokeERKS6_S8_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEFPNS2_3TagEmES5_PS3_JmEE6invokeERKS7_S8_m", "__ZN3nbt3Tag4readERNSt3__213basic_istreamIcNS1_11char_traitsIcEEEEbc", "__ZNSt3__213basic_istreamIcNS_11char_traitsIcEEE4readEPcl", "__ZNSt3__224__put_character_sequenceIcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6appendEPKcm", "_zcalloc", "_do_read", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE23__append_forward_unsafeIPcEERS5_T_S9_", "__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE23__append_forward_unsafeIPwEERS5_T_S9_", "__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6appendEPKwm", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_iiiii = [0, "__ZNKSt3__25ctypeIcE8do_widenEPKcS3_Pc", "__ZNKSt3__25ctypeIwE5do_isEPKwS3_Pt", "__ZNKSt3__25ctypeIwE10do_scan_isEtPKwS3_", "__ZNKSt3__25ctypeIwE11do_scan_notEtPKwS3_", "__ZNKSt3__25ctypeIwE8do_widenEPKcS3_Pw", "__ZN10emscripten8internal7InvokerIPN3nbt3TagEJNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEbcEE6invokeEPFS4_SB_bcEPNS0_11BindingTypeISB_vEUt_Ebc", "__ZNSt3__26__treeINS_12__value_typeINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS_10shared_ptrIN3nbt3TagEEEEENS_19__map_value_compareIS7_SC_NS_4lessIS7_EELb1EEENS5_ISC_EEE30__emplace_hint_unique_key_argsIS7_JRKNS_4pairIKS7_SB_EEEEENS_15__tree_iteratorISC_PNS_11__tree_nodeISC_PvEElEENS_21__tree_const_iteratorISC_ST_lEERKT_DpOT0_", "__ZNSt3__217__libcpp_sscanf_lEPKcP15__locale_structS1_z", "__ZNSt3__227__num_get_unsigned_integralImEET_PKcS3_Rji", "__ZNSt3__227__num_get_unsigned_integralIjEET_PKcS3_Rji", "__ZNSt3__227__num_get_unsigned_integralItEET_PKcS3_Rji", "__ZNSt3__225__num_get_signed_integralIlEET_PKcS3_Rji", "__ZNSt3__219__libcpp_asprintf_lEPPcP15__locale_structPKcz", 0, 0];
var debug_table_iiiiid = [0, "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcd", "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEce", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwd", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwe", 0, 0, 0];
var debug_table_iiiiii = [0, "__ZNKSt3__27collateIcE10do_compareEPKcS3_S3_S3_", "__ZNKSt3__27collateIwE10do_compareEPKwS3_S3_S3_", "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcb", "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcl", "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcm", "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcPKv", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwb", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwl", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwm", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwPKv", "__ZNKSt3__27codecvtIDic11__mbstate_tE10do_unshiftERS1_PcS4_RS4_", "__ZNKSt3__27codecvtIDic11__mbstate_tE9do_lengthERS1_PKcS5_m", "__ZNKSt3__27codecvtIwc11__mbstate_tE10do_unshiftERS1_PcS4_RS4_", "__ZNKSt3__27codecvtIwc11__mbstate_tE9do_lengthERS1_PKcS5_m", "__ZNKSt3__25ctypeIcE9do_narrowEPKcS3_cPc", "__ZNKSt3__25ctypeIwE9do_narrowEPKwS3_cPc", "__ZNKSt3__27codecvtIcc11__mbstate_tE10do_unshiftERS1_PcS4_RS4_", "__ZNKSt3__27codecvtIcc11__mbstate_tE9do_lengthERS1_PKcS5_m", "__ZNKSt3__27codecvtIDsc11__mbstate_tE10do_unshiftERS1_PcS4_RS4_", "__ZNKSt3__27codecvtIDsc11__mbstate_tE9do_lengthERS1_PKcS5_m", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_iiiiiid = [0, "__ZNKSt3__29money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_bRNS_8ios_baseEce", "__ZNKSt3__29money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_bRNS_8ios_baseEwe", 0];
var debug_table_iiiiiii = [0, "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRb", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRl", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRx", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRt", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjS8_", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRm", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRy", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRf", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRd", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRe", "__ZNKSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjRPv", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRb", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRl", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRx", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRt", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjS8_", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRm", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRy", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRf", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRd", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRe", "__ZNKSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjRPv", "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE11do_get_timeES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE11do_get_dateES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE14do_get_weekdayES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE16do_get_monthnameES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE11do_get_yearES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE11do_get_timeES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE11do_get_dateES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE14do_get_weekdayES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE16do_get_monthnameES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE11do_get_yearES4_S4_RNS_8ios_baseERjP2tm", "__ZNKSt3__29money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_bRNS_8ios_baseEcRKNS_12basic_stringIcS3_NS_9allocatorIcEEEE", "__ZNKSt3__29money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_bRNS_8ios_baseEwRKNS_12basic_stringIwS3_NS_9allocatorIwEEEE", "__ZNSt3__216__pad_and_outputIcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_", "__ZNSt3__216__pad_and_outputIwNS_11char_traitsIwEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_iiiiiiii = [0, "__ZNKSt3__28time_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcPK2tmcc", "__ZNKSt3__28time_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwPK2tmcc", "__ZNKSt3__29money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_bRNS_8ios_baseERjRe", "__ZNKSt3__29money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_bRNS_8ios_baseERjRNS_12basic_stringIcS3_NS_9allocatorIcEEEE", "__ZNKSt3__29money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_bRNS_8ios_baseERjRe", "__ZNKSt3__29money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_bRNS_8ios_baseERjRNS_12basic_stringIwS3_NS_9allocatorIwEEEE", "__ZNSt3__214__scan_keywordINS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEPKNS_12basic_stringIcS3_NS_9allocatorIcEEEENS_5ctypeIcEEEET0_RT_SE_SD_SD_RKT1_Rjb", "__ZNSt3__214__scan_keywordINS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEPKNS_12basic_stringIwS3_NS_9allocatorIwEEEENS_5ctypeIwEEEET0_RT_SE_SD_SD_RKT1_Rjb", 0, 0, 0, 0, 0, 0, 0];
var debug_table_iiiiiiiii = [0, "__ZNKSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_getES4_S4_RNS_8ios_baseERjP2tmcc", "__ZNKSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_getES4_S4_RNS_8ios_baseERjP2tmcc", "__ZNKSt3__27codecvtIDic11__mbstate_tE6do_outERS1_PKDiS5_RS5_PcS7_RS7_", "__ZNKSt3__27codecvtIDic11__mbstate_tE5do_inERS1_PKcS5_RS5_PDiS7_RS7_", "__ZNKSt3__27codecvtIwc11__mbstate_tE6do_outERS1_PKwS5_RS5_PcS7_RS7_", "__ZNKSt3__27codecvtIwc11__mbstate_tE5do_inERS1_PKcS5_RS5_PwS7_RS7_", "__ZNKSt3__27codecvtIcc11__mbstate_tE6do_outERS1_PKcS5_RS5_PcS7_RS7_", "__ZNKSt3__27codecvtIcc11__mbstate_tE5do_inERS1_PKcS5_RS5_PcS7_RS7_", "__ZNKSt3__27codecvtIDsc11__mbstate_tE6do_outERS1_PKDsS5_RS5_PcS7_RS7_", "__ZNKSt3__27codecvtIDsc11__mbstate_tE5do_inERS1_PKcS5_RS5_PDsS7_RS7_", "_deflateInit2_", 0, 0, 0, 0];
var debug_table_iiiiiiiiiii = [0, "__ZNSt3__29__num_getIcE17__stage2_int_loopEciPcRS2_RjcRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEPjRSD_PKc", "__ZNSt3__29__num_getIwE17__stage2_int_loopEwiPcRS2_RjwRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEPjRSD_PKw", 0];
var debug_table_iiiiiiiiiiii = [0, "__ZNSt3__29money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEE8__do_getERS4_S4_bRKNS_6localeEjRjRbRKNS_5ctypeIcEERNS_10unique_ptrIcPFvPvEEERPcSM_", "__ZNSt3__29money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEE8__do_getERS4_S4_bRKNS_6localeEjRjRbRKNS_5ctypeIwEERNS_10unique_ptrIwPFvPvEEERPwSM_", 0];
var debug_table_iiiiiiiiiiiii = [0, "__ZNSt3__29__num_getIcE19__stage2_float_loopEcRbRcPcRS4_ccRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEPjRSE_RjS4_", "__ZNSt3__29__num_getIwE19__stage2_float_loopEwRbRcPcRS4_wwRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEPjRSE_RjPw", 0];
var debug_table_iiiiij = [0, "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcx", "__ZNKSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEE6do_putES4_RNS_8ios_baseEcy", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwx", "__ZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwy", 0, 0, 0];
var debug_table_iij = [0, "__ZNSt3__213basic_ostreamIcNS_11char_traitsIcEEElsEx"];
var debug_table_ji = [0, "__ZN3nbt12PrimitiveTagIxLc4EE8getValueEv"];
var debug_table_jii = [0, "__ZNK3nbt5ArrayIxE10getElementEm"];
var debug_table_jiiii = [0, "__ZNSt3__227__num_get_unsigned_integralIyEET_PKcS3_Rji", "__ZNSt3__225__num_get_signed_integralIxEET_PKcS3_Rji", "__ZNSt3__212_GLOBAL__N_110as_integerIxNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEET_RKS7_RKT0_Pmi"];
var debug_table_jiji = [0, "___emscripten_stdout_seek"];
var debug_table_v = [0, "___cxa_pure_virtual", "___cxa_end_catch", "__ZL28demangling_terminate_handlerv", "___cxa_rethrow", "__ZSt17__throw_bad_allocv", "__ZNSt3__2L10init_weeksEv", "__ZNSt3__2L11init_monthsEv", "__ZNSt3__2L10init_am_pmEv", "__ZNSt3__2L11init_wweeksEv", "__ZNSt3__2L12init_wmonthsEv", "__ZNSt3__2L11init_wam_pmEv", "__ZNSt3__212_GLOBAL__N_14makeINS_7collateIcEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7collateIwEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_5ctypeIwEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7codecvtIcc11__mbstate_tEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7codecvtIwc11__mbstate_tEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7codecvtIDsc11__mbstate_tEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7codecvtIDic11__mbstate_tEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_7num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_10moneypunctIcLb0EEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_10moneypunctIcLb1EEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_10moneypunctIwLb0EEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_10moneypunctIwLb1EEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_9money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_9money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_9money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_9money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_8time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_8time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_8time_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_8time_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_8messagesIcEEjEERT_T0_", "__ZNSt3__212_GLOBAL__N_14makeINS_8messagesIwEEjEERT_T0_", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_vi = [0, "__ZNSt3__214__shared_countD2Ev", "__ZNSt3__220__shared_ptr_pointerIPN3nbt3TagENS_14default_deleteIS2_EENS_9allocatorIS2_EEED0Ev", "__ZNSt3__220__shared_ptr_pointerIPN3nbt3TagENS_14default_deleteIS2_EENS_9allocatorIS2_EEE16__on_zero_sharedEv", "__ZNSt3__220__shared_ptr_pointerIPN3nbt3TagENS_14default_deleteIS2_EENS_9allocatorIS2_EEE21__on_zero_shared_weakEv", "__ZNSt3__220__shared_ptr_pointerIPxNS_14default_deleteIxEENS_9allocatorIxEEED0Ev", "__ZNSt3__220__shared_ptr_pointerIPxNS_14default_deleteIxEENS_9allocatorIxEEE16__on_zero_sharedEv", "__ZNSt3__220__shared_ptr_pointerIPxNS_14default_deleteIxEENS_9allocatorIxEEE21__on_zero_shared_weakEv", "__ZNSt3__220__shared_ptr_pointerIPiNS_14default_deleteIiEENS_9allocatorIiEEED0Ev", "__ZNSt3__220__shared_ptr_pointerIPiNS_14default_deleteIiEENS_9allocatorIiEEE16__on_zero_sharedEv", "__ZNSt3__220__shared_ptr_pointerIPiNS_14default_deleteIiEENS_9allocatorIiEEE21__on_zero_shared_weakEv", "__ZNSt3__220__shared_ptr_pointerIPhNS_14default_deleteIhEENS_9allocatorIhEEED0Ev", "__ZNSt3__220__shared_ptr_pointerIPhNS_14default_deleteIhEENS_9allocatorIhEEE16__on_zero_sharedEv", "__ZNSt3__220__shared_ptr_pointerIPhNS_14default_deleteIhEENS_9allocatorIhEEE21__on_zero_shared_weakEv", "__ZNSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev", "__ZNSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEED0Ev", "__ZThn8_NSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev", "__ZThn8_NSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEED0Ev", "__ZTv0_n12_NSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev", "__ZTv0_n12_NSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEED0Ev", "__ZNSt3__213basic_istreamIcNS_11char_traitsIcEEED1Ev", "__ZNSt3__213basic_istreamIcNS_11char_traitsIcEEED0Ev", "__ZTv0_n12_NSt3__213basic_istreamIcNS_11char_traitsIcEEED1Ev", "__ZTv0_n12_NSt3__213basic_istreamIcNS_11char_traitsIcEEED0Ev", "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev", "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEED0Ev", "__ZNSt3__214basic_iostreamIcNS_11char_traitsIcEEED1Ev", "__ZNSt3__214basic_iostreamIcNS_11char_traitsIcEEED0Ev", "__ZThn8_NSt3__214basic_iostreamIcNS_11char_traitsIcEEED1Ev", "__ZThn8_NSt3__214basic_iostreamIcNS_11char_traitsIcEEED0Ev", "__ZTv0_n12_NSt3__214basic_iostreamIcNS_11char_traitsIcEEED1Ev", "__ZTv0_n12_NSt3__214basic_iostreamIcNS_11char_traitsIcEEED0Ev", "__ZNSt3__213basic_ostreamIcNS_11char_traitsIcEEED1Ev", "__ZNSt3__213basic_ostreamIcNS_11char_traitsIcEEED0Ev", "__ZTv0_n12_NSt3__213basic_ostreamIcNS_11char_traitsIcEEED1Ev", "__ZTv0_n12_NSt3__213basic_ostreamIcNS_11char_traitsIcEEED0Ev", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EED2Ev", "__ZN3nbt7ListTagD0Ev", "__ZN3nbt3TagD2Ev", "__ZN3nbt6EndTagD0Ev", "__ZN3nbt12PrimitiveTagIaLc1EED0Ev", "__ZN3nbt12PrimitiveTagIsLc2EED0Ev", "__ZN3nbt12PrimitiveTagIiLc3EED0Ev", "__ZN3nbt12PrimitiveTagIxLc4EED0Ev", "__ZN3nbt12PrimitiveTagIfLc5EED0Ev", "__ZN3nbt12PrimitiveTagIdLc6EED0Ev", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EED2Ev", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EED0Ev", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EED2Ev", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EED0Ev", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EED2Ev", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EED0Ev", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EED2Ev", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EED0Ev", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EED2Ev", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EED0Ev", "__ZN3nbt3TagD0Ev", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EED0Ev", "__ZN10__cxxabiv116__shim_type_infoD2Ev", "__ZN10__cxxabiv117__class_type_infoD0Ev", "__ZNK10__cxxabiv116__shim_type_info5noop1Ev", "__ZNK10__cxxabiv116__shim_type_info5noop2Ev", "__ZN10__cxxabiv120__si_class_type_infoD0Ev", "__ZNSt9exceptionD2Ev", "__ZNSt9bad_allocD0Ev", "__ZNSt11logic_errorD2Ev", "__ZNSt11logic_errorD0Ev", "__ZNSt13runtime_errorD2Ev", "__ZNSt13runtime_errorD0Ev", "__ZNSt16invalid_argumentD0Ev", "__ZNSt12length_errorD0Ev", "__ZNSt12out_of_rangeD0Ev", "__ZNSt8bad_castD2Ev", "__ZNSt8bad_castD0Ev", "__ZN10__cxxabiv123__fundamental_type_infoD0Ev", "__ZN10__cxxabiv119__pointer_type_infoD0Ev", "__ZN10__cxxabiv121__vmi_class_type_infoD0Ev", "__ZNSt3__28ios_baseD2Ev", "__ZNSt3__28ios_baseD0Ev", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEED2Ev", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEED0Ev", "__ZNSt3__214error_categoryD2Ev", "__ZNSt3__219__iostream_categoryD0Ev", "__ZNSt3__28ios_base7failureD2Ev", "__ZNSt3__28ios_base7failureD0Ev", "__ZNSt3__27collateIcED2Ev", "__ZNSt3__27collateIcED0Ev", "__ZNSt3__26locale5facet16__on_zero_sharedEv", "__ZNSt3__27collateIwED2Ev", "__ZNSt3__27collateIwED0Ev", "__ZNSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEED2Ev", "__ZNSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEED0Ev", "__ZNSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEED2Ev", "__ZNSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEED0Ev", "__ZNSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEED2Ev", "__ZNSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEED0Ev", "__ZNSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEED2Ev", "__ZNSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEED0Ev", "__ZNSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEED2Ev", "__ZNSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEED0Ev", "__ZNSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEED2Ev", "__ZNSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEED0Ev", "__ZNSt3__28time_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEED2Ev", "__ZNSt3__28time_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEED0Ev", "__ZNSt3__28time_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEED2Ev", "__ZNSt3__28time_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEED0Ev", "__ZNSt3__210moneypunctIcLb0EED2Ev", "__ZNSt3__210moneypunctIcLb0EED0Ev", "__ZNSt3__210moneypunctIcLb1EED2Ev", "__ZNSt3__210moneypunctIcLb1EED0Ev", "__ZNSt3__210moneypunctIwLb0EED2Ev", "__ZNSt3__210moneypunctIwLb0EED0Ev", "__ZNSt3__210moneypunctIwLb1EED2Ev", "__ZNSt3__210moneypunctIwLb1EED0Ev", "__ZNSt3__29money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEED2Ev", "__ZNSt3__29money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEED0Ev", "__ZNSt3__29money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEED2Ev", "__ZNSt3__29money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEED0Ev", "__ZNSt3__29money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEED2Ev", "__ZNSt3__29money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEED0Ev", "__ZNSt3__29money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEED2Ev", "__ZNSt3__29money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEED0Ev", "__ZNSt3__28messagesIcED2Ev", "__ZNSt3__28messagesIcED0Ev", "__ZNSt3__28messagesIwED2Ev", "__ZNSt3__28messagesIwED0Ev", "__ZNSt3__26locale5facetD2Ev", "__ZNSt3__216__narrow_to_utf8ILm32EED0Ev", "__ZNSt3__217__widen_from_utf8ILm32EED0Ev", "__ZNSt3__27codecvtIwc11__mbstate_tED2Ev", "__ZNSt3__27codecvtIwc11__mbstate_tED0Ev", "__ZNSt3__26locale5__impD2Ev", "__ZNSt3__26locale5__impD0Ev", "__ZNSt3__25ctypeIcED2Ev", "__ZNSt3__25ctypeIcED0Ev", "__ZNSt3__28numpunctIcED2Ev", "__ZNSt3__28numpunctIcED0Ev", "__ZNSt3__28numpunctIwED2Ev", "__ZNSt3__28numpunctIwED0Ev", "__ZNSt3__26locale5facetD0Ev", "__ZNSt3__25ctypeIwED0Ev", "__ZNSt3__27codecvtIcc11__mbstate_tED0Ev", "__ZNSt3__27codecvtIDsc11__mbstate_tED0Ev", "__ZNSt3__27codecvtIDic11__mbstate_tED0Ev", "__ZNSt3__212system_errorD2Ev", "__ZNSt3__212system_errorD0Ev", "__ZN10emscripten8internal14raw_destructorIN3nbt3TagEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt5ArrayIhEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt5ArrayIiEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt5ArrayIxEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt7TagHashEEEvPT_", "__ZN3nbt7TagHash7jsBeginEv", "__ZN3nbt7TagHash6jsNextEv", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagIaLc1EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagIsLc2EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagIiLc3EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagIxLc4EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagIfLc5EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagIdLc6EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagINSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEELc8EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagINS2_7TagHashELc10EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEEEvPT_", "__ZN10emscripten8internal14raw_destructorIN3nbt7ListTagEEEvPT_", "__ZN3nbt7ListTag5clearEv", "__ZNKSt3__221__basic_string_commonILb1EE20__throw_length_errorEv", "__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv", "__ZNSt3__28ios_base33__set_badbit_and_consider_rethrowEv", "__ZNSt3__26locale2id6__initEv", "__ZNSt3__217__call_once_proxyINS_5tupleIJONS_12_GLOBAL__N_111__fake_bindEEEEEEvPv", "__ZNSt3__212__do_nothingEPv", "__ZNSt3__221__throw_runtime_errorEPKc", "_free", "__ZNSt3__212_GLOBAL__N_112throw_helperISt12out_of_rangeEEvRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE", "__ZNSt3__212_GLOBAL__N_112throw_helperISt16invalid_argumentEEvRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_vid = [0, "__ZN3nbt12PrimitiveTagIdLc6EE8setValueEd"];
var debug_table_vif = [0, "__ZN3nbt12PrimitiveTagIfLc5EE8setValueEf"];
var debug_table_vii = [0, "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE5imbueERKNS_6localeE", "__ZN3nbt7ListTag11readPayloadERNSt3__213basic_istreamIcNS1_11char_traitsIcEEEE", "__ZNK3nbt7ListTag12writePayloadERNSt3__213basic_ostreamIcNS1_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE14serializeValueEv", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE16deserializeValueENS1_12basic_stringIcNS1_11char_traitsIcEENS6_IcEEEE", "__ZN3nbt6EndTag11readPayloadERNSt3__213basic_istreamIcNS1_11char_traitsIcEEEE", "__ZNK3nbt6EndTag12writePayloadERNSt3__213basic_ostreamIcNS1_11char_traitsIcEEEE", "__ZN3nbt12PrimitiveTagIaLc1EE11readPayloadERNSt3__213basic_istreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIaLc1EE12writePayloadERNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIaLc1EE14serializeValueEv", "__ZN3nbt12PrimitiveTagIaLc1EE16deserializeValueENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagIsLc2EE11readPayloadERNSt3__213basic_istreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIsLc2EE12writePayloadERNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIsLc2EE14serializeValueEv", "__ZN3nbt12PrimitiveTagIsLc2EE16deserializeValueENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagIiLc3EE11readPayloadERNSt3__213basic_istreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIiLc3EE12writePayloadERNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIiLc3EE14serializeValueEv", "__ZN3nbt12PrimitiveTagIiLc3EE16deserializeValueENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagIxLc4EE11readPayloadERNSt3__213basic_istreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIxLc4EE12writePayloadERNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIxLc4EE14serializeValueEv", "__ZN3nbt12PrimitiveTagIxLc4EE16deserializeValueENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagIfLc5EE11readPayloadERNSt3__213basic_istreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIfLc5EE12writePayloadERNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIfLc5EE14serializeValueEv", "__ZN3nbt12PrimitiveTagIfLc5EE16deserializeValueENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagIdLc6EE11readPayloadERNSt3__213basic_istreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIdLc6EE12writePayloadERNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagIdLc6EE14serializeValueEv", "__ZN3nbt12PrimitiveTagIdLc6EE16deserializeValueENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EE11readPayloadERNSt3__213basic_istreamIcNS4_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_5ArrayIhEELc7EE12writePayloadERNSt3__213basic_ostreamIcNS4_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_5ArrayIhEELc7EE14serializeValueEv", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EE16deserializeValueENSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE11readPayloadERNS1_13basic_istreamIcS4_EE", "__ZNK3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE12writePayloadERNS1_13basic_ostreamIcS4_EE", "__ZNK3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE14serializeValueEv", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE16deserializeValueES7_", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EE11readPayloadERNSt3__213basic_istreamIcNS3_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_7TagHashELc10EE12writePayloadERNSt3__213basic_ostreamIcNS3_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_7TagHashELc10EE14serializeValueEv", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EE16deserializeValueENSt3__212basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EE11readPayloadERNSt3__213basic_istreamIcNS4_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_5ArrayIiEELc11EE12writePayloadERNSt3__213basic_ostreamIcNS4_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_5ArrayIiEELc11EE14serializeValueEv", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EE16deserializeValueENSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EE11readPayloadERNSt3__213basic_istreamIcNS4_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_5ArrayIxEELc12EE12writePayloadERNSt3__213basic_ostreamIcNS4_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINS_5ArrayIxEELc12EE14serializeValueEv", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EE16deserializeValueENSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE11readPayloadERNS1_13basic_istreamIcNS1_11char_traitsIcEEEE", "__ZNK3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE12writePayloadERNS1_13basic_ostreamIcNS1_11char_traitsIcEEEE", "__ZNKSt3__210moneypunctIcLb0EE11do_groupingEv", "__ZNKSt3__210moneypunctIcLb0EE14do_curr_symbolEv", "__ZNKSt3__210moneypunctIcLb0EE16do_positive_signEv", "__ZNKSt3__210moneypunctIcLb0EE16do_negative_signEv", "__ZNKSt3__210moneypunctIcLb0EE13do_pos_formatEv", "__ZNKSt3__210moneypunctIcLb0EE13do_neg_formatEv", "__ZNKSt3__210moneypunctIcLb1EE11do_groupingEv", "__ZNKSt3__210moneypunctIcLb1EE14do_curr_symbolEv", "__ZNKSt3__210moneypunctIcLb1EE16do_positive_signEv", "__ZNKSt3__210moneypunctIcLb1EE16do_negative_signEv", "__ZNKSt3__210moneypunctIcLb1EE13do_pos_formatEv", "__ZNKSt3__210moneypunctIcLb1EE13do_neg_formatEv", "__ZNKSt3__210moneypunctIwLb0EE11do_groupingEv", "__ZNKSt3__210moneypunctIwLb0EE14do_curr_symbolEv", "__ZNKSt3__210moneypunctIwLb0EE16do_positive_signEv", "__ZNKSt3__210moneypunctIwLb0EE16do_negative_signEv", "__ZNKSt3__210moneypunctIwLb0EE13do_pos_formatEv", "__ZNKSt3__210moneypunctIwLb0EE13do_neg_formatEv", "__ZNKSt3__210moneypunctIwLb1EE11do_groupingEv", "__ZNKSt3__210moneypunctIwLb1EE14do_curr_symbolEv", "__ZNKSt3__210moneypunctIwLb1EE16do_positive_signEv", "__ZNKSt3__210moneypunctIwLb1EE16do_negative_signEv", "__ZNKSt3__210moneypunctIwLb1EE13do_pos_formatEv", "__ZNKSt3__210moneypunctIwLb1EE13do_neg_formatEv", "__ZNKSt3__28messagesIcE8do_closeEl", "__ZNKSt3__28messagesIwE8do_closeEl", "__ZNKSt3__28numpunctIcE11do_groupingEv", "__ZNKSt3__28numpunctIcE11do_truenameEv", "__ZNKSt3__28numpunctIcE12do_falsenameEv", "__ZNKSt3__28numpunctIwE11do_groupingEv", "__ZNKSt3__28numpunctIwE11do_truenameEv", "__ZNKSt3__28numpunctIwE12do_falsenameEv", "__ZNK3nbt3Tag7getNameEv", "__ZN3nbt3Tag7setNameENSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEE", "__ZN3nbt3Tag10setHasNameEb", "__ZN3nbt5ArrayIhE6resizeEm", "__ZNK3nbt5ArrayIhE9serializeEv", "__ZN3nbt5ArrayIhE11deserializeENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt5ArrayIiE6resizeEm", "__ZNK3nbt5ArrayIiE9serializeEv", "__ZN3nbt5ArrayIiE11deserializeENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN3nbt5ArrayIxE6resizeEm", "__ZNK3nbt5ArrayIxE9serializeEv", "__ZN3nbt5ArrayIxE11deserializeENSt3__212basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEE", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFvvEvPS3_JEE6invokeERKS5_S6_", "__ZN3nbt7TagHash7getNameEv", "__ZN3nbt7TagHash8jsRemoveENSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEE", "__ZN3nbt12PrimitiveTagIaLc1EE8setValueEa", "__ZN3nbt12PrimitiveTagIsLc2EE8setValueEs", "__ZN3nbt12PrimitiveTagIiLc3EE8setValueEi", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE8getValueEv", "__ZN3nbt12PrimitiveTagINSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEELc8EE8setValueES7_", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EE8getValueEv", "__ZN3nbt12PrimitiveTagINS_7TagHashELc10EE8setValueES1_", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EE8getValueEv", "__ZN3nbt12PrimitiveTagINS_5ArrayIhEELc7EE8setValueES2_", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EE8getValueEv", "__ZN3nbt12PrimitiveTagINS_5ArrayIiEELc11EE8setValueES2_", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EE8getValueEv", "__ZN3nbt12PrimitiveTagINS_5ArrayIxEELc12EE8setValueES2_", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE8getValueEv", "__ZN3nbt12PrimitiveTagINSt3__26vectorINS1_10shared_ptrINS_3TagEEENS1_9allocatorIS5_EEEELc9EE8setValueES8_", "__ZN3nbt7ListTag13removeElementEm", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEFvvEvPS3_JEE6invokeERKS5_S6_", "__ZN3nbt7ListTag12setEntryKindEc", "__ZNKSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE3strEv", "__Z11zlibDeflateRKNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE", "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE3strERKNS_12basic_stringIcS2_S4_EE", "__ZNSt11logic_errorC2EPKc", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2ERKS5_", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc", "__ZNSt3__213basic_istreamIcNS_11char_traitsIcEEE5tellgEv", "__ZNSt3__213basic_ostreamIcNS_11char_traitsIcEEE6sentryC2ERS3_", "__ZNSt3__28ios_base5clearEj", "_zcfree", "_pop_arg_long_double", "__ZNSt3__28ios_base16__call_callbacksENS0_5eventE", "__ZNSt13runtime_errorC2EPKc", "__ZNSt3__217_DeallocateCaller27__do_deallocate_handle_sizeEPvm", "__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw", "__ZNSt3__26vectorIPNS_6locale5facetENS_15__sso_allocatorIS3_Lm28EEEEC2Em", "__ZNSt3__26locale5__imp7installINS_7collateIcEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7collateIwEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_5ctypeIcEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_5ctypeIwEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7codecvtIcc11__mbstate_tEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7codecvtIwc11__mbstate_tEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7codecvtIDsc11__mbstate_tEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7codecvtIDic11__mbstate_tEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8numpunctIcEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8numpunctIwEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_7num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_10moneypunctIcLb0EEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_10moneypunctIcLb1EEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_10moneypunctIwLb0EEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_10moneypunctIwLb1EEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_9money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_9money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_9money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_9money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8time_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8time_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8messagesIcEEEEvPT_", "__ZNSt3__26locale5__imp7installINS_8messagesIwEEEEvPT_", "__ZNSt3__26vectorIPNS_6locale5facetENS_15__sso_allocatorIS3_Lm28EEEE11__vallocateEm", "__ZNSt3__26vectorIPNS_6locale5facetENS_15__sso_allocatorIS3_Lm28EEEE18__construct_at_endEm", "__ZNSt3__26vectorIPNS_6locale5facetENS_15__sso_allocatorIS3_Lm28EEEE6resizeEm", "__ZNSt3__214__split_bufferIPNS_6locale5facetERNS_15__sso_allocatorIS3_Lm28EEEE18__construct_at_endEm", "__ZNSt3__26vectorIPNS_6locale5facetENS_15__sso_allocatorIS3_Lm28EEEE26__swap_out_circular_bufferERNS_14__split_bufferIS3_RS5_EE", "__ZNSt3__218__libcpp_refstringC2EPKc", "__ZNSt11logic_errorC2ERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE", "__ZNSt13runtime_errorC2ERKNSt3__212basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_viid = [0, "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIdLc6EEEFvdEvPS4_JdEE6invokeERKS6_S7_d"];
var debug_table_viif = [0, "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIfLc5EEEFvfEvPS4_JfEE6invokeERKS6_S7_f"];
var debug_table_viii = [0, "__ZNKSt3__214error_category23default_error_conditionEi", "__ZNKSt3__219__iostream_category7messageEi", "__ZN3nbt3Tag9serializeEPS0_c", "__ZN3nbt3Tag19serializeCompressedEPS0_c", "__ZN10emscripten8internal13MethodInvokerIMN3nbt3TagEFvNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEEvPS3_JSA_EE6invokeERKSC_SD_PNS0_11BindingTypeISA_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt3TagEFvbEvPS3_JbEE6invokeERKS5_S6_b", "__ZN3nbt5ArrayIhE10setElementEmh", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIhEEFvmEvPS4_JmEE6invokeERKS6_S7_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIhEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN3nbt5ArrayIiE10setElementEmi", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIiEEFvmEvPS4_JmEE6invokeERKS6_S7_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIiEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIxEEFvmEvPS4_JmEE6invokeERKS6_S7_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIxEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN3nbt7TagHash5jsSetENSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEPNS_3TagE", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFvNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEEvPS3_JSA_EE6invokeERKSC_SD_PNS0_11BindingTypeISA_vEUt_E", "__ZN3nbt7TagHash8jsRenameENSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEES7_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIaLc1EEEFvaEvPS4_JaEE6invokeERKS6_S7_a", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIaLc1EEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIsLc2EEEFvsEvPS4_JsEE6invokeERKS6_S7_s", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIsLc2EEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIiLc3EEEFviEvPS4_JiEE6invokeERKS6_S7_i", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIiLc3EEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIxLc4EEEFvxEvPS4_JxEE6invokeERKS6_S7_Px", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIxLc4EEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIfLc5EEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagIdLc6EEEFvNSt3__212basic_stringIcNS5_11char_traitsIcEENS5_9allocatorIcEEEEEvPS4_JSB_EE6invokeERKSD_SE_PNS0_11BindingTypeISB_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEELc8EEEFvSA_EvPSB_JSA_EE6invokeERKSD_SE_PNS0_11BindingTypeISA_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_7TagHashELc10EEEFvS4_EvPS5_JS4_EE6invokeERKS7_S8_PS4_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_7TagHashELc10EEEFvNSt3__212basic_stringIcNS6_11char_traitsIcEENS6_9allocatorIcEEEEEvPS5_JSC_EE6invokeERKSE_SF_PNS0_11BindingTypeISC_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEFvS5_EvPS6_JS5_EE6invokeERKS8_S9_PS5_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIhEELc7EEEFvNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEEEvPS6_JSD_EE6invokeERKSF_SG_PNS0_11BindingTypeISD_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEFvS5_EvPS6_JS5_EE6invokeERKS8_S9_PS5_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIiEELc11EEEFvNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEEEvPS6_JSD_EE6invokeERKSF_SG_PNS0_11BindingTypeISD_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEFvS5_EvPS6_JS5_EE6invokeERKS8_S9_PS5_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINS2_5ArrayIxEELc12EEEFvNSt3__212basic_stringIcNS7_11char_traitsIcEENS7_9allocatorIcEEEEEvPS6_JSD_EE6invokeERKSF_SG_PNS0_11BindingTypeISD_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEFvSB_EvPSC_JSB_EE6invokeERKSE_SF_PSB_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt12PrimitiveTagINSt3__26vectorINS4_10shared_ptrINS2_3TagEEENS4_9allocatorIS8_EEEELc9EEEFvNS4_12basic_stringIcNS4_11char_traitsIcEENS9_IcEEEEEvPSC_JSH_EE6invokeERKSJ_SK_PNS0_11BindingTypeISH_vEUt_E", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEFvmEvPS3_JmEE6invokeERKS5_S6_m", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7ListTagEFvcEvPS3_JcEE6invokeERKS5_S6_c", "__ZN3nbt3Tag5writeEPS0_RNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEEc", "___cxa_throw", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6resizeEmc", "__ZNSt3__28ios_base7failureC2EPKcRKNS_10error_codeE", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm", "__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6__initEPKwm", "__ZNSt3__219__double_or_nothingIcEEvRNS_10unique_ptrIT_PFvPvEEERPS2_S9_", "__ZNSt3__219__double_or_nothingIjEEvRNS_10unique_ptrIT_PFvPvEEERPS2_S9_", "__ZNSt3__219__double_or_nothingIwEEvRNS_10unique_ptrIT_PFvPvEEERPS2_S9_", "__ZNSt3__212system_error6__initERKNS_10error_codeENS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var debug_table_viiii = [0, "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE7seekposENS_4fposI11__mbstate_tEEj", "__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi", "__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi", "__ZNK10__cxxabiv121__vmi_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE7seekposENS_4fposI11__mbstate_tEEj", "__ZNKSt3__27collateIcE12do_transformEPKcS3_", "__ZNKSt3__27collateIwE12do_transformEPKwS3_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIhEEFvmhEvPS4_JmhEE6invokeERKS6_S7_mh", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIiEEFvmiEvPS4_JmiEE6invokeERKS6_S7_mi", "__ZN10emscripten8internal13MethodInvokerIMN3nbt5ArrayIxEEFvmxEvPS4_JmxEE6invokeERKS6_S7_mPx", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFvNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEEPNS2_3TagEEvPS3_JSA_SC_EE6invokeERKSE_SF_PNS0_11BindingTypeISA_vEUt_ESC_", "__ZN10emscripten8internal13MethodInvokerIMN3nbt7TagHashEFvNSt3__212basic_stringIcNS4_11char_traitsIcEENS4_9allocatorIcEEEESA_EvPS3_JSA_SA_EE6invokeERKSC_SD_PNS0_11BindingTypeISA_vEUt_ESK_", "__ZN3nbt3Tag5writeEPS0_RNSt3__213basic_ostreamIcNS2_11char_traitsIcEEEERKNS2_12basic_stringIcS5_NS2_9allocatorIcEEEEc", "__ZNSt3__216__check_groupingERKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEPjS8_Rj", "__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcmm"];
var debug_table_viiiii = [0, "__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib", "__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib", "__ZNK10__cxxabiv121__vmi_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib"];
var debug_table_viiiiii = [0, "__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib", "__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib", "__ZNK10__cxxabiv121__vmi_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib", "__ZNKSt3__28messagesIcE6do_getEliiRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE", "__ZNKSt3__28messagesIwE6do_getEliiRKNS_12basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEEE", "__ZNSt3__26__treeINS_12__value_typeINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEENS_10shared_ptrIN3nbt3TagEEEEENS_19__map_value_compareIS7_SC_NS_4lessIS7_EELb1EEENS5_ISC_EEE25__emplace_unique_key_argsIS7_JRKNS_21piecewise_construct_tENS_5tupleIJRKS7_EEENSN_IJEEEEEENS_4pairINS_15__tree_iteratorISC_PNS_11__tree_nodeISC_PvEElEEbEERKT_DpOT0_", 0];
var debug_table_viiiiiii = [0, "__ZNSt3__29__num_putIcE21__widen_and_group_intEPcS2_S2_S2_RS2_S3_RKNS_6localeE", "__ZNSt3__29__num_putIcE23__widen_and_group_floatEPcS2_S2_S2_RS2_S3_RKNS_6localeE", "__ZNSt3__29__num_putIwE21__widen_and_group_intEPcS2_S2_PwRS3_S4_RKNS_6localeE", "__ZNSt3__29__num_putIwE23__widen_and_group_floatEPcS2_S2_PwRS3_S4_RKNS_6localeE", 0, 0, 0];
var debug_table_viiiiiiiiii = [0, "__ZNSt3__211__money_getIcE13__gather_infoEbRKNS_6localeERNS_10money_base7patternERcS8_RNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEESF_SF_SF_Ri", "__ZNSt3__211__money_getIwE13__gather_infoEbRKNS_6localeERNS_10money_base7patternERwS8_RNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS9_IwNSA_IwEENSC_IwEEEESJ_SJ_Ri", "__ZNSt3__211__money_putIcE13__gather_infoEbbRKNS_6localeERNS_10money_base7patternERcS8_RNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEESF_SF_Ri", "__ZNSt3__211__money_putIwE13__gather_infoEbbRKNS_6localeERNS_10money_base7patternERwS8_RNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERNS9_IwNSA_IwEENSC_IwEEEESJ_Ri", 0, 0, 0];
var debug_table_viiiiiiiiiiiiiii = [0, "__ZNSt3__211__money_putIcE8__formatEPcRS2_S3_jPKcS5_RKNS_5ctypeIcEEbRKNS_10money_base7patternEccRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEESL_SL_i", "__ZNSt3__211__money_putIwE8__formatEPwRS2_S3_jPKwS5_RKNS_5ctypeIwEEbRKNS_10money_base7patternEwwRKNS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEERKNSE_IwNSF_IwEENSH_IwEEEESQ_i", 0];
var debug_table_viij = [0, "__ZN3nbt5ArrayIxE10setElementEmx"];
var debug_table_viijii = [0, "__ZNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEE7seekoffExNS_8ios_base7seekdirEj", "__ZNSt3__215basic_streambufIcNS_11char_traitsIcEEE7seekoffExNS_8ios_base7seekdirEj", 0];
var debug_table_vij = [0, "__ZN3nbt12PrimitiveTagIxLc4EE8setValueEx"];
var debug_tables = {
    "di": debug_table_di,
    "dii": debug_table_dii,
    "diii": debug_table_diii,
    "fi": debug_table_fi,
    "fii": debug_table_fii,
    "fiii": debug_table_fiii,
    "i": debug_table_i,
    "ii": debug_table_ii,
    "iidiiii": debug_table_iidiiii,
    "iii": debug_table_iii,
    "iiii": debug_table_iiii,
    "iiiii": debug_table_iiiii,
    "iiiiid": debug_table_iiiiid,
    "iiiiii": debug_table_iiiiii,
    "iiiiiid": debug_table_iiiiiid,
    "iiiiiii": debug_table_iiiiiii,
    "iiiiiiii": debug_table_iiiiiiii,
    "iiiiiiiii": debug_table_iiiiiiiii,
    "iiiiiiiiiii": debug_table_iiiiiiiiiii,
    "iiiiiiiiiiii": debug_table_iiiiiiiiiiii,
    "iiiiiiiiiiiii": debug_table_iiiiiiiiiiiii,
    "iiiiij": debug_table_iiiiij,
    "iij": debug_table_iij,
    "ji": debug_table_ji,
    "jii": debug_table_jii,
    "jiiii": debug_table_jiiii,
    "jiji": debug_table_jiji,
    "v": debug_table_v,
    "vi": debug_table_vi,
    "vid": debug_table_vid,
    "vif": debug_table_vif,
    "vii": debug_table_vii,
    "viid": debug_table_viid,
    "viif": debug_table_viif,
    "viii": debug_table_viii,
    "viiii": debug_table_viiii,
    "viiiii": debug_table_viiiii,
    "viiiiii": debug_table_viiiiii,
    "viiiiiii": debug_table_viiiiiii,
    "viiiiiiiiii": debug_table_viiiiiiiiii,
    "viiiiiiiiiiiiiii": debug_table_viiiiiiiiiiiiiii,
    "viij": debug_table_viij,
    "viijii": debug_table_viijii,
    "vij": debug_table_vij
};
function nullFunc_di(x) {
    abortFnPtrError(x, "di")
}
function nullFunc_dii(x) {
    abortFnPtrError(x, "dii")
}
function nullFunc_diii(x) {
    abortFnPtrError(x, "diii")
}
function nullFunc_fi(x) {
    abortFnPtrError(x, "fi")
}
function nullFunc_fii(x) {
    abortFnPtrError(x, "fii")
}
function nullFunc_fiii(x) {
    abortFnPtrError(x, "fiii")
}
function nullFunc_i(x) {
    abortFnPtrError(x, "i")
}
function nullFunc_ii(x) {
    abortFnPtrError(x, "ii")
}
function nullFunc_iidiiii(x) {
    abortFnPtrError(x, "iidiiii")
}
function nullFunc_iii(x) {
    abortFnPtrError(x, "iii")
}
function nullFunc_iiii(x) {
    abortFnPtrError(x, "iiii")
}
function nullFunc_iiiii(x) {
    abortFnPtrError(x, "iiiii")
}
function nullFunc_iiiiid(x) {
    abortFnPtrError(x, "iiiiid")
}
function nullFunc_iiiiii(x) {
    abortFnPtrError(x, "iiiiii")
}
function nullFunc_iiiiiid(x) {
    abortFnPtrError(x, "iiiiiid")
}
function nullFunc_iiiiiii(x) {
    abortFnPtrError(x, "iiiiiii")
}
function nullFunc_iiiiiiii(x) {
    abortFnPtrError(x, "iiiiiiii")
}
function nullFunc_iiiiiiiii(x) {
    abortFnPtrError(x, "iiiiiiiii")
}
function nullFunc_iiiiiiiiiii(x) {
    abortFnPtrError(x, "iiiiiiiiiii")
}
function nullFunc_iiiiiiiiiiii(x) {
    abortFnPtrError(x, "iiiiiiiiiiii")
}
function nullFunc_iiiiiiiiiiiii(x) {
    abortFnPtrError(x, "iiiiiiiiiiiii")
}
function nullFunc_iiiiij(x) {
    abortFnPtrError(x, "iiiiij")
}
function nullFunc_iij(x) {
    abortFnPtrError(x, "iij")
}
function nullFunc_ji(x) {
    abortFnPtrError(x, "ji")
}
function nullFunc_jii(x) {
    abortFnPtrError(x, "jii")
}
function nullFunc_jiiii(x) {
    abortFnPtrError(x, "jiiii")
}
function nullFunc_jiji(x) {
    abortFnPtrError(x, "jiji")
}
function nullFunc_v(x) {
    abortFnPtrError(x, "v")
}
function nullFunc_vi(x) {
    abortFnPtrError(x, "vi")
}
function nullFunc_vid(x) {
    abortFnPtrError(x, "vid")
}
function nullFunc_vif(x) {
    abortFnPtrError(x, "vif")
}
function nullFunc_vii(x) {
    abortFnPtrError(x, "vii")
}
function nullFunc_viid(x) {
    abortFnPtrError(x, "viid")
}
function nullFunc_viif(x) {
    abortFnPtrError(x, "viif")
}
function nullFunc_viii(x) {
    abortFnPtrError(x, "viii")
}
function nullFunc_viiii(x) {
    abortFnPtrError(x, "viiii")
}
function nullFunc_viiiii(x) {
    abortFnPtrError(x, "viiiii")
}
function nullFunc_viiiiii(x) {
    abortFnPtrError(x, "viiiiii")
}
function nullFunc_viiiiiii(x) {
    abortFnPtrError(x, "viiiiiii")
}
function nullFunc_viiiiiiiiii(x) {
    abortFnPtrError(x, "viiiiiiiiii")
}
function nullFunc_viiiiiiiiiiiiiii(x) {
    abortFnPtrError(x, "viiiiiiiiiiiiiii")
}
function nullFunc_viij(x) {
    abortFnPtrError(x, "viij")
}
function nullFunc_viijii(x) {
    abortFnPtrError(x, "viijii")
}
function nullFunc_vij(x) {
    abortFnPtrError(x, "vij")
}
function invoke_diii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_diii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_fiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_fiii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_i(index) {
    var sp = stackSave();
    try {
        return dynCall_i(index)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_ii(index, a1) {
    var sp = stackSave();
    try {
        return dynCall_ii(index, a1)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iii(index, a1, a2) {
    var sp = stackSave();
    try {
        return dynCall_iii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_iiii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        return dynCall_iiiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
    var sp = stackSave();
    try {
        return dynCall_iiiiii(index, a1, a2, a3, a4, a5)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    var sp = stackSave();
    try {
        return dynCall_iiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iiiiij(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
        return dynCall_iiiiij(index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_iij(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_iij(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_jiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        return dynCall_jiiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_v(index) {
    var sp = stackSave();
    try {
        dynCall_v(index)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_vi(index, a1) {
    var sp = stackSave();
    try {
        dynCall_vi(index, a1)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_vii(index, a1, a2) {
    var sp = stackSave();
    try {
        dynCall_vii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        dynCall_viii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        dynCall_viiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
        dynCall_viiiiii(index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    var sp = stackSave();
    try {
        dynCall_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    var sp = stackSave();
    try {
        dynCall_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
    var sp = stackSave();
    try {
        dynCall_viiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
function invoke_viijii(index, a1, a2, a3, a4, a5, a6) {
    var sp = stackSave();
    try {
        dynCall_viijii(index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp")
            throw e;
        _setThrew(1, 0)
    }
}
var asmGlobalArg = {};
var asmLibraryArg = {
    "___cxa_allocate_exception": ___cxa_allocate_exception,
    "___cxa_begin_catch": ___cxa_begin_catch,
    "___cxa_end_catch": ___cxa_end_catch,
    "___cxa_find_matching_catch_2": ___cxa_find_matching_catch_2,
    "___cxa_find_matching_catch_3": ___cxa_find_matching_catch_3,
    "___cxa_free_exception": ___cxa_free_exception,
    "___cxa_rethrow": ___cxa_rethrow,
    "___cxa_throw": ___cxa_throw,
    "___cxa_uncaught_exceptions": ___cxa_uncaught_exceptions,
    "___exception_addRef": ___exception_addRef,
    "___exception_deAdjust": ___exception_deAdjust,
    "___exception_decRef": ___exception_decRef,
    "___gxx_personality_v0": ___gxx_personality_v0,
    "___map_file": ___map_file,
    "___resumeException": ___resumeException,
    "___sys_munmap": ___sys_munmap,
    "___syscall91": ___syscall91,
    "___wasi_fd_write": ___wasi_fd_write,
    "__addDays": __addDays,
    "__arraySum": __arraySum,
    "__embind_register_bool": __embind_register_bool,
    "__embind_register_class": __embind_register_class,
    "__embind_register_class_class_function": __embind_register_class_class_function,
    "__embind_register_class_function": __embind_register_class_function,
    "__embind_register_emval": __embind_register_emval,
    "__embind_register_float": __embind_register_float,
    "__embind_register_function": __embind_register_function,
    "__embind_register_integer": __embind_register_integer,
    "__embind_register_memory_view": __embind_register_memory_view,
    "__embind_register_std_string": __embind_register_std_string,
    "__embind_register_std_wstring": __embind_register_std_wstring,
    "__embind_register_void": __embind_register_void,
    "__emval_decref": __emval_decref,
    "__emval_register": __emval_register,
    "__isLeapYear": __isLeapYear,
    "__memory_base": 1024,
    "__table_base": 0,
    "_abort": _abort,
    "_embind_repr": _embind_repr,
    "_emscripten_get_heap_size": _emscripten_get_heap_size,
    "_emscripten_get_now": _emscripten_get_now,
    "_emscripten_memcpy_big": _emscripten_memcpy_big,
    "_emscripten_resize_heap": _emscripten_resize_heap,
    "_fd_write": _fd_write,
    "_getenv": _getenv,
    "_llvm_bswap_i64": _llvm_bswap_i64,
    "_llvm_stackrestore": _llvm_stackrestore,
    "_llvm_stacksave": _llvm_stacksave,
    "_llvm_trap": _llvm_trap,
    "_strftime": _strftime,
    "_strftime_l": _strftime_l,
    "abort": abort,
    "abortStackOverflow": abortStackOverflow,
    "getTempRet0": getTempRet0,
    "invoke_diii": invoke_diii,
    "invoke_fiii": invoke_fiii,
    "invoke_i": invoke_i,
    "invoke_ii": invoke_ii,
    "invoke_iii": invoke_iii,
    "invoke_iiii": invoke_iiii,
    "invoke_iiiii": invoke_iiiii,
    "invoke_iiiiii": invoke_iiiiii,
    "invoke_iiiiiii": invoke_iiiiiii,
    "invoke_iiiiiiii": invoke_iiiiiiii,
    "invoke_iiiiiiiii": invoke_iiiiiiiii,
    "invoke_iiiiiiiiiii": invoke_iiiiiiiiiii,
    "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii,
    "invoke_iiiiiiiiiiiii": invoke_iiiiiiiiiiiii,
    "invoke_iiiiij": invoke_iiiiij,
    "invoke_iij": invoke_iij,
    "invoke_jiiii": invoke_jiiii,
    "invoke_v": invoke_v,
    "invoke_vi": invoke_vi,
    "invoke_vii": invoke_vii,
    "invoke_viii": invoke_viii,
    "invoke_viiii": invoke_viiii,
    "invoke_viiiiii": invoke_viiiiii,
    "invoke_viiiiiii": invoke_viiiiiii,
    "invoke_viiiiiiiiii": invoke_viiiiiiiiii,
    "invoke_viiiiiiiiiiiiiii": invoke_viiiiiiiiiiiiiii,
    "invoke_viijii": invoke_viijii,
    "memory": wasmMemory,
    "nullFunc_di": nullFunc_di,
    "nullFunc_dii": nullFunc_dii,
    "nullFunc_diii": nullFunc_diii,
    "nullFunc_fi": nullFunc_fi,
    "nullFunc_fii": nullFunc_fii,
    "nullFunc_fiii": nullFunc_fiii,
    "nullFunc_i": nullFunc_i,
    "nullFunc_ii": nullFunc_ii,
    "nullFunc_iidiiii": nullFunc_iidiiii,
    "nullFunc_iii": nullFunc_iii,
    "nullFunc_iiii": nullFunc_iiii,
    "nullFunc_iiiii": nullFunc_iiiii,
    "nullFunc_iiiiid": nullFunc_iiiiid,
    "nullFunc_iiiiii": nullFunc_iiiiii,
    "nullFunc_iiiiiid": nullFunc_iiiiiid,
    "nullFunc_iiiiiii": nullFunc_iiiiiii,
    "nullFunc_iiiiiiii": nullFunc_iiiiiiii,
    "nullFunc_iiiiiiiii": nullFunc_iiiiiiiii,
    "nullFunc_iiiiiiiiiii": nullFunc_iiiiiiiiiii,
    "nullFunc_iiiiiiiiiiii": nullFunc_iiiiiiiiiiii,
    "nullFunc_iiiiiiiiiiiii": nullFunc_iiiiiiiiiiiii,
    "nullFunc_iiiiij": nullFunc_iiiiij,
    "nullFunc_iij": nullFunc_iij,
    "nullFunc_ji": nullFunc_ji,
    "nullFunc_jii": nullFunc_jii,
    "nullFunc_jiiii": nullFunc_jiiii,
    "nullFunc_jiji": nullFunc_jiji,
    "nullFunc_v": nullFunc_v,
    "nullFunc_vi": nullFunc_vi,
    "nullFunc_vid": nullFunc_vid,
    "nullFunc_vif": nullFunc_vif,
    "nullFunc_vii": nullFunc_vii,
    "nullFunc_viid": nullFunc_viid,
    "nullFunc_viif": nullFunc_viif,
    "nullFunc_viii": nullFunc_viii,
    "nullFunc_viiii": nullFunc_viiii,
    "nullFunc_viiiii": nullFunc_viiiii,
    "nullFunc_viiiiii": nullFunc_viiiiii,
    "nullFunc_viiiiiii": nullFunc_viiiiiii,
    "nullFunc_viiiiiiiiii": nullFunc_viiiiiiiiii,
    "nullFunc_viiiiiiiiiiiiiii": nullFunc_viiiiiiiiiiiiiii,
    "nullFunc_viij": nullFunc_viij,
    "nullFunc_viijii": nullFunc_viijii,
    "nullFunc_vij": nullFunc_vij,
    "setTempRet0": setTempRet0,
    "table": wasmTable,
    "tempDoublePtr": tempDoublePtr
};
var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
Module["asm"] = asm;
var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["__ZSt18uncaught_exceptionv"].apply(null, arguments)
}
;
var ___cxa_can_catch = Module["___cxa_can_catch"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["___cxa_can_catch"].apply(null, arguments)
}
;
var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["___cxa_is_pointer_type"].apply(null, arguments)
}
;
var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["___embind_register_native_and_builtin_types"].apply(null, arguments)
}
;
var ___errno_location = Module["___errno_location"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["___errno_location"].apply(null, arguments)
}
;
var ___getTypeName = Module["___getTypeName"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["___getTypeName"].apply(null, arguments)
}
;
var _emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_emscripten_get_sbrk_ptr"].apply(null, arguments)
}
;
var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments)
}
;
var _fflush = Module["_fflush"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_fflush"].apply(null, arguments)
}
;
var _free = Module["_free"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_free"].apply(null, arguments)
}
;
var _llvm_bswap_i16 = Module["_llvm_bswap_i16"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_llvm_bswap_i16"].apply(null, arguments)
}
;
var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_llvm_bswap_i32"].apply(null, arguments)
}
;
var _malloc = Module["_malloc"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_malloc"].apply(null, arguments)
}
;
var _memcpy = Module["_memcpy"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_memcpy"].apply(null, arguments)
}
;
var _memmove = Module["_memmove"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_memmove"].apply(null, arguments)
}
;
var _memset = Module["_memset"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_memset"].apply(null, arguments)
}
;
var _setThrew = Module["_setThrew"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["_setThrew"].apply(null, arguments)
}
;
var globalCtors = Module["globalCtors"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["globalCtors"].apply(null, arguments)
}
;
var stackAlloc = Module["stackAlloc"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["stackAlloc"].apply(null, arguments)
}
;
var stackRestore = Module["stackRestore"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["stackRestore"].apply(null, arguments)
}
;
var stackSave = Module["stackSave"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["stackSave"].apply(null, arguments)
}
;
var dynCall_di = Module["dynCall_di"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_di"].apply(null, arguments)
}
;
var dynCall_dii = Module["dynCall_dii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_dii"].apply(null, arguments)
}
;
var dynCall_diii = Module["dynCall_diii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_diii"].apply(null, arguments)
}
;
var dynCall_fi = Module["dynCall_fi"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_fi"].apply(null, arguments)
}
;
var dynCall_fii = Module["dynCall_fii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_fii"].apply(null, arguments)
}
;
var dynCall_fiii = Module["dynCall_fiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_fiii"].apply(null, arguments)
}
;
var dynCall_i = Module["dynCall_i"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_i"].apply(null, arguments)
}
;
var dynCall_ii = Module["dynCall_ii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_ii"].apply(null, arguments)
}
;
var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iidiiii"].apply(null, arguments)
}
;
var dynCall_iii = Module["dynCall_iii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iii"].apply(null, arguments)
}
;
var dynCall_iiii = Module["dynCall_iiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiii"].apply(null, arguments)
}
;
var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiii"].apply(null, arguments)
}
;
var dynCall_iiiiid = Module["dynCall_iiiiid"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiid"].apply(null, arguments)
}
;
var dynCall_iiiiii = Module["dynCall_iiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiiid = Module["dynCall_iiiiiid"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiid"].apply(null, arguments)
}
;
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiiiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiiiiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null, arguments)
}
;
var dynCall_iiiiij = Module["dynCall_iiiiij"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iiiiij"].apply(null, arguments)
}
;
var dynCall_iij = Module["dynCall_iij"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_iij"].apply(null, arguments)
}
;
var dynCall_ji = Module["dynCall_ji"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_ji"].apply(null, arguments)
}
;
var dynCall_jii = Module["dynCall_jii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_jii"].apply(null, arguments)
}
;
var dynCall_jiiii = Module["dynCall_jiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_jiiii"].apply(null, arguments)
}
;
var dynCall_jiji = Module["dynCall_jiji"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_jiji"].apply(null, arguments)
}
;
var dynCall_v = Module["dynCall_v"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_v"].apply(null, arguments)
}
;
var dynCall_vi = Module["dynCall_vi"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_vi"].apply(null, arguments)
}
;
var dynCall_vid = Module["dynCall_vid"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_vid"].apply(null, arguments)
}
;
var dynCall_vif = Module["dynCall_vif"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_vif"].apply(null, arguments)
}
;
var dynCall_vii = Module["dynCall_vii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_vii"].apply(null, arguments)
}
;
var dynCall_viid = Module["dynCall_viid"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viid"].apply(null, arguments)
}
;
var dynCall_viif = Module["dynCall_viif"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viif"].apply(null, arguments)
}
;
var dynCall_viii = Module["dynCall_viii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viii"].apply(null, arguments)
}
;
var dynCall_viiii = Module["dynCall_viiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viiii"].apply(null, arguments)
}
;
var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viiiii"].apply(null, arguments)
}
;
var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viiiiii"].apply(null, arguments)
}
;
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments)
}
;
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viiiiiiiiii"].apply(null, arguments)
}
;
var dynCall_viiiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiiii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viiiiiiiiiiiiiii"].apply(null, arguments)
}
;
var dynCall_viij = Module["dynCall_viij"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viij"].apply(null, arguments)
}
;
var dynCall_viijii = Module["dynCall_viijii"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_viijii"].apply(null, arguments)
}
;
var dynCall_vij = Module["dynCall_vij"] = function() {
    assert(runtimeInitialized, "you need to wait for the runtime to be ready (e.g. wait for main() to be called)");
    assert(!runtimeExited, "the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)");
    return Module["asm"]["dynCall_vij"].apply(null, arguments)
}
;
Module["__ZZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwPKvE5__fmt"] = 38441;
Module["__ZZNKSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEE6do_putES4_RNS_8ios_baseEwmE5__fmt"] = 38452;
Module["asm"] = asm;
if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString"))
    Module["intArrayFromString"] = function() {
        abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString"))
    Module["intArrayToString"] = function() {
        abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ccall"))
    Module["ccall"] = function() {
        abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "cwrap"))
    Module["cwrap"] = function() {
        abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "setValue"))
    Module["setValue"] = function() {
        abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getValue"))
    Module["getValue"] = function() {
        abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "allocate"))
    Module["allocate"] = function() {
        abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getMemory"))
    Module["getMemory"] = function() {
        abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString"))
    Module["UTF8ArrayToString"] = function() {
        abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString"))
    Module["UTF8ToString"] = function() {
        abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array"))
    Module["stringToUTF8Array"] = function() {
        abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8"))
    Module["stringToUTF8"] = function() {
        abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8"))
    Module["lengthBytesUTF8"] = function() {
        abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace"))
    Module["stackTrace"] = function() {
        abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun"))
    Module["addOnPreRun"] = function() {
        abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit"))
    Module["addOnInit"] = function() {
        abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain"))
    Module["addOnPreMain"] = function() {
        abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit"))
    Module["addOnExit"] = function() {
        abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun"))
    Module["addOnPostRun"] = function() {
        abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory"))
    Module["writeStringToMemory"] = function() {
        abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory"))
    Module["writeArrayToMemory"] = function() {
        abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory"))
    Module["writeAsciiToMemory"] = function() {
        abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addRunDependency"))
    Module["addRunDependency"] = function() {
        abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "removeRunDependency"))
    Module["removeRunDependency"] = function() {
        abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder"))
    Module["FS_createFolder"] = function() {
        abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPath"))
    Module["FS_createPath"] = function() {
        abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDataFile"))
    Module["FS_createDataFile"] = function() {
        abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPreloadedFile"))
    Module["FS_createPreloadedFile"] = function() {
        abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLazyFile"))
    Module["FS_createLazyFile"] = function() {
        abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink"))
    Module["FS_createLink"] = function() {
        abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDevice"))
    Module["FS_createDevice"] = function() {
        abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS_unlink"))
    Module["FS_unlink"] = function() {
        abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "dynamicAlloc"))
    Module["dynamicAlloc"] = function() {
        abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "loadDynamicLibrary"))
    Module["loadDynamicLibrary"] = function() {
        abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "loadWebAssemblyModule"))
    Module["loadWebAssemblyModule"] = function() {
        abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getLEB"))
    Module["getLEB"] = function() {
        abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables"))
    Module["getFunctionTables"] = function() {
        abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables"))
    Module["alignFunctionTables"] = function() {
        abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions"))
    Module["registerFunctions"] = function() {
        abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "addFunction"))
    Module["addFunction"] = function() {
        abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction"))
    Module["removeFunction"] = function() {
        abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper"))
    Module["getFuncWrapper"] = function() {
        abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint"))
    Module["prettyPrint"] = function() {
        abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt"))
    Module["makeBigInt"] = function() {
        abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "dynCall"))
    Module["dynCall"] = function() {
        abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting"))
    Module["getCompilerSetting"] = function() {
        abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "print"))
    Module["print"] = function() {
        abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "printErr"))
    Module["printErr"] = function() {
        abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0"))
    Module["getTempRet0"] = function() {
        abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0"))
    Module["setTempRet0"] = function() {
        abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "callMain"))
    Module["callMain"] = function() {
        abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "abort"))
    Module["abort"] = function() {
        abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8"))
    Module["stringToNewUTF8"] = function() {
        abort("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer"))
    Module["emscripten_realloc_buffer"] = function() {
        abort("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ENV"))
    Module["ENV"] = function() {
        abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES"))
    Module["ERRNO_CODES"] = function() {
        abort("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES"))
    Module["ERRNO_MESSAGES"] = function() {
        abort("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "setErrNo"))
    Module["setErrNo"] = function() {
        abort("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "DNS"))
    Module["DNS"] = function() {
        abort("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES"))
    Module["GAI_ERRNO_MESSAGES"] = function() {
        abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "Protocols"))
    Module["Protocols"] = function() {
        abort("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "Sockets"))
    Module["Sockets"] = function() {
        abort("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE"))
    Module["UNWIND_CACHE"] = function() {
        abort("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs"))
    Module["readAsmConstArgs"] = function() {
        abort("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q"))
    Module["jstoi_q"] = function() {
        abort("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s"))
    Module["jstoi_s"] = function() {
        abort("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative"))
    Module["reallyNegative"] = function() {
        abort("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "formatString"))
    Module["formatString"] = function() {
        abort("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "PATH"))
    Module["PATH"] = function() {
        abort("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS"))
    Module["PATH_FS"] = function() {
        abort("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS"))
    Module["SYSCALLS"] = function() {
        abort("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2"))
    Module["syscallMmap2"] = function() {
        abort("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap"))
    Module["syscallMunmap"] = function() {
        abort("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "JSEvents"))
    Module["JSEvents"] = function() {
        abort("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets"))
    Module["specialHTMLTargets"] = function() {
        abort("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "demangle"))
    Module["demangle"] = function() {
        abort("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "demangleAll"))
    Module["demangleAll"] = function() {
        abort("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace"))
    Module["jsStackTrace"] = function() {
        abort("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace"))
    Module["stackTrace"] = function() {
        abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings"))
    Module["getEnvStrings"] = function() {
        abort("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64"))
    Module["writeI53ToI64"] = function() {
        abort("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped"))
    Module["writeI53ToI64Clamped"] = function() {
        abort("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling"))
    Module["writeI53ToI64Signaling"] = function() {
        abort("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped"))
    Module["writeI53ToU64Clamped"] = function() {
        abort("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling"))
    Module["writeI53ToU64Signaling"] = function() {
        abort("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64"))
    Module["readI53FromI64"] = function() {
        abort("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64"))
    Module["readI53FromU64"] = function() {
        abort("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53"))
    Module["convertI32PairToI53"] = function() {
        abort("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53"))
    Module["convertU32PairToI53"] = function() {
        abort("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "Browser"))
    Module["Browser"] = function() {
        abort("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "FS"))
    Module["FS"] = function() {
        abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "MEMFS"))
    Module["MEMFS"] = function() {
        abort("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "TTY"))
    Module["TTY"] = function() {
        abort("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS"))
    Module["PIPEFS"] = function() {
        abort("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS"))
    Module["SOCKFS"] = function() {
        abort("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "GL"))
    Module["GL"] = function() {
        abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet"))
    Module["emscriptenWebGLGet"] = function() {
        abort("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData"))
    Module["emscriptenWebGLGetTexPixelData"] = function() {
        abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform"))
    Module["emscriptenWebGLGetUniform"] = function() {
        abort("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib"))
    Module["emscriptenWebGLGetVertexAttrib"] = function() {
        abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "AL"))
    Module["AL"] = function() {
        abort("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode"))
    Module["SDL_unicode"] = function() {
        abort("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext"))
    Module["SDL_ttfContext"] = function() {
        abort("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio"))
    Module["SDL_audio"] = function() {
        abort("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SDL"))
    Module["SDL"] = function() {
        abort("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx"))
    Module["SDL_gfx"] = function() {
        abort("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "GLUT"))
    Module["GLUT"] = function() {
        abort("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "EGL"))
    Module["EGL"] = function() {
        abort("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window"))
    Module["GLFW_Window"] = function() {
        abort("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "GLFW"))
    Module["GLFW"] = function() {
        abort("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "GLEW"))
    Module["GLEW"] = function() {
        abort("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "IDBStore"))
    Module["IDBStore"] = function() {
        abort("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError"))
    Module["runAndAbortIfError"] = function() {
        abort("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emval_handle_array"))
    Module["emval_handle_array"] = function() {
        abort("'emval_handle_array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emval_free_list"))
    Module["emval_free_list"] = function() {
        abort("'emval_free_list' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emval_symbols"))
    Module["emval_symbols"] = function() {
        abort("'emval_symbols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "init_emval"))
    Module["init_emval"] = function() {
        abort("'init_emval' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "count_emval_handles"))
    Module["count_emval_handles"] = function() {
        abort("'count_emval_handles' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "get_first_emval"))
    Module["get_first_emval"] = function() {
        abort("'get_first_emval' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getStringOrSymbol"))
    Module["getStringOrSymbol"] = function() {
        abort("'getStringOrSymbol' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "requireHandle"))
    Module["requireHandle"] = function() {
        abort("'requireHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emval_newers"))
    Module["emval_newers"] = function() {
        abort("'emval_newers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "craftEmvalAllocator"))
    Module["craftEmvalAllocator"] = function() {
        abort("'craftEmvalAllocator' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emval_get_global"))
    Module["emval_get_global"] = function() {
        abort("'emval_get_global' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "emval_methodCallers"))
    Module["emval_methodCallers"] = function() {
        abort("'emval_methodCallers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "InternalError"))
    Module["InternalError"] = function() {
        abort("'InternalError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "BindingError"))
    Module["BindingError"] = function() {
        abort("'BindingError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "UnboundTypeError"))
    Module["UnboundTypeError"] = function() {
        abort("'UnboundTypeError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "PureVirtualError"))
    Module["PureVirtualError"] = function() {
        abort("'PureVirtualError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "init_embind"))
    Module["init_embind"] = function() {
        abort("'init_embind' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "throwInternalError"))
    Module["throwInternalError"] = function() {
        abort("'throwInternalError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "throwBindingError"))
    Module["throwBindingError"] = function() {
        abort("'throwBindingError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "throwUnboundTypeError"))
    Module["throwUnboundTypeError"] = function() {
        abort("'throwUnboundTypeError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ensureOverloadTable"))
    Module["ensureOverloadTable"] = function() {
        abort("'ensureOverloadTable' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "exposePublicSymbol"))
    Module["exposePublicSymbol"] = function() {
        abort("'exposePublicSymbol' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "replacePublicSymbol"))
    Module["replacePublicSymbol"] = function() {
        abort("'replacePublicSymbol' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "extendError"))
    Module["extendError"] = function() {
        abort("'extendError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "createNamedFunction"))
    Module["createNamedFunction"] = function() {
        abort("'createNamedFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "registeredInstances"))
    Module["registeredInstances"] = function() {
        abort("'registeredInstances' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getBasestPointer"))
    Module["getBasestPointer"] = function() {
        abort("'getBasestPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "registerInheritedInstance"))
    Module["registerInheritedInstance"] = function() {
        abort("'registerInheritedInstance' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "unregisterInheritedInstance"))
    Module["unregisterInheritedInstance"] = function() {
        abort("'unregisterInheritedInstance' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getInheritedInstance"))
    Module["getInheritedInstance"] = function() {
        abort("'getInheritedInstance' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getInheritedInstanceCount"))
    Module["getInheritedInstanceCount"] = function() {
        abort("'getInheritedInstanceCount' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getLiveInheritedInstances"))
    Module["getLiveInheritedInstances"] = function() {
        abort("'getLiveInheritedInstances' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "registeredTypes"))
    Module["registeredTypes"] = function() {
        abort("'registeredTypes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "awaitingDependencies"))
    Module["awaitingDependencies"] = function() {
        abort("'awaitingDependencies' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "typeDependencies"))
    Module["typeDependencies"] = function() {
        abort("'typeDependencies' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "registeredPointers"))
    Module["registeredPointers"] = function() {
        abort("'registeredPointers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "registerType"))
    Module["registerType"] = function() {
        abort("'registerType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "whenDependentTypesAreResolved"))
    Module["whenDependentTypesAreResolved"] = function() {
        abort("'whenDependentTypesAreResolved' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "embind_charCodes"))
    Module["embind_charCodes"] = function() {
        abort("'embind_charCodes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "embind_init_charCodes"))
    Module["embind_init_charCodes"] = function() {
        abort("'embind_init_charCodes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "readLatin1String"))
    Module["readLatin1String"] = function() {
        abort("'readLatin1String' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getTypeName"))
    Module["getTypeName"] = function() {
        abort("'getTypeName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "heap32VectorToArray"))
    Module["heap32VectorToArray"] = function() {
        abort("'heap32VectorToArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "requireRegisteredType"))
    Module["requireRegisteredType"] = function() {
        abort("'requireRegisteredType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "getShiftFromSize"))
    Module["getShiftFromSize"] = function() {
        abort("'getShiftFromSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "integerReadValueFromPointer"))
    Module["integerReadValueFromPointer"] = function() {
        abort("'integerReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "enumReadValueFromPointer"))
    Module["enumReadValueFromPointer"] = function() {
        abort("'enumReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "floatReadValueFromPointer"))
    Module["floatReadValueFromPointer"] = function() {
        abort("'floatReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "simpleReadValueFromPointer"))
    Module["simpleReadValueFromPointer"] = function() {
        abort("'simpleReadValueFromPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "runDestructors"))
    Module["runDestructors"] = function() {
        abort("'runDestructors' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "new_"))
    Module["new_"] = function() {
        abort("'new_' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "craftInvokerFunction"))
    Module["craftInvokerFunction"] = function() {
        abort("'craftInvokerFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "embind__requireFunction"))
    Module["embind__requireFunction"] = function() {
        abort("'embind__requireFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "tupleRegistrations"))
    Module["tupleRegistrations"] = function() {
        abort("'tupleRegistrations' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "structRegistrations"))
    Module["structRegistrations"] = function() {
        abort("'structRegistrations' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "genericPointerToWireType"))
    Module["genericPointerToWireType"] = function() {
        abort("'genericPointerToWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "constNoSmartPtrRawPointerToWireType"))
    Module["constNoSmartPtrRawPointerToWireType"] = function() {
        abort("'constNoSmartPtrRawPointerToWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "nonConstNoSmartPtrRawPointerToWireType"))
    Module["nonConstNoSmartPtrRawPointerToWireType"] = function() {
        abort("'nonConstNoSmartPtrRawPointerToWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "init_RegisteredPointer"))
    Module["init_RegisteredPointer"] = function() {
        abort("'init_RegisteredPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer"))
    Module["RegisteredPointer"] = function() {
        abort("'RegisteredPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_getPointee"))
    Module["RegisteredPointer_getPointee"] = function() {
        abort("'RegisteredPointer_getPointee' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_destructor"))
    Module["RegisteredPointer_destructor"] = function() {
        abort("'RegisteredPointer_destructor' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_deleteObject"))
    Module["RegisteredPointer_deleteObject"] = function() {
        abort("'RegisteredPointer_deleteObject' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "RegisteredPointer_fromWireType"))
    Module["RegisteredPointer_fromWireType"] = function() {
        abort("'RegisteredPointer_fromWireType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "runDestructor"))
    Module["runDestructor"] = function() {
        abort("'runDestructor' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "releaseClassHandle"))
    Module["releaseClassHandle"] = function() {
        abort("'releaseClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "finalizationGroup"))
    Module["finalizationGroup"] = function() {
        abort("'finalizationGroup' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "detachFinalizer_deps"))
    Module["detachFinalizer_deps"] = function() {
        abort("'detachFinalizer_deps' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "detachFinalizer"))
    Module["detachFinalizer"] = function() {
        abort("'detachFinalizer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "attachFinalizer"))
    Module["attachFinalizer"] = function() {
        abort("'attachFinalizer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "makeClassHandle"))
    Module["makeClassHandle"] = function() {
        abort("'makeClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "init_ClassHandle"))
    Module["init_ClassHandle"] = function() {
        abort("'init_ClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle"))
    Module["ClassHandle"] = function() {
        abort("'ClassHandle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_isAliasOf"))
    Module["ClassHandle_isAliasOf"] = function() {
        abort("'ClassHandle_isAliasOf' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "throwInstanceAlreadyDeleted"))
    Module["throwInstanceAlreadyDeleted"] = function() {
        abort("'throwInstanceAlreadyDeleted' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_clone"))
    Module["ClassHandle_clone"] = function() {
        abort("'ClassHandle_clone' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_delete"))
    Module["ClassHandle_delete"] = function() {
        abort("'ClassHandle_delete' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "deletionQueue"))
    Module["deletionQueue"] = function() {
        abort("'deletionQueue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_isDeleted"))
    Module["ClassHandle_isDeleted"] = function() {
        abort("'ClassHandle_isDeleted' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "ClassHandle_deleteLater"))
    Module["ClassHandle_deleteLater"] = function() {
        abort("'ClassHandle_deleteLater' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "flushPendingDeletes"))
    Module["flushPendingDeletes"] = function() {
        abort("'flushPendingDeletes' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "delayFunction"))
    Module["delayFunction"] = function() {
        abort("'delayFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "setDelayFunction"))
    Module["setDelayFunction"] = function() {
        abort("'setDelayFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "RegisteredClass"))
    Module["RegisteredClass"] = function() {
        abort("'RegisteredClass' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "shallowCopyInternalPointer"))
    Module["shallowCopyInternalPointer"] = function() {
        abort("'shallowCopyInternalPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "downcastPointer"))
    Module["downcastPointer"] = function() {
        abort("'downcastPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "upcastPointer"))
    Module["upcastPointer"] = function() {
        abort("'upcastPointer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "validateThis"))
    Module["validateThis"] = function() {
        abort("'validateThis' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "char_0"))
    Module["char_0"] = function() {
        abort("'char_0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "char_9"))
    Module["char_9"] = function() {
        abort("'char_9' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "makeLegalFunctionName"))
    Module["makeLegalFunctionName"] = function() {
        abort("'makeLegalFunctionName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce"))
    Module["warnOnce"] = function() {
        abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stackSave"))
    Module["stackSave"] = function() {
        abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore"))
    Module["stackRestore"] = function() {
        abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc"))
    Module["stackAlloc"] = function() {
        abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString"))
    Module["AsciiToString"] = function() {
        abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii"))
    Module["stringToAscii"] = function() {
        abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString"))
    Module["UTF16ToString"] = function() {
        abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16"))
    Module["stringToUTF16"] = function() {
        abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16"))
    Module["lengthBytesUTF16"] = function() {
        abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString"))
    Module["UTF32ToString"] = function() {
        abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32"))
    Module["stringToUTF32"] = function() {
        abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32"))
    Module["lengthBytesUTF32"] = function() {
        abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8"))
    Module["allocateUTF8"] = function() {
        abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack"))
    Module["allocateUTF8OnStack"] = function() {
        abort("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
    }
    ;
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
Module["abortStackOverflow"] = abortStackOverflow;
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL"))
    Object.defineProperty(Module, "ALLOC_NORMAL", {
        configurable: true,
        get: function() {
            abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
        }
    });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK"))
    Object.defineProperty(Module, "ALLOC_STACK", {
        configurable: true,
        get: function() {
            abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
        }
    });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_DYNAMIC"))
    Object.defineProperty(Module, "ALLOC_DYNAMIC", {
        configurable: true,
        get: function() {
            abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
        }
    });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NONE"))
    Object.defineProperty(Module, "ALLOC_NONE", {
        configurable: true,
        get: function() {
            abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)")
        }
    });
var calledRun;
function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
dependenciesFulfilled = function runCaller() {
    if (!calledRun)
        run();
    if (!calledRun)
        dependenciesFulfilled = runCaller
}
;
function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return
    }
    writeStackCookie();
    preRun();
    if (runDependencies > 0)
        return;
    function doRun() {
        if (calledRun)
            return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT)
            return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"])
            Module["onRuntimeInitialized"]();
        assert(!Module["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
            setTimeout(function() {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
    checkStackCookie()
}
Module["run"] = run;
function checkUnflushedContent() {
    var print = out;
    var printErr = err;
    var has = false;
    out = err = function(x) {
        has = true
    }
    ;
    try {
        var flush = Module["_fflush"];
        if (flush)
            flush(0);
        ["stdout", "stderr"].forEach(function(name) {
            var info = FS.analyzePath("/dev/" + name);
            if (!info)
                return;
            var stream = info.object;
            var rdev = stream.rdev;
            var tty = TTY.ttys[rdev];
            if (tty && tty.output && tty.output.length) {
                has = true
            }
        })
    } catch (e) {}
    out = print;
    err = printErr;
    if (has) {
        warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.")
    }
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
noExitRuntime = true;
run();
