(function() {
    var t = this;
    var e = t.Backbone;
    var i = [];
    var r = i.push;
    var s = i.slice;
    var n = i.splice;
    var a;
    if (typeof exports !== "undefined") {
        a = exports
    } else {
        a = t.Backbone = {}
    }
    a.VERSION = "1.1.0";
    var h = t._;
    if (!h && typeof require !== "undefined") h = require("underscore");
    a.$ = t.jQuery || t.Zepto || t.ender || t.$;
    a.noConflict = function() {
        t.Backbone = e;
        return this
    };
    a.emulateHTTP = false;
    a.emulateJSON = false;
    var o = a.Events = {
        on: function(t, e, i) {
            if (!l(this, "on", t, [e, i]) || !e) return this;
            this._events || (this._events = {});
            var r = this._events[t] || (this._events[t] = []);
            r.push({
                callback: e,
                context: i,
                ctx: i || this
            });
            return this
        },
        once: function(t, e, i) {
            if (!l(this, "once", t, [e, i]) || !e) return this;
            var r = this;
            var s = h.once(function() {
                r.off(t, s);
                e.apply(this, arguments)
            });
            s._callback = e;
            return this.on(t, s, i)
        },
        off: function(t, e, i) {
            var r, s, n, a, o, u, c, f;
            if (!this._events || !l(this, "off", t, [e, i])) return this;
            if (!t && !e && !i) {
                this._events = {};
                return this
            }
            a = t ? [t] : h.keys(this._events);
            for (o = 0, u = a.length; o < u; o++) {
                t = a[o];
                if (n = this._events[t]) {
                    this._events[t] = r = [];
                    if (e || i) {
                        for (c = 0, f = n.length; c < f; c++) {
                            s = n[c];
                            if (e && e !== s.callback && e !== s.callback._callback || i && i !== s.context) {
                                r.push(s)
                            }
                        }
                    }
                    if (!r.length) delete this._events[t]
                }
            }
            return this
        },
        trigger: function(t) {
            if (!this._events) return this;
            var e = s.call(arguments, 1);
            if (!l(this, "trigger", t, e)) return this;
            var i = this._events[t];
            var r = this._events.all;
            if (i) c(i, e);
            if (r) c(r, arguments);
            return this
        },
        stopListening: function(t, e, i) {
            var r = this._listeningTo;
            if (!r) return this;
            var s = !e && !i;
            if (!i && typeof e === "object") i = this;
            if (t)(r = {})[t._listenId] = t;
            for (var n in r) {
                t = r[n];
                t.off(e, i, this);
                if (s || h.isEmpty(t._events)) delete this._listeningTo[n]
            }
            return this
        }
    };
    var u = /\s+/;
    var l = function(t, e, i, r) {
        if (!i) return true;
        if (typeof i === "object") {
            for (var s in i) {
                t[e].apply(t, [s, i[s]].concat(r))
            }
            return false
        }
        if (u.test(i)) {
            var n = i.split(u);
            for (var a = 0, h = n.length; a < h; a++) {
                t[e].apply(t, [n[a]].concat(r))
            }
            return false
        }
        return true
    };
    var c = function(t, e) {
        var i, r = -1,
            s = t.length,
            n = e[0],
            a = e[1],
            h = e[2];
        switch (e.length) {
            case 0:
                while (++r < s)(i = t[r]).callback.call(i.ctx);
                return;
            case 1:
                while (++r < s)(i = t[r]).callback.call(i.ctx, n);
                return;
            case 2:
                while (++r < s)(i = t[r]).callback.call(i.ctx, n, a);
                return;
            case 3:
                while (++r < s)(i = t[r]).callback.call(i.ctx, n, a, h);
                return;
            default:
                while (++r < s)(i = t[r]).callback.apply(i.ctx, e)
        }
    };
    var f = {
        listenTo: "on",
        listenToOnce: "once"
    };
    h.each(f, function(t, e) {
        o[e] = function(e, i, r) {
            var s = this._listeningTo || (this._listeningTo = {});
            var n = e._listenId || (e._listenId = h.uniqueId("l"));
            s[n] = e;
            if (!r && typeof i === "object") r = this;
            e[t](i, r, this);
            return this
        }
    });
    o.bind = o.on;
    o.unbind = o.off;
    h.extend(a, o);
    var d = a.Model = function(t, e) {
        var i = t || {};
        e || (e = {});
        this.cid = h.uniqueId("c");
        this.attributes = {};
        if (e.collection) this.collection = e.collection;
        if (e.parse) i = this.parse(i, e) || {};
        i = h.defaults({}, i, h.result(this, "defaults"));
        this.set(i, e);
        this.changed = {};
        this.initialize.apply(this, arguments)
    };
    h.extend(d.prototype, o, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(t) {
            return h.clone(this.attributes)
        },
        sync: function() {
            return a.sync.apply(this, arguments)
        },
        get: function(t) {
            return this.attributes[t]
        },
        escape: function(t) {
            return h.escape(this.get(t))
        },
        has: function(t) {
            return this.get(t) != null
        },
        set: function(t, e, i) {
            var r, s, n, a, o, u, l, c;
            if (t == null) return this;
            if (typeof t === "object") {
                s = t;
                i = e
            } else {
                (s = {})[t] = e
            }
            i || (i = {});
            if (!this._validate(s, i)) return false;
            n = i.unset;
            o = i.silent;
            a = [];
            u = this._changing;
            this._changing = true;
            if (!u) {
                this._previousAttributes = h.clone(this.attributes);
                this.changed = {}
            }
            c = this.attributes, l = this._previousAttributes;
            if (this.idAttribute in s) this.id = s[this.idAttribute];
            for (r in s) {
                e = s[r];
                if (!h.isEqual(c[r], e)) a.push(r);
                if (!h.isEqual(l[r], e)) {
                    this.changed[r] = e
                } else {
                    delete this.changed[r]
                }
                n ? delete c[r] : c[r] = e
            }
            if (!o) {
                if (a.length) this._pending = true;
                for (var f = 0, d = a.length; f < d; f++) {
                    this.trigger("change:" + a[f], this, c[a[f]], i)
                }
            }
            if (u) return this;
            if (!o) {
                while (this._pending) {
                    this._pending = false;
                    this.trigger("change", this, i)
                }
            }
            this._pending = false;
            this._changing = false;
            return this
        },
        unset: function(t, e) {
            return this.set(t, void 0, h.extend({}, e, {
                unset: true
            }))
        },
        clear: function(t) {
            var e = {};
            for (var i in this.attributes) e[i] = void 0;
            return this.set(e, h.extend({}, t, {
                unset: true
            }))
        },
        hasChanged: function(t) {
            if (t == null) return !h.isEmpty(this.changed);
            return h.has(this.changed, t)
        },
        changedAttributes: function(t) {
            if (!t) return this.hasChanged() ? h.clone(this.changed) : false;
            var e, i = false;
            var r = this._changing ? this._previousAttributes : this.attributes;
            for (var s in t) {
                if (h.isEqual(r[s], e = t[s])) continue;
                (i || (i = {}))[s] = e
            }
            return i
        },
        previous: function(t) {
            if (t == null || !this._previousAttributes) return null;
            return this._previousAttributes[t]
        },
        previousAttributes: function() {
            return h.clone(this._previousAttributes)
        },
        fetch: function(t) {
            t = t ? h.clone(t) : {};
            if (t.parse === void 0) t.parse = true;
            var e = this;
            var i = t.success;
            t.success = function(r) {
                if (!e.set(e.parse(r, t), t)) return false;
                if (i) i(e, r, t);
                e.trigger("sync", e, r, t)
            };
            M(this, t);
            return this.sync("read", this, t)
        },
        save: function(t, e, i) {
            var r, s, n, a = this.attributes;
            if (t == null || typeof t === "object") {
                r = t;
                i = e
            } else {
                (r = {})[t] = e
            }
            i = h.extend({
                validate: true
            }, i);
            if (r && !i.wait) {
                if (!this.set(r, i)) return false
            } else {
                if (!this._validate(r, i)) return false
            }
            if (r && i.wait) {
                this.attributes = h.extend({}, a, r)
            }
            if (i.parse === void 0) i.parse = true;
            var o = this;
            var u = i.success;
            i.success = function(t) {
                o.attributes = a;
                var e = o.parse(t, i);
                if (i.wait) e = h.extend(r || {}, e);
                if (h.isObject(e) && !o.set(e, i)) {
                    return false
                }
                if (u) u(o, t, i);
                o.trigger("sync", o, t, i)
            };
            M(this, i);
            s = this.isNew() ? "create" : i.patch ? "patch" : "update";
            if (s === "patch") i.attrs = r;
            n = this.sync(s, this, i);
            if (r && i.wait) this.attributes = a;
            return n
        },
        destroy: function(t) {
            t = t ? h.clone(t) : {};
            var e = this;
            var i = t.success;
            var r = function() {
                e.trigger("destroy", e, e.collection, t)
            };
            t.success = function(s) {
                if (t.wait || e.isNew()) r();
                if (i) i(e, s, t);
                if (!e.isNew()) e.trigger("sync", e, s, t)
            };
            if (this.isNew()) {
                t.success();
                return false
            }
            M(this, t);
            var s = this.sync("delete", this, t);
            if (!t.wait) r();
            return s
        },
        url: function() {
            var t = h.result(this, "urlRoot") || h.result(this.collection, "url") || U();
            if (this.isNew()) return t;
            return t + (t.charAt(t.length - 1) === "/" ? "" : "/") + encodeURIComponent(this.id)
        },
        parse: function(t, e) {
            return t
        },
        clone: function() {
            return new this.constructor(this.attributes)
        },
        isNew: function() {
            return this.id == null
        },
        isValid: function(t) {
            return this._validate({}, h.extend(t || {}, {
                validate: true
            }))
        },
        _validate: function(t, e) {
            if (!e.validate || !this.validate) return true;
            t = h.extend({}, this.attributes, t);
            var i = this.validationError = this.validate(t, e) || null;
            if (!i) return true;
            this.trigger("invalid", this, i, h.extend(e, {
                validationError: i
            }));
            return false
        }
    });
    var p = ["keys", "values", "pairs", "invert", "pick", "omit"];
    h.each(p, function(t) {
        d.prototype[t] = function() {
            var e = s.call(arguments);
            e.unshift(this.attributes);
            return h[t].apply(h, e)
        }
    });
    var v = a.Collection = function(t, e) {
        e || (e = {});
        if (e.model) this.model = e.model;
        if (e.comparator !== void 0) this.comparator = e.comparator;
        this._reset();
        this.initialize.apply(this, arguments);
        if (t) this.reset(t, h.extend({
            silent: true
        }, e))
    };
    var g = {
        add: true,
        remove: true,
        merge: true
    };
    var m = {
        add: true,
        remove: false
    };
    h.extend(v.prototype, o, {
        model: d,
        initialize: function() {},
        toJSON: function(t) {
            return this.map(function(e) {
                return e.toJSON(t)
            })
        },
        sync: function() {
            return a.sync.apply(this, arguments)
        },
        add: function(t, e) {
            return this.set(t, h.extend({
                merge: false
            }, e, m))
        },
        remove: function(t, e) {
            var i = !h.isArray(t);
            t = i ? [t] : h.clone(t);
            e || (e = {});
            var r, s, n, a;
            for (r = 0, s = t.length; r < s; r++) {
                a = t[r] = this.get(t[r]);
                if (!a) continue;
                delete this._byId[a.id];
                delete this._byId[a.cid];
                n = this.indexOf(a);
                this.models.splice(n, 1);
                this.length--;
                if (!e.silent) {
                    e.index = n;
                    a.trigger("remove", a, this, e)
                }
                this._removeReference(a)
            }
            return i ? t[0] : t
        },
        set: function(t, e) {
            e = h.defaults({}, e, g);
            if (e.parse) t = this.parse(t, e);
            var i = !h.isArray(t);
            t = i ? t ? [t] : [] : h.clone(t);
            var r, s, n, a, o, u, l;
            var c = e.at;
            var f = this.model;
            var p = this.comparator && c == null && e.sort !== false;
            var v = h.isString(this.comparator) ? this.comparator : null;
            var m = [],
                y = [],
                _ = {};
            var w = e.add,
                b = e.merge,
                x = e.remove;
            var E = !p && w && x ? [] : false;
            for (r = 0, s = t.length; r < s; r++) {
                o = t[r];
                if (o instanceof d) {
                    n = a = o
                } else {
                    n = o[f.prototype.idAttribute]
                }
                if (u = this.get(n)) {
                    if (x) _[u.cid] = true;
                    if (b) {
                        o = o === a ? a.attributes : o;
                        if (e.parse) o = u.parse(o, e);
                        u.set(o, e);
                        if (p && !l && u.hasChanged(v)) l = true
                    }
                    t[r] = u
                } else if (w) {
                    a = t[r] = this._prepareModel(o, e);
                    if (!a) continue;
                    m.push(a);
                    a.on("all", this._onModelEvent, this);
                    this._byId[a.cid] = a;
                    if (a.id != null) this._byId[a.id] = a
                }
                if (E) E.push(u || a)
            }
            if (x) {
                for (r = 0, s = this.length; r < s; ++r) {
                    if (!_[(a = this.models[r]).cid]) y.push(a)
                }
                if (y.length) this.remove(y, e)
            }
            if (m.length || E && E.length) {
                if (p) l = true;
                this.length += m.length;
                if (c != null) {
                    for (r = 0, s = m.length; r < s; r++) {
                        this.models.splice(c + r, 0, m[r])
                    }
                } else {
                    if (E) this.models.length = 0;
                    var T = E || m;
                    for (r = 0, s = T.length; r < s; r++) {
                        this.models.push(T[r])
                    }
                }
            }
            if (l) this.sort({
                silent: true
            });
            if (!e.silent) {
                for (r = 0, s = m.length; r < s; r++) {
                    (a = m[r]).trigger("add", a, this, e)
                }
                if (l || E && E.length) this.trigger("sort", this, e)
            }
            return i ? t[0] : t
        },
        reset: function(t, e) {
            e || (e = {});
            for (var i = 0, r = this.models.length; i < r; i++) {
                this._removeReference(this.models[i])
            }
            e.previousModels = this.models;
            this._reset();
            t = this.add(t, h.extend({
                silent: true
            }, e));
            if (!e.silent) this.trigger("reset", this, e);
            return t
        },
        push: function(t, e) {
            return this.add(t, h.extend({
                at: this.length
            }, e))
        },
        pop: function(t) {
            var e = this.at(this.length - 1);
            this.remove(e, t);
            return e
        },
        unshift: function(t, e) {
            return this.add(t, h.extend({
                at: 0
            }, e))
        },
        shift: function(t) {
            var e = this.at(0);
            this.remove(e, t);
            return e
        },
        slice: function() {
            return s.apply(this.models, arguments)
        },
        get: function(t) {
            if (t == null) return void 0;
            return this._byId[t.id] || this._byId[t.cid] || this._byId[t]
        },
        at: function(t) {
            return this.models[t]
        },
        where: function(t, e) {
            if (h.isEmpty(t)) return e ? void 0 : [];
            return this[e ? "find" : "filter"](function(e) {
                for (var i in t) {
                    if (t[i] !== e.get(i)) return false
                }
                return true
            })
        },
        findWhere: function(t) {
            return this.where(t, true)
        },
        sort: function(t) {
            if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
            t || (t = {});
            if (h.isString(this.comparator) || this.comparator.length === 1) {
                this.models = this.sortBy(this.comparator, this)
            } else {
                this.models.sort(h.bind(this.comparator, this))
            }
            if (!t.silent) this.trigger("sort", this, t);
            return this
        },
        pluck: function(t) {
            return h.invoke(this.models, "get", t)
        },
        fetch: function(t) {
            t = t ? h.clone(t) : {};
            if (t.parse === void 0) t.parse = true;
            var e = t.success;
            var i = this;
            t.success = function(r) {
                var s = t.reset ? "reset" : "set";
                i[s](r, t);
                if (e) e(i, r, t);
                i.trigger("sync", i, r, t)
            };
            M(this, t);
            return this.sync("read", this, t)
        },
        create: function(t, e) {
            e = e ? h.clone(e) : {};
            if (!(t = this._prepareModel(t, e))) return false;
            if (!e.wait) this.add(t, e);
            var i = this;
            var r = e.success;
            e.success = function(t, e, s) {
                if (s.wait) i.add(t, s);
                if (r) r(t, e, s)
            };
            t.save(null, e);
            return t
        },
        parse: function(t, e) {
            return t
        },
        clone: function() {
            return new this.constructor(this.models)
        },
        _reset: function() {
            this.length = 0;
            this.models = [];
            this._byId = {}
        },
        _prepareModel: function(t, e) {
            if (t instanceof d) {
                if (!t.collection) t.collection = this;
                return t
            }
            e = e ? h.clone(e) : {};
            e.collection = this;
            var i = new this.model(t, e);
            if (!i.validationError) return i;
            this.trigger("invalid", this, i.validationError, e);
            return false
        },
        _removeReference: function(t) {
            if (this === t.collection) delete t.collection;
            t.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function(t, e, i, r) {
            if ((t === "add" || t === "remove") && i !== this) return;
            if (t === "destroy") this.remove(e, r);
            if (e && t === "change:" + e.idAttribute) {
                delete this._byId[e.previous(e.idAttribute)];
                if (e.id != null) this._byId[e.id] = e
            }
            this.trigger.apply(this, arguments)
        }
    });
    var y = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain"];
    h.each(y, function(t) {
        v.prototype[t] = function() {
            var e = s.call(arguments);
            e.unshift(this.models);
            return h[t].apply(h, e)
        }
    });
    var _ = ["groupBy", "countBy", "sortBy"];
    h.each(_, function(t) {
        v.prototype[t] = function(e, i) {
            var r = h.isFunction(e) ? e : function(t) {
                return t.get(e)
            };
            return h[t](this.models, r, i)
        }
    });
    var w = a.View = function(t) {
        this.cid = h.uniqueId("view");
        t || (t = {});
        h.extend(this, h.pick(t, x));
        this._ensureElement();
        this.initialize.apply(this, arguments);
        this.delegateEvents()
    };
    var b = /^(\S+)\s*(.*)$/;
    var x = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    h.extend(w.prototype, o, {
        tagName: "div",
        $: function(t) {
            return this.$el.find(t)
        },
        initialize: function() {},
        render: function() {
            return this
        },
        remove: function() {
            this.$el.remove();
            this.stopListening();
            return this
        },
        setElement: function(t, e) {
            if (this.$el) this.undelegateEvents();
            this.$el = t instanceof a.$ ? t : a.$(t);
            this.el = this.$el[0];
            if (e !== false) this.delegateEvents();
            return this
        },
        delegateEvents: function(t) {
            if (!(t || (t = h.result(this, "events")))) return this;
            this.undelegateEvents();
            for (var e in t) {
                var i = t[e];
                if (!h.isFunction(i)) i = this[t[e]];
                if (!i) continue;
                var r = e.match(b);
                var s = r[1],
                    n = r[2];
                i = h.bind(i, this);
                s += ".delegateEvents" + this.cid;
                if (n === "") {
                    this.$el.on(s, i)
                } else {
                    this.$el.on(s, n, i)
                }
            }
            return this
        },
        undelegateEvents: function() {
            this.$el.off(".delegateEvents" + this.cid);
            return this
        },
        _ensureElement: function() {
            if (!this.el) {
                var t = h.extend({}, h.result(this, "attributes"));
                if (this.id) t.id = h.result(this, "id");
                if (this.className) t["class"] = h.result(this, "className");
                var e = a.$("<" + h.result(this, "tagName") + ">").attr(t);
                this.setElement(e, false)
            } else {
                this.setElement(h.result(this, "el"), false)
            }
        }
    });
    a.sync = function(t, e, i) {
        var r = T[t];
        h.defaults(i || (i = {}), {
            emulateHTTP: a.emulateHTTP,
            emulateJSON: a.emulateJSON
        });
        var s = {
            type: r,
            dataType: "json"
        };
        if (!i.url) {
            s.url = h.result(e, "url") || U()
        }
        if (i.data == null && e && (t === "create" || t === "update" || t === "patch")) {
            s.contentType = "application/json";
            s.data = JSON.stringify(i.attrs || e.toJSON(i))
        }
        if (i.emulateJSON) {
            s.contentType = "application/x-www-form-urlencoded";
            s.data = s.data ? {
                model: s.data
            } : {}
        }
        if (i.emulateHTTP && (r === "PUT" || r === "DELETE" || r === "PATCH")) {
            s.type = "POST";
            if (i.emulateJSON) s.data._method = r;
            var n = i.beforeSend;
            i.beforeSend = function(t) {
                t.setRequestHeader("X-HTTP-Method-Override", r);
                if (n) return n.apply(this, arguments)
            }
        }
        if (s.type !== "GET" && !i.emulateJSON) {
            s.processData = false
        }
        if (s.type === "PATCH" && E) {
            s.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        var o = i.xhr = a.ajax(h.extend(s, i));
        e.trigger("request", e, o, i);
        return o
    };
    var E = typeof window !== "undefined" && !!window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);
    var T = {
        create: "POST",
        update: "PUT",
        patch: "PATCH",
        "delete": "DELETE",
        read: "GET"
    };
    a.ajax = function() {
        return a.$.ajax.apply(a.$, arguments)
    };
    var k = a.Router = function(t) {
        t || (t = {});
        if (t.routes) this.routes = t.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments)
    };
    var S = /\((.*?)\)/g;
    var $ = /(\(\?)?:\w+/g;
    var H = /\*\w+/g;
    var A = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    h.extend(k.prototype, o, {
        initialize: function() {},
        route: function(t, e, i) {
            if (!h.isRegExp(t)) t = this._routeToRegExp(t);
            if (h.isFunction(e)) {
                i = e;
                e = ""
            }
            if (!i) i = this[e];
            var r = this;
            a.history.route(t, function(s) {
                var n = r._extractParameters(t, s);
                i && i.apply(r, n);
                r.trigger.apply(r, ["route:" + e].concat(n));
                r.trigger("route", e, n);
                a.history.trigger("route", r, e, n)
            });
            return this
        },
        navigate: function(t, e) {
            a.history.navigate(t, e);
            return this
        },
        _bindRoutes: function() {
            if (!this.routes) return;
            this.routes = h.result(this, "routes");
            var t, e = h.keys(this.routes);
            while ((t = e.pop()) != null) {
                this.route(t, this.routes[t])
            }
        },
        _routeToRegExp: function(t) {
            t = t.replace(A, "\\$&").replace(S, "(?:$1)?").replace($, function(t, e) {
                return e ? t : "([^/]+)"
            }).replace(H, "(.*?)");
            return new RegExp("^" + t + "$")
        },
        _extractParameters: function(t, e) {
            var i = t.exec(e).slice(1);
            return h.map(i, function(t) {
                return t ? decodeURIComponent(t) : null
            })
        }
    });
    var I = a.History = function() {
        this.handlers = [];
        h.bindAll(this, "checkUrl");
        if (typeof window !== "undefined") {
            this.location = window.location;
            this.history = window.history
        }
    };
    var N = /^[#\/]|\s+$/g;
    var O = /^\/+|\/+$/g;
    var P = /msie [\w.]+/;
    var C = /\/$/;
    var j = /[?#].*$/;
    I.started = false;
    h.extend(I.prototype, o, {
        interval: 50,
        getHash: function(t) {
            var e = (t || this).location.href.match(/#(.*)$/);
            return e ? e[1] : ""
        },
        getFragment: function(t, e) {
            if (t == null) {
                if (this._hasPushState || !this._wantsHashChange || e) {
                    t = this.location.pathname;
                    var i = this.root.replace(C, "");
                    if (!t.indexOf(i)) t = t.slice(i.length)
                } else {
                    t = this.getHash()
                }
            }
            return t.replace(N, "")
        },
        start: function(t) {
            if (I.started) throw new Error("Backbone.history has already been started");
            I.started = true;
            this.options = h.extend({
                root: "/"
            }, this.options, t);
            this.root = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._wantsPushState = !!this.options.pushState;
            this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var e = this.getFragment();
            var i = document.documentMode;
            var r = P.exec(navigator.userAgent.toLowerCase()) && (!i || i <= 7);
            this.root = ("/" + this.root + "/").replace(O, "/");
            if (r && this._wantsHashChange) {
                this.iframe = a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
                this.navigate(e)
            }
            if (this._hasPushState) {
                a.$(window).on("popstate", this.checkUrl)
            } else if (this._wantsHashChange && "onhashchange" in window && !r) {
                a.$(window).on("hashchange", this.checkUrl)
            } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval)
            }
            this.fragment = e;
            var s = this.location;
            var n = s.pathname.replace(/[^\/]$/, "$&/") === this.root;
            if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !n) {
                    this.fragment = this.getFragment(null, true);
                    this.location.replace(this.root + this.location.search + "#" + this.fragment);
                    return true
                } else if (this._hasPushState && n && s.hash) {
                    this.fragment = this.getHash().replace(N, "");
                    this.history.replaceState({}, document.title, this.root + this.fragment + s.search)
                }
            }
            if (!this.options.silent) return this.loadUrl()
        },
        stop: function() {
            a.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl);
            clearInterval(this._checkUrlInterval);
            I.started = false
        },
        route: function(t, e) {
            this.handlers.unshift({
                route: t,
                callback: e
            })
        },
        checkUrl: function(t) {
            var e = this.getFragment();
            if (e === this.fragment && this.iframe) {
                e = this.getFragment(this.getHash(this.iframe))
            }
            if (e === this.fragment) return false;
            if (this.iframe) this.navigate(e);
            this.loadUrl()
        },
        loadUrl: function(t) {
            t = this.fragment = this.getFragment(t);
            return h.any(this.handlers, function(e) {
                if (e.route.test(t)) {
                    e.callback(t);
                    return true
                }
            })
        },
        navigate: function(t, e) {
            if (!I.started) return false;
            if (!e || e === true) e = {
                trigger: !!e
            };
            var i = this.root + (t = this.getFragment(t || ""));
            t = t.replace(j, "");
            if (this.fragment === t) return;
            this.fragment = t;
            if (t === "" && i !== "/") i = i.slice(0, -1);
            if (this._hasPushState) {
                this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, i)
            } else if (this._wantsHashChange) {
                this._updateHash(this.location, t, e.replace);
                if (this.iframe && t !== this.getFragment(this.getHash(this.iframe))) {
                    if (!e.replace) this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, t, e.replace)
                }
            } else {
                return this.location.assign(i)
            }
            if (e.trigger) return this.loadUrl(t)
        },
        _updateHash: function(t, e, i) {
            if (i) {
                var r = t.href.replace(/(javascript:|#).*$/, "");
                t.replace(r + "#" + e)
            } else {
                t.hash = "#" + e
            }
        }
    });
    a.history = new I;
    var R = function(t, e) {
        var i = this;
        var r;
        if (t && h.has(t, "constructor")) {
            r = t.constructor
        } else {
            r = function() {
                return i.apply(this, arguments)
            }
        }
        h.extend(r, i, e);
        var s = function() {
            this.constructor = r
        };
        s.prototype = i.prototype;
        r.prototype = new s;
        if (t) h.extend(r.prototype, t);
        r.__super__ = i.prototype;
        return r
    };
    d.extend = v.extend = k.extend = w.extend = I.extend = R;
    var U = function() {
        throw new Error('A "url" property or function must be specified')
    };
    var M = function(t, e) {
        var i = e.error;
        e.error = function(r) {
            if (i) i(t, r, e);
            t.trigger("error", t, r, e)
        }
    }
}).call(this);
//# sourceMappingURL=backbone-min.map