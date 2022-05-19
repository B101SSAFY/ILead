<<<<<<< HEAD
function createUnityInstance(e, t, r) {
  function n(e, r) {
    if (!n.aborted && t.showBanner)
      return "error" == r && (n.aborted = !0), t.showBanner(e, r);
    switch (r) {
      case "error":
        console.error(e);
        break;
      case "warning":
        console.warn(e);
        break;
      default:
        console.log(e);
    }
  }
  function o(e) {
    var t = e.reason || e.error,
      r = t ? t.toString() : e.message || e.reason || "",
      n = t && t.stack ? t.stack.toString() : "";
    if (
      (n.startsWith(r) && (n = n.substring(r.length)),
      (r += "\n" + n.trim()),
      r && f.stackTraceRegExp && f.stackTraceRegExp.test(r))
    ) {
      var o = e.filename || (t && (t.fileName || t.sourceURL)) || "",
        a = e.lineno || (t && (t.lineNumber || t.line)) || 0;
      i(r, o, a);
    }
  }
  function a(e) {
    e.preventDefault();
  }
  function i(e, t, r) {
    if (f.startupErrorHandler) return void f.startupErrorHandler(e, t, r);
    if (
      !(
        (f.errorHandler && f.errorHandler(e, t, r)) ||
        (console.log("Invoking error handler due to\n" + e),
        "function" == typeof dump &&
          dump("Invoking error handler due to\n" + e),
        e.indexOf("UnknownError") != -1 ||
          e.indexOf("Program terminated with exit(0)") != -1 ||
          i.didShowErrorMessage)
      )
    ) {
      var e =
        "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" +
        e;
      e.indexOf("DISABLE_EXCEPTION_CATCHING") != -1
        ? (e =
            "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.")
        : e.indexOf("Cannot enlarge memory arrays") != -1
        ? (e =
            "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.")
        : (e.indexOf("Invalid array buffer length") == -1 &&
            e.indexOf("Invalid typed array length") == -1 &&
            e.indexOf("out of memory") == -1 &&
            e.indexOf("could not allocate memory") == -1) ||
          (e =
            "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),
        alert(e),
        (i.didShowErrorMessage = !0);
    }
  }
  function s(e, t) {
    if ("symbolsUrl" != e) {
      var n = f.downloadProgress[e];
      n ||
        (n = f.downloadProgress[e] =
          {
            started: !1,
            finished: !1,
            lengthComputable: !1,
            total: 0,
            loaded: 0,
          }),
        "object" != typeof t ||
          ("progress" != t.type && "load" != t.type) ||
          (n.started ||
            ((n.started = !0),
            (n.lengthComputable = t.lengthComputable),
            (n.total = t.total)),
          (n.loaded = t.loaded),
          "load" == t.type && (n.finished = !0));
      var o = 0,
        a = 0,
        i = 0,
        s = 0,
        l = 0;
      for (var e in f.downloadProgress) {
        var n = f.downloadProgress[e];
        if (!n.started) return 0;
        i++,
          n.lengthComputable
            ? ((o += n.loaded), (a += n.total), s++)
            : n.finished || l++;
      }
      var d = i ? (i - l - (a ? (s * (a - o)) / a : 0)) / i : 0;
      r(0.9 * d);
    }
  }
  function l(e, t, r) {
    for (var n in g)
      if (g[n].hasUnityMarker(e)) {
        t &&
          console.log(
            'You can reduce startup time if you configure your web server to add "Content-Encoding: ' +
              n +
              '" response header when serving "' +
              t +
              '" file.'
          );
        var o = g[n];
        if (!o.worker) {
          var a = URL.createObjectURL(
            new Blob(
              [
                "this.require = ",
                o.require.toString(),
                "; this.decompress = ",
                o.decompress.toString(),
                "; this.onmessage = ",
                function (e) {
                  var t = {
                    id: e.data.id,
                    decompressed: this.decompress(e.data.compressed),
                  };
                  postMessage(t, t.decompressed ? [t.decompressed.buffer] : []);
                }.toString(),
                "; postMessage({ ready: true });",
              ],
              { type: "application/javascript" }
            )
          );
          (o.worker = new Worker(a)),
            (o.worker.onmessage = function (e) {
              return e.data.ready
                ? void URL.revokeObjectURL(a)
                : (this.callbacks[e.data.id](e.data.decompressed),
                  void delete this.callbacks[e.data.id]);
            }),
            (o.worker.callbacks = {}),
            (o.worker.nextCallbackId = 0);
        }
        var i = o.worker.nextCallbackId++;
        return (
          (o.worker.callbacks[i] = r),
          void o.worker.postMessage({ id: i, compressed: e }, [e.buffer])
        );
      }
    r(e);
  }
  function d(e) {
    return new Promise(function (t, r) {
      s(e);
      var o =
        f.companyName && f.productName
          ? new f.XMLHttpRequest({
              companyName: f.companyName,
              productName: f.productName,
              cacheControl: f.cacheControl(f[e]),
            })
          : new XMLHttpRequest();
      o.open("GET", f[e]),
        (o.responseType = "arraybuffer"),
        o.addEventListener("progress", function (t) {
          s(e, t);
        }),
        o.addEventListener("load", function (r) {
          s(e, r), l(new Uint8Array(o.response), f[e], t);
        }),
        o.addEventListener("error", function (t) {
          var r = "Failed to download file " + f[e];
          "file:" == location.protocol
            ? n(
                r +
                  ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.",
                "error"
              )
            : console.error(r);
        }),
        o.send();
    });
  }
  function u() {
    return d("frameworkUrl").then(function (e) {
      var t = URL.createObjectURL(
        new Blob([e], { type: "application/javascript" })
      );
      return new Promise(function (e, r) {
        var o = document.createElement("script");
        (o.src = t),
          (o.onload = function () {
            if ("undefined" == typeof unityFramework || !unityFramework) {
              var r = [
                ["br", "br"],
                ["gz", "gzip"],
              ];
              for (var a in r) {
                var i = r[a];
                if (f.frameworkUrl.endsWith("." + i[0])) {
                  var s = "Unable to parse " + f.frameworkUrl + "!";
                  if ("file:" == location.protocol)
                    return void n(
                      s +
                        " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.",
                      "error"
                    );
                  if (
                    ((s +=
                      ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' +
                      i[1] +
                      '" present. Check browser Console and Devtools Network tab to debug.'),
                    "br" == i[0] && "http:" == location.protocol)
                  ) {
                    var l =
                      ["localhost", "127.0.0.1"].indexOf(location.hostname) !=
                      -1
                        ? ""
                        : "Migrate your server to use HTTPS.";
                    s = /Firefox/.test(navigator.userAgent)
                      ? "Unable to parse " +
                        f.frameworkUrl +
                        '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' +
                        l +
                        ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.'
                      : "Unable to parse " +
                        f.frameworkUrl +
                        '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.';
                  }
                  return void n(s, "error");
                }
              }
              n(
                "Unable to parse " +
                  f.frameworkUrl +
                  "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)",
                "error"
              );
            }
            var d = unityFramework;
            (unityFramework = null),
              (o.onload = null),
              URL.revokeObjectURL(t),
              e(d);
          }),
          (o.onerror = function (e) {
            n(
              "Unable to load file " +
                f.frameworkUrl +
                "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)",
              "error"
            );
          }),
          document.body.appendChild(o),
          f.deinitializers.push(function () {
            document.body.removeChild(o);
          });
      });
    });
  }
  function c() {
    Promise.all([u(), d("codeUrl")]).then(function (e) {
      (f.wasmBinary = e[1]), e[0](f);
    });
    var e = d("dataUrl");
    f.preRun.push(function () {
      f.addRunDependency("dataUrl"),
        e.then(function (e) {
          var t = new DataView(e.buffer, e.byteOffset, e.byteLength),
            r = 0,
            n = "UnityWebData1.0\0";
          if (
            !String.fromCharCode.apply(null, e.subarray(r, r + n.length)) == n
          )
            throw "unknown data format";
          r += n.length;
          var o = t.getUint32(r, !0);
          for (r += 4; r < o; ) {
            var a = t.getUint32(r, !0);
            r += 4;
            var i = t.getUint32(r, !0);
            r += 4;
            var s = t.getUint32(r, !0);
            r += 4;
            var l = String.fromCharCode.apply(null, e.subarray(r, r + s));
            r += s;
            for (
              var d = 0, u = l.indexOf("/", d) + 1;
              u > 0;
              d = u, u = l.indexOf("/", d) + 1
            )
              f.FS_createPath(l.substring(0, d), l.substring(d, u - 1), !0, !0);
            f.FS_createDataFile(l, null, e.subarray(a, a + i), !0, !0, !0);
          }
          f.removeRunDependency("dataUrl");
        });
    });
  }
  r = r || function () {};
  var f = {
    canvas: e,
    webglContextAttributes: { preserveDrawingBuffer: !1 },
    cacheControl: function (e) {
      return e == f.dataUrl ? "must-revalidate" : "no-store";
    },
    streamingAssetsUrl: "StreamingAssets",
    downloadProgress: {},
    deinitializers: [],
    intervals: {},
    setInterval: function (e, t) {
      var r = window.setInterval(e, t);
      return (this.intervals[r] = !0), r;
    },
    clearInterval: function (e) {
      delete this.intervals[e], window.clearInterval(e);
    },
    preRun: [],
    postRun: [],
    print: function (e) {
      console.log(e);
    },
    printErr: function (e) {
      console.error(e),
        "string" == typeof e &&
          e.indexOf("wasm streaming compile failed") != -1 &&
          (e.toLowerCase().indexOf("mime") != -1
            ? n(
                'HTTP Response Header "Content-Type" configured incorrectly on the server for file ' +
                  f.codeUrl +
                  ' , should be "application/wasm". Startup time performance will suffer.',
                "warning"
              )
            : n(
                'WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' +
                  f.codeUrl +
                  ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.",
                "warning"
              ));
    },
    locateFile: function (e) {
      return e;
    },
    disabledCanvasEvents: ["contextmenu", "dragstart"],
  };
  for (var h in t) f[h] = t[h];
  f.streamingAssetsUrl = new URL(f.streamingAssetsUrl, document.URL).href;
  var p = f.disabledCanvasEvents.slice();
  p.forEach(function (t) {
    e.addEventListener(t, a);
  }),
    window.addEventListener("error", o),
    window.addEventListener("unhandledrejection", o);
  var b = "",
    m = "";
  document.addEventListener("webkitfullscreenchange", function (t) {
    var r = document.webkitCurrentFullScreenElement;
    r === e
      ? e.style.width &&
        ((b = e.style.width),
        (m = e.style.height),
        (e.style.width = "100%"),
        (e.style.height = "100%"))
      : b && ((e.style.width = b), (e.style.height = m), (b = ""), (m = ""));
  });
  var w = {
    Module: f,
    SetFullscreen: function () {
      return f.SetFullscreen
        ? f.SetFullscreen.apply(f, arguments)
        : void f.print("Failed to set Fullscreen mode: Player not loaded yet.");
    },
    SendMessage: function () {
      return f.SendMessage
        ? f.SendMessage.apply(f, arguments)
        : void f.print("Failed to execute SendMessage: Player not loaded yet.");
    },
    Quit: function () {
      return new Promise(function (t, r) {
        (f.shouldQuit = !0),
          (f.onQuit = t),
          p.forEach(function (t) {
            e.removeEventListener(t, a);
          }),
          window.removeEventListener("error", o),
          window.removeEventListener("unhandledrejection", o);
      });
    },
  };
  (f.SystemInfo = (function () {
    function e(e, t, r) {
      return (e = RegExp(e, "i").exec(t)), e && e[r];
    }
    for (
      var t,
        r,
        n,
        o,
        a,
        i,
        s = navigator.userAgent + " ",
        l = [
          ["Firefox", "Firefox"],
          ["OPR", "Opera"],
          ["Edg", "Edge"],
          ["SamsungBrowser", "Samsung Browser"],
          ["Trident", "Internet Explorer"],
          ["MSIE", "Internet Explorer"],
          ["Chrome", "Chrome"],
          ["CriOS", "Chrome on iOS Safari"],
          ["FxiOS", "Firefox on iOS Safari"],
          ["Safari", "Safari"],
        ],
        d = 0;
      d < l.length;
      ++d
    )
      if ((r = e(l[d][0] + "[/ ](.*?)[ \\)]", s, 1))) {
        t = l[d][1];
        break;
      }
    "Safari" == t && (r = e("Version/(.*?) ", s, 1)),
      "Internet Explorer" == t && (r = e("rv:(.*?)\\)? ", s, 1) || r);
    for (
      var u = [
          ["Windows (.*?)[;)]", "Windows"],
          ["Android ([0-9_.]+)", "Android"],
          ["iPhone OS ([0-9_.]+)", "iPhoneOS"],
          ["iPad.*? OS ([0-9_.]+)", "iPadOS"],
          ["FreeBSD( )", "FreeBSD"],
          ["OpenBSD( )", "OpenBSD"],
          ["Linux|X11()", "Linux"],
          ["Mac OS X ([0-9_.]+)", "MacOS"],
          ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"],
        ],
        c = 0;
      c < u.length;
      ++c
    )
      if ((o = e(u[c][0], s, 1))) {
        (n = u[c][1]), (o = o.replace(/_/g, "."));
        break;
      }
    var f = {
      "NT 5.0": "2000",
      "NT 5.1": "XP",
      "NT 5.2": "Server 2003",
      "NT 6.0": "Vista",
      "NT 6.1": "7",
      "NT 6.2": "8",
      "NT 6.3": "8.1",
      "NT 10.0": "10",
    };
    (o = f[o] || o),
      (a = document.createElement("canvas")),
      a &&
        ((gl = a.getContext("webgl2")),
        (glVersion = gl ? 2 : 0),
        gl || ((gl = a && a.getContext("webgl")) && (glVersion = 1)),
        gl &&
          (i =
            (gl.getExtension("WEBGL_debug_renderer_info") &&
              gl.getParameter(37446)) ||
            gl.getParameter(7937)));
    var h = "undefined" != typeof SharedArrayBuffer,
      p =
        "object" == typeof WebAssembly &&
        "function" == typeof WebAssembly.compile;
    return {
      width: screen.width,
      height: screen.height,
      userAgent: s.trim(),
      browser: t || "Unknown browser",
      browserVersion: r || "Unknown version",
      mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
      os: n || "Unknown OS",
      osVersion: o || "Unknown OS Version",
      gpu: i || "Unknown GPU",
      language: navigator.userLanguage || navigator.language,
      hasWebGL: glVersion,
      hasCursorLock: !!document.body.requestPointerLock,
      hasFullscreen:
        !!document.body.requestFullscreen ||
        !!document.body.webkitRequestFullscreen,
      hasThreads: h,
      hasWasm: p,
      hasWasmThreads: !1,
    };
  })()),
    (f.abortHandler = function (e) {
      return i(e, "", 0), !0;
    }),
    (Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50)),
    (f.XMLHttpRequest = (function () {
      function e(e) {
        console.log("[UnityCache] " + e);
      }
      function t(e) {
        return (
          (t.link = t.link || document.createElement("a")),
          (t.link.href = e),
          t.link.href
        );
      }
      function r(e) {
        var t = window.location.href.match(/^[a-z]+:\/\/[^\/]+/);
        return !t || e.lastIndexOf(t[0], 0);
      }
      function n() {
        function t(t) {
          if ("undefined" == typeof n.database)
            for (
              n.database = t,
                n.database || e("indexedDB database could not be opened");
              n.queue.length;

            ) {
              var r = n.queue.shift();
              n.database
                ? n.execute.apply(n, r.arguments)
                : "function" == typeof r.onerror &&
                  r.onerror(new Error("operation cancelled"));
            }
        }
        function r() {
          var e = o.open(i.name, i.version);
          (e.onupgradeneeded = function (e) {
            var t = e.target.result;
            t.objectStoreNames.contains(l.name) || t.createObjectStore(l.name);
          }),
            (e.onsuccess = function (e) {
              t(e.target.result);
            }),
            (e.onerror = function () {
              t(null);
            });
        }
        var n = this;
        n.queue = [];
        try {
          var o =
              window.indexedDB ||
              window.mozIndexedDB ||
              window.webkitIndexedDB ||
              window.msIndexedDB,
            a = setTimeout(function () {
              "undefined" == typeof n.database && t(null);
            }, 2e3),
            d = o.open(i.name);
          (d.onupgradeneeded = function (e) {
            var t = e.target.result.createObjectStore(s.name, {
              keyPath: "url",
            });
            [
              "version",
              "company",
              "product",
              "updated",
              "revalidated",
              "accessed",
            ].forEach(function (e) {
              t.createIndex(e, e);
            });
          }),
            (d.onsuccess = function (e) {
              clearTimeout(a);
              var n = e.target.result;
              n.version < i.version ? (n.close(), r()) : t(n);
            }),
            (d.onerror = function () {
              clearTimeout(a), t(null);
            });
        } catch (e) {
          clearTimeout(a), t(null);
        }
      }
      function o(e, t, r, n, o) {
        var a = {
          url: e,
          version: s.version,
          company: t,
          product: r,
          updated: n,
          revalidated: n,
          accessed: n,
          responseHeaders: {},
          xhr: {},
        };
        return (
          o &&
            (["Last-Modified", "ETag"].forEach(function (e) {
              a.responseHeaders[e] = o.getResponseHeader(e);
            }),
            ["responseURL", "status", "statusText", "response"].forEach(
              function (e) {
                a.xhr[e] = o[e];
              }
            )),
          a
        );
      }
      function a(t) {
        (this.cache = { enabled: !1 }),
          t &&
            ((this.cache.control = t.cacheControl),
            (this.cache.company = t.companyName),
            (this.cache.product = t.productName)),
          (this.xhr = new XMLHttpRequest(t)),
          this.xhr.addEventListener(
            "load",
            function () {
              var t = this.xhr,
                r = this.cache;
              r.enabled &&
                !r.revalidated &&
                (304 == t.status
                  ? ((r.result.revalidated = r.result.accessed),
                    (r.revalidated = !0),
                    d.execute(s.name, "put", [r.result]),
                    e(
                      "'" +
                        r.result.url +
                        "' successfully revalidated and served from the indexedDB cache"
                    ))
                  : 200 == t.status
                  ? ((r.result = o(
                      r.result.url,
                      r.company,
                      r.product,
                      r.result.accessed,
                      t
                    )),
                    (r.revalidated = !0),
                    d.execute(
                      s.name,
                      "put",
                      [r.result],
                      function (t) {
                        e(
                          "'" +
                            r.result.url +
                            "' successfully downloaded and stored in the indexedDB cache"
                        );
                      },
                      function (t) {
                        e(
                          "'" +
                            r.result.url +
                            "' successfully downloaded but not stored in the indexedDB cache due to the error: " +
                            t
                        );
                      }
                    ))
                  : e(
                      "'" +
                        r.result.url +
                        "' request failed with status: " +
                        t.status +
                        " " +
                        t.statusText
                    ));
            }.bind(this)
          );
      }
      var i = { name: "UnityCache", version: 2 },
        s = { name: "XMLHttpRequest", version: 1 },
        l = { name: "WebAssembly", version: 1 };
      n.prototype.execute = function (e, t, r, n, o) {
        if (this.database)
          try {
            var a = this.database
              .transaction(
                [e],
                ["put", "delete", "clear"].indexOf(t) != -1
                  ? "readwrite"
                  : "readonly"
              )
              .objectStore(e);
            "openKeyCursor" == t && ((a = a.index(r[0])), (r = r.slice(1)));
            var i = a[t].apply(a, r);
            "function" == typeof n &&
              (i.onsuccess = function (e) {
                n(e.target.result);
              }),
              (i.onerror = o);
          } catch (e) {
            "function" == typeof o && o(e);
          }
        else
          "undefined" == typeof this.database
            ? this.queue.push({ arguments: arguments, onerror: o })
            : "function" == typeof o && o(new Error("indexedDB access denied"));
      };
      var d = new n();
      (a.prototype.send = function (t) {
        var n = this.xhr,
          o = this.cache,
          a = arguments;
        return (
          (o.enabled = o.enabled && "arraybuffer" == n.responseType && !t),
          o.enabled
            ? void d.execute(
                s.name,
                "get",
                [o.result.url],
                function (t) {
                  if (!t || t.version != s.version)
                    return void n.send.apply(n, a);
                  if (
                    ((o.result = t),
                    (o.result.accessed = Date.now()),
                    "immutable" == o.control)
                  )
                    (o.revalidated = !0),
                      d.execute(s.name, "put", [o.result]),
                      n.dispatchEvent(new Event("load")),
                      e(
                        "'" +
                          o.result.url +
                          "' served from the indexedDB cache without revalidation"
                      );
                  else if (
                    r(o.result.url) &&
                    (o.result.responseHeaders["Last-Modified"] ||
                      o.result.responseHeaders.ETag)
                  ) {
                    var i = new XMLHttpRequest();
                    i.open("HEAD", o.result.url),
                      (i.onload = function () {
                        (o.revalidated = ["Last-Modified", "ETag"].every(
                          function (e) {
                            return (
                              !o.result.responseHeaders[e] ||
                              o.result.responseHeaders[e] ==
                                i.getResponseHeader(e)
                            );
                          }
                        )),
                          o.revalidated
                            ? ((o.result.revalidated = o.result.accessed),
                              d.execute(s.name, "put", [o.result]),
                              n.dispatchEvent(new Event("load")),
                              e(
                                "'" +
                                  o.result.url +
                                  "' successfully revalidated and served from the indexedDB cache"
                              ))
                            : n.send.apply(n, a);
                      }),
                      i.send();
                  } else
                    o.result.responseHeaders["Last-Modified"]
                      ? (n.setRequestHeader(
                          "If-Modified-Since",
                          o.result.responseHeaders["Last-Modified"]
                        ),
                        n.setRequestHeader("Cache-Control", "no-cache"))
                      : o.result.responseHeaders.ETag &&
                        (n.setRequestHeader(
                          "If-None-Match",
                          o.result.responseHeaders.ETag
                        ),
                        n.setRequestHeader("Cache-Control", "no-cache")),
                      n.send.apply(n, a);
                },
                function (e) {
                  n.send.apply(n, a);
                }
              )
            : n.send.apply(n, a)
        );
      }),
        (a.prototype.open = function (e, r, n, a, i) {
          return (
            (this.cache.result = o(
              t(r),
              this.cache.company,
              this.cache.product,
              Date.now()
            )),
            (this.cache.enabled =
              ["must-revalidate", "immutable"].indexOf(this.cache.control) !=
                -1 &&
              "GET" == e &&
              this.cache.result.url.match("^https?://") &&
              ("undefined" == typeof n || n) &&
              "undefined" == typeof a &&
              "undefined" == typeof i),
            (this.cache.revalidated = !1),
            this.xhr.open.apply(this.xhr, arguments)
          );
        }),
        (a.prototype.setRequestHeader = function (e, t) {
          return (
            (this.cache.enabled = !1),
            this.xhr.setRequestHeader.apply(this.xhr, arguments)
          );
        });
      var u = new XMLHttpRequest();
      for (var c in u)
        a.prototype.hasOwnProperty(c) ||
          !(function (e) {
            Object.defineProperty(
              a.prototype,
              e,
              "function" == typeof u[e]
                ? {
                    value: function () {
                      return this.xhr[e].apply(this.xhr, arguments);
                    },
                  }
                : {
                    get: function () {
                      return this.cache.revalidated &&
                        this.cache.result.xhr.hasOwnProperty(e)
                        ? this.cache.result.xhr[e]
                        : this.xhr[e];
                    },
                    set: function (t) {
                      this.xhr[e] = t;
                    },
                  }
            );
          })(c);
      return a;
    })());
  var g = {
    gzip: {
      require: function (e) {
        var t = {
          "inflate.js": function (e, t, r) {
            "use strict";
            function n(e) {
              if (!(this instanceof n)) return new n(e);
              this.options = s.assign(
                { chunkSize: 16384, windowBits: 0, to: "" },
                e || {}
              );
              var t = this.options;
              t.raw &&
                t.windowBits >= 0 &&
                t.windowBits < 16 &&
                ((t.windowBits = -t.windowBits),
                0 === t.windowBits && (t.windowBits = -15)),
                !(t.windowBits >= 0 && t.windowBits < 16) ||
                  (e && e.windowBits) ||
                  (t.windowBits += 32),
                t.windowBits > 15 &&
                  t.windowBits < 48 &&
                  0 === (15 & t.windowBits) &&
                  (t.windowBits |= 15),
                (this.err = 0),
                (this.msg = ""),
                (this.ended = !1),
                (this.chunks = []),
                (this.strm = new c()),
                (this.strm.avail_out = 0);
              var r = i.inflateInit2(this.strm, t.windowBits);
              if (r !== d.Z_OK) throw new Error(u[r]);
              (this.header = new f()),
                i.inflateGetHeader(this.strm, this.header);
            }
            function o(e, t) {
              var r = new n(t);
              if ((r.push(e, !0), r.err)) throw r.msg || u[r.err];
              return r.result;
            }
            function a(e, t) {
              return (t = t || {}), (t.raw = !0), o(e, t);
            }
            var i = e("./zlib/inflate"),
              s = e("./utils/common"),
              l = e("./utils/strings"),
              d = e("./zlib/constants"),
              u = e("./zlib/messages"),
              c = e("./zlib/zstream"),
              f = e("./zlib/gzheader"),
              h = Object.prototype.toString;
            (n.prototype.push = function (e, t) {
              var r,
                n,
                o,
                a,
                u,
                c,
                f = this.strm,
                p = this.options.chunkSize,
                b = this.options.dictionary,
                m = !1;
              if (this.ended) return !1;
              (n = t === ~~t ? t : t === !0 ? d.Z_FINISH : d.Z_NO_FLUSH),
                "string" == typeof e
                  ? (f.input = l.binstring2buf(e))
                  : "[object ArrayBuffer]" === h.call(e)
                  ? (f.input = new Uint8Array(e))
                  : (f.input = e),
                (f.next_in = 0),
                (f.avail_in = f.input.length);
              do {
                if (
                  (0 === f.avail_out &&
                    ((f.output = new s.Buf8(p)),
                    (f.next_out = 0),
                    (f.avail_out = p)),
                  (r = i.inflate(f, d.Z_NO_FLUSH)),
                  r === d.Z_NEED_DICT &&
                    b &&
                    ((c =
                      "string" == typeof b
                        ? l.string2buf(b)
                        : "[object ArrayBuffer]" === h.call(b)
                        ? new Uint8Array(b)
                        : b),
                    (r = i.inflateSetDictionary(this.strm, c))),
                  r === d.Z_BUF_ERROR && m === !0 && ((r = d.Z_OK), (m = !1)),
                  r !== d.Z_STREAM_END && r !== d.Z_OK)
                )
                  return this.onEnd(r), (this.ended = !0), !1;
                f.next_out &&
                  ((0 !== f.avail_out &&
                    r !== d.Z_STREAM_END &&
                    (0 !== f.avail_in ||
                      (n !== d.Z_FINISH && n !== d.Z_SYNC_FLUSH))) ||
                    ("string" === this.options.to
                      ? ((o = l.utf8border(f.output, f.next_out)),
                        (a = f.next_out - o),
                        (u = l.buf2string(f.output, o)),
                        (f.next_out = a),
                        (f.avail_out = p - a),
                        a && s.arraySet(f.output, f.output, o, a, 0),
                        this.onData(u))
                      : this.onData(s.shrinkBuf(f.output, f.next_out)))),
                  0 === f.avail_in && 0 === f.avail_out && (m = !0);
              } while (
                (f.avail_in > 0 || 0 === f.avail_out) &&
                r !== d.Z_STREAM_END
              );
              return (
                r === d.Z_STREAM_END && (n = d.Z_FINISH),
                n === d.Z_FINISH
                  ? ((r = i.inflateEnd(this.strm)),
                    this.onEnd(r),
                    (this.ended = !0),
                    r === d.Z_OK)
                  : n !== d.Z_SYNC_FLUSH ||
                    (this.onEnd(d.Z_OK), (f.avail_out = 0), !0)
              );
            }),
              (n.prototype.onData = function (e) {
                this.chunks.push(e);
              }),
              (n.prototype.onEnd = function (e) {
                e === d.Z_OK &&
                  ("string" === this.options.to
                    ? (this.result = this.chunks.join(""))
                    : (this.result = s.flattenChunks(this.chunks))),
                  (this.chunks = []),
                  (this.err = e),
                  (this.msg = this.strm.msg);
              }),
              (r.Inflate = n),
              (r.inflate = o),
              (r.inflateRaw = a),
              (r.ungzip = o);
          },
          "utils/common.js": function (e, t, r) {
            "use strict";
            var n =
              "undefined" != typeof Uint8Array &&
              "undefined" != typeof Uint16Array &&
              "undefined" != typeof Int32Array;
            (r.assign = function (e) {
              for (
                var t = Array.prototype.slice.call(arguments, 1);
                t.length;

              ) {
                var r = t.shift();
                if (r) {
                  if ("object" != typeof r)
                    throw new TypeError(r + "must be non-object");
                  for (var n in r) r.hasOwnProperty(n) && (e[n] = r[n]);
                }
              }
              return e;
            }),
              (r.shrinkBuf = function (e, t) {
                return e.length === t
                  ? e
                  : e.subarray
                  ? e.subarray(0, t)
                  : ((e.length = t), e);
              });
            var o = {
                arraySet: function (e, t, r, n, o) {
                  if (t.subarray && e.subarray)
                    return void e.set(t.subarray(r, r + n), o);
                  for (var a = 0; a < n; a++) e[o + a] = t[r + a];
                },
                flattenChunks: function (e) {
                  var t, r, n, o, a, i;
                  for (n = 0, t = 0, r = e.length; t < r; t++) n += e[t].length;
                  for (
                    i = new Uint8Array(n), o = 0, t = 0, r = e.length;
                    t < r;
                    t++
                  )
                    (a = e[t]), i.set(a, o), (o += a.length);
                  return i;
                },
              },
              a = {
                arraySet: function (e, t, r, n, o) {
                  for (var a = 0; a < n; a++) e[o + a] = t[r + a];
                },
                flattenChunks: function (e) {
                  return [].concat.apply([], e);
                },
              };
            (r.setTyped = function (e) {
              e
                ? ((r.Buf8 = Uint8Array),
                  (r.Buf16 = Uint16Array),
                  (r.Buf32 = Int32Array),
                  r.assign(r, o))
                : ((r.Buf8 = Array),
                  (r.Buf16 = Array),
                  (r.Buf32 = Array),
                  r.assign(r, a));
            }),
              r.setTyped(n);
          },
          "utils/strings.js": function (e, t, r) {
            "use strict";
            function n(e, t) {
              if (t < 65537 && ((e.subarray && i) || (!e.subarray && a)))
                return String.fromCharCode.apply(null, o.shrinkBuf(e, t));
              for (var r = "", n = 0; n < t; n++)
                r += String.fromCharCode(e[n]);
              return r;
            }
            var o = e("./common"),
              a = !0,
              i = !0;
            try {
              String.fromCharCode.apply(null, [0]);
            } catch (e) {
              a = !1;
            }
            try {
              String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (e) {
              i = !1;
            }
            for (var s = new o.Buf8(256), l = 0; l < 256; l++)
              s[l] =
                l >= 252
                  ? 6
                  : l >= 248
                  ? 5
                  : l >= 240
                  ? 4
                  : l >= 224
                  ? 3
                  : l >= 192
                  ? 2
                  : 1;
            (s[254] = s[254] = 1),
              (r.string2buf = function (e) {
                var t,
                  r,
                  n,
                  a,
                  i,
                  s = e.length,
                  l = 0;
                for (a = 0; a < s; a++)
                  (r = e.charCodeAt(a)),
                    55296 === (64512 & r) &&
                      a + 1 < s &&
                      ((n = e.charCodeAt(a + 1)),
                      56320 === (64512 & n) &&
                        ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), a++)),
                    (l += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
                for (t = new o.Buf8(l), i = 0, a = 0; i < l; a++)
                  (r = e.charCodeAt(a)),
                    55296 === (64512 & r) &&
                      a + 1 < s &&
                      ((n = e.charCodeAt(a + 1)),
                      56320 === (64512 & n) &&
                        ((r = 65536 + ((r - 55296) << 10) + (n - 56320)), a++)),
                    r < 128
                      ? (t[i++] = r)
                      : r < 2048
                      ? ((t[i++] = 192 | (r >>> 6)), (t[i++] = 128 | (63 & r)))
                      : r < 65536
                      ? ((t[i++] = 224 | (r >>> 12)),
                        (t[i++] = 128 | ((r >>> 6) & 63)),
                        (t[i++] = 128 | (63 & r)))
                      : ((t[i++] = 240 | (r >>> 18)),
                        (t[i++] = 128 | ((r >>> 12) & 63)),
                        (t[i++] = 128 | ((r >>> 6) & 63)),
                        (t[i++] = 128 | (63 & r)));
                return t;
              }),
              (r.buf2binstring = function (e) {
                return n(e, e.length);
              }),
              (r.binstring2buf = function (e) {
                for (
                  var t = new o.Buf8(e.length), r = 0, n = t.length;
                  r < n;
                  r++
                )
                  t[r] = e.charCodeAt(r);
                return t;
              }),
              (r.buf2string = function (e, t) {
                var r,
                  o,
                  a,
                  i,
                  l = t || e.length,
                  d = new Array(2 * l);
                for (o = 0, r = 0; r < l; )
                  if (((a = e[r++]), a < 128)) d[o++] = a;
                  else if (((i = s[a]), i > 4)) (d[o++] = 65533), (r += i - 1);
                  else {
                    for (a &= 2 === i ? 31 : 3 === i ? 15 : 7; i > 1 && r < l; )
                      (a = (a << 6) | (63 & e[r++])), i--;
                    i > 1
                      ? (d[o++] = 65533)
                      : a < 65536
                      ? (d[o++] = a)
                      : ((a -= 65536),
                        (d[o++] = 55296 | ((a >> 10) & 1023)),
                        (d[o++] = 56320 | (1023 & a)));
                  }
                return n(d, o);
              }),
              (r.utf8border = function (e, t) {
                var r;
                for (
                  t = t || e.length, t > e.length && (t = e.length), r = t - 1;
                  r >= 0 && 128 === (192 & e[r]);

                )
                  r--;
                return r < 0 ? t : 0 === r ? t : r + s[e[r]] > t ? r : t;
              });
          },
          "zlib/inflate.js": function (e, t, r) {
            "use strict";
            function n(e) {
              return (
                ((e >>> 24) & 255) +
                ((e >>> 8) & 65280) +
                ((65280 & e) << 8) +
                ((255 & e) << 24)
              );
            }
            function o() {
              (this.mode = 0),
                (this.last = !1),
                (this.wrap = 0),
                (this.havedict = !1),
                (this.flags = 0),
                (this.dmax = 0),
                (this.check = 0),
                (this.total = 0),
                (this.head = null),
                (this.wbits = 0),
                (this.wsize = 0),
                (this.whave = 0),
                (this.wnext = 0),
                (this.window = null),
                (this.hold = 0),
                (this.bits = 0),
                (this.length = 0),
                (this.offset = 0),
                (this.extra = 0),
                (this.lencode = null),
                (this.distcode = null),
                (this.lenbits = 0),
                (this.distbits = 0),
                (this.ncode = 0),
                (this.nlen = 0),
                (this.ndist = 0),
                (this.have = 0),
                (this.next = null),
                (this.lens = new g.Buf16(320)),
                (this.work = new g.Buf16(288)),
                (this.lendyn = null),
                (this.distdyn = null),
                (this.sane = 0),
                (this.back = 0),
                (this.was = 0);
            }
            function a(e) {
              var t;
              return e && e.state
                ? ((t = e.state),
                  (e.total_in = e.total_out = t.total = 0),
                  (e.msg = ""),
                  t.wrap && (e.adler = 1 & t.wrap),
                  (t.mode = D),
                  (t.last = 0),
                  (t.havedict = 0),
                  (t.dmax = 32768),
                  (t.head = null),
                  (t.hold = 0),
                  (t.bits = 0),
                  (t.lencode = t.lendyn = new g.Buf32(be)),
                  (t.distcode = t.distdyn = new g.Buf32(me)),
                  (t.sane = 1),
                  (t.back = -1),
                  T)
                : O;
            }
            function i(e) {
              var t;
              return e && e.state
                ? ((t = e.state),
                  (t.wsize = 0),
                  (t.whave = 0),
                  (t.wnext = 0),
                  a(e))
                : O;
            }
            function s(e, t) {
              var r, n;
              return e && e.state
                ? ((n = e.state),
                  t < 0
                    ? ((r = 0), (t = -t))
                    : ((r = (t >> 4) + 1), t < 48 && (t &= 15)),
                  t && (t < 8 || t > 15)
                    ? O
                    : (null !== n.window && n.wbits !== t && (n.window = null),
                      (n.wrap = r),
                      (n.wbits = t),
                      i(e)))
                : O;
            }
            function l(e, t) {
              var r, n;
              return e
                ? ((n = new o()),
                  (e.state = n),
                  (n.window = null),
                  (r = s(e, t)),
                  r !== T && (e.state = null),
                  r)
                : O;
            }
            function d(e) {
              return l(e, ge);
            }
            function u(e) {
              if (ve) {
                var t;
                for (
                  m = new g.Buf32(512), w = new g.Buf32(32), t = 0;
                  t < 144;

                )
                  e.lens[t++] = 8;
                for (; t < 256; ) e.lens[t++] = 9;
                for (; t < 280; ) e.lens[t++] = 7;
                for (; t < 288; ) e.lens[t++] = 8;
                for (
                  x(S, e.lens, 0, 288, m, 0, e.work, { bits: 9 }), t = 0;
                  t < 32;

                )
                  e.lens[t++] = 5;
                x(E, e.lens, 0, 32, w, 0, e.work, { bits: 5 }), (ve = !1);
              }
              (e.lencode = m),
                (e.lenbits = 9),
                (e.distcode = w),
                (e.distbits = 5);
            }
            function c(e, t, r, n) {
              var o,
                a = e.state;
              return (
                null === a.window &&
                  ((a.wsize = 1 << a.wbits),
                  (a.wnext = 0),
                  (a.whave = 0),
                  (a.window = new g.Buf8(a.wsize))),
                n >= a.wsize
                  ? (g.arraySet(a.window, t, r - a.wsize, a.wsize, 0),
                    (a.wnext = 0),
                    (a.whave = a.wsize))
                  : ((o = a.wsize - a.wnext),
                    o > n && (o = n),
                    g.arraySet(a.window, t, r - n, o, a.wnext),
                    (n -= o),
                    n
                      ? (g.arraySet(a.window, t, r - n, n, 0),
                        (a.wnext = n),
                        (a.whave = a.wsize))
                      : ((a.wnext += o),
                        a.wnext === a.wsize && (a.wnext = 0),
                        a.whave < a.wsize && (a.whave += o))),
                0
              );
            }
            function f(e, t) {
              var r,
                o,
                a,
                i,
                s,
                l,
                d,
                f,
                h,
                p,
                b,
                m,
                w,
                be,
                me,
                we,
                ge,
                ve,
                ye,
                ke,
                xe,
                _e,
                Se,
                Ee,
                Ce = 0,
                Ue = new g.Buf8(4),
                Le = [
                  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                  15,
                ];
              if (!e || !e.state || !e.output || (!e.input && 0 !== e.avail_in))
                return O;
              (r = e.state),
                r.mode === K && (r.mode = Y),
                (s = e.next_out),
                (a = e.output),
                (d = e.avail_out),
                (i = e.next_in),
                (o = e.input),
                (l = e.avail_in),
                (f = r.hold),
                (h = r.bits),
                (p = l),
                (b = d),
                (_e = T);
              e: for (;;)
                switch (r.mode) {
                  case D:
                    if (0 === r.wrap) {
                      r.mode = Y;
                      break;
                    }
                    for (; h < 16; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    if (2 & r.wrap && 35615 === f) {
                      (r.check = 0),
                        (Ue[0] = 255 & f),
                        (Ue[1] = (f >>> 8) & 255),
                        (r.check = y(r.check, Ue, 2, 0)),
                        (f = 0),
                        (h = 0),
                        (r.mode = z);
                      break;
                    }
                    if (
                      ((r.flags = 0),
                      r.head && (r.head.done = !1),
                      !(1 & r.wrap) || (((255 & f) << 8) + (f >> 8)) % 31)
                    ) {
                      (e.msg = "incorrect header check"), (r.mode = fe);
                      break;
                    }
                    if ((15 & f) !== N) {
                      (e.msg = "unknown compression method"), (r.mode = fe);
                      break;
                    }
                    if (
                      ((f >>>= 4), (h -= 4), (xe = (15 & f) + 8), 0 === r.wbits)
                    )
                      r.wbits = xe;
                    else if (xe > r.wbits) {
                      (e.msg = "invalid window size"), (r.mode = fe);
                      break;
                    }
                    (r.dmax = 1 << xe),
                      (e.adler = r.check = 1),
                      (r.mode = 512 & f ? G : K),
                      (f = 0),
                      (h = 0);
                    break;
                  case z:
                    for (; h < 16; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    if (((r.flags = f), (255 & r.flags) !== N)) {
                      (e.msg = "unknown compression method"), (r.mode = fe);
                      break;
                    }
                    if (57344 & r.flags) {
                      (e.msg = "unknown header flags set"), (r.mode = fe);
                      break;
                    }
                    r.head && (r.head.text = (f >> 8) & 1),
                      512 & r.flags &&
                        ((Ue[0] = 255 & f),
                        (Ue[1] = (f >>> 8) & 255),
                        (r.check = y(r.check, Ue, 2, 0))),
                      (f = 0),
                      (h = 0),
                      (r.mode = F);
                  case F:
                    for (; h < 32; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    r.head && (r.head.time = f),
                      512 & r.flags &&
                        ((Ue[0] = 255 & f),
                        (Ue[1] = (f >>> 8) & 255),
                        (Ue[2] = (f >>> 16) & 255),
                        (Ue[3] = (f >>> 24) & 255),
                        (r.check = y(r.check, Ue, 4, 0))),
                      (f = 0),
                      (h = 0),
                      (r.mode = P);
                  case P:
                    for (; h < 16; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    r.head && ((r.head.xflags = 255 & f), (r.head.os = f >> 8)),
                      512 & r.flags &&
                        ((Ue[0] = 255 & f),
                        (Ue[1] = (f >>> 8) & 255),
                        (r.check = y(r.check, Ue, 2, 0))),
                      (f = 0),
                      (h = 0),
                      (r.mode = Z);
                  case Z:
                    if (1024 & r.flags) {
                      for (; h < 16; ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      (r.length = f),
                        r.head && (r.head.extra_len = f),
                        512 & r.flags &&
                          ((Ue[0] = 255 & f),
                          (Ue[1] = (f >>> 8) & 255),
                          (r.check = y(r.check, Ue, 2, 0))),
                        (f = 0),
                        (h = 0);
                    } else r.head && (r.head.extra = null);
                    r.mode = M;
                  case M:
                    if (
                      1024 & r.flags &&
                      ((m = r.length),
                      m > l && (m = l),
                      m &&
                        (r.head &&
                          ((xe = r.head.extra_len - r.length),
                          r.head.extra ||
                            (r.head.extra = new Array(r.head.extra_len)),
                          g.arraySet(r.head.extra, o, i, m, xe)),
                        512 & r.flags && (r.check = y(r.check, o, m, i)),
                        (l -= m),
                        (i += m),
                        (r.length -= m)),
                      r.length)
                    )
                      break e;
                    (r.length = 0), (r.mode = j);
                  case j:
                    if (2048 & r.flags) {
                      if (0 === l) break e;
                      m = 0;
                      do
                        (xe = o[i + m++]),
                          r.head &&
                            xe &&
                            r.length < 65536 &&
                            (r.head.name += String.fromCharCode(xe));
                      while (xe && m < l);
                      if (
                        (512 & r.flags && (r.check = y(r.check, o, m, i)),
                        (l -= m),
                        (i += m),
                        xe)
                      )
                        break e;
                    } else r.head && (r.head.name = null);
                    (r.length = 0), (r.mode = W);
                  case W:
                    if (4096 & r.flags) {
                      if (0 === l) break e;
                      m = 0;
                      do
                        (xe = o[i + m++]),
                          r.head &&
                            xe &&
                            r.length < 65536 &&
                            (r.head.comment += String.fromCharCode(xe));
                      while (xe && m < l);
                      if (
                        (512 & r.flags && (r.check = y(r.check, o, m, i)),
                        (l -= m),
                        (i += m),
                        xe)
                      )
                        break e;
                    } else r.head && (r.head.comment = null);
                    r.mode = q;
                  case q:
                    if (512 & r.flags) {
                      for (; h < 16; ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      if (f !== (65535 & r.check)) {
                        (e.msg = "header crc mismatch"), (r.mode = fe);
                        break;
                      }
                      (f = 0), (h = 0);
                    }
                    r.head &&
                      ((r.head.hcrc = (r.flags >> 9) & 1), (r.head.done = !0)),
                      (e.adler = r.check = 0),
                      (r.mode = K);
                    break;
                  case G:
                    for (; h < 32; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    (e.adler = r.check = n(f)), (f = 0), (h = 0), (r.mode = X);
                  case X:
                    if (0 === r.havedict)
                      return (
                        (e.next_out = s),
                        (e.avail_out = d),
                        (e.next_in = i),
                        (e.avail_in = l),
                        (r.hold = f),
                        (r.bits = h),
                        B
                      );
                    (e.adler = r.check = 1), (r.mode = K);
                  case K:
                    if (t === U || t === L) break e;
                  case Y:
                    if (r.last) {
                      (f >>>= 7 & h), (h -= 7 & h), (r.mode = de);
                      break;
                    }
                    for (; h < 3; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    switch (((r.last = 1 & f), (f >>>= 1), (h -= 1), 3 & f)) {
                      case 0:
                        r.mode = V;
                        break;
                      case 1:
                        if ((u(r), (r.mode = re), t === L)) {
                          (f >>>= 2), (h -= 2);
                          break e;
                        }
                        break;
                      case 2:
                        r.mode = $;
                        break;
                      case 3:
                        (e.msg = "invalid block type"), (r.mode = fe);
                    }
                    (f >>>= 2), (h -= 2);
                    break;
                  case V:
                    for (f >>>= 7 & h, h -= 7 & h; h < 32; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    if ((65535 & f) !== ((f >>> 16) ^ 65535)) {
                      (e.msg = "invalid stored block lengths"), (r.mode = fe);
                      break;
                    }
                    if (
                      ((r.length = 65535 & f),
                      (f = 0),
                      (h = 0),
                      (r.mode = Q),
                      t === L)
                    )
                      break e;
                  case Q:
                    r.mode = J;
                  case J:
                    if ((m = r.length)) {
                      if ((m > l && (m = l), m > d && (m = d), 0 === m))
                        break e;
                      g.arraySet(a, o, i, m, s),
                        (l -= m),
                        (i += m),
                        (d -= m),
                        (s += m),
                        (r.length -= m);
                      break;
                    }
                    r.mode = K;
                    break;
                  case $:
                    for (; h < 14; ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    if (
                      ((r.nlen = (31 & f) + 257),
                      (f >>>= 5),
                      (h -= 5),
                      (r.ndist = (31 & f) + 1),
                      (f >>>= 5),
                      (h -= 5),
                      (r.ncode = (15 & f) + 4),
                      (f >>>= 4),
                      (h -= 4),
                      r.nlen > 286 || r.ndist > 30)
                    ) {
                      (e.msg = "too many length or distance symbols"),
                        (r.mode = fe);
                      break;
                    }
                    (r.have = 0), (r.mode = ee);
                  case ee:
                    for (; r.have < r.ncode; ) {
                      for (; h < 3; ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      (r.lens[Le[r.have++]] = 7 & f), (f >>>= 3), (h -= 3);
                    }
                    for (; r.have < 19; ) r.lens[Le[r.have++]] = 0;
                    if (
                      ((r.lencode = r.lendyn),
                      (r.lenbits = 7),
                      (Se = { bits: r.lenbits }),
                      (_e = x(_, r.lens, 0, 19, r.lencode, 0, r.work, Se)),
                      (r.lenbits = Se.bits),
                      _e)
                    ) {
                      (e.msg = "invalid code lengths set"), (r.mode = fe);
                      break;
                    }
                    (r.have = 0), (r.mode = te);
                  case te:
                    for (; r.have < r.nlen + r.ndist; ) {
                      for (
                        ;
                        (Ce = r.lencode[f & ((1 << r.lenbits) - 1)]),
                          (me = Ce >>> 24),
                          (we = (Ce >>> 16) & 255),
                          (ge = 65535 & Ce),
                          !(me <= h);

                      ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      if (ge < 16)
                        (f >>>= me), (h -= me), (r.lens[r.have++] = ge);
                      else {
                        if (16 === ge) {
                          for (Ee = me + 2; h < Ee; ) {
                            if (0 === l) break e;
                            l--, (f += o[i++] << h), (h += 8);
                          }
                          if (((f >>>= me), (h -= me), 0 === r.have)) {
                            (e.msg = "invalid bit length repeat"),
                              (r.mode = fe);
                            break;
                          }
                          (xe = r.lens[r.have - 1]),
                            (m = 3 + (3 & f)),
                            (f >>>= 2),
                            (h -= 2);
                        } else if (17 === ge) {
                          for (Ee = me + 3; h < Ee; ) {
                            if (0 === l) break e;
                            l--, (f += o[i++] << h), (h += 8);
                          }
                          (f >>>= me),
                            (h -= me),
                            (xe = 0),
                            (m = 3 + (7 & f)),
                            (f >>>= 3),
                            (h -= 3);
                        } else {
                          for (Ee = me + 7; h < Ee; ) {
                            if (0 === l) break e;
                            l--, (f += o[i++] << h), (h += 8);
                          }
                          (f >>>= me),
                            (h -= me),
                            (xe = 0),
                            (m = 11 + (127 & f)),
                            (f >>>= 7),
                            (h -= 7);
                        }
                        if (r.have + m > r.nlen + r.ndist) {
                          (e.msg = "invalid bit length repeat"), (r.mode = fe);
                          break;
                        }
                        for (; m--; ) r.lens[r.have++] = xe;
                      }
                    }
                    if (r.mode === fe) break;
                    if (0 === r.lens[256]) {
                      (e.msg = "invalid code -- missing end-of-block"),
                        (r.mode = fe);
                      break;
                    }
                    if (
                      ((r.lenbits = 9),
                      (Se = { bits: r.lenbits }),
                      (_e = x(S, r.lens, 0, r.nlen, r.lencode, 0, r.work, Se)),
                      (r.lenbits = Se.bits),
                      _e)
                    ) {
                      (e.msg = "invalid literal/lengths set"), (r.mode = fe);
                      break;
                    }
                    if (
                      ((r.distbits = 6),
                      (r.distcode = r.distdyn),
                      (Se = { bits: r.distbits }),
                      (_e = x(
                        E,
                        r.lens,
                        r.nlen,
                        r.ndist,
                        r.distcode,
                        0,
                        r.work,
                        Se
                      )),
                      (r.distbits = Se.bits),
                      _e)
                    ) {
                      (e.msg = "invalid distances set"), (r.mode = fe);
                      break;
                    }
                    if (((r.mode = re), t === L)) break e;
                  case re:
                    r.mode = ne;
                  case ne:
                    if (l >= 6 && d >= 258) {
                      (e.next_out = s),
                        (e.avail_out = d),
                        (e.next_in = i),
                        (e.avail_in = l),
                        (r.hold = f),
                        (r.bits = h),
                        k(e, b),
                        (s = e.next_out),
                        (a = e.output),
                        (d = e.avail_out),
                        (i = e.next_in),
                        (o = e.input),
                        (l = e.avail_in),
                        (f = r.hold),
                        (h = r.bits),
                        r.mode === K && (r.back = -1);
                      break;
                    }
                    for (
                      r.back = 0;
                      (Ce = r.lencode[f & ((1 << r.lenbits) - 1)]),
                        (me = Ce >>> 24),
                        (we = (Ce >>> 16) & 255),
                        (ge = 65535 & Ce),
                        !(me <= h);

                    ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    if (we && 0 === (240 & we)) {
                      for (
                        ve = me, ye = we, ke = ge;
                        (Ce =
                          r.lencode[ke + ((f & ((1 << (ve + ye)) - 1)) >> ve)]),
                          (me = Ce >>> 24),
                          (we = (Ce >>> 16) & 255),
                          (ge = 65535 & Ce),
                          !(ve + me <= h);

                      ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      (f >>>= ve), (h -= ve), (r.back += ve);
                    }
                    if (
                      ((f >>>= me),
                      (h -= me),
                      (r.back += me),
                      (r.length = ge),
                      0 === we)
                    ) {
                      r.mode = le;
                      break;
                    }
                    if (32 & we) {
                      (r.back = -1), (r.mode = K);
                      break;
                    }
                    if (64 & we) {
                      (e.msg = "invalid literal/length code"), (r.mode = fe);
                      break;
                    }
                    (r.extra = 15 & we), (r.mode = oe);
                  case oe:
                    if (r.extra) {
                      for (Ee = r.extra; h < Ee; ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      (r.length += f & ((1 << r.extra) - 1)),
                        (f >>>= r.extra),
                        (h -= r.extra),
                        (r.back += r.extra);
                    }
                    (r.was = r.length), (r.mode = ae);
                  case ae:
                    for (
                      ;
                      (Ce = r.distcode[f & ((1 << r.distbits) - 1)]),
                        (me = Ce >>> 24),
                        (we = (Ce >>> 16) & 255),
                        (ge = 65535 & Ce),
                        !(me <= h);

                    ) {
                      if (0 === l) break e;
                      l--, (f += o[i++] << h), (h += 8);
                    }
                    if (0 === (240 & we)) {
                      for (
                        ve = me, ye = we, ke = ge;
                        (Ce =
                          r.distcode[
                            ke + ((f & ((1 << (ve + ye)) - 1)) >> ve)
                          ]),
                          (me = Ce >>> 24),
                          (we = (Ce >>> 16) & 255),
                          (ge = 65535 & Ce),
                          !(ve + me <= h);

                      ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      (f >>>= ve), (h -= ve), (r.back += ve);
                    }
                    if (((f >>>= me), (h -= me), (r.back += me), 64 & we)) {
                      (e.msg = "invalid distance code"), (r.mode = fe);
                      break;
                    }
                    (r.offset = ge), (r.extra = 15 & we), (r.mode = ie);
                  case ie:
                    if (r.extra) {
                      for (Ee = r.extra; h < Ee; ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      (r.offset += f & ((1 << r.extra) - 1)),
                        (f >>>= r.extra),
                        (h -= r.extra),
                        (r.back += r.extra);
                    }
                    if (r.offset > r.dmax) {
                      (e.msg = "invalid distance too far back"), (r.mode = fe);
                      break;
                    }
                    r.mode = se;
                  case se:
                    if (0 === d) break e;
                    if (((m = b - d), r.offset > m)) {
                      if (((m = r.offset - m), m > r.whave && r.sane)) {
                        (e.msg = "invalid distance too far back"),
                          (r.mode = fe);
                        break;
                      }
                      m > r.wnext
                        ? ((m -= r.wnext), (w = r.wsize - m))
                        : (w = r.wnext - m),
                        m > r.length && (m = r.length),
                        (be = r.window);
                    } else (be = a), (w = s - r.offset), (m = r.length);
                    m > d && (m = d), (d -= m), (r.length -= m);
                    do a[s++] = be[w++];
                    while (--m);
                    0 === r.length && (r.mode = ne);
                    break;
                  case le:
                    if (0 === d) break e;
                    (a[s++] = r.length), d--, (r.mode = ne);
                    break;
                  case de:
                    if (r.wrap) {
                      for (; h < 32; ) {
                        if (0 === l) break e;
                        l--, (f |= o[i++] << h), (h += 8);
                      }
                      if (
                        ((b -= d),
                        (e.total_out += b),
                        (r.total += b),
                        b &&
                          (e.adler = r.check =
                            r.flags
                              ? y(r.check, a, b, s - b)
                              : v(r.check, a, b, s - b)),
                        (b = d),
                        (r.flags ? f : n(f)) !== r.check)
                      ) {
                        (e.msg = "incorrect data check"), (r.mode = fe);
                        break;
                      }
                      (f = 0), (h = 0);
                    }
                    r.mode = ue;
                  case ue:
                    if (r.wrap && r.flags) {
                      for (; h < 32; ) {
                        if (0 === l) break e;
                        l--, (f += o[i++] << h), (h += 8);
                      }
                      if (f !== (4294967295 & r.total)) {
                        (e.msg = "incorrect length check"), (r.mode = fe);
                        break;
                      }
                      (f = 0), (h = 0);
                    }
                    r.mode = ce;
                  case ce:
                    _e = R;
                    break e;
                  case fe:
                    _e = H;
                    break e;
                  case he:
                    return A;
                  case pe:
                  default:
                    return O;
                }
              return (
                (e.next_out = s),
                (e.avail_out = d),
                (e.next_in = i),
                (e.avail_in = l),
                (r.hold = f),
                (r.bits = h),
                (r.wsize ||
                  (b !== e.avail_out &&
                    r.mode < fe &&
                    (r.mode < de || t !== C))) &&
                c(e, e.output, e.next_out, b - e.avail_out)
                  ? ((r.mode = he), A)
                  : ((p -= e.avail_in),
                    (b -= e.avail_out),
                    (e.total_in += p),
                    (e.total_out += b),
                    (r.total += b),
                    r.wrap &&
                      b &&
                      (e.adler = r.check =
                        r.flags
                          ? y(r.check, a, b, e.next_out - b)
                          : v(r.check, a, b, e.next_out - b)),
                    (e.data_type =
                      r.bits +
                      (r.last ? 64 : 0) +
                      (r.mode === K ? 128 : 0) +
                      (r.mode === re || r.mode === Q ? 256 : 0)),
                    ((0 === p && 0 === b) || t === C) && _e === T && (_e = I),
                    _e)
              );
            }
            function h(e) {
              if (!e || !e.state) return O;
              var t = e.state;
              return t.window && (t.window = null), (e.state = null), T;
            }
            function p(e, t) {
              var r;
              return e && e.state
                ? ((r = e.state),
                  0 === (2 & r.wrap) ? O : ((r.head = t), (t.done = !1), T))
                : O;
            }
            function b(e, t) {
              var r,
                n,
                o,
                a = t.length;
              return e && e.state
                ? ((r = e.state),
                  0 !== r.wrap && r.mode !== X
                    ? O
                    : r.mode === X &&
                      ((n = 1), (n = v(n, t, a, 0)), n !== r.check)
                    ? H
                    : (o = c(e, t, a, a))
                    ? ((r.mode = he), A)
                    : ((r.havedict = 1), T))
                : O;
            }
            var m,
              w,
              g = e("../utils/common"),
              v = e("./adler32"),
              y = e("./crc32"),
              k = e("./inffast"),
              x = e("./inftrees"),
              _ = 0,
              S = 1,
              E = 2,
              C = 4,
              U = 5,
              L = 6,
              T = 0,
              R = 1,
              B = 2,
              O = -2,
              H = -3,
              A = -4,
              I = -5,
              N = 8,
              D = 1,
              z = 2,
              F = 3,
              P = 4,
              Z = 5,
              M = 6,
              j = 7,
              W = 8,
              q = 9,
              G = 10,
              X = 11,
              K = 12,
              Y = 13,
              V = 14,
              Q = 15,
              J = 16,
              $ = 17,
              ee = 18,
              te = 19,
              re = 20,
              ne = 21,
              oe = 22,
              ae = 23,
              ie = 24,
              se = 25,
              le = 26,
              de = 27,
              ue = 28,
              ce = 29,
              fe = 30,
              he = 31,
              pe = 32,
              be = 852,
              me = 592,
              we = 15,
              ge = we,
              ve = !0;
            (r.inflateReset = i),
              (r.inflateReset2 = s),
              (r.inflateResetKeep = a),
              (r.inflateInit = d),
              (r.inflateInit2 = l),
              (r.inflate = f),
              (r.inflateEnd = h),
              (r.inflateGetHeader = p),
              (r.inflateSetDictionary = b),
              (r.inflateInfo = "pako inflate (from Nodeca project)");
          },
          "zlib/constants.js": function (e, t, r) {
            "use strict";
            t.exports = {
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_BUF_ERROR: -5,
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              Z_BINARY: 0,
              Z_TEXT: 1,
              Z_UNKNOWN: 2,
              Z_DEFLATED: 8,
            };
          },
          "zlib/messages.js": function (e, t, r) {
            "use strict";
            t.exports = {
              2: "need dictionary",
              1: "stream end",
              0: "",
              "-1": "file error",
              "-2": "stream error",
              "-3": "data error",
              "-4": "insufficient memory",
              "-5": "buffer error",
              "-6": "incompatible version",
            };
          },
          "zlib/zstream.js": function (e, t, r) {
            "use strict";
            function n() {
              (this.input = null),
                (this.next_in = 0),
                (this.avail_in = 0),
                (this.total_in = 0),
                (this.output = null),
                (this.next_out = 0),
                (this.avail_out = 0),
                (this.total_out = 0),
                (this.msg = ""),
                (this.state = null),
                (this.data_type = 2),
                (this.adler = 0);
            }
            t.exports = n;
          },
          "zlib/gzheader.js": function (e, t, r) {
            "use strict";
            function n() {
              (this.text = 0),
                (this.time = 0),
                (this.xflags = 0),
                (this.os = 0),
                (this.extra = null),
                (this.extra_len = 0),
                (this.name = ""),
                (this.comment = ""),
                (this.hcrc = 0),
                (this.done = !1);
            }
            t.exports = n;
          },
          "zlib/adler32.js": function (e, t, r) {
            "use strict";
            function n(e, t, r, n) {
              for (
                var o = (65535 & e) | 0, a = ((e >>> 16) & 65535) | 0, i = 0;
                0 !== r;

              ) {
                (i = r > 2e3 ? 2e3 : r), (r -= i);
                do (o = (o + t[n++]) | 0), (a = (a + o) | 0);
                while (--i);
                (o %= 65521), (a %= 65521);
              }
              return o | (a << 16) | 0;
            }
            t.exports = n;
          },
          "zlib/crc32.js": function (e, t, r) {
            "use strict";
            function n() {
              for (var e, t = [], r = 0; r < 256; r++) {
                e = r;
                for (var n = 0; n < 8; n++)
                  e = 1 & e ? 3988292384 ^ (e >>> 1) : e >>> 1;
                t[r] = e;
              }
              return t;
            }
            function o(e, t, r, n) {
              var o = a,
                i = n + r;
              e ^= -1;
              for (var s = n; s < i; s++) e = (e >>> 8) ^ o[255 & (e ^ t[s])];
              return e ^ -1;
            }
            var a = n();
            t.exports = o;
          },
          "zlib/inffast.js": function (e, t, r) {
            "use strict";
            var n = 30,
              o = 12;
            t.exports = function (e, t) {
              var r,
                a,
                i,
                s,
                l,
                d,
                u,
                c,
                f,
                h,
                p,
                b,
                m,
                w,
                g,
                v,
                y,
                k,
                x,
                _,
                S,
                E,
                C,
                U,
                L;
              (r = e.state),
                (a = e.next_in),
                (U = e.input),
                (i = a + (e.avail_in - 5)),
                (s = e.next_out),
                (L = e.output),
                (l = s - (t - e.avail_out)),
                (d = s + (e.avail_out - 257)),
                (u = r.dmax),
                (c = r.wsize),
                (f = r.whave),
                (h = r.wnext),
                (p = r.window),
                (b = r.hold),
                (m = r.bits),
                (w = r.lencode),
                (g = r.distcode),
                (v = (1 << r.lenbits) - 1),
                (y = (1 << r.distbits) - 1);
              e: do {
                m < 15 &&
                  ((b += U[a++] << m), (m += 8), (b += U[a++] << m), (m += 8)),
                  (k = w[b & v]);
                t: for (;;) {
                  if (
                    ((x = k >>> 24),
                    (b >>>= x),
                    (m -= x),
                    (x = (k >>> 16) & 255),
                    0 === x)
                  )
                    L[s++] = 65535 & k;
                  else {
                    if (!(16 & x)) {
                      if (0 === (64 & x)) {
                        k = w[(65535 & k) + (b & ((1 << x) - 1))];
                        continue t;
                      }
                      if (32 & x) {
                        r.mode = o;
                        break e;
                      }
                      (e.msg = "invalid literal/length code"), (r.mode = n);
                      break e;
                    }
                    (_ = 65535 & k),
                      (x &= 15),
                      x &&
                        (m < x && ((b += U[a++] << m), (m += 8)),
                        (_ += b & ((1 << x) - 1)),
                        (b >>>= x),
                        (m -= x)),
                      m < 15 &&
                        ((b += U[a++] << m),
                        (m += 8),
                        (b += U[a++] << m),
                        (m += 8)),
                      (k = g[b & y]);
                    r: for (;;) {
                      if (
                        ((x = k >>> 24),
                        (b >>>= x),
                        (m -= x),
                        (x = (k >>> 16) & 255),
                        !(16 & x))
                      ) {
                        if (0 === (64 & x)) {
                          k = g[(65535 & k) + (b & ((1 << x) - 1))];
                          continue r;
                        }
                        (e.msg = "invalid distance code"), (r.mode = n);
                        break e;
                      }
                      if (
                        ((S = 65535 & k),
                        (x &= 15),
                        m < x &&
                          ((b += U[a++] << m),
                          (m += 8),
                          m < x && ((b += U[a++] << m), (m += 8))),
                        (S += b & ((1 << x) - 1)),
                        S > u)
                      ) {
                        (e.msg = "invalid distance too far back"), (r.mode = n);
                        break e;
                      }
                      if (((b >>>= x), (m -= x), (x = s - l), S > x)) {
                        if (((x = S - x), x > f && r.sane)) {
                          (e.msg = "invalid distance too far back"),
                            (r.mode = n);
                          break e;
                        }
                        if (((E = 0), (C = p), 0 === h)) {
                          if (((E += c - x), x < _)) {
                            _ -= x;
                            do L[s++] = p[E++];
                            while (--x);
                            (E = s - S), (C = L);
                          }
                        } else if (h < x) {
                          if (((E += c + h - x), (x -= h), x < _)) {
                            _ -= x;
                            do L[s++] = p[E++];
                            while (--x);
                            if (((E = 0), h < _)) {
                              (x = h), (_ -= x);
                              do L[s++] = p[E++];
                              while (--x);
                              (E = s - S), (C = L);
                            }
                          }
                        } else if (((E += h - x), x < _)) {
                          _ -= x;
                          do L[s++] = p[E++];
                          while (--x);
                          (E = s - S), (C = L);
                        }
                        for (; _ > 2; )
                          (L[s++] = C[E++]),
                            (L[s++] = C[E++]),
                            (L[s++] = C[E++]),
                            (_ -= 3);
                        _ && ((L[s++] = C[E++]), _ > 1 && (L[s++] = C[E++]));
                      } else {
                        E = s - S;
                        do
                          (L[s++] = L[E++]),
                            (L[s++] = L[E++]),
                            (L[s++] = L[E++]),
                            (_ -= 3);
                        while (_ > 2);
                        _ && ((L[s++] = L[E++]), _ > 1 && (L[s++] = L[E++]));
                      }
                      break;
                    }
                  }
                  break;
                }
              } while (a < i && s < d);
              (_ = m >> 3),
                (a -= _),
                (m -= _ << 3),
                (b &= (1 << m) - 1),
                (e.next_in = a),
                (e.next_out = s),
                (e.avail_in = a < i ? 5 + (i - a) : 5 - (a - i)),
                (e.avail_out = s < d ? 257 + (d - s) : 257 - (s - d)),
                (r.hold = b),
                (r.bits = m);
            };
          },
          "zlib/inftrees.js": function (e, t, r) {
            "use strict";
            var n = e("../utils/common"),
              o = 15,
              a = 852,
              i = 592,
              s = 0,
              l = 1,
              d = 2,
              u = [
                3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
                51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
              ],
              c = [
                16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
                19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
              ],
              f = [
                1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
                385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
                16385, 24577, 0, 0,
              ],
              h = [
                16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
                23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
              ];
            t.exports = function (e, t, r, p, b, m, w, g) {
              var v,
                y,
                k,
                x,
                _,
                S,
                E,
                C,
                U,
                L = g.bits,
                T = 0,
                R = 0,
                B = 0,
                O = 0,
                H = 0,
                A = 0,
                I = 0,
                N = 0,
                D = 0,
                z = 0,
                F = null,
                P = 0,
                Z = new n.Buf16(o + 1),
                M = new n.Buf16(o + 1),
                j = null,
                W = 0;
              for (T = 0; T <= o; T++) Z[T] = 0;
              for (R = 0; R < p; R++) Z[t[r + R]]++;
              for (H = L, O = o; O >= 1 && 0 === Z[O]; O--);
              if ((H > O && (H = O), 0 === O))
                return (
                  (b[m++] = 20971520), (b[m++] = 20971520), (g.bits = 1), 0
                );
              for (B = 1; B < O && 0 === Z[B]; B++);
              for (H < B && (H = B), N = 1, T = 1; T <= o; T++)
                if (((N <<= 1), (N -= Z[T]), N < 0)) return -1;
              if (N > 0 && (e === s || 1 !== O)) return -1;
              for (M[1] = 0, T = 1; T < o; T++) M[T + 1] = M[T] + Z[T];
              for (R = 0; R < p; R++) 0 !== t[r + R] && (w[M[t[r + R]]++] = R);
              if (
                (e === s
                  ? ((F = j = w), (S = 19))
                  : e === l
                  ? ((F = u), (P -= 257), (j = c), (W -= 257), (S = 256))
                  : ((F = f), (j = h), (S = -1)),
                (z = 0),
                (R = 0),
                (T = B),
                (_ = m),
                (A = H),
                (I = 0),
                (k = -1),
                (D = 1 << H),
                (x = D - 1),
                (e === l && D > a) || (e === d && D > i))
              )
                return 1;
              for (;;) {
                (E = T - I),
                  w[R] < S
                    ? ((C = 0), (U = w[R]))
                    : w[R] > S
                    ? ((C = j[W + w[R]]), (U = F[P + w[R]]))
                    : ((C = 96), (U = 0)),
                  (v = 1 << (T - I)),
                  (y = 1 << A),
                  (B = y);
                do
                  (y -= v),
                    (b[_ + (z >> I) + y] = (E << 24) | (C << 16) | U | 0);
                while (0 !== y);
                for (v = 1 << (T - 1); z & v; ) v >>= 1;
                if (
                  (0 !== v ? ((z &= v - 1), (z += v)) : (z = 0),
                  R++,
                  0 === --Z[T])
                ) {
                  if (T === O) break;
                  T = t[r + w[R]];
                }
                if (T > H && (z & x) !== k) {
                  for (
                    0 === I && (I = H), _ += B, A = T - I, N = 1 << A;
                    A + I < O && ((N -= Z[A + I]), !(N <= 0));

                  )
                    A++, (N <<= 1);
                  if (((D += 1 << A), (e === l && D > a) || (e === d && D > i)))
                    return 1;
                  (k = z & x), (b[k] = (H << 24) | (A << 16) | (_ - m) | 0);
                }
              }
              return (
                0 !== z && (b[_ + z] = ((T - I) << 24) | (64 << 16) | 0),
                (g.bits = H),
                0
              );
            };
          },
        };
        for (var r in t) t[r].folder = r.substring(0, r.lastIndexOf("/") + 1);
        var n = function (e) {
            var r = [];
            return (
              (e = e.split("/").every(function (e) {
                return ".." == e ? r.pop() : "." == e || "" == e || r.push(e);
              })
                ? r.join("/")
                : null),
              e ? t[e] || t[e + ".js"] || t[e + "/index.js"] : null
            );
          },
          o = function (e, t) {
            return e
              ? n(e.folder + "node_modules/" + t) || o(e.parent, t)
              : null;
          },
          a = function (e, t) {
            var r = t.match(/^\//)
              ? null
              : e
              ? t.match(/^\.\.?\//)
                ? n(e.folder + t)
                : o(e, t)
              : n(t);
            if (!r) throw "module not found: " + t;
            return (
              r.exports ||
                ((r.parent = e), r(a.bind(null, r), r, (r.exports = {}))),
              r.exports
            );
          };
        return a(null, e);
      },
      decompress: function (e) {
        this.exports || (this.exports = this.require("inflate.js"));
        try {
          return this.exports.inflate(e);
        } catch (e) {}
      },
      hasUnityMarker: function (e) {
        var t = 10,
          r = "UnityWeb Compressed Content (gzip)";
        if (t > e.length || 31 != e[0] || 139 != e[1]) return !1;
        var n = e[3];
        if (4 & n) {
          if (t + 2 > e.length) return !1;
          if (((t += 2 + e[t] + (e[t + 1] << 8)), t > e.length)) return !1;
        }
        if (8 & n) {
          for (; t < e.length && e[t]; ) t++;
          if (t + 1 > e.length) return !1;
          t++;
        }
        return (
          16 & n &&
          String.fromCharCode.apply(null, e.subarray(t, t + r.length + 1)) ==
            r + "\0"
        );
      },
    },
  };
  return new Promise(function (e, t) {
    f.SystemInfo.hasWebGL
      ? 1 == f.SystemInfo.hasWebGL
        ? t(
            'Your browser does not support graphics API "WebGL 2.0" which is required for this content.'
          )
        : f.SystemInfo.hasWasm
        ? (1 == f.SystemInfo.hasWebGL &&
            f.print(
              'Warning: Your browser does not support "WebGL 2.0" Graphics API, switching to "WebGL 1.0"'
            ),
          (f.startupErrorHandler = t),
          r(0),
          f.postRun.push(function () {
            r(1), delete f.startupErrorHandler, e(w);
          }),
          c())
        : t("Your browser does not support WebAssembly.")
      : t("Your browser does not support WebGL.");
  });
}

/*
=======
function createUnityInstance(e,t,r){function n(e,r){if(!n.aborted&&t.showBanner)return"error"==r&&(n.aborted=!0),t.showBanner(e,r);switch(r){case"error":console.error(e);break;case"warning":console.warn(e);break;default:console.log(e)}}function o(e){var t=e.reason||e.error,r=t?t.toString():e.message||e.reason||"",n=t&&t.stack?t.stack.toString():"";if(n.startsWith(r)&&(n=n.substring(r.length)),r+="\n"+n.trim(),r&&f.stackTraceRegExp&&f.stackTraceRegExp.test(r)){var o=e.filename||t&&(t.fileName||t.sourceURL)||"",a=e.lineno||t&&(t.lineNumber||t.line)||0;i(r,o,a)}}function a(e){e.preventDefault()}function i(e,t,r){if(f.startupErrorHandler)return void f.startupErrorHandler(e,t,r);if(!(f.errorHandler&&f.errorHandler(e,t,r)||(console.log("Invoking error handler due to\n"+e),"function"==typeof dump&&dump("Invoking error handler due to\n"+e),e.indexOf("UnknownError")!=-1||e.indexOf("Program terminated with exit(0)")!=-1||i.didShowErrorMessage))){var e="An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n"+e;e.indexOf("DISABLE_EXCEPTION_CATCHING")!=-1?e="An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace.":e.indexOf("Cannot enlarge memory arrays")!=-1?e="Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings.":e.indexOf("Invalid array buffer length")==-1&&e.indexOf("Invalid typed array length")==-1&&e.indexOf("out of memory")==-1&&e.indexOf("could not allocate memory")==-1||(e="The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."),alert(e),i.didShowErrorMessage=!0}}function s(e,t){if("symbolsUrl"!=e){var n=f.downloadProgress[e];n||(n=f.downloadProgress[e]={started:!1,finished:!1,lengthComputable:!1,total:0,loaded:0}),"object"!=typeof t||"progress"!=t.type&&"load"!=t.type||(n.started||(n.started=!0,n.lengthComputable=t.lengthComputable,n.total=t.total),n.loaded=t.loaded,"load"==t.type&&(n.finished=!0));var o=0,a=0,i=0,s=0,l=0;for(var e in f.downloadProgress){var n=f.downloadProgress[e];if(!n.started)return 0;i++,n.lengthComputable?(o+=n.loaded,a+=n.total,s++):n.finished||l++}var d=i?(i-l-(a?s*(a-o)/a:0))/i:0;r(.9*d)}}function l(e,t,r){for(var n in g)if(g[n].hasUnityMarker(e)){t&&console.log('You can reduce startup time if you configure your web server to add "Content-Encoding: '+n+'" response header when serving "'+t+'" file.');var o=g[n];if(!o.worker){var a=URL.createObjectURL(new Blob(["this.require = ",o.require.toString(),"; this.decompress = ",o.decompress.toString(),"; this.onmessage = ",function(e){var t={id:e.data.id,decompressed:this.decompress(e.data.compressed)};postMessage(t,t.decompressed?[t.decompressed.buffer]:[])}.toString(),"; postMessage({ ready: true });"],{type:"application/javascript"}));o.worker=new Worker(a),o.worker.onmessage=function(e){return e.data.ready?void URL.revokeObjectURL(a):(this.callbacks[e.data.id](e.data.decompressed),void delete this.callbacks[e.data.id])},o.worker.callbacks={},o.worker.nextCallbackId=0}var i=o.worker.nextCallbackId++;return o.worker.callbacks[i]=r,void o.worker.postMessage({id:i,compressed:e},[e.buffer])}r(e)}function d(e){return new Promise(function(t,r){s(e);var o=f.companyName&&f.productName?new f.XMLHttpRequest({companyName:f.companyName,productName:f.productName,cacheControl:f.cacheControl(f[e])}):new XMLHttpRequest;o.open("GET",f[e]),o.responseType="arraybuffer",o.addEventListener("progress",function(t){s(e,t)}),o.addEventListener("load",function(r){s(e,r),l(new Uint8Array(o.response),f[e],t)}),o.addEventListener("error",function(t){var r="Failed to download file "+f[e];"file:"==location.protocol?n(r+". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.","error"):console.error(r)}),o.send()})}function u(){return d("frameworkUrl").then(function(e){var t=URL.createObjectURL(new Blob([e],{type:"application/javascript"}));return new Promise(function(e,r){var o=document.createElement("script");o.src=t,o.onload=function(){if("undefined"==typeof unityFramework||!unityFramework){var r=[["br","br"],["gz","gzip"]];for(var a in r){var i=r[a];if(f.frameworkUrl.endsWith("."+i[0])){var s="Unable to parse "+f.frameworkUrl+"!";if("file:"==location.protocol)return void n(s+" Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.","error");if(s+=' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: '+i[1]+'" present. Check browser Console and Devtools Network tab to debug.',"br"==i[0]&&"http:"==location.protocol){var l=["localhost","127.0.0.1"].indexOf(location.hostname)!=-1?"":"Migrate your server to use HTTPS.";s=/Firefox/.test(navigator.userAgent)?"Unable to parse "+f.frameworkUrl+'!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. '+l+' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.':"Unable to parse "+f.frameworkUrl+'!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.'}return void n(s,"error")}}n("Unable to parse "+f.frameworkUrl+"! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)","error")}var d=unityFramework;unityFramework=null,o.onload=null,URL.revokeObjectURL(t),e(d)},o.onerror=function(e){n("Unable to load file "+f.frameworkUrl+"! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)","error")},document.body.appendChild(o),f.deinitializers.push(function(){document.body.removeChild(o)})})})}function c(){Promise.all([u(),d("codeUrl")]).then(function(e){f.wasmBinary=e[1],e[0](f)});var e=d("dataUrl");f.preRun.push(function(){f.addRunDependency("dataUrl"),e.then(function(e){var t=new DataView(e.buffer,e.byteOffset,e.byteLength),r=0,n="UnityWebData1.0\0";if(!String.fromCharCode.apply(null,e.subarray(r,r+n.length))==n)throw"unknown data format";r+=n.length;var o=t.getUint32(r,!0);for(r+=4;r<o;){var a=t.getUint32(r,!0);r+=4;var i=t.getUint32(r,!0);r+=4;var s=t.getUint32(r,!0);r+=4;var l=String.fromCharCode.apply(null,e.subarray(r,r+s));r+=s;for(var d=0,u=l.indexOf("/",d)+1;u>0;d=u,u=l.indexOf("/",d)+1)f.FS_createPath(l.substring(0,d),l.substring(d,u-1),!0,!0);f.FS_createDataFile(l,null,e.subarray(a,a+i),!0,!0,!0)}f.removeRunDependency("dataUrl")})})}r=r||function(){};var f={canvas:e,webglContextAttributes:{preserveDrawingBuffer:!1},cacheControl:function(e){return e==f.dataUrl?"must-revalidate":"no-store"},streamingAssetsUrl:"StreamingAssets",downloadProgress:{},deinitializers:[],intervals:{},setInterval:function(e,t){var r=window.setInterval(e,t);return this.intervals[r]=!0,r},clearInterval:function(e){delete this.intervals[e],window.clearInterval(e)},preRun:[],postRun:[],print:function(e){console.log(e)},printErr:function(e){console.error(e),"string"==typeof e&&e.indexOf("wasm streaming compile failed")!=-1&&(e.toLowerCase().indexOf("mime")!=-1?n('HTTP Response Header "Content-Type" configured incorrectly on the server for file '+f.codeUrl+' , should be "application/wasm". Startup time performance will suffer.',"warning"):n('WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file '+f.codeUrl+", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.","warning"))},locateFile:function(e){return e},disabledCanvasEvents:["contextmenu","dragstart"]};for(var h in t)f[h]=t[h];f.streamingAssetsUrl=new URL(f.streamingAssetsUrl,document.URL).href;var p=f.disabledCanvasEvents.slice();p.forEach(function(t){e.addEventListener(t,a)}),window.addEventListener("error",o),window.addEventListener("unhandledrejection",o);var b="",m="";document.addEventListener("webkitfullscreenchange",function(t){var r=document.webkitCurrentFullScreenElement;r===e?e.style.width&&(b=e.style.width,m=e.style.height,e.style.width="100%",e.style.height="100%"):b&&(e.style.width=b,e.style.height=m,b="",m="")});var w={Module:f,SetFullscreen:function(){return f.SetFullscreen?f.SetFullscreen.apply(f,arguments):void f.print("Failed to set Fullscreen mode: Player not loaded yet.")},SendMessage:function(){return f.SendMessage?f.SendMessage.apply(f,arguments):void f.print("Failed to execute SendMessage: Player not loaded yet.")},Quit:function(){return new Promise(function(t,r){f.shouldQuit=!0,f.onQuit=t,p.forEach(function(t){e.removeEventListener(t,a)}),window.removeEventListener("error",o),window.removeEventListener("unhandledrejection",o)})}};f.SystemInfo=function(){function e(e,t,r){return e=RegExp(e,"i").exec(t),e&&e[r]}for(var t,r,n,o,a,i,s=navigator.userAgent+" ",l=[["Firefox","Firefox"],["OPR","Opera"],["Edg","Edge"],["SamsungBrowser","Samsung Browser"],["Trident","Internet Explorer"],["MSIE","Internet Explorer"],["Chrome","Chrome"],["CriOS","Chrome on iOS Safari"],["FxiOS","Firefox on iOS Safari"],["Safari","Safari"]],d=0;d<l.length;++d)if(r=e(l[d][0]+"[/ ](.*?)[ \\)]",s,1)){t=l[d][1];break}"Safari"==t&&(r=e("Version/(.*?) ",s,1)),"Internet Explorer"==t&&(r=e("rv:(.*?)\\)? ",s,1)||r);for(var u=[["Windows (.*?)[;)]","Windows"],["Android ([0-9_.]+)","Android"],["iPhone OS ([0-9_.]+)","iPhoneOS"],["iPad.*? OS ([0-9_.]+)","iPadOS"],["FreeBSD( )","FreeBSD"],["OpenBSD( )","OpenBSD"],["Linux|X11()","Linux"],["Mac OS X ([0-9_.]+)","MacOS"],["bot|google|baidu|bing|msn|teoma|slurp|yandex","Search Bot"]],c=0;c<u.length;++c)if(o=e(u[c][0],s,1)){n=u[c][1],o=o.replace(/_/g,".");break}var f={"NT 5.0":"2000","NT 5.1":"XP","NT 5.2":"Server 2003","NT 6.0":"Vista","NT 6.1":"7","NT 6.2":"8","NT 6.3":"8.1","NT 10.0":"10"};o=f[o]||o,a=document.createElement("canvas"),a&&(gl=a.getContext("webgl2"),glVersion=gl?2:0,gl||(gl=a&&a.getContext("webgl"))&&(glVersion=1),gl&&(i=gl.getExtension("WEBGL_debug_renderer_info")&&gl.getParameter(37446)||gl.getParameter(7937)));var h="undefined"!=typeof SharedArrayBuffer,p="object"==typeof WebAssembly&&"function"==typeof WebAssembly.compile;return{width:screen.width,height:screen.height,userAgent:s.trim(),browser:t||"Unknown browser",browserVersion:r||"Unknown version",mobile:/Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),os:n||"Unknown OS",osVersion:o||"Unknown OS Version",gpu:i||"Unknown GPU",language:navigator.userLanguage||navigator.language,hasWebGL:glVersion,hasCursorLock:!!document.body.requestPointerLock,hasFullscreen:!!document.body.requestFullscreen||!!document.body.webkitRequestFullscreen,hasThreads:h,hasWasm:p,hasWasmThreads:!1}}(),f.abortHandler=function(e){return i(e,"",0),!0},Error.stackTraceLimit=Math.max(Error.stackTraceLimit||0,50),f.XMLHttpRequest=function(){function e(e){console.log("[UnityCache] "+e)}function t(e){return t.link=t.link||document.createElement("a"),t.link.href=e,t.link.href}function r(e){var t=window.location.href.match(/^[a-z]+:\/\/[^\/]+/);return!t||e.lastIndexOf(t[0],0)}function n(){function t(t){if("undefined"==typeof n.database)for(n.database=t,n.database||e("indexedDB database could not be opened");n.queue.length;){var r=n.queue.shift();n.database?n.execute.apply(n,r.arguments):"function"==typeof r.onerror&&r.onerror(new Error("operation cancelled"))}}function r(){var e=o.open(i.name,i.version);e.onupgradeneeded=function(e){var t=e.target.result;t.objectStoreNames.contains(l.name)||t.createObjectStore(l.name)},e.onsuccess=function(e){t(e.target.result)},e.onerror=function(){t(null)}}var n=this;n.queue=[];try{var o=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,a=setTimeout(function(){"undefined"==typeof n.database&&t(null)},2e3),d=o.open(i.name);d.onupgradeneeded=function(e){var t=e.target.result.createObjectStore(s.name,{keyPath:"url"});["version","company","product","updated","revalidated","accessed"].forEach(function(e){t.createIndex(e,e)})},d.onsuccess=function(e){clearTimeout(a);var n=e.target.result;n.version<i.version?(n.close(),r()):t(n)},d.onerror=function(){clearTimeout(a),t(null)}}catch(e){clearTimeout(a),t(null)}}function o(e,t,r,n,o){var a={url:e,version:s.version,company:t,product:r,updated:n,revalidated:n,accessed:n,responseHeaders:{},xhr:{}};return o&&(["Last-Modified","ETag"].forEach(function(e){a.responseHeaders[e]=o.getResponseHeader(e)}),["responseURL","status","statusText","response"].forEach(function(e){a.xhr[e]=o[e]})),a}function a(t){this.cache={enabled:!1},t&&(this.cache.control=t.cacheControl,this.cache.company=t.companyName,this.cache.product=t.productName),this.xhr=new XMLHttpRequest(t),this.xhr.addEventListener("load",function(){var t=this.xhr,r=this.cache;r.enabled&&!r.revalidated&&(304==t.status?(r.result.revalidated=r.result.accessed,r.revalidated=!0,d.execute(s.name,"put",[r.result]),e("'"+r.result.url+"' successfully revalidated and served from the indexedDB cache")):200==t.status?(r.result=o(r.result.url,r.company,r.product,r.result.accessed,t),r.revalidated=!0,d.execute(s.name,"put",[r.result],function(t){e("'"+r.result.url+"' successfully downloaded and stored in the indexedDB cache")},function(t){e("'"+r.result.url+"' successfully downloaded but not stored in the indexedDB cache due to the error: "+t)})):e("'"+r.result.url+"' request failed with status: "+t.status+" "+t.statusText))}.bind(this))}var i={name:"UnityCache",version:2},s={name:"XMLHttpRequest",version:1},l={name:"WebAssembly",version:1};n.prototype.execute=function(e,t,r,n,o){if(this.database)try{var a=this.database.transaction([e],["put","delete","clear"].indexOf(t)!=-1?"readwrite":"readonly").objectStore(e);"openKeyCursor"==t&&(a=a.index(r[0]),r=r.slice(1));var i=a[t].apply(a,r);"function"==typeof n&&(i.onsuccess=function(e){n(e.target.result)}),i.onerror=o}catch(e){"function"==typeof o&&o(e)}else"undefined"==typeof this.database?this.queue.push({arguments:arguments,onerror:o}):"function"==typeof o&&o(new Error("indexedDB access denied"))};var d=new n;a.prototype.send=function(t){var n=this.xhr,o=this.cache,a=arguments;return o.enabled=o.enabled&&"arraybuffer"==n.responseType&&!t,o.enabled?void d.execute(s.name,"get",[o.result.url],function(t){if(!t||t.version!=s.version)return void n.send.apply(n,a);if(o.result=t,o.result.accessed=Date.now(),"immutable"==o.control)o.revalidated=!0,d.execute(s.name,"put",[o.result]),n.dispatchEvent(new Event("load")),e("'"+o.result.url+"' served from the indexedDB cache without revalidation");else if(r(o.result.url)&&(o.result.responseHeaders["Last-Modified"]||o.result.responseHeaders.ETag)){var i=new XMLHttpRequest;i.open("HEAD",o.result.url),i.onload=function(){o.revalidated=["Last-Modified","ETag"].every(function(e){return!o.result.responseHeaders[e]||o.result.responseHeaders[e]==i.getResponseHeader(e)}),o.revalidated?(o.result.revalidated=o.result.accessed,d.execute(s.name,"put",[o.result]),n.dispatchEvent(new Event("load")),e("'"+o.result.url+"' successfully revalidated and served from the indexedDB cache")):n.send.apply(n,a)},i.send()}else o.result.responseHeaders["Last-Modified"]?(n.setRequestHeader("If-Modified-Since",o.result.responseHeaders["Last-Modified"]),n.setRequestHeader("Cache-Control","no-cache")):o.result.responseHeaders.ETag&&(n.setRequestHeader("If-None-Match",o.result.responseHeaders.ETag),n.setRequestHeader("Cache-Control","no-cache")),n.send.apply(n,a)},function(e){n.send.apply(n,a)}):n.send.apply(n,a)},a.prototype.open=function(e,r,n,a,i){return this.cache.result=o(t(r),this.cache.company,this.cache.product,Date.now()),this.cache.enabled=["must-revalidate","immutable"].indexOf(this.cache.control)!=-1&&"GET"==e&&this.cache.result.url.match("^https?://")&&("undefined"==typeof n||n)&&"undefined"==typeof a&&"undefined"==typeof i,this.cache.revalidated=!1,this.xhr.open.apply(this.xhr,arguments)},a.prototype.setRequestHeader=function(e,t){return this.cache.enabled=!1,this.xhr.setRequestHeader.apply(this.xhr,arguments)};var u=new XMLHttpRequest;for(var c in u)a.prototype.hasOwnProperty(c)||!function(e){Object.defineProperty(a.prototype,e,"function"==typeof u[e]?{value:function(){return this.xhr[e].apply(this.xhr,arguments)}}:{get:function(){return this.cache.revalidated&&this.cache.result.xhr.hasOwnProperty(e)?this.cache.result.xhr[e]:this.xhr[e]},set:function(t){this.xhr[e]=t}})}(c);return a}();var g={gzip:{require:function(e){var t={"inflate.js":function(e,t,r){"use strict";function n(e){if(!(this instanceof n))return new n(e);this.options=s.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0===(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var r=i.inflateInit2(this.strm,t.windowBits);if(r!==d.Z_OK)throw new Error(u[r]);this.header=new f,i.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new n(t);if(r.push(e,!0),r.err)throw r.msg||u[r.err];return r.result}function a(e,t){return t=t||{},t.raw=!0,o(e,t)}var i=e("./zlib/inflate"),s=e("./utils/common"),l=e("./utils/strings"),d=e("./zlib/constants"),u=e("./zlib/messages"),c=e("./zlib/zstream"),f=e("./zlib/gzheader"),h=Object.prototype.toString;n.prototype.push=function(e,t){var r,n,o,a,u,c,f=this.strm,p=this.options.chunkSize,b=this.options.dictionary,m=!1;if(this.ended)return!1;n=t===~~t?t:t===!0?d.Z_FINISH:d.Z_NO_FLUSH,"string"==typeof e?f.input=l.binstring2buf(e):"[object ArrayBuffer]"===h.call(e)?f.input=new Uint8Array(e):f.input=e,f.next_in=0,f.avail_in=f.input.length;do{if(0===f.avail_out&&(f.output=new s.Buf8(p),f.next_out=0,f.avail_out=p),r=i.inflate(f,d.Z_NO_FLUSH),r===d.Z_NEED_DICT&&b&&(c="string"==typeof b?l.string2buf(b):"[object ArrayBuffer]"===h.call(b)?new Uint8Array(b):b,r=i.inflateSetDictionary(this.strm,c)),r===d.Z_BUF_ERROR&&m===!0&&(r=d.Z_OK,m=!1),r!==d.Z_STREAM_END&&r!==d.Z_OK)return this.onEnd(r),this.ended=!0,!1;f.next_out&&(0!==f.avail_out&&r!==d.Z_STREAM_END&&(0!==f.avail_in||n!==d.Z_FINISH&&n!==d.Z_SYNC_FLUSH)||("string"===this.options.to?(o=l.utf8border(f.output,f.next_out),a=f.next_out-o,u=l.buf2string(f.output,o),f.next_out=a,f.avail_out=p-a,a&&s.arraySet(f.output,f.output,o,a,0),this.onData(u)):this.onData(s.shrinkBuf(f.output,f.next_out)))),0===f.avail_in&&0===f.avail_out&&(m=!0)}while((f.avail_in>0||0===f.avail_out)&&r!==d.Z_STREAM_END);return r===d.Z_STREAM_END&&(n=d.Z_FINISH),n===d.Z_FINISH?(r=i.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===d.Z_OK):n!==d.Z_SYNC_FLUSH||(this.onEnd(d.Z_OK),f.avail_out=0,!0)},n.prototype.onData=function(e){this.chunks.push(e)},n.prototype.onEnd=function(e){e===d.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=n,r.inflate=o,r.inflateRaw=a,r.ungzip=o},"utils/common.js":function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var o={arraySet:function(e,t,r,n,o){if(t.subarray&&e.subarray)return void e.set(t.subarray(r,r+n),o);for(var a=0;a<n;a++)e[o+a]=t[r+a]},flattenChunks:function(e){var t,r,n,o,a,i;for(n=0,t=0,r=e.length;t<r;t++)n+=e[t].length;for(i=new Uint8Array(n),o=0,t=0,r=e.length;t<r;t++)a=e[t],i.set(a,o),o+=a.length;return i}},a={arraySet:function(e,t,r,n,o){for(var a=0;a<n;a++)e[o+a]=t[r+a]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,o)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,a))},r.setTyped(n)},"utils/strings.js":function(e,t,r){"use strict";function n(e,t){if(t<65537&&(e.subarray&&i||!e.subarray&&a))return String.fromCharCode.apply(null,o.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}var o=e("./common"),a=!0,i=!0;try{String.fromCharCode.apply(null,[0])}catch(e){a=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){i=!1}for(var s=new o.Buf8(256),l=0;l<256;l++)s[l]=l>=252?6:l>=248?5:l>=240?4:l>=224?3:l>=192?2:1;s[254]=s[254]=1,r.string2buf=function(e){var t,r,n,a,i,s=e.length,l=0;for(a=0;a<s;a++)r=e.charCodeAt(a),55296===(64512&r)&&a+1<s&&(n=e.charCodeAt(a+1),56320===(64512&n)&&(r=65536+(r-55296<<10)+(n-56320),a++)),l+=r<128?1:r<2048?2:r<65536?3:4;for(t=new o.Buf8(l),i=0,a=0;i<l;a++)r=e.charCodeAt(a),55296===(64512&r)&&a+1<s&&(n=e.charCodeAt(a+1),56320===(64512&n)&&(r=65536+(r-55296<<10)+(n-56320),a++)),r<128?t[i++]=r:r<2048?(t[i++]=192|r>>>6,t[i++]=128|63&r):r<65536?(t[i++]=224|r>>>12,t[i++]=128|r>>>6&63,t[i++]=128|63&r):(t[i++]=240|r>>>18,t[i++]=128|r>>>12&63,t[i++]=128|r>>>6&63,t[i++]=128|63&r);return t},r.buf2binstring=function(e){return n(e,e.length)},r.binstring2buf=function(e){for(var t=new o.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,o,a,i,l=t||e.length,d=new Array(2*l);for(o=0,r=0;r<l;)if(a=e[r++],a<128)d[o++]=a;else if(i=s[a],i>4)d[o++]=65533,r+=i-1;else{for(a&=2===i?31:3===i?15:7;i>1&&r<l;)a=a<<6|63&e[r++],i--;i>1?d[o++]=65533:a<65536?d[o++]=a:(a-=65536,d[o++]=55296|a>>10&1023,d[o++]=56320|1023&a)}return n(d,o)},r.utf8border=function(e,t){var r;for(t=t||e.length,t>e.length&&(t=e.length),r=t-1;r>=0&&128===(192&e[r]);)r--;return r<0?t:0===r?t:r+s[e[r]]>t?r:t}},"zlib/inflate.js":function(e,t,r){"use strict";function n(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function o(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new g.Buf16(320),this.work=new g.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=D,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new g.Buf32(be),t.distcode=t.distdyn=new g.Buf32(me),t.sane=1,t.back=-1,T):O}function i(e){var t;return e&&e.state?(t=e.state,t.wsize=0,t.whave=0,t.wnext=0,a(e)):O}function s(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=(t>>4)+1,t<48&&(t&=15)),t&&(t<8||t>15)?O:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,i(e))):O}function l(e,t){var r,n;return e?(n=new o,e.state=n,n.window=null,r=s(e,t),r!==T&&(e.state=null),r):O}function d(e){return l(e,ge)}function u(e){if(ve){var t;for(m=new g.Buf32(512),w=new g.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(x(S,e.lens,0,288,m,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;x(E,e.lens,0,32,w,0,e.work,{bits:5}),ve=!1}e.lencode=m,e.lenbits=9,e.distcode=w,e.distbits=5}function c(e,t,r,n){var o,a=e.state;return null===a.window&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0,a.window=new g.Buf8(a.wsize)),n>=a.wsize?(g.arraySet(a.window,t,r-a.wsize,a.wsize,0),a.wnext=0,a.whave=a.wsize):(o=a.wsize-a.wnext,o>n&&(o=n),g.arraySet(a.window,t,r-n,o,a.wnext),n-=o,n?(g.arraySet(a.window,t,r-n,n,0),a.wnext=n,a.whave=a.wsize):(a.wnext+=o,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=o))),0}function f(e,t){var r,o,a,i,s,l,d,f,h,p,b,m,w,be,me,we,ge,ve,ye,ke,xe,_e,Se,Ee,Ce=0,Ue=new g.Buf8(4),Le=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return O;r=e.state,r.mode===K&&(r.mode=Y),s=e.next_out,a=e.output,d=e.avail_out,i=e.next_in,o=e.input,l=e.avail_in,f=r.hold,h=r.bits,p=l,b=d,_e=T;e:for(;;)switch(r.mode){case D:if(0===r.wrap){r.mode=Y;break}for(;h<16;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(2&r.wrap&&35615===f){r.check=0,Ue[0]=255&f,Ue[1]=f>>>8&255,r.check=y(r.check,Ue,2,0),f=0,h=0,r.mode=z;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&f)<<8)+(f>>8))%31){e.msg="incorrect header check",r.mode=fe;break}if((15&f)!==N){e.msg="unknown compression method",r.mode=fe;break}if(f>>>=4,h-=4,xe=(15&f)+8,0===r.wbits)r.wbits=xe;else if(xe>r.wbits){e.msg="invalid window size",r.mode=fe;break}r.dmax=1<<xe,e.adler=r.check=1,r.mode=512&f?G:K,f=0,h=0;break;case z:for(;h<16;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(r.flags=f,(255&r.flags)!==N){e.msg="unknown compression method",r.mode=fe;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=fe;break}r.head&&(r.head.text=f>>8&1),512&r.flags&&(Ue[0]=255&f,Ue[1]=f>>>8&255,r.check=y(r.check,Ue,2,0)),f=0,h=0,r.mode=F;case F:for(;h<32;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}r.head&&(r.head.time=f),512&r.flags&&(Ue[0]=255&f,Ue[1]=f>>>8&255,Ue[2]=f>>>16&255,Ue[3]=f>>>24&255,r.check=y(r.check,Ue,4,0)),f=0,h=0,r.mode=P;case P:for(;h<16;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}r.head&&(r.head.xflags=255&f,r.head.os=f>>8),512&r.flags&&(Ue[0]=255&f,Ue[1]=f>>>8&255,r.check=y(r.check,Ue,2,0)),f=0,h=0,r.mode=Z;case Z:if(1024&r.flags){for(;h<16;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}r.length=f,r.head&&(r.head.extra_len=f),512&r.flags&&(Ue[0]=255&f,Ue[1]=f>>>8&255,r.check=y(r.check,Ue,2,0)),f=0,h=0}else r.head&&(r.head.extra=null);r.mode=M;case M:if(1024&r.flags&&(m=r.length,m>l&&(m=l),m&&(r.head&&(xe=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),g.arraySet(r.head.extra,o,i,m,xe)),512&r.flags&&(r.check=y(r.check,o,m,i)),l-=m,i+=m,r.length-=m),r.length))break e;r.length=0,r.mode=j;case j:if(2048&r.flags){if(0===l)break e;m=0;do xe=o[i+m++],r.head&&xe&&r.length<65536&&(r.head.name+=String.fromCharCode(xe));while(xe&&m<l);if(512&r.flags&&(r.check=y(r.check,o,m,i)),l-=m,i+=m,xe)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=W;case W:if(4096&r.flags){if(0===l)break e;m=0;do xe=o[i+m++],r.head&&xe&&r.length<65536&&(r.head.comment+=String.fromCharCode(xe));while(xe&&m<l);if(512&r.flags&&(r.check=y(r.check,o,m,i)),l-=m,i+=m,xe)break e}else r.head&&(r.head.comment=null);r.mode=q;case q:if(512&r.flags){for(;h<16;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(f!==(65535&r.check)){e.msg="header crc mismatch",r.mode=fe;break}f=0,h=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=K;break;case G:for(;h<32;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}e.adler=r.check=n(f),f=0,h=0,r.mode=X;case X:if(0===r.havedict)return e.next_out=s,e.avail_out=d,e.next_in=i,e.avail_in=l,r.hold=f,r.bits=h,B;e.adler=r.check=1,r.mode=K;case K:if(t===U||t===L)break e;case Y:if(r.last){f>>>=7&h,h-=7&h,r.mode=de;break}for(;h<3;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}switch(r.last=1&f,f>>>=1,h-=1,3&f){case 0:r.mode=V;break;case 1:if(u(r),r.mode=re,t===L){f>>>=2,h-=2;break e}break;case 2:r.mode=$;break;case 3:e.msg="invalid block type",r.mode=fe}f>>>=2,h-=2;break;case V:for(f>>>=7&h,h-=7&h;h<32;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if((65535&f)!==(f>>>16^65535)){e.msg="invalid stored block lengths",r.mode=fe;break}if(r.length=65535&f,f=0,h=0,r.mode=Q,t===L)break e;case Q:r.mode=J;case J:if(m=r.length){if(m>l&&(m=l),m>d&&(m=d),0===m)break e;g.arraySet(a,o,i,m,s),l-=m,i+=m,d-=m,s+=m,r.length-=m;break}r.mode=K;break;case $:for(;h<14;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(r.nlen=(31&f)+257,f>>>=5,h-=5,r.ndist=(31&f)+1,f>>>=5,h-=5,r.ncode=(15&f)+4,f>>>=4,h-=4,r.nlen>286||r.ndist>30){e.msg="too many length or distance symbols",r.mode=fe;break}r.have=0,r.mode=ee;case ee:for(;r.have<r.ncode;){for(;h<3;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}r.lens[Le[r.have++]]=7&f,f>>>=3,h-=3}for(;r.have<19;)r.lens[Le[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,Se={bits:r.lenbits},_e=x(_,r.lens,0,19,r.lencode,0,r.work,Se),r.lenbits=Se.bits,_e){e.msg="invalid code lengths set",r.mode=fe;break}r.have=0,r.mode=te;case te:for(;r.have<r.nlen+r.ndist;){for(;Ce=r.lencode[f&(1<<r.lenbits)-1],me=Ce>>>24,we=Ce>>>16&255,ge=65535&Ce,!(me<=h);){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(ge<16)f>>>=me,h-=me,r.lens[r.have++]=ge;else{if(16===ge){for(Ee=me+2;h<Ee;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(f>>>=me,h-=me,0===r.have){e.msg="invalid bit length repeat",r.mode=fe;break}xe=r.lens[r.have-1],m=3+(3&f),f>>>=2,h-=2}else if(17===ge){for(Ee=me+3;h<Ee;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}f>>>=me,h-=me,xe=0,m=3+(7&f),f>>>=3,h-=3}else{for(Ee=me+7;h<Ee;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}f>>>=me,h-=me,xe=0,m=11+(127&f),f>>>=7,h-=7}if(r.have+m>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=fe;break}for(;m--;)r.lens[r.have++]=xe}}if(r.mode===fe)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=fe;break}if(r.lenbits=9,Se={bits:r.lenbits},_e=x(S,r.lens,0,r.nlen,r.lencode,0,r.work,Se),r.lenbits=Se.bits,_e){e.msg="invalid literal/lengths set",r.mode=fe;break}if(r.distbits=6,r.distcode=r.distdyn,Se={bits:r.distbits},_e=x(E,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,Se),r.distbits=Se.bits,_e){e.msg="invalid distances set",r.mode=fe;break}if(r.mode=re,t===L)break e;case re:r.mode=ne;case ne:if(l>=6&&d>=258){e.next_out=s,e.avail_out=d,e.next_in=i,e.avail_in=l,r.hold=f,r.bits=h,k(e,b),s=e.next_out,a=e.output,d=e.avail_out,i=e.next_in,o=e.input,l=e.avail_in,f=r.hold,h=r.bits,r.mode===K&&(r.back=-1);break}for(r.back=0;Ce=r.lencode[f&(1<<r.lenbits)-1],me=Ce>>>24,we=Ce>>>16&255,ge=65535&Ce,!(me<=h);){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(we&&0===(240&we)){for(ve=me,ye=we,ke=ge;Ce=r.lencode[ke+((f&(1<<ve+ye)-1)>>ve)],me=Ce>>>24,we=Ce>>>16&255,ge=65535&Ce,!(ve+me<=h);){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}f>>>=ve,h-=ve,r.back+=ve}if(f>>>=me,h-=me,r.back+=me,r.length=ge,0===we){r.mode=le;break}if(32&we){r.back=-1,r.mode=K;break}if(64&we){e.msg="invalid literal/length code",r.mode=fe;break}r.extra=15&we,r.mode=oe;case oe:if(r.extra){for(Ee=r.extra;h<Ee;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}r.length+=f&(1<<r.extra)-1,f>>>=r.extra,h-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=ae;case ae:for(;Ce=r.distcode[f&(1<<r.distbits)-1],me=Ce>>>24,we=Ce>>>16&255,ge=65535&Ce,!(me<=h);){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(0===(240&we)){for(ve=me,ye=we,ke=ge;Ce=r.distcode[ke+((f&(1<<ve+ye)-1)>>ve)],me=Ce>>>24,we=Ce>>>16&255,ge=65535&Ce,!(ve+me<=h);){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}f>>>=ve,h-=ve,r.back+=ve}if(f>>>=me,h-=me,r.back+=me,64&we){e.msg="invalid distance code",r.mode=fe;break}r.offset=ge,r.extra=15&we,r.mode=ie;case ie:if(r.extra){for(Ee=r.extra;h<Ee;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}r.offset+=f&(1<<r.extra)-1,f>>>=r.extra,h-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",
r.mode=fe;break}r.mode=se;case se:if(0===d)break e;if(m=b-d,r.offset>m){if(m=r.offset-m,m>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=fe;break}m>r.wnext?(m-=r.wnext,w=r.wsize-m):w=r.wnext-m,m>r.length&&(m=r.length),be=r.window}else be=a,w=s-r.offset,m=r.length;m>d&&(m=d),d-=m,r.length-=m;do a[s++]=be[w++];while(--m);0===r.length&&(r.mode=ne);break;case le:if(0===d)break e;a[s++]=r.length,d--,r.mode=ne;break;case de:if(r.wrap){for(;h<32;){if(0===l)break e;l--,f|=o[i++]<<h,h+=8}if(b-=d,e.total_out+=b,r.total+=b,b&&(e.adler=r.check=r.flags?y(r.check,a,b,s-b):v(r.check,a,b,s-b)),b=d,(r.flags?f:n(f))!==r.check){e.msg="incorrect data check",r.mode=fe;break}f=0,h=0}r.mode=ue;case ue:if(r.wrap&&r.flags){for(;h<32;){if(0===l)break e;l--,f+=o[i++]<<h,h+=8}if(f!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=fe;break}f=0,h=0}r.mode=ce;case ce:_e=R;break e;case fe:_e=H;break e;case he:return A;case pe:default:return O}return e.next_out=s,e.avail_out=d,e.next_in=i,e.avail_in=l,r.hold=f,r.bits=h,(r.wsize||b!==e.avail_out&&r.mode<fe&&(r.mode<de||t!==C))&&c(e,e.output,e.next_out,b-e.avail_out)?(r.mode=he,A):(p-=e.avail_in,b-=e.avail_out,e.total_in+=p,e.total_out+=b,r.total+=b,r.wrap&&b&&(e.adler=r.check=r.flags?y(r.check,a,b,e.next_out-b):v(r.check,a,b,e.next_out-b)),e.data_type=r.bits+(r.last?64:0)+(r.mode===K?128:0)+(r.mode===re||r.mode===Q?256:0),(0===p&&0===b||t===C)&&_e===T&&(_e=I),_e)}function h(e){if(!e||!e.state)return O;var t=e.state;return t.window&&(t.window=null),e.state=null,T}function p(e,t){var r;return e&&e.state?(r=e.state,0===(2&r.wrap)?O:(r.head=t,t.done=!1,T)):O}function b(e,t){var r,n,o,a=t.length;return e&&e.state?(r=e.state,0!==r.wrap&&r.mode!==X?O:r.mode===X&&(n=1,n=v(n,t,a,0),n!==r.check)?H:(o=c(e,t,a,a))?(r.mode=he,A):(r.havedict=1,T)):O}var m,w,g=e("../utils/common"),v=e("./adler32"),y=e("./crc32"),k=e("./inffast"),x=e("./inftrees"),_=0,S=1,E=2,C=4,U=5,L=6,T=0,R=1,B=2,O=-2,H=-3,A=-4,I=-5,N=8,D=1,z=2,F=3,P=4,Z=5,M=6,j=7,W=8,q=9,G=10,X=11,K=12,Y=13,V=14,Q=15,J=16,$=17,ee=18,te=19,re=20,ne=21,oe=22,ae=23,ie=24,se=25,le=26,de=27,ue=28,ce=29,fe=30,he=31,pe=32,be=852,me=592,we=15,ge=we,ve=!0;r.inflateReset=i,r.inflateReset2=s,r.inflateResetKeep=a,r.inflateInit=d,r.inflateInit2=l,r.inflate=f,r.inflateEnd=h,r.inflateGetHeader=p,r.inflateSetDictionary=b,r.inflateInfo="pako inflate (from Nodeca project)"},"zlib/constants.js":function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},"zlib/messages.js":function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},"zlib/zstream.js":function(e,t,r){"use strict";function n(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}t.exports=n},"zlib/gzheader.js":function(e,t,r){"use strict";function n(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}t.exports=n},"zlib/adler32.js":function(e,t,r){"use strict";function n(e,t,r,n){for(var o=65535&e|0,a=e>>>16&65535|0,i=0;0!==r;){i=r>2e3?2e3:r,r-=i;do o=o+t[n++]|0,a=a+o|0;while(--i);o%=65521,a%=65521}return o|a<<16|0}t.exports=n},"zlib/crc32.js":function(e,t,r){"use strict";function n(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}function o(e,t,r,n){var o=a,i=n+r;e^=-1;for(var s=n;s<i;s++)e=e>>>8^o[255&(e^t[s])];return e^-1}var a=n();t.exports=o},"zlib/inffast.js":function(e,t,r){"use strict";var n=30,o=12;t.exports=function(e,t){var r,a,i,s,l,d,u,c,f,h,p,b,m,w,g,v,y,k,x,_,S,E,C,U,L;r=e.state,a=e.next_in,U=e.input,i=a+(e.avail_in-5),s=e.next_out,L=e.output,l=s-(t-e.avail_out),d=s+(e.avail_out-257),u=r.dmax,c=r.wsize,f=r.whave,h=r.wnext,p=r.window,b=r.hold,m=r.bits,w=r.lencode,g=r.distcode,v=(1<<r.lenbits)-1,y=(1<<r.distbits)-1;e:do{m<15&&(b+=U[a++]<<m,m+=8,b+=U[a++]<<m,m+=8),k=w[b&v];t:for(;;){if(x=k>>>24,b>>>=x,m-=x,x=k>>>16&255,0===x)L[s++]=65535&k;else{if(!(16&x)){if(0===(64&x)){k=w[(65535&k)+(b&(1<<x)-1)];continue t}if(32&x){r.mode=o;break e}e.msg="invalid literal/length code",r.mode=n;break e}_=65535&k,x&=15,x&&(m<x&&(b+=U[a++]<<m,m+=8),_+=b&(1<<x)-1,b>>>=x,m-=x),m<15&&(b+=U[a++]<<m,m+=8,b+=U[a++]<<m,m+=8),k=g[b&y];r:for(;;){if(x=k>>>24,b>>>=x,m-=x,x=k>>>16&255,!(16&x)){if(0===(64&x)){k=g[(65535&k)+(b&(1<<x)-1)];continue r}e.msg="invalid distance code",r.mode=n;break e}if(S=65535&k,x&=15,m<x&&(b+=U[a++]<<m,m+=8,m<x&&(b+=U[a++]<<m,m+=8)),S+=b&(1<<x)-1,S>u){e.msg="invalid distance too far back",r.mode=n;break e}if(b>>>=x,m-=x,x=s-l,S>x){if(x=S-x,x>f&&r.sane){e.msg="invalid distance too far back",r.mode=n;break e}if(E=0,C=p,0===h){if(E+=c-x,x<_){_-=x;do L[s++]=p[E++];while(--x);E=s-S,C=L}}else if(h<x){if(E+=c+h-x,x-=h,x<_){_-=x;do L[s++]=p[E++];while(--x);if(E=0,h<_){x=h,_-=x;do L[s++]=p[E++];while(--x);E=s-S,C=L}}}else if(E+=h-x,x<_){_-=x;do L[s++]=p[E++];while(--x);E=s-S,C=L}for(;_>2;)L[s++]=C[E++],L[s++]=C[E++],L[s++]=C[E++],_-=3;_&&(L[s++]=C[E++],_>1&&(L[s++]=C[E++]))}else{E=s-S;do L[s++]=L[E++],L[s++]=L[E++],L[s++]=L[E++],_-=3;while(_>2);_&&(L[s++]=L[E++],_>1&&(L[s++]=L[E++]))}break}}break}}while(a<i&&s<d);_=m>>3,a-=_,m-=_<<3,b&=(1<<m)-1,e.next_in=a,e.next_out=s,e.avail_in=a<i?5+(i-a):5-(a-i),e.avail_out=s<d?257+(d-s):257-(s-d),r.hold=b,r.bits=m}},"zlib/inftrees.js":function(e,t,r){"use strict";var n=e("../utils/common"),o=15,a=852,i=592,s=0,l=1,d=2,u=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],c=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],f=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],h=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,p,b,m,w,g){var v,y,k,x,_,S,E,C,U,L=g.bits,T=0,R=0,B=0,O=0,H=0,A=0,I=0,N=0,D=0,z=0,F=null,P=0,Z=new n.Buf16(o+1),M=new n.Buf16(o+1),j=null,W=0;for(T=0;T<=o;T++)Z[T]=0;for(R=0;R<p;R++)Z[t[r+R]]++;for(H=L,O=o;O>=1&&0===Z[O];O--);if(H>O&&(H=O),0===O)return b[m++]=20971520,b[m++]=20971520,g.bits=1,0;for(B=1;B<O&&0===Z[B];B++);for(H<B&&(H=B),N=1,T=1;T<=o;T++)if(N<<=1,N-=Z[T],N<0)return-1;if(N>0&&(e===s||1!==O))return-1;for(M[1]=0,T=1;T<o;T++)M[T+1]=M[T]+Z[T];for(R=0;R<p;R++)0!==t[r+R]&&(w[M[t[r+R]]++]=R);if(e===s?(F=j=w,S=19):e===l?(F=u,P-=257,j=c,W-=257,S=256):(F=f,j=h,S=-1),z=0,R=0,T=B,_=m,A=H,I=0,k=-1,D=1<<H,x=D-1,e===l&&D>a||e===d&&D>i)return 1;for(;;){E=T-I,w[R]<S?(C=0,U=w[R]):w[R]>S?(C=j[W+w[R]],U=F[P+w[R]]):(C=96,U=0),v=1<<T-I,y=1<<A,B=y;do y-=v,b[_+(z>>I)+y]=E<<24|C<<16|U|0;while(0!==y);for(v=1<<T-1;z&v;)v>>=1;if(0!==v?(z&=v-1,z+=v):z=0,R++,0===--Z[T]){if(T===O)break;T=t[r+w[R]]}if(T>H&&(z&x)!==k){for(0===I&&(I=H),_+=B,A=T-I,N=1<<A;A+I<O&&(N-=Z[A+I],!(N<=0));)A++,N<<=1;if(D+=1<<A,e===l&&D>a||e===d&&D>i)return 1;k=z&x,b[k]=H<<24|A<<16|_-m|0}}return 0!==z&&(b[_+z]=T-I<<24|64<<16|0),g.bits=H,0}}};for(var r in t)t[r].folder=r.substring(0,r.lastIndexOf("/")+1);var n=function(e){var r=[];return e=e.split("/").every(function(e){return".."==e?r.pop():"."==e||""==e||r.push(e)})?r.join("/"):null,e?t[e]||t[e+".js"]||t[e+"/index.js"]:null},o=function(e,t){return e?n(e.folder+"node_modules/"+t)||o(e.parent,t):null},a=function(e,t){var r=t.match(/^\//)?null:e?t.match(/^\.\.?\//)?n(e.folder+t):o(e,t):n(t);if(!r)throw"module not found: "+t;return r.exports||(r.parent=e,r(a.bind(null,r),r,r.exports={})),r.exports};return a(null,e)},decompress:function(e){this.exports||(this.exports=this.require("inflate.js"));try{return this.exports.inflate(e)}catch(e){}},hasUnityMarker:function(e){var t=10,r="UnityWeb Compressed Content (gzip)";if(t>e.length||31!=e[0]||139!=e[1])return!1;var n=e[3];if(4&n){if(t+2>e.length)return!1;if(t+=2+e[t]+(e[t+1]<<8),t>e.length)return!1}if(8&n){for(;t<e.length&&e[t];)t++;if(t+1>e.length)return!1;t++}return 16&n&&String.fromCharCode.apply(null,e.subarray(t,t+r.length+1))==r+"\0"}}};return new Promise(function(e,t){f.SystemInfo.hasWebGL?1==f.SystemInfo.hasWebGL?t('Your browser does not support graphics API "WebGL 2.0" which is required for this content.'):f.SystemInfo.hasWasm?(1==f.SystemInfo.hasWebGL&&f.print('Warning: Your browser does not support "WebGL 2.0" Graphics API, switching to "WebGL 1.0"'),f.startupErrorHandler=t,r(0),f.postRun.push(function(){r(1),delete f.startupErrorHandler,e(w)}),c()):t("Your browser does not support WebAssembly."):t("Your browser does not support WebGL.")})}

    /*
>>>>>>> 90e099003a751295c755e808c6665f08982cd23c
    MICROPHONE PRO
    CURRENT VERSION 3.0.1
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE JANUARY 30 2022
*/

class UnityWebGLTools {
<<<<<<< HEAD
  static callUnityCallback(callback, object) {
    document.callUnityCallback(callback, object);
  }

  static objectToJSON(object) {
    return JSON.stringify(object);
  }

  static getPtrFromString(str) {
    return document.getPtrFromString(str);
  }

  static getStringFromPtr(ptr) {
    return document.getStringFromPtr(ptr);
  }

  static isMobileDevice() {
    return !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
      navigator.userAgent || ""
    );
  }

  static isEdge() {
    return (
      navigator.userAgent.indexOf("Edge") !== -1 &&
      (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)
    );
  }

  static isOpera() {
    return !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
  }

  static isFirefox() {
    return (
      navigator.userAgent.toLowerCase().indexOf("firefox") > -1 &&
      "netscape" in window &&
      / rv:/.test(navigator.userAgent)
    );
  }

  static isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  static isChrome() {
    return !!window.chrome && !isOpera;
  }

  static isIE() {
    return (
      typeof document !== "undefined" && !!document.documentMode && !isEdge
    );
  }
=======
    static callUnityCallback(callback, object){
        document.callUnityCallback(callback, object);
    }

    static objectToJSON(object){
        return JSON.stringify(object);
    }

    static getPtrFromString(str) {
        return document.getPtrFromString(str);
    }

    static getStringFromPtr(ptr) {
        return document.getStringFromPtr(ptr);
    }

    static isMobileDevice() { return !!(/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent || '')); }

    static isEdge() { return navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob); }

    static isOpera() { return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; }

    static isFirefox() { return navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && ('netscape' in window) && / rv:/.test(navigator.userAgent); }

    static isSafari() { return /^((?!chrome|android).)*safari/i.test(navigator.userAgent); }

    static isChrome() { return !!window.chrome && !isOpera; }
    
    static isIE() { return typeof document !== 'undefined' && !!document.documentMode && !isEdge; }
>>>>>>> 90e099003a751295c755e808c6665f08982cd23c
}

/*
    MICROPHONE PRO
    CURRENT VERSION 3.0.1
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE JANUARY 30 2022
*/

class UnityMicrophone {
<<<<<<< HEAD
  static DEFAULT_FREQUENCY = 44100;

  static INSTANCE = null;

  static AUDIO_WORKLET = false;

  constructor(version, worklet) {
    UnityMicrophone.INSTANCE = this;

    UnityMicrophone.AUDIO_WORKLET = worklet === 1 ? true : false;
    this.unityVersion = version;
    this.recording = false;
    this.frequency = UnityMicrophone.DEFAULT_FREQUENCY;
    this.devicesList = [];
    this.audioContext = new (window.AudioContext ||
      window.webKitAudioContext)();
    this.recordingDevice = null;
    this.recordingSource = null;
    this.recordingBuffer = null;
    this.scriptProcessorNode = null;
    this.recordingBufferCallback = null;
    this.recordingEndedCallback = null;
    this.recordingStartedCallback = null;

    if (UnityMicrophone.AUDIO_WORKLET === true) {
      this.audioContext.audioWorklet
        .addModule("./Native/mic-worklet-processor.js")
        .then(() => {
          console.log("worklet module registered");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setInterval(() => {
      if (
        this.audioContext.state === "suspended" ||
        this.audioContext.state === "interrupted"
      ) {
        console.log("resuming audioContext. state: " + this.audioContext.state);
        this.audioContext.resume();
      }
    }, 1000);
  }

  devices(callback) {
    var unityCallback = callback;

    this.refreshDevicesList((status, error) => {
      if (status === true) {
        UnityWebGLTools.callUnityCallback(unityCallback, {
          status: true,
          type: "devices",
          data: UnityWebGLTools.objectToJSON({
            array: UnityMicrophone.INSTANCE.devicesList,
          }),
        });
      } else {
        UnityWebGLTools.callUnityCallback(unityCallback, {
          status: false,
          type: "devices",
          data: error,
        });
      }
    });
  }

  end(deviceId, callback) {
    // doesnt matter which device id
    if (!this.recording) return;

    this.recordingEndedCallback = callback;

    if (UnityMicrophone.AUDIO_WORKLET === true) {
      const isRecording =
        this.scriptProcessorNode.parameters.get("isRecording");
      isRecording.setValueAtTime(0, this.audioContext.currentTime);
    } else {
      this.recordEnded();
    }
  }

  getDeviceCaps(deviceId) {
    // doesnt matter which device id
    var array = [UnityWebGLTools.isSafari() ? 44100 : 16000, 48000];
    return UnityWebGLTools.getPtrFromString(
      UnityWebGLTools.objectToJSON({ array: array })
    );
  }

  isRecording(deviceId) {
    // doesnt matter which device id
    return this.recording ? 1 : 0;
  }

  start(deviceId, frequency, callback) {
    if (this.recording) return;

    this.frequency = frequency;
    this.recordingDevice = this.devicesList.find(
      (item) => item.deviceId === deviceId
    );
    this.recordingBuffer = [];

    this.recordingStartedCallback = callback;

    if (navigator.mediaDevices.getUserMedia) {
      var constraints = null;

      if (
        deviceId === null ||
        !navigator.mediaDevices.getSupportedConstraints().deviceId
      ) {
        constraints = {
          audio: true,
        };
      } else {
        constraints = {
          audio: {
            deviceId: {
              exact: deviceId,
            },
            echoCancellation: true,
          },
        };
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => this.getUserMediaSuccessForRecording(stream))
        .catch((error) => this.getUserMediaFailedForRecording(error));
    }
  }

  requestPermission(callback) {
    // doesnt matter which device
    var unityCallback = callback;

    if (this.isPermissionGranted(null)) {
      UnityWebGLTools.callUnityCallback(unityCallback, {
        status: true,
        type: "requestPermission",
        data: "granted",
      });
      return;
    }

    if (this.isSupported()) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(getUserMediaSuccess)
        .catch(getUserMediaFailed);

      function getUserMediaSuccess(stream) {
        UnityWebGLTools.callUnityCallback(unityCallback, {
          status: true,
          type: "requestPermission",
          data: "granted",
        });
      }

      function getUserMediaFailed(error) {
        UnityWebGLTools.callUnityCallback(unityCallback, {
          status: false,
          type: "requestPermission",
          data: error.message,
        });
      }
    } else {
      UnityWebGLTools.callUnityCallback(unityCallback, {
        status: false,
        type: "requestPermission",
        data: "mediaDevices.getUserMedia isn't supported",
      });
    }
  }

  isPermissionGranted(callback) {
    var unityCallback = callback;

    this.refreshDevicesList((status, error) => {
      if (status === true) {
        if (this.devicesList.length > 0) {
          if (!this.devicesList[0].isGrantedAccess) {
            UnityWebGLTools.callUnityCallback(unityCallback, {
              status: false,
              type: "isPermissionGranted",
              data: "denied",
            });
          } else {
            UnityWebGLTools.callUnityCallback(unityCallback, {
              status: true,
              type: "isPermissionGranted",
              data: "granted",
            });
          }
        } else {
          UnityWebGLTools.callUnityCallback(unityCallback, {
            status: false,
            type: "isPermissionGranted",
            data: "no devices connected",
          });
        }
      } else {
        UnityWebGLTools.callUnityCallback(unityCallback, {
          status: false,
          type: "isPermissionGranted",
          data: error,
        });
      }
    });
  }

  recordEnded() {
    if (!this.recording) return;

    //this.download("recordedAudio.txt", JSON.stringify(this.recordingBuffer));

    if (this.recordingSource.mediaStream) {
      this.recordingSource.mediaStream
        .getTracks()
        .forEach((track) => track.stop());
    }

    this.recordingSource.disconnect(this.scriptProcessorNode);
    this.scriptProcessorNode.disconnect();
    this.scriptProcessorNode = null;
    this.recordingSource = null;
    this.recordingBuffer = null;
    this.recordingDevice = null;
    this.recording = false;

    UnityWebGLTools.callUnityCallback(
      UnityMicrophone.INSTANCE.recordingEndedCallback,
      { status: true, type: "end", data: "recording ended" }
    );
  }

  download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  isSupported() {
    return !!navigator.mediaDevices.getUserMedia ? 1 : 0;
  }

  getUserMediaSuccessForRecording(stream) {
    this.recordingBuffer = [];

    this.recordingSource = this.audioContext.createMediaStreamSource(stream);

    if (UnityMicrophone.AUDIO_WORKLET === true) {
      this.scriptProcessorNode = new window.AudioWorkletNode(
        this.audioContext,
        "microphone-worklet"
      );
    } else {
      this.scriptProcessorNode = this.audioContext.createScriptProcessor(
        4096,
        1,
        1
      );
    }

    this.recordingSource.connect(this.scriptProcessorNode);
    this.scriptProcessorNode.connect(this.audioContext.destination);

    if (UnityMicrophone.AUDIO_WORKLET === true) {
      this.scriptProcessorNode.port.onmessage = (e) =>
        this.audioNodeWorkletEventHandler(e);

      const isRecording =
        this.scriptProcessorNode.parameters.get("isRecording");
      isRecording.setValueAtTime(1, this.audioContext.currentTime);
    } else {
      this.scriptProcessorNode.onaudioprocess = (e) =>
        this.audioNodeEventHandler(e);

      UnityWebGLTools.callUnityCallback(this.recordingStartedCallback, {
        status: true,
        type: "start",
        data: "recording started",
      });
    }

    this.recording = true;
  }

  getUserMediaFailedForRecording(error) {
    UnityWebGLTools.callUnityCallback(this.recordingStartedCallback, {
      status: false,
      type: "start",
      data: error,
    });
  }

  // throws callback when resampling is complete
  changeBitrate(inputAudioBuffer, targetFrequency, callback) {
    if (inputAudioBuffer === null) {
      callback(false, null);
      return;
    }

    if (inputAudioBuffer.sampleRate === targetFrequency) {
      callback(true, inputAudioBuffer.getChannelData(0));
      return;
    }

    if (
      inputAudioBuffer.length < 64 ||
      inputAudioBuffer.length > targetFrequency * 4
    ) {
      callback(false, null);
      return;
    }

    if (this.targetFrequency < inputAudioBuffer.sampleRate) {
      this.downsampleBitrate(
        Object.values(inputAudioBuffer.getChannelData(0)),
        inputAudioBuffer.sampleRate,
        this.targetFrequency,
        callback
      );
      return;
    }

    try {
      var OfflineAudioContext =
        window.OfflineAudioContext || window.webkitOfflineAudioContext;
      var offlineCtx = new OfflineAudioContext(
        inputAudioBuffer.numberOfChannels,
        inputAudioBuffer.duration *
          inputAudioBuffer.numberOfChannels *
          targetFrequency,
        targetFrequency
      );
      var buffer = offlineCtx.createBuffer(
        inputAudioBuffer.numberOfChannels,
        inputAudioBuffer.length,
        inputAudioBuffer.sampleRate
      );
      // copy the source data into the offline AudioBuffer
      for (
        var channel = 0;
        channel < inputAudioBuffer.numberOfChannels;
        channel++
      ) {
        buffer.copyToChannel(inputAudioBuffer.getChannelData(channel), channel);
      }
      // resample it from the beginning.
      var source = offlineCtx.createBufferSource();
      source.buffer = inputAudioBuffer;
      source.connect(offlineCtx.destination);
      source.start(0);
      offlineCtx.oncomplete = function (e) {
        callback(true, e.renderedBuffer.getChannelData(0));
      };
      offlineCtx.startRendering();
    } catch (error) {
      console.error(error);
      callback(false, null);
    }
  }

  downsampleBitrate(samples, sourceFrequency, targetFrequency, callback) {
    if (samples === null) {
      callback(false, samples);
      return;
    }

    if (sourceFrequency === targetFrequency) {
      callback(true, samples);
      return;
    }

    var sampleRateRatio = sourceFrequency / targetFrequency;
    var newLength = Math.round(samples.length / sampleRateRatio);
    var result = new Float32Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (
        var i = offsetBuffer;
        i < nextOffsetBuffer && i < samples.length;
        i++
      ) {
        accum += samples[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    callback(true, result);
  }

  // returns block of samples from recorded buffer
  getRecordingBuffer(callback) {
    if (!this.isRecording()) {
      UnityWebGLTools.callUnityCallback(unityCallback, {
        status: false,
        type: "getRecordingBuffer",
        data: "recording isnt started",
      });
      return;
    }

    var unityCallback = callback;
    UnityWebGLTools.callUnityCallback(unityCallback, {
      status: true,
      type: "getRecordingBuffer",
      data: UnityWebGLTools.objectToJSON({ array: this.recordingBuffer }),
    });
  }

  setRecordingBufferCallback(callback) {
    this.recordingBufferCallback = callback;
  }

  // handling media stream and filling buffer
  audioNodeEventHandler(e) {
    if (!this.recording) return;

    this.changeBitrate(e.inputBuffer, this.frequency, (status, channelData) => {
      if (status === true) {
        if (!this.recording) return;

        this.recordingBuffer = this.recordingBuffer.concat(
          Object.values(channelData)
        );

        UnityWebGLTools.callUnityCallback(this.recordingBufferCallback, {
          data: channelData,
          length: channelData.length,
        });
      } else {
        console.log("resampling cannot be done");
      }
    });
  }

  audioNodeWorkletEventHandler(e) {
    switch (e.data.eventType) {
      case "data":
        {
          const audioData = e.data.audioBuffer;
          const inputBuffer = this.audioContext.createBuffer(
            1,
            audioData.length,
            this.audioContext.sampleRate
          );
          const nowBuffering = inputBuffer.getChannelData(0);
          for (var i = 0; i < audioData.length; i++) {
            nowBuffering[i] = audioData[i];
          }

          this.changeBitrate(
            inputBuffer,
            this.frequency,
            (status, channelData) => {
              if (status === true) {
                if (!this.recording) return;

                this.recordingBuffer = this.recordingBuffer.concat(channelData);

                UnityWebGLTools.callUnityCallback(
                  this.recordingBufferCallback,
                  {
                    data: channelData,
                    length: channelData.length,
                  }
                );
              } else {
                console.log("resampling cannot be done");
              }
            }
          );
        }
        break;
      case "stop":
        {
          this.recordEnded();
        }
        break;
      case "start":
        {
          UnityWebGLTools.callUnityCallback(this.recordingStartedCallback, {
            status: true,
            type: "start",
            data: "recording started",
          });
        }
        break;
    }
  }

  // refreshes devices list
  refreshDevicesList(callback) {
    if (!navigator.mediaDevices.enumerateDevices) {
      callback(false, "enumerateDevices() not supported");
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        var outputDevicesArr = [];

        for (var i = 0; i < devices.length; i++) {
          if (devices[i].kind === "audioinput") {
            var deviceInfo = {
              deviceId: devices[i].deviceId,
              kind: devices[i].kind,
              label: devices[i].label,
              groupId: devices[i].groupId,
              isGrantedAccess: true,
            };

            if (
              deviceInfo.label === undefined ||
              deviceInfo.label === null ||
              deviceInfo.label.length === 0
            ) {
              deviceInfo.label = "Microphone " + (outputDevicesArr.length + 1);
              deviceInfo.isGrantedAccess = false;
            }

            outputDevicesArr.push(deviceInfo);
          }
        }

        UnityMicrophone.INSTANCE.devicesList = outputDevicesArr;

        callback(true, null);
      })
      .catch(function (error) {
        callback(
          false,
          "get devices exception: " +
            error.name +
            ": " +
            error.message +
            "; " +
            error.stack
        );
      });
  }
=======

    static DEFAULT_FREQUENCY = 44100;

    static INSTANCE = null;

    static AUDIO_WORKLET = false;

    constructor(version, worklet) {
        UnityMicrophone.INSTANCE = this;

        UnityMicrophone.AUDIO_WORKLET = worklet === 1 ? true : false;
        this.unityVersion = version;
        this.recording = false;
        this.frequency = UnityMicrophone.DEFAULT_FREQUENCY;
        this.devicesList = [];
        this.audioContext = new (window.AudioContext || window.webKitAudioContext)();
        this.recordingDevice = null;
        this.recordingSource = null;
        this.recordingBuffer = null;
        this.scriptProcessorNode = null;
        this.recordingBufferCallback = null;
        this.recordingEndedCallback = null;
        this.recordingStartedCallback = null;

        if (UnityMicrophone.AUDIO_WORKLET === true) {
            this.audioContext.audioWorklet.addModule('./Native/mic-worklet-processor.js')
                .then(() => {
                    console.log("worklet module registered");
                }).catch((err) => {
                    console.log(err);
                });
        }

        setInterval(() => {
            if (this.audioContext.state === "suspended" || this.audioContext.state === "interrupted") {
                console.log("resuming audioContext. state: " + this.audioContext.state);
                this.audioContext.resume();
            }
        }, 1000);
    }

    devices(callback) {
        var unityCallback = callback;

        this.refreshDevicesList((status, error) => {
            if (status === true) {
                UnityWebGLTools.callUnityCallback(unityCallback, { "status": true, "type": "devices", "data": UnityWebGLTools.objectToJSON({ "array": UnityMicrophone.INSTANCE.devicesList }) });
            } else {
                UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "devices", "data": error });
            }
        });
    }

    end(deviceId, callback) {
        // doesnt matter which device id
        if (!this.recording)
            return;

        this.recordingEndedCallback = callback;

        if (UnityMicrophone.AUDIO_WORKLET === true) {
            const isRecording = this.scriptProcessorNode.parameters.get('isRecording');
            isRecording.setValueAtTime(0, this.audioContext.currentTime);
        } else {
            this.recordEnded();
        }
    }

    getDeviceCaps(deviceId) {
        // doesnt matter which device id
        var array = [(UnityWebGLTools.isSafari() ? 44100 : 16000), 48000];
        return UnityWebGLTools.getPtrFromString(UnityWebGLTools.objectToJSON({ "array": array }))
    }

    isRecording(deviceId) {
        // doesnt matter which device id
        return this.recording ? 1 : 0;
    }

    start(deviceId, frequency, callback) {
        if (this.recording)
            return;

        this.frequency = frequency;
        this.recordingDevice = this.devicesList.find(item => item.deviceId === deviceId);
        this.recordingBuffer = [];

        this.recordingStartedCallback = callback;

        if (navigator.mediaDevices.getUserMedia) {
            var constraints = null;

            if (deviceId === null || !navigator.mediaDevices.getSupportedConstraints().deviceId) {
                constraints = {
                    audio: true,
                };
            } else {
                constraints = {
                    audio: {
                        deviceId: {
                            exact: deviceId
                        },
                        echoCancellation: true
                    }
                };
            }

            navigator.mediaDevices.getUserMedia(constraints).then((stream) => this.getUserMediaSuccessForRecording(stream)).catch((error) => this.getUserMediaFailedForRecording(error));
        }
    }

    requestPermission(callback) {
        // doesnt matter which device
        var unityCallback = callback;

        if (this.isPermissionGranted(null)) {
            UnityWebGLTools.callUnityCallback(unityCallback, { "status": true, "type": "requestPermission", "data": "granted" });
            return;
        }

        if (this.isSupported()) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(getUserMediaSuccess).catch(getUserMediaFailed);

            function getUserMediaSuccess(stream) {
                UnityWebGLTools.callUnityCallback(unityCallback, { "status": true, "type": "requestPermission", "data": "granted" });
            }

            function getUserMediaFailed(error) {
                UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "requestPermission", "data": error.message });
            }
        } else {
            UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "requestPermission", "data": "mediaDevices.getUserMedia isn't supported" });
        }
    }

    isPermissionGranted(callback) {
        var unityCallback = callback;

        this.refreshDevicesList((status, error) => {
            if (status === true) {
                if (this.devicesList.length > 0) {
                    if (!this.devicesList[0].isGrantedAccess) {
                        UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "isPermissionGranted", "data": "denied" });
                    } else {
                        UnityWebGLTools.callUnityCallback(unityCallback, { "status": true, "type": "isPermissionGranted", "data": "granted" });
                    }
                } else {
                    UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "isPermissionGranted", "data": "no devices connected" });
                }
            } else {
                UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "isPermissionGranted", "data": error });
            }
        });
    }

    recordEnded(){
        if(!this.recording)
            return;

        //this.download("recordedAudio.txt", JSON.stringify(this.recordingBuffer));

        if (this.recordingSource.mediaStream) {
            this.recordingSource.mediaStream
              .getTracks()
              .forEach((track) => track.stop());
        }

        this.recordingSource.disconnect(this.scriptProcessorNode);
        this.scriptProcessorNode.disconnect();
        this.scriptProcessorNode = null;
        this.recordingSource = null;
        this.recordingBuffer = null;
        this.recordingDevice = null;
        this.recording = false;

        UnityWebGLTools.callUnityCallback(UnityMicrophone.INSTANCE.recordingEndedCallback, { "status": true, "type": "end", "data": "recording ended" });
    }

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    isSupported() {
        return (!!(navigator.mediaDevices.getUserMedia)) ? 1 : 0;
    }

    getUserMediaSuccessForRecording(stream) {
        this.recordingBuffer = [];

        this.recordingSource = this.audioContext.createMediaStreamSource(stream);

        if (UnityMicrophone.AUDIO_WORKLET === true) {
            this.scriptProcessorNode = new window.AudioWorkletNode(this.audioContext, 'microphone-worklet');
        } else {
            this.scriptProcessorNode = this.audioContext.createScriptProcessor(4096, 1, 1);
        }

        this.recordingSource.connect(this.scriptProcessorNode);
        this.scriptProcessorNode.connect(this.audioContext.destination);
        
        if (UnityMicrophone.AUDIO_WORKLET === true) {
            this.scriptProcessorNode.port.onmessage = (e) => this.audioNodeWorkletEventHandler(e);

            const isRecording = this.scriptProcessorNode.parameters.get('isRecording');
            isRecording.setValueAtTime(1, this.audioContext.currentTime);
        } else {
            this.scriptProcessorNode.onaudioprocess = (e) => this.audioNodeEventHandler(e);

            UnityWebGLTools.callUnityCallback(this.recordingStartedCallback, { "status": true, "type": "start", "data": "recording started" });
        }

        this.recording = true;
    }

    getUserMediaFailedForRecording(error) {
        UnityWebGLTools.callUnityCallback(this.recordingStartedCallback, { "status": false, "type": "start", "data": error });
    }

    // throws callback when resampling is complete
    changeBitrate(inputAudioBuffer, targetFrequency, callback) {
        
        if (inputAudioBuffer === null) {
            callback(false, null);
            return;
        }

        if (inputAudioBuffer.sampleRate === targetFrequency) {
            callback(true, inputAudioBuffer.getChannelData(0));
            return;
        }

        if (inputAudioBuffer.length < 64 || inputAudioBuffer.length > targetFrequency * 4) {
            callback(false, null);
            return;
        }

        if (this.targetFrequency < inputAudioBuffer.sampleRate) {
            this.downsampleBitrate(Object.values(inputAudioBuffer.getChannelData(0)), inputAudioBuffer.sampleRate, this.targetFrequency, callback);
            return;
        }

        try{
            var OfflineAudioContext = (window.OfflineAudioContext || window.webkitOfflineAudioContext);
            var offlineCtx = new OfflineAudioContext(inputAudioBuffer.numberOfChannels, inputAudioBuffer.duration * inputAudioBuffer.numberOfChannels * targetFrequency, targetFrequency);
            var buffer = offlineCtx.createBuffer(inputAudioBuffer.numberOfChannels, inputAudioBuffer.length, inputAudioBuffer.sampleRate);
            // copy the source data into the offline AudioBuffer
            for (var channel = 0; channel < inputAudioBuffer.numberOfChannels; channel++) {
                buffer.copyToChannel(inputAudioBuffer.getChannelData(channel), channel);
            }
            // resample it from the beginning.
            var source = offlineCtx.createBufferSource();
            source.buffer = inputAudioBuffer;
            source.connect(offlineCtx.destination);
            source.start(0);
            offlineCtx.oncomplete = function (e) {
                callback(true, e.renderedBuffer.getChannelData(0));
            }
            offlineCtx.startRendering();
        } catch(error){
            console.error(error);
            callback(false, null);
        }
    }

    downsampleBitrate(samples, sourceFrequency, targetFrequency, callback){
        if (samples === null) {
            callback(false, samples);
            return;
        }

        if (sourceFrequency === targetFrequency) {
            callback(true, samples);
            return;
        }

        var sampleRateRatio = sourceFrequency / targetFrequency;
        var newLength = Math.round(samples.length / sampleRateRatio);
        var result = new Float32Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
            var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            var accum = 0,
            count = 0;
            for (var i = offsetBuffer; i < nextOffsetBuffer && i < samples.length; i++) {
                accum += samples[i];
                count++;
            }
            result[offsetResult] = accum / count;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }

        callback(true, result);
    }

    // returns block of samples from recorded buffer
    getRecordingBuffer(callback) {
        if (!this.isRecording()) {
            UnityWebGLTools.callUnityCallback(unityCallback, { "status": false, "type": "getRecordingBuffer", "data": "recording isnt started" });
            return;
        }

        var unityCallback = callback;
        UnityWebGLTools.callUnityCallback(unityCallback, { "status": true, "type": "getRecordingBuffer", "data": UnityWebGLTools.objectToJSON({ "array": this.recordingBuffer }) });
    }

    setRecordingBufferCallback(callback) {
        this.recordingBufferCallback = callback;
    }

    // handling media stream and filling buffer
    audioNodeEventHandler(e) { 
        if(!this.recording)
            return;

        this.changeBitrate(e.inputBuffer, this.frequency, (status, channelData) => {
            if (status === true) {
                if(!this.recording)
                    return;

                this.recordingBuffer = this.recordingBuffer.concat(Object.values(channelData));
                
                UnityWebGLTools.callUnityCallback(this.recordingBufferCallback, {
                    data: channelData,
                    length: channelData.length
                });
            } else {
                console.log("resampling cannot be done");
            }
        });
    }

    audioNodeWorkletEventHandler(e) {
        switch (e.data.eventType) {
            case "data":
                {
                    const audioData = e.data.audioBuffer;
                    const inputBuffer = this.audioContext.createBuffer(1, audioData.length, this.audioContext.sampleRate);
                    const nowBuffering = inputBuffer.getChannelData(0);
                    for (var i = 0; i < audioData.length; i++) {
                        nowBuffering[i] = audioData[i];
                    }

                    this.changeBitrate(inputBuffer, this.frequency, (status, channelData) => {
                        if (status === true) {

                            if (!this.recording)
                                return;

                            this.recordingBuffer = this.recordingBuffer.concat(channelData);

                            UnityWebGLTools.callUnityCallback(this.recordingBufferCallback, {
                                data: channelData,
                                length: channelData.length
                            });
                        } else {
                            console.log("resampling cannot be done");
                        }
                    });
                }
                break;
            case "stop":
                {
                    this.recordEnded();
                }
                break;
            case "start":
                {
                    UnityWebGLTools.callUnityCallback(this.recordingStartedCallback, { "status": true, "type": "start", "data": "recording started" });
                }
                break;
        }
    }

    // refreshes devices list
    refreshDevicesList(callback) {
        if (!navigator.mediaDevices.enumerateDevices) {
            callback(false, "enumerateDevices() not supported");
            return;
        }

        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                var outputDevicesArr = [];

                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].kind === "audioinput") {
                        var deviceInfo = {
                            deviceId: devices[i].deviceId,
                            kind: devices[i].kind,
                            label: devices[i].label,
                            groupId: devices[i].groupId,
                            isGrantedAccess: true
                        };

                        if (deviceInfo.label === undefined || deviceInfo.label === null || deviceInfo.label.length === 0) {
                            deviceInfo.label = "Microphone " + (outputDevicesArr.length + 1);
                            deviceInfo.isGrantedAccess = false;
                        }

                        outputDevicesArr.push(deviceInfo);
                    }
                }

                UnityMicrophone.INSTANCE.devicesList = outputDevicesArr;

                callback(true, null);
            })
            .catch(function (error) {
                callback(false, ("get devices exception: " + error.name + ": " + error.message + "; " + error.stack));
            });
    }
>>>>>>> 90e099003a751295c755e808c6665f08982cd23c
}

/*
    MICROPHONE PRO
    CURRENT VERSION 3.0.1
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE JANUARY 30 2022
*/

class MicrophoneWorkletProcessor extends AudioWorkletProcessor {
<<<<<<< HEAD
  static get parameterDescriptors() {
    return [
      {
        name: "isRecording",
        defaultValue: 0,
      },
    ];
  }

  constructor() {
    super();
    this._bufferSize = 4096;
    this._buffer = new Float32Array(this._bufferSize);
    this._initBuffer();

    this.recording = false;
  }

  _initBuffer() {
    this._bytesWritten = 0;
  }

  _isBufferEmpty() {
    return this._bytesWritten === 0;
  }

  _isBufferFull() {
    return this._bytesWritten === this._bufferSize;
  }

  _appendToBuffer(value) {
    if (this._isBufferFull()) {
      this._flush();
    }

    this._buffer[this._bytesWritten] = value;
    this._bytesWritten += 1;
  }

  _flush() {
    let buffer = this._buffer;
    if (this._bytesWritten < this._bufferSize) {
      buffer = buffer.slice(0, this._bytesWritten);
    }

    this.port.postMessage({
      eventType: "data",
      audioBuffer: buffer,
    });

    this._initBuffer();
  }

  _recordingStopped() {
    this.port.postMessage({
      eventType: "stop",
    });
    this.recording = false;
  }

  _recordingStarted() {
    this.port.postMessage({
      eventType: "start",
    });
    this.recording = true;
  }

  process(inputs, outputs, parameters) {
    const isRecordingValues = parameters.isRecording;

    for (let i = 0; i < isRecordingValues.length; i++) {
      const shouldRecord = isRecordingValues[i] === 1;

      if (shouldRecord && !this.recording) {
        this._recordingStarted();
      }

      if (!shouldRecord && !this._isBufferEmpty()) {
        this._flush();
      }

      if (!shouldRecord && this.recording) {
        this._recordingStopped();
      }

      if (this.recording) {
        if (inputs.length > 0) {
          if (inputs[0].length > 0) {
            this._appendToBuffer(inputs[0][0][i]);
          }
        }
      }
    }

    return true;
  }
}

registerProcessor("microphone-worklet", MicrophoneWorkletProcessor);
=======
    static get parameterDescriptors() {
        return [{
          name: 'isRecording',
          defaultValue: 0
        }];
      }
    
      constructor() {
        super();
        this._bufferSize = 4096;
        this._buffer = new Float32Array(this._bufferSize);
        this._initBuffer();

        this.recording = false;
      }
    
      _initBuffer() {
        this._bytesWritten = 0;
      }
    
      _isBufferEmpty() {
        return this._bytesWritten === 0;
      }
    
      _isBufferFull() {
        return this._bytesWritten === this._bufferSize;
      }
    
      _appendToBuffer(value) {
        if (this._isBufferFull()) {
          this._flush();
        }
    
        this._buffer[this._bytesWritten] = value;
        this._bytesWritten += 1;
      }
    
      _flush() {
        let buffer = this._buffer;
        if (this._bytesWritten < this._bufferSize) {
          buffer = buffer.slice(0, this._bytesWritten);
        }
    
        this.port.postMessage({
          eventType: 'data',
          audioBuffer: buffer
        });
    
        this._initBuffer();
      }
    
      _recordingStopped() {
        this.port.postMessage({
          eventType: 'stop'
        });
        this.recording = false;
      }

      _recordingStarted() {
        this.port.postMessage({
          eventType: 'start'
        });
        this.recording = true;
      }
    
      process(inputs, outputs, parameters) {
        const isRecordingValues = parameters.isRecording;           

        for (let i = 0; i < isRecordingValues.length; i++) {
          const shouldRecord = isRecordingValues[i] === 1;     

          if(shouldRecord && !this.recording){
            this._recordingStarted();
          }

          if (!shouldRecord && !this._isBufferEmpty()) {
            this._flush();  
          }

          if(!shouldRecord && this.recording){
            this._recordingStopped();
          }
      
          if (this.recording) {        
            if(inputs.length > 0){
                if(inputs[0].length > 0){
                  this._appendToBuffer(inputs[0][0][i]);
                }
            }
          }
        }
  
        return true;
      }
    }
    
    registerProcessor('microphone-worklet', MicrophoneWorkletProcessor);
>>>>>>> 90e099003a751295c755e808c6665f08982cd23c
