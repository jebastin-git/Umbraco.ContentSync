import { UmbElementMixin as _t } from "@umbraco-cms/backoffice/element-api";
import { UMB_AUTH_CONTEXT as vt } from "@umbraco-cms/backoffice/auth";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, J = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), Y = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, e, o) {
    if (this._$cssResult$ = !0, o !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (J && t === void 0) {
      const o = e !== void 0 && e.length === 1;
      o && (t = Y.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && Y.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const mt = (s) => new ct(typeof s == "string" ? s : s + "", void 0, X), $t = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((o, i, n) => o + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new ct(e, s, X);
}, gt = (s, t) => {
  if (J) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const o = document.createElement("style"), i = H.litNonce;
    i !== void 0 && o.setAttribute("nonce", i), o.textContent = e.cssText, s.appendChild(o);
  }
}, G = J ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const o of t.cssRules) e += o.cssText;
  return mt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: bt, defineProperty: wt, getOwnPropertyDescriptor: xt, getOwnPropertyNames: St, getOwnPropertySymbols: At, getPrototypeOf: Et } = Object, g = globalThis, Q = g.trustedTypes, Pt = Q ? Q.emptyScript : "", q = g.reactiveElementPolyfillSupport, z = (s, t) => s, j = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Pt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (s, t) => !bt(s, t), tt = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const o = Symbol(), i = this.getPropertyDescriptor(t, o, e);
      i !== void 0 && wt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, o) {
    const { get: i, set: n } = xt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: i, set(r) {
      const l = i == null ? void 0 : i.call(this);
      n == null || n.call(this, r), this.requestUpdate(t, l, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, o = [...St(e), ...At(e)];
      for (const i of o) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [o, i] of e) this.elementProperties.set(o, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, o] of this.elementProperties) {
      const i = this._$Eu(e, o);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const i of o) e.unshift(G(i));
    } else t !== void 0 && e.push(G(t));
    return e;
  }
  static _$Eu(t, e) {
    const o = e.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const o of e.keys()) this.hasOwnProperty(o) && (t.set(o, this[o]), delete this[o]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var o;
      return (o = e.hostConnected) == null ? void 0 : o.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var o;
      return (o = e.hostDisconnected) == null ? void 0 : o.call(e);
    });
  }
  attributeChangedCallback(t, e, o) {
    this._$AK(t, o);
  }
  _$ET(t, e) {
    var n;
    const o = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, o);
    if (i !== void 0 && o.reflect === !0) {
      const r = (((n = o.converter) == null ? void 0 : n.toAttribute) !== void 0 ? o.converter : j).toAttribute(e, o.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, r;
    const o = this.constructor, i = o._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const l = o.getPropertyOptions(i), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : j;
      this._$Em = i;
      const p = a.fromAttribute(e, l.type);
      this[i] = p ?? ((r = this._$Ej) == null ? void 0 : r.get(i)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(t, e, o, i = !1, n) {
    var r;
    if (t !== void 0) {
      const l = this.constructor;
      if (i === !1 && (n = this[t]), o ?? (o = l.getPropertyOptions(t)), !((o.hasChanged ?? Z)(n, e) || o.useDefault && o.reflect && n === ((r = this._$Ej) == null ? void 0 : r.get(t)) && !this.hasAttribute(l._$Eu(t, o)))) return;
      this.C(t, e, o);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: o, reflect: i, wrapped: n }, r) {
    o && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || o || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var o;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: l } = r, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, r, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (o = this._$EO) == null || o.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((o) => {
      var i;
      return (i = o.hostUpdated) == null ? void 0 : i.call(o);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[z("elementProperties")] = /* @__PURE__ */ new Map(), A[z("finalized")] = /* @__PURE__ */ new Map(), q == null || q({ ReactiveElement: A }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, et = (s) => s, L = R.trustedTypes, st = L ? L.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ht = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + $, Ct = `<${dt}>`, S = document, k = () => S.createComment(""), O = (s) => s === null || typeof s != "object" && typeof s != "function", K = Array.isArray, zt = (s) => K(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, C = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, it = />/g, b = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, nt = /"/g, pt = /^(?:script|style|textarea|title)$/i, Rt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), h = Rt(1), E = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), w = S.createTreeWalker(S, 129);
function ut(s, t) {
  if (!K(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Tt = (s, t) => {
  const e = s.length - 1, o = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = C;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let p, u, d = -1, v = 0;
    for (; v < a.length && (r.lastIndex = v, u = r.exec(a), u !== null); ) v = r.lastIndex, r === C ? u[1] === "!--" ? r = ot : u[1] !== void 0 ? r = it : u[2] !== void 0 ? (pt.test(u[2]) && (i = RegExp("</" + u[2], "g")), r = b) : u[3] !== void 0 && (r = b) : r === b ? u[0] === ">" ? (r = i ?? C, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, p = u[1], r = u[3] === void 0 ? b : u[3] === '"' ? nt : rt) : r === nt || r === rt ? r = b : r === ot || r === it ? r = C : (r = b, i = void 0);
    const m = r === b && s[l + 1].startsWith("/>") ? " " : "";
    n += r === C ? a + Ct : d >= 0 ? (o.push(p), a.slice(0, d) + ht + a.slice(d) + $ + m) : a + $ + (d === -2 ? l : m);
  }
  return [ut(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), o];
};
class U {
  constructor({ strings: t, _$litType$: e }, o) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const l = t.length - 1, a = this.parts, [p, u] = Tt(t, e);
    if (this.el = U.createElement(p, o), w.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = w.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(ht)) {
          const v = u[r++], m = i.getAttribute(d).split($), N = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: n, name: N[2], strings: m, ctor: N[1] === "." ? Ot : N[1] === "?" ? Ut : N[1] === "@" ? Mt : B }), i.removeAttribute(d);
        } else d.startsWith($) && (a.push({ type: 6, index: n }), i.removeAttribute(d));
        if (pt.test(i.tagName)) {
          const d = i.textContent.split($), v = d.length - 1;
          if (v > 0) {
            i.textContent = L ? L.emptyScript : "";
            for (let m = 0; m < v; m++) i.append(d[m], k()), w.nextNode(), a.push({ type: 2, index: ++n });
            i.append(d[v], k());
          }
        }
      } else if (i.nodeType === 8) if (i.data === dt) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = i.data.indexOf($, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += $.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const o = S.createElement("template");
    return o.innerHTML = t, o;
  }
}
function P(s, t, e = s, o) {
  var r, l;
  if (t === E) return t;
  let i = o !== void 0 ? (r = e._$Co) == null ? void 0 : r[o] : e._$Cl;
  const n = O(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((l = i == null ? void 0 : i._$AO) == null || l.call(i, !1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, e, o)), o !== void 0 ? (e._$Co ?? (e._$Co = []))[o] = i : e._$Cl = i), i !== void 0 && (t = P(s, i._$AS(s, t.values), i, o)), t;
}
class kt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: o } = this._$AD, i = ((t == null ? void 0 : t.creationScope) ?? S).importNode(e, !0);
    w.currentNode = i;
    let n = w.nextNode(), r = 0, l = 0, a = o[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let p;
        a.type === 2 ? p = new M(n, n.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (p = new Nt(n, this, t)), this._$AV.push(p), a = o[++l];
      }
      r !== (a == null ? void 0 : a.index) && (n = w.nextNode(), r++);
    }
    return w.currentNode = S, i;
  }
  p(t) {
    let e = 0;
    for (const o of this._$AV) o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, e), e += o.strings.length - 2) : o._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, o, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = o, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = P(this, t, e), O(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: o } = t, i = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = U.createElement(ut(o.h, o.h[0]), this.options)), o);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const r = new kt(i, this), l = r.u(this.options);
      r.p(e), this.T(l), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let o, i = 0;
    for (const n of t) i === e.length ? e.push(o = new M(this.O(k()), this.O(k()), this, this.options)) : o = e[i], o._$AI(n), i++;
    i < e.length && (this._$AR(o && o._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var o;
    for ((o = this._$AP) == null ? void 0 : o.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = et(t).nextSibling;
      et(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, o, i, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = c;
  }
  _$AI(t, e = this, o, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = P(this, t, e, 0), r = !O(t) || t !== this._$AH && t !== E, r && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = n[0], a = 0; a < n.length - 1; a++) p = P(this, l[o + a], e, a), p === E && (p = this._$AH[a]), r || (r = !O(p) || p !== this._$AH[a]), p === c ? t = c : t !== c && (t += (p ?? "") + n[a + 1]), this._$AH[a] = p;
    }
    r && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ot extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Ut extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Mt extends B {
  constructor(t, e, o, i, n) {
    super(t, e, o, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = P(this, t, e, 0) ?? c) === E) return;
    const o = this._$AH, i = t === c && o !== c || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== c && (o === c || i);
    i && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
}
const V = R.litHtmlPolyfillSupport;
V == null || V(U, M), (R.litHtmlVersions ?? (R.litHtmlVersions = [])).push("3.3.2");
const It = (s, t, e) => {
  const o = (e == null ? void 0 : e.renderBefore) ?? t;
  let i = o._$litPart$;
  if (i === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    o._$litPart$ = i = new M(t.insertBefore(k(), n), n, void 0, e ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class T extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return E;
  }
}
var lt;
T._$litElement$ = !0, T.finalized = !0, (lt = x.litElementHydrateSupport) == null || lt.call(x, { LitElement: T });
const F = x.litElementPolyfillSupport;
F == null || F({ LitElement: T });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Z }, jt = (s = Dt, t, e) => {
  const { kind: o, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), o === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), o === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, s, l), l;
    } };
  }
  if (o === "setter") {
    const { name: r } = e;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + o);
};
function Lt(s) {
  return (t, e) => typeof e == "object" ? jt(s, t, e) : ((o, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, o), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(s) {
  return Lt({ ...s, state: !0, attribute: !1 });
}
var Bt = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, ft = (s) => {
  throw TypeError(s);
}, y = (s, t, e, o) => {
  for (var i = o > 1 ? void 0 : o ? qt(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (i = (o ? r(t, e, i) : r(i)) || i);
  return o && i && Bt(t, e, i), i;
}, yt = (s, t, e) => t.has(s) || ft("Cannot " + e), Wt = (s, t, e) => (yt(s, t, "read from private field"), e ? e.call(s) : t.get(s)), Vt = (s, t, e) => t.has(s) ? ft("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), Ft = (s, t, e, o) => (yt(s, t, "write to private field"), t.set(s, e), e), D;
let f = class extends _t(T) {
  constructor() {
    super(...arguments), this._snapshots = [], this._selectedId = "", this._preview = null, this._syncResult = null, this._busy = !1, this._error = "", this._success = "", this._environment = "Dev", this._lastExportedPayload = "", this._importPayload = "", this._syncSource = "snapshot", Vt(this, D);
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(vt, (s) => {
      Ft(this, D, s), this._loadSnapshots();
    });
  }
  // ── Render ────────────────────────────────────────────────────────────────
  render() {
    return h`
      <uui-box headline="Content Sync">

        ${this._busy ? h`<uui-loader-bar></uui-loader-bar>` : c}

        ${this._renderSnapshotSection()}

        ${this._renderImportSection()}

        ${this._preview !== null ? this._renderPreviewSection() : c}

        ${this._syncResult !== null ? this._renderResultSection() : c}

        ${this._error ? h`<p class="message error" role="alert">${this._error}</p>` : c}

        ${this._success ? h`<p class="message success">${this._success}</p>` : c}

      </uui-box>
    `;
  }
  // ── Section renderers ─────────────────────────────────────────────────────
  _renderSnapshotSection() {
    return h`
      <section aria-label="Snapshot selector">
        <h2>Snapshots</h2>

        <!-- Environment label -->
        <div class="env-row">
          <label for="env-input">Environment</label>
          <input
            id="env-input"
            type="text"
            .value=${this._environment}
            ?disabled=${this._busy}
            @input=${(s) => {
      this._environment = s.target.value.trim() || "Dev";
    }}
            placeholder="e.g. Dev, Staging, Production" />
        </div>

        <!-- Toolbar: Export + Refresh + snapshot picker -->
        <div class="toolbar">
          <uui-button
            look="primary"
            label="Export current content and create a snapshot"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy}
            @click=${this._exportAndRefresh}>
            Export &amp; Snapshot
          </uui-button>

          <uui-button
            look="secondary"
            label="Reload snapshot list"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy}
            @click=${this._loadSnapshots}>
            Refresh
          </uui-button>

          ${this._snapshots.length > 0 ? h`
            <select
              aria-label="Choose a snapshot to preview or restore"
              .value=${this._selectedId}
              ?disabled=${this._busy}
              @change=${this._onSnapshotChange}>
              <option value="">— Select a snapshot —</option>
              ${this._snapshots.map((s) => h`
                <option value=${s.id}>
                  [${s.environment}]
                  ${new Date(s.createdAt).toLocaleString()}
                  — by ${s.createdBy}
                </option>
              `)}
            </select>

            ${this._selectedId ? h`
              <uui-button
                look="secondary"
                label="Preview the selected snapshot"
                .state=${this._busy ? "loading" : void 0}
                ?disabled=${this._busy}
                @click=${this._runPreview}>
                Preview
              </uui-button>
            ` : c}

          ` : h`
            <span class="empty-hint">No snapshots yet — click "Export &amp; Snapshot" to create one.</span>
          `}
        </div>
        <!-- Copy-payload row: shown after a successful export -->
        ${this._lastExportedPayload ? h`
          <div class="copy-row">
            <uui-button
              look="secondary"
              label="Copy the exported JSON payload to clipboard"
              @click=${this._copyPayload}>
              Copy payload
            </uui-button>
            <span class="copy-hint">Paste this on another environment to sync content across.</span>
          </div>
        ` : c}

      </section>
    `;
  }
  _renderImportSection() {
    const s = this._importPayload.trim().length > 0;
    return h`
      <div class="import-section">
        <h2>Import from another environment</h2>
        <p class="import-hint">
          <strong>Cross-environment workflow:</strong>
          On your <em>source</em> environment click "Export &amp; Snapshot" then "Copy payload".
          Come back here (your <em>target</em> environment), paste the JSON below, then Preview and Sync.
        </p>
        <textarea
          placeholder="Paste exported JSON payload here…"
          .value=${this._importPayload}
          ?disabled=${this._busy}
          @input=${(t) => {
      this._importPayload = t.target.value, this._syncSource = "import", this._preview = null, this._syncResult = null, this._error = "", this._success = "";
    }}
        ></textarea>
        ${s ? h`
          <uui-button
            look="secondary"
            label="Preview what this payload would change"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy}
            @click=${this._runPreview}>
            Preview import
          </uui-button>
        ` : c}
      </div>
    `;
  }
  _renderPreviewSection() {
    const s = this._preview;
    return h`
      <section aria-label="Preview results">
        <h2>Preview</h2>

        <!-- Summary counts -->
        <div class="summary-bar">
          <div class="count-card added">
            <span class="count">${s.addedCount}</span>
            <span class="label">Added</span>
          </div>
          <div class="count-card updated">
            <span class="count">${s.updatedCount}</span>
            <span class="label">Updated</span>
          </div>
          <div class="count-card deleted">
            <span class="count">${s.deletedCount}</span>
            <span class="label">Deleted</span>
          </div>
        </div>

        <!-- Conflict list / no-conflict message -->
        ${s.hasConflicts ? this._renderConflicts(s.conflicts) : s.totalChanges === 0 ? h`<p class="no-changes-notice">
                No changes detected — the snapshot content matches this environment exactly.
                You can still click Sync to confirm the restore, but nothing will be modified.
              </p>` : h`<p class="no-conflict">✓ No conflicts detected — safe to sync.</p>`}

        <!-- Diff detail (collapsible to keep the page uncluttered) -->
        ${s.totalChanges > 0 ? this._renderDiffDetail(s.diffs) : c}

        <!-- Action buttons -->
        <div class="actions">
          <uui-button
            look="primary"
            color="positive"
            label="Apply this snapshot to the current environment"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy || s.hasConflicts}
            @click=${() => this._runSync(!1)}>
            Sync
          </uui-button>

          ${s.hasConflicts ? h`
            <span class="sync-hint">Resolve conflicts to sync, or —</span>
            <div class="force-sync-wrap">
              <span class="force-sync-label">Danger zone</span>
              <uui-button
                look="primary"
                color="danger"
                label="Force sync — override all conflicts and apply"
                .state=${this._busy ? "loading" : void 0}
                ?disabled=${this._busy}
                @click=${() => this._runSync(!0)}>
                Force Sync
              </uui-button>
            </div>
          ` : c}
        </div>
      </section>
    `;
  }
  _renderConflicts(s) {
    return h`
      <h3>⚠ Conflicts (${s.length})</h3>
      <div role="table" aria-label="Conflict list">
        <div class="conflict-header" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Property</span>
          <span role="columnheader">Type</span>
        </div>
        ${s.map((t) => h`
          <div class="conflict-row" role="row" title="Item ID: ${t.itemId}">
            <span role="cell">${t.itemName}</span>
            <span role="cell">${t.propertyName || "(item level)"}</span>
            <span role="cell">
              <span class="conflict-type ${t.conflictType}">${t.conflictType}</span>
            </span>
          </div>
        `)}
      </div>
    `;
  }
  _renderDiffDetail(s) {
    const e = s.slice(0, 100), o = s.length - 100;
    return h`
      <details>
        <summary>View property changes (${s.length})</summary>
        <table class="diff-table" aria-label="Property-level diff">
          <thead>
            <tr>
              <th>Item</th>
              <th>Property</th>
              <th>Change</th>
              <th>Source value</th>
              <th>Target value</th>
            </tr>
          </thead>
          <tbody>
            ${e.map((i) => h`
              <tr>
                <td title=${i.itemId}>${i.itemName}</td>
                <td>${i.propertyName}</td>
                <td class="change-${i.changeType}">${i.changeType}</td>
                <td>${i.sourcePropertyValue ?? h`<span class="null-value">—</span>`}</td>
                <td>${i.targetPropertyValue ?? h`<span class="null-value">—</span>`}</td>
              </tr>
            `)}
            ${o > 0 ? h`
              <tr>
                <td colspan="5" style="text-align:center;color:#888;padding:8px">
                  …and ${o} more changes not shown
                </td>
              </tr>
            ` : c}
          </tbody>
        </table>
      </details>
    `;
  }
  _renderResultSection() {
    const s = this._syncResult;
    return h`
      <section aria-label="Sync result">
        <h2>Result</h2>
        <dl>
          <dt>Status</dt>
          <dd>${s.status}</dd>

          <dt>Items processed</dt>
          <dd>${s.importedCount}</dd>

          <dt>Completed at</dt>
          <dd>${new Date(s.processedAt).toLocaleString()}</dd>

          ${s.forced ? h`
            <dt>Forced</dt>
            <dd>Yes — conflicts were overridden</dd>
          ` : c}

          ${s.warnings.length > 0 ? h`
            <dt>Warnings</dt>
            <dd>
              <ul style="margin:0;padding-left:1.2em">
                ${s.warnings.map((t) => h`<li>${t}</li>`)}
              </ul>
            </dd>
          ` : c}
        </dl>
      </section>
    `;
  }
  // ── API helpers ───────────────────────────────────────────────────────────
  // Wraps fetch with the backoffice bearer token so requests satisfy the
  // BackOfficeAccess auth policy. Token is retrieved from UMB_AUTH_CONTEXT.
  async _fetch(s, t = {}) {
    var i;
    const e = await ((i = Wt(this, D)) == null ? void 0 : i.getLatestToken()), o = {
      ...t.headers ?? {},
      ...e ? { Authorization: `Bearer ${e}` } : {}
    };
    return fetch(s, { ...t, headers: o });
  }
  async _exportAndRefresh() {
    this._startRequest();
    try {
      const s = encodeURIComponent(this._environment), t = await this._fetch(`/api/contentsync/export?env=${s}`);
      if (!t.ok) throw new Error(`Export failed: HTTP ${t.status}`);
      const e = await t.json();
      this._lastExportedPayload = e.payload ?? "", this._success = `Exported ${e.count} items — snapshot saved. Copy the payload below to import it on another environment.`, await this._fetchSnapshots(), e.snapshotId && (this._selectedId = e.snapshotId);
    } catch (s) {
      this._setError(`Export failed: ${I(s)}`);
    } finally {
      this._busy = !1;
    }
  }
  async _loadSnapshots() {
    this._startRequest();
    try {
      await this._fetchSnapshots();
    } catch (s) {
      this._setError(`Failed to load snapshots: ${I(s)}`);
    } finally {
      this._busy = !1;
    }
  }
  async _fetchSnapshots() {
    const s = encodeURIComponent(this._environment), t = await this._fetch(`/api/contentsync/snapshots?env=${s}`);
    if (!t.ok) throw new Error(`Server returned HTTP ${t.status}`);
    this._snapshots = await t.json(), this._selectedId = "", this._preview = null, this._syncResult = null;
  }
  _onSnapshotChange(s) {
    this._selectedId = s.target.value, this._syncSource = "snapshot", this._preview = null, this._syncResult = null, this._error = "", this._success = "";
  }
  async _runPreview() {
    const s = this._syncSource === "snapshot";
    if (!(s && !this._selectedId) && !(!s && !this._importPayload.trim())) {
      this._startRequest(), this._preview = null, this._syncResult = null;
      try {
        let t;
        if (s) {
          const o = await this._fetch(`/api/contentsync/snapshot/${this._selectedId}`);
          if (!o.ok) throw new Error(`Could not load snapshot: HTTP ${o.status}`);
          t = (await o.json()).data;
        } else
          t = this._importPayload.trim();
        const e = await this._fetch("/api/contentsync/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: t })
        });
        if (e.status === 400) {
          const o = await e.json();
          throw new Error(o.errors.join(" · "));
        }
        if (!e.ok) throw new Error(`Preview failed: HTTP ${e.status}`);
        this._preview = await e.json();
      } catch (t) {
        this._setError(I(t));
      } finally {
        this._busy = !1;
      }
    }
  }
  async _runSync(s) {
    const t = this._syncSource === "snapshot";
    if (!(t && !this._selectedId) && !(!t && !this._importPayload.trim())) {
      this._startRequest(), this._syncResult = null;
      try {
        const e = s ? "?force=true" : "", o = t ? await this._fetch(`/api/contentsync/restore/${this._selectedId}${e}`, { method: "POST" }) : await this._fetch(`/api/contentsync/sync${e}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: this._importPayload.trim() })
        });
        if (o.status === 409) {
          this._preview = await o.json(), this._setError('Conflicts were detected. Review the list above or click "Force Sync" to override.');
          return;
        }
        if (o.status === 400) {
          const i = await o.json();
          throw new Error(i.errors.join(" · "));
        }
        if (!o.ok) throw new Error(`Sync failed: HTTP ${o.status}`);
        this._syncResult = await o.json(), this._success = s ? "Force sync completed. Conflicts were overridden." : "Sync completed successfully.";
      } catch (e) {
        this._setError(I(e));
      } finally {
        this._busy = !1;
      }
    }
  }
  async _copyPayload() {
    try {
      await navigator.clipboard.writeText(this._lastExportedPayload), this._success = "Payload copied to clipboard. Paste it on your target environment.";
    } catch {
      this._setError("Clipboard write failed — please copy the payload manually from the browser console."), console.info("[ContentSync] exported payload:", this._lastExportedPayload);
    }
  }
  // ── State helpers ─────────────────────────────────────────────────────────
  _startRequest() {
    this._busy = !0, this._error = "", this._success = "";
  }
  _setError(s) {
    this._error = s, this._success = "";
  }
};
D = /* @__PURE__ */ new WeakMap();
f.styles = $t`
    :host {
      display: block;
      padding: var(--uui-size-layout-1, 24px);
      font-family: var(--uui-font-family, sans-serif);
      font-size: var(--uui-type-small-size, 14px);
      color: var(--uui-color-text, #1a1a1a);
    }

    /* ── Layout ────────────────────────────────────────────────────── */
    section {
      margin-bottom: var(--uui-size-layout-1, 24px);
    }
    h2 {
      margin: 0 0 var(--uui-size-space-4, 12px);
      font-size: var(--uui-type-h4-size, 1rem);
      font-weight: 600;
    }
    h3 {
      margin: 0 0 var(--uui-size-space-3, 8px);
      font-size: var(--uui-type-small-size, 14px);
      font-weight: 600;
      color: var(--uui-color-text-alt, #555);
    }

    /* ── Controls ──────────────────────────────────────────────────── */
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
    }
    select {
      padding: 6px 10px;
      min-width: 340px;
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      background: var(--uui-color-surface, #fff);
      color: var(--uui-color-text, #1a1a1a);
      font-size: inherit;
      cursor: pointer;
    }
    select:disabled { opacity: 0.5; cursor: not-allowed; }
    select:focus-visible { outline: 2px solid var(--uui-color-focus, #3544b1); outline-offset: 1px; }

    /* ── Summary counts ────────────────────────────────────────────── */
    .summary-bar {
      display: flex;
      gap: var(--uui-size-space-4, 12px);
      margin-bottom: var(--uui-size-space-4, 12px);
    }
    .count-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--uui-size-space-3, 8px) var(--uui-size-space-5, 16px);
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      min-width: 72px;
    }
    .count-card .count { font-size: 1.6rem; font-weight: 700; line-height: 1; }
    .count-card .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--uui-color-text-alt, #666);
      margin-top: 4px;
    }
    .count-card.added   .count { color: var(--uui-color-positive-standalone, #1c8140); }
    .count-card.updated .count { color: var(--uui-color-warning-standalone, #9a6010); }
    .count-card.deleted .count { color: var(--uui-color-danger-standalone, #b01c2e); }

    /* ── Conflict list ─────────────────────────────────────────────── */
    .conflict-header,
    .conflict-row {
      display: grid;
      grid-template-columns: 2fr 2fr 160px;
      gap: var(--uui-size-space-3, 8px);
      padding: 6px var(--uui-size-space-3, 8px);
      border-bottom: 1px solid var(--uui-color-border-standalone, #e5e5e5);
      font-size: 0.8125rem;
    }
    .conflict-header {
      font-weight: 600;
      color: var(--uui-color-text-alt, #666);
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    .conflict-row:last-child { border-bottom: none; }
    .conflict-type {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 3px;
      font-size: 0.7rem;
      font-weight: 600;
      background: #fff3cd;
      color: #7a4f00;
      white-space: nowrap;
    }
    .conflict-type.ModifiedInBoth  { background: #fff3cd; color: #7a4f00; }
    .conflict-type.DeletedInTarget { background: #f8d7da; color: #7d1a24; }
    .conflict-type.MissingInSource { background: #cce5ff; color: #004085; }

    /* ── Diff table ────────────────────────────────────────────────── */
    details { margin: var(--uui-size-space-3, 8px) 0; }
    details > summary {
      cursor: pointer;
      font-size: 0.8125rem;
      color: var(--uui-color-interactive, #3544b1);
      user-select: none;
    }
    .diff-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--uui-size-space-3, 8px);
      font-size: 0.8125rem;
    }
    .diff-table th {
      text-align: left;
      padding: 5px 8px;
      background: var(--uui-color-surface-alt, #f5f5f5);
      border-bottom: 2px solid var(--uui-color-border, #c4c4c4);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--uui-color-text-alt, #555);
    }
    .diff-table td {
      padding: 5px 8px;
      border-bottom: 1px solid var(--uui-color-border-standalone, #e5e5e5);
      vertical-align: top;
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .change-Added   { color: var(--uui-color-positive-standalone, #1c8140); font-weight: 600; }
    .change-Updated { color: var(--uui-color-warning-standalone, #9a6010); font-weight: 600; }
    .change-Deleted { color: var(--uui-color-danger-standalone, #b01c2e); font-weight: 600; }
    .null-value { color: var(--uui-color-text-alt, #aaa); font-style: italic; }

    /* ── Result block ──────────────────────────────────────────────── */
    dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 16px; }
    dt { font-weight: 600; color: var(--uui-color-text-alt, #555); }
    dd { margin: 0; }

    /* ── Status messages ───────────────────────────────────────────── */
    .message {
      margin-top: var(--uui-size-space-3, 8px);
      padding: 8px 12px;
      border-radius: var(--uui-border-radius, 3px);
      font-size: 0.875rem;
      border: none;
      color: #fff;
    }
    .message.error   { background: var(--uui-color-danger-standalone, #b01c2e); }
    .message.success { background: var(--uui-color-positive-standalone, #1c8140); }
    .empty-hint {
      color: var(--uui-color-text-alt, #888);
      font-style: italic;
      font-size: 0.875rem;
    }
    .no-conflict { color: var(--uui-color-positive-standalone, #1c8140); font-size: 0.875rem; }

    /* ── Environment input ─────────────────────────────────────────── */
    .env-row {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
      margin-bottom: var(--uui-size-space-4, 12px);
    }
    .env-row label {
      font-weight: 600;
      font-size: 0.8125rem;
      color: var(--uui-color-text-alt, #555);
      white-space: nowrap;
    }
    .env-row input {
      padding: 5px 10px;
      width: 160px;
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      background: var(--uui-color-surface, #fff);
      color: var(--uui-color-text, #1a1a1a);
      font-size: inherit;
    }
    .env-row input:focus-visible { outline: 2px solid var(--uui-color-focus, #3544b1); outline-offset: 1px; }

    /* ── Sync actions ──────────────────────────────────────────────── */
    .actions {
      display: flex;
      gap: var(--uui-size-space-3, 8px);
      margin-top: var(--uui-size-space-4, 12px);
      align-items: center;
      flex-wrap: wrap;
    }
    .sync-hint {
      font-size: 0.8125rem;
      color: var(--uui-color-text-alt, #777);
      font-style: italic;
    }
    .force-sync-wrap {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
      padding-left: var(--uui-size-space-4, 12px);
      border-left: 2px solid var(--uui-color-danger-standalone, #b01c2e);
      margin-left: var(--uui-size-space-3, 8px);
    }
    .force-sync-label {
      font-size: 0.75rem;
      color: var(--uui-color-danger-standalone, #b01c2e);
      font-weight: 600;
    }

    /* ── Import section ────────────────────────────────────────────── */
    .import-section {
      margin-top: var(--uui-size-layout-1, 24px);
      padding-top: var(--uui-size-layout-1, 24px);
      border-top: 1px solid var(--uui-color-border-standalone, #e5e5e5);
    }
    .import-hint {
      font-size: 0.875rem;
      color: var(--uui-color-text-alt, #666);
      margin: 0 0 var(--uui-size-space-4, 12px);
      line-height: 1.5;
    }
    .import-hint strong { color: var(--uui-color-text, #1a1a1a); }
    textarea {
      display: block;
      width: 100%;
      min-height: 100px;
      padding: 8px 10px;
      border: 1px solid var(--uui-color-border, #c4c4c4);
      border-radius: var(--uui-border-radius, 3px);
      background: var(--uui-color-surface, #fff);
      color: var(--uui-color-text, #1a1a1a);
      font-family: monospace;
      font-size: 0.8125rem;
      resize: vertical;
      box-sizing: border-box;
      margin-bottom: var(--uui-size-space-3, 8px);
    }
    textarea:focus-visible { outline: 2px solid var(--uui-color-focus, #3544b1); outline-offset: 1px; }
    textarea:disabled { opacity: 0.5; }

    /* ── Copy-payload button row ───────────────────────────────────── */
    .copy-row {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3, 8px);
      margin-top: var(--uui-size-space-3, 8px);
    }
    .copy-hint {
      font-size: 0.8125rem;
      color: var(--uui-color-text-alt, #777);
    }

    /* ── Zero-changes notice ───────────────────────────────────────── */
    .no-changes-notice {
      font-size: 0.875rem;
      color: var(--uui-color-text-alt, #666);
      font-style: italic;
      margin-bottom: var(--uui-size-space-3, 8px);
    }

    /* ── Utility ───────────────────────────────────────────────────── */
    uui-button + uui-button, uui-button + select { margin-left: 0; }
  `;
y([
  _()
], f.prototype, "_snapshots", 2);
y([
  _()
], f.prototype, "_selectedId", 2);
y([
  _()
], f.prototype, "_preview", 2);
y([
  _()
], f.prototype, "_syncResult", 2);
y([
  _()
], f.prototype, "_busy", 2);
y([
  _()
], f.prototype, "_error", 2);
y([
  _()
], f.prototype, "_success", 2);
y([
  _()
], f.prototype, "_environment", 2);
y([
  _()
], f.prototype, "_lastExportedPayload", 2);
y([
  _()
], f.prototype, "_importPayload", 2);
y([
  _()
], f.prototype, "_syncSource", 2);
f = y([
  Ht("content-sync-dashboard")
], f);
function I(s) {
  return s instanceof Error ? s.message : String(s);
}
const Yt = f;
export {
  f as ContentSyncDashboard,
  Yt as default
};
