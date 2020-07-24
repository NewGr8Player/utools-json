"use strict";
var App = (function () {
    var a = {
        dom: {
            css: function (d, f, e) {
                d.style[f] = e
            }, show: function (d) {
                this.css(d, "display", "block")
            }, hide: function (d) {
                this.css(d, "display", "none")
            }, id: function (d) {
                return document.getElementById(d)
            }, klass: function (d) {
                return document.getElementsByClassName(d)
            }, stopEvent: function (d) {
                d.stopPropagation();
                d.preventDefault();
                return this
            }, matches: (function () {
                var d = document.createElement("div"),
                    e = d.matches || d.mozMatchesSelector || d.webkitMatchesSelector || d.oMatchesSelector || d.msMatchesSelector;
                return function (f, g) {
                    if (!e) {
                        return false
                    }
                    return e.call(g, f)
                }
            })(), closest: function (g, e) {
                var f = g, d = false;
                while (f && f !== document) {
                    if (this.matches(e, f)) {
                        d = f;
                        break
                    }
                    f = f.parentNode
                }
                return d
            }
        }, extend: function (f, d) {
            var e = {};
            for (name in f) {
                if (f.hasOwnProperty(name)) {
                    e[name] = d[name] ? d[name] : f[name]
                }
            }
            return e
        }, mixin: function (e, d) {
            for (var f in d) {
                if (d.hasOwnProperty(f)) {
                    e[f] = d[f]
                }
            }
        }, foreach: function (d, g) {
            for (var e = 0, f = d.length; e < f; e++) {
                g(d[e], e)
            }
        }, foreachReverse: function (d, f) {
            for (var e = d.length - 1; e >= 0; e--) {
                f(d[e], e)
            }
        }, inherits: (function () {
            var d = function () {
            };
            return function (f, e) {
                d.prototype = e.prototype;
                f.prototype = new d();
                f.prototype.constructor = f
            }
        })(), debug: (function () {
            var d = document.getElementById("debug");
            return function () {
                d.innerHTML = [].join.call(arguments, " ")
            }
        })(),
    };
    var c = function (e, d) {
        e.addEventListener("click", function (h) {
            var f = a.dom.closest(h.target, ".menu__item"), g = f ? f.dataset["action"] : null;
            if (g && g in d) {
                d[g]()
            }
        }, false)
    };

    function b(d) {
        var f = {
            closable: true,
            overlay: true,
            layout: "default",
            content_el: null,
            js_module: null,
            extra_button: false,
            extra_button_class_name: "",
            extra_button_event: null
        };
        var e = a.extend(f, d);
        var l = 10;
        this.content_el = e.content_el;
        var p = document.createElement("div"), m = document.createElement("div");
        p.className = "window";
        m.className = "window__content";
        if (e.overlay) {
            var g = b.create_overlay()
        }
        if (e.content_el.dataset["header"]) {
            var h = document.createElement("h4");
            h.className = "window__header";
            h.innerHTML = e.content_el.dataset["header"];
            p.appendChild(h)
        }
        p.appendChild(m);
        document.body.appendChild(p);
        if (e.content_el) {
            m.appendChild(e.content_el)
        }
        if (e.closable) {
            var k = document.createElement("div");
            k.className = "window__close-button";
            p.appendChild(k);
            k.addEventListener("click", i, false);
            g.addEventListener("click", i, false)
        }
        if (e.extra_button) {
            var j = document.createElement("div");
            j.className = e.extra_button_class_name;
            p.appendChild(j);
            if (typeof e.extra_button_event === "function") {
                j.addEventListener("click", e.extra_button_event, false)
            }
        }

        function n() {
            a.dom.show(p);
            if (g) {
                a.dom.show(g)
            }
            b.layers.push(this)
        }

        function i() {
            a.dom.hide(p);
            if (g) {
                a.dom.hide(g)
            }
            b.layers.pop(this)
        }

        this.show = n;
        this.hide = i;
        this.set_layer = function (q) {
            a.dom.css(p, "zIndex", l + q * 2 + 1);
            if (e.overlay) {
                a.dom.css(g, "zIndex", l + q * 2)
            }
        };
        if (typeof e.js_module === "function") {
            var o = e.js_module.call(this, this);
            a.mixin(this, o)
        }
    }

    b.layers = (function () {
        var d = [], e = 0;
        return {
            push: function (f) {
                f.set_layer(++e);
                d.push(f)
            }, pop: function (f) {
                if (f) {
                    d.splice(d.indexOf(f), 1)
                } else {
                    d.pop()
                }
                e--
            }, clear: function () {
                while (d.length) {
                    this.pop()
                }
            }
        }
    })();
    b.create_overlay = function () {
        var d = document.createElement("div");
        d.className = "overlay";
        a.dom.hide(d);
        document.body.appendChild(d);
        return d
    };
    return {utils: a, Menu: c, Window: b}
})();