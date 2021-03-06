var jsonTree = (function () {
    var i = {
        getClass: function (l) {
            return Object.prototype.toString.call(l)
        }, getType: function (l) {
            if (l === null) {
                return "null"
            }
            switch (typeof l) {
                case"number":
                    return "number";
                case"string":
                    return "string";
                case"boolean":
                    return "boolean"
            }
            switch (i.getClass(l)) {
                case"[object Array]":
                    return "array";
                case"[object Object]":
                    return "object"
            }
            throw new Error("Bad type: " + i.getClass(l))
        }, forEachNode: function (p, n) {
            var l = i.getType(p), o;
            switch (l) {
                case"array":
                    o = p.length - 1;
                    p.forEach(function (r, q) {
                        n(q, r, q === o)
                    });
                    break;
                case"object":
                    var m = Object.keys(p).sort();
                    o = m.length - 1;
                    m.forEach(function (r, q) {
                        n(r, p[r], q === o)
                    });
                    break
            }
        }, inherits: (function () {
            var l = function () {
            };
            return function (n, m) {
                l.prototype = m.prototype;
                n.prototype = new l();
                n.prototype.constructor = n
            }
        })(), isValidRoot: function (l) {
            switch (i.getType(l)) {
                case"object":
                case"array":
                    return true;
                default:
                    return false
            }
        }, extend: function (l, m) {
            for (var n in m) {
                if (m.hasOwnProperty(n)) {
                    l[n] = m[n]
                }
            }
        }
    };

    function h(m, o, n) {
        var l = i.getType(o);
        if (l in h.CONSTRUCTORS) {
            return new h.CONSTRUCTORS[l](m, o, n)
        } else {
            throw new Error("Bad type: " + i.getClass(o))
        }
    }

    h.CONSTRUCTORS = {"boolean": j, "number": e, "string": g, "null": k, "object": d, "array": f};

    function a(n, r, q) {
        if (this.constructor === a) {
            throw new Error("This is abstract class")
        }
        var l = this, p = document.createElement("li"), m, o = function (s, u) {
            var t = '                    <span class="jsontree_label-wrapper">                        <span class="jsontree_label">"' + s + '"</span> :                 </span>                <span class="jsontree_value-wrapper">                    <span class="jsontree_value jsontree_value_' + l.type + '">' + u + "</span>" + (!q ? "," : "") + "</span>";
            return t
        };
        l.label = n;
        l.isComplex = false;
        p.classList.add("jsontree_node");
        p.innerHTML = o(n, r);
        l.el = p;
        m = p.querySelector(".jsontree_label");
        m.addEventListener("click", function (s) {
            if (s.altKey) {
                l.toggleMarked();
                return
            }
            if (s.shiftKey) {
                document.getSelection().removeAllRanges();
                alert(l.getJSONPath());
                return
            }
        }, false)
    }

    a.prototype = {
        constructor: a, mark: function () {
            this.el.classList.add("jsontree_node_marked")
        }, unmark: function () {
            this.el.classList.remove("jsontree_node_marked")
        }, toggleMarked: function () {
            this.el.classList.toggle("jsontree_node_marked")
        }, expandParent: function (l) {
            if (!this.parent) {
                return
            }
            this.parent.expand();
            this.parent.expandParent(l)
        }, getJSONPath: function (m) {
            if (this.isRoot) {
                return "$"
            }
            var l;
            if (this.parent.type === "array") {
                l = "[" + this.label + "]"
            } else {
                l = m ? "." + this.label : "['" + this.label + "']"
            }
            return this.parent.getJSONPath(m) + l
        }
    };

    function j(l, n, m) {
        this.type = "boolean";
        a.call(this, l, n, m)
    }

    i.inherits(j, a);

    function e(l, n, m) {
        this.type = "number";
        a.call(this, l, n, m)
    }

    i.inherits(e, a);

    function g(l, n, m) {
        this.type = "string";
        a.call(this, l, '"' + n + '"', m)
    }

    i.inherits(g, a);

    function k(l, n, m) {
        this.type = "null";
        a.call(this, l, n, m)
    }

    i.inherits(k, a);

    function b(r, n, p) {
        if (this.constructor === b) {
            throw new Error("This is abstract class")
        }
        var u = this, m = document.createElement("li"), s = function (x, w) {
            var v = (!p) ? "," : "",
                y = '                        <div class="jsontree_value-wrapper">                            <div class="jsontree_value jsontree_value_' + u.type + '">                                <b>' + w[0] + '</b>                                <span class="jsontree_show-more">&hellip;</span>                                <ul class="jsontree_child-nodes"></ul>                                <b>' + w[1] + "</b>" + "</div>" + v + "</div>";
            if (x !== null) {
                y = '                        <span class="jsontree_label-wrapper">                            <span class="jsontree_label">' + '<span class="jsontree_expand-button"></span>' + '"' + x + '"</span> :                     </span>' + y
            }
            return y
        }, q, l, o, t = [];
        u.label = r;
        u.isComplex = true;
        m.classList.add("jsontree_node");
        m.classList.add("jsontree_node_complex");
        m.innerHTML = s(r, u.sym);
        q = m.querySelector(".jsontree_child-nodes");
        if (r !== null) {
            l = m.querySelector(".jsontree_label");
            o = m.querySelector(".jsontree_show-more");
            l.addEventListener("click", function (v) {
                if (v.altKey) {
                    u.toggleMarked();
                    return
                }
                if (v.shiftKey) {
                    document.getSelection().removeAllRanges();
                    alert(u.getJSONPath());
                    return
                }
                u.toggle(v.ctrlKey || v.metaKey)
            }, false);
            o.addEventListener("click", function (v) {
                u.toggle(v.ctrlKey || v.metaKey)
            }, false);
            u.isRoot = false
        } else {
            u.isRoot = true;
            u.parent = null;
            m.classList.add("jsontree_node_expanded")
        }
        u.el = m;
        u.childNodes = t;
        u.childNodesUl = q;
        i.forEachNode(n, function (v, w, x) {
            u.addChild(new h(v, w, x))
        });
        u.isEmpty = !Boolean(t.length);
        if (u.isEmpty) {
            m.classList.add("jsontree_node_empty")
        }
    }

    i.inherits(b, a);
    i.extend(b.prototype, {
        constructor: b, addChild: function (l) {
            this.childNodes.push(l);
            this.childNodesUl.appendChild(l.el);
            l.parent = this
        }, expand: function (l) {
            if (this.isEmpty) {
                return
            }
            if (!this.isRoot) {
                this.el.classList.add("jsontree_node_expanded")
            }
            if (l) {
                this.childNodes.forEach(function (n, m) {
                    if (n.isComplex) {
                        n.expand(l)
                    }
                })
            }
        }, collapse: function (l) {
            if (this.isEmpty) {
                return
            }
            if (!this.isRoot) {
                this.el.classList.remove("jsontree_node_expanded")
            }
            if (l) {
                this.childNodes.forEach(function (n, m) {
                    if (n.isComplex) {
                        n.collapse(l)
                    }
                })
            }
        }, toggle: function (l) {
            if (this.isEmpty) {
                return
            }
            this.el.classList.toggle("jsontree_node_expanded");
            if (l) {
                var m = this.el.classList.contains("jsontree_node_expanded");
                this.childNodes.forEach(function (o, n) {
                    if (o.isComplex) {
                        o[m ? "expand" : "collapse"](l)
                    }
                })
            }
        }, findChildren: function (n, l, m) {
            if (this.isEmpty) {
                return
            }
            this.childNodes.forEach(function (p, o) {
                if (n(p)) {
                    l(p)
                }
                if (p.isComplex && m) {
                    p.findChildren(n, l, m)
                }
            })
        }
    });

    function d(l, n, m) {
        this.sym = ["{", "}"];
        this.type = "object";
        b.call(this, l, n, m)
    }

    i.inherits(d, b);

    function f(l, n, m) {
        this.sym = ["[", "]"];
        this.type = "array";
        b.call(this, l, n, m)
    }

    i.inherits(f, b);

    function c(m, l) {
        this.wrapper = document.createElement("ul");
        this.wrapper.className = "jsontree_tree clearfix";
        this.rootNode = null;
        this.sourceJSONObj = m;
        this.loadData(m);
        this.appendTo(l)
    }

    c.prototype = {
        constructor: c, loadData: function (l) {
            if (!i.isValidRoot(l)) {
                alert("The root should be an object or an array");
                return
            }
            this.sourceJSONObj = l;
            this.rootNode = new h(null, l, "last");
            this.wrapper.innerHTML = "";
            this.wrapper.appendChild(this.rootNode.el)
        }, appendTo: function (l) {
            l.appendChild(this.wrapper)
        }, expand: function (l) {
            if (this.rootNode.isComplex) {
                if (typeof l == "function") {
                    this.rootNode.childNodes.forEach(function (n, m) {
                        if (n.isComplex && l(n)) {
                            n.expand()
                        }
                    })
                } else {
                    this.rootNode.expand("recursive")
                }
            }
        }, collapse: function () {
            if (typeof this.rootNode.collapse === "function") {
                this.rootNode.collapse("recursive")
            }
        }, toSourceJSON: function (n) {
            if (!n) {
                return JSON.stringify(this.sourceJSONObj)
            }
            var m = "[%^$#$%^%]", l = JSON.stringify(this.sourceJSONObj, null, m);
            l = l.split("\n").join("<br />");
            l = l.split(m).join("&nbsp;&nbsp;&nbsp;&nbsp;");
            return l
        }, toSourceJSONText: function () {
            var l = "[%^$#$%^%]";
            return JSON.stringify(this.sourceJSONObj, null, l).split(l).join("    ")
        }, findAndHandle: function (m, l) {
            this.rootNode.findChildren(m, l, "isRecursive")
        }, unmarkAll: function () {
            this.rootNode.findChildren(function (l) {
                return true
            }, function (l) {
                l.unmark()
            }, "isRecursive")
        }
    };
    return {
        create: function (m, l) {
            return new c(m, l)
        }
    }
})();