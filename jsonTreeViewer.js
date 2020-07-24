"use strict";
var jsonTreeViewer = (function () {
    var a = "JsonTreeViewData";
    var h = App.utils;
    var e = document.getElementById("tree");
    var i = jsonTree.create({}, e);
    var b = new App.Menu(h.dom.id("nav"), {
        "load": function () {
            g.show()
        }, "expand": function () {
            i.expand()
        }, "collapse": function () {
            i.collapse()
        }, "source": function () {
            c.print(i.toSourceJSON("isPrettyPrinted"))
        }, "find_and_mark": function () {
            f.show()
        }, "unmark_all": function () {
            i.unmarkAll()
        }, "help": function () {
            d.show()
        }
    });
    var g = new App.Window({
        content_el: h.dom.id("load_json_form"), overlay: true, js_module: function (k) {
            var l = k.content_el, n = document.getElementById("code_input"),
                j = document.getElementById("load_code_button");

            function m(o) {
                jsonTreeViewer.parse(n.value);
                k.hide();
                n.value = "";
                o.preventDefault()
            }

            j.addEventListener("click", m, false)
        }
    });
    var d = new App.Window({content_el: document.getElementById("help"), overlay: true});
    var c = new App.Window({
        content_el: h.dom.id("source_json"),
        overlay: true,
        extra_button: true,
        extra_button_class_name: "window__copy-button",
        extra_button_event: function () {
            window.utools.copyText(i.toSourceJSONText())
        },
        js_module: function (j) {
            return {
                print: function (k) {
                    j.content_el.innerHTML = k;
                    j.show()
                }
            }
        }
    });
    var f = new App.Window({
        content_el: h.dom.id("find_nodes_form"), overlay: true, js_module: function (k) {
            var l = k.content_el, q = {
                    label_name: document.getElementById("nodes_search_by_label"),
                    node_type: document.getElementById("nodes_search_by_type")
                }, n = document.getElementById("search_by_label_name"), p = document.getElementsByName("nodes_type"),
                j = document.getElementById("find_button"), m = {
                    BY_LABEL_NAME: function (r, s) {
                        return s.label.toString().toUpperCase() === r.toString().toUpperCase()
                    }, BY_NODE_TYPE: function (r, s) {
                        return r.indexOf(s.type) >= 0
                    }
                };

            function o(v) {
                var u;
                v.preventDefault();
                if (q.label_name.checked) {
                    var r = n.value.trim();
                    if (!r) {
                        return
                    }
                    u = m.BY_LABEL_NAME.bind(null, r)
                } else {
                    if (q.node_type.checked) {
                        var s = [];
                        for (var t = 0, w = p.length; t < w; t++) {
                            if (p[t].checked) {
                                s.push(p[t].value)
                            }
                        }
                        if (!s.length) {
                            return
                        }
                        u = m.BY_NODE_TYPE.bind(null, s)
                    }
                }
                if (!u) {
                    return
                }
                i.findAndHandle(u, function (x) {
                    x.mark();
                    x.expandParent("isRecursive")
                });
                k.hide()
            }

            j.addEventListener("click", o, false)
        }
    });
    return {
        parse: function (j) {
            var k;
            try {
                k = JSON.parse(j)
            } catch (l) {
                alert(l)
            }
            i.loadData(k)
        }
    }
})();