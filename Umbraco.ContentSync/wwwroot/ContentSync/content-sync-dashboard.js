import { UmbElementMixin as $t } from "@umbraco-cms/backoffice/element-api";
import { UMB_AUTH_CONTEXT as vt } from "@umbraco-cms/backoffice/auth";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, X = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), G = /* @__PURE__ */ new WeakMap();
let ct = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (X && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = G.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && G.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const yt = (s) => new ct(typeof s == "string" ? s : s + "", void 0, J), mt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new ct(e, s, J);
}, gt = (s, t) => {
  if (X) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = D.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, Y = X ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return yt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: bt, defineProperty: wt, getOwnPropertyDescriptor: xt, getOwnPropertyNames: At, getOwnPropertySymbols: St, getPrototypeOf: Et } = Object, m = globalThis, Q = m.trustedTypes, Ct = Q ? Q.emptyScript : "", q = m.reactiveElementPolyfillSupport, R = (s, t) => s, j = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Ct : null;
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
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), m.litPropertyMetadata ?? (m.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && wt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = xt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const e = this.properties, i = [...At(e), ...St(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(Y(r));
    } else t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return gt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : j).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : j;
      this._$Em = r;
      const u = a.fromAttribute(e, l.type);
      this[r] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? Z)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[R("elementProperties")] = /* @__PURE__ */ new Map(), S[R("finalized")] = /* @__PURE__ */ new Map(), q == null || q({ ReactiveElement: S }), (m.reactiveElementVersions ?? (m.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, et = (s) => s, L = z.trustedTypes, st = L ? L.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ht = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + y, Pt = `<${dt}>`, A = document, k = () => A.createComment(""), O = (s) => s === null || typeof s != "object" && typeof s != "function", K = Array.isArray, Rt = (s) => K(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", W = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, it = /-->/g, rt = />/g, b = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ot = /'/g, nt = /"/g, ut = /^(?:script|style|textarea|title)$/i, zt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = zt(1), E = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), w = A.createTreeWalker(A, 129);
function pt(s, t) {
  if (!K(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Tt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let u, p, h = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, p = o.exec(a), p !== null); ) _ = o.lastIndex, o === P ? p[1] === "!--" ? o = it : p[1] !== void 0 ? o = rt : p[2] !== void 0 ? (ut.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = b) : p[3] !== void 0 && (o = b) : o === b ? p[0] === ">" ? (o = r ?? P, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? b : p[3] === '"' ? nt : ot) : o === nt || o === ot ? o = b : o === it || o === rt ? o = P : (o = b, r = void 0);
    const v = o === b && s[l + 1].startsWith("/>") ? " " : "";
    n += o === P ? a + Pt : h >= 0 ? (i.push(u), a.slice(0, h) + ht + a.slice(h) + y + v) : a + y + (h === -2 ? l : v);
  }
  return [pt(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [u, p] = Tt(t, e);
    if (this.el = U.createElement(u, i), w.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = w.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(ht)) {
          const _ = p[o++], v = r.getAttribute(h).split(y), H = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: H[2], strings: v, ctor: H[1] === "." ? Ot : H[1] === "?" ? Ut : H[1] === "@" ? Mt : B }), r.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (ut.test(r.tagName)) {
          const h = r.textContent.split(y), _ = h.length - 1;
          if (_ > 0) {
            r.textContent = L ? L.emptyScript : "";
            for (let v = 0; v < _; v++) r.append(h[v], k()), w.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[_], k());
          }
        }
      } else if (r.nodeType === 8) if (r.data === dt) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function C(s, t, e = s, i) {
  var o, l;
  if (t === E) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = O(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = C(s, r._$AS(s, t.values), r, i)), t;
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    w.currentNode = r;
    let n = w.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new M(n, n.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (u = new Ht(n, this, t)), this._$AV.push(u), a = i[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = w.nextNode(), o++);
    }
    return w.currentNode = A, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class M {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = C(this, t, e), O(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && O(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(pt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new kt(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new M(this.O(k()), this.O(k()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = et(t).nextSibling;
      et(t).remove(), t = r;
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
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = C(this, t, e, 0), o = !O(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
    else {
      const l = t;
      let a, u;
      for (t = n[0], a = 0; a < n.length - 1; a++) u = C(this, l[i + a], e, a), u === E && (u = this._$AH[a]), o || (o = !O(u) || u !== this._$AH[a]), u === c ? t = c : t !== c && (t += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    o && !r && this.j(t);
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
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? c) === E) return;
    const i = this._$AH, r = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const V = z.litHtmlPolyfillSupport;
V == null || V(U, M), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.2");
const Nt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new M(t.insertBefore(k(), n), n, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class T extends S {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Nt(e, this.renderRoot, this.renderOptions);
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
const Dt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: Z }, jt = (s = It, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Lt(s) {
  return (t, e) => typeof e == "object" ? jt(s, t, e) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(s) {
  return Lt({ ...s, state: !0, attribute: !1 });
}
var Bt = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, ft = (s) => {
  throw TypeError(s);
}, $ = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? qt(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && Bt(t, e, r), r;
}, _t = (s, t, e) => t.has(s) || ft("Cannot " + e), Wt = (s, t, e) => (_t(s, t, "read from private field"), e ? e.call(s) : t.get(s)), Vt = (s, t, e) => t.has(s) ? ft("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), Ft = (s, t, e, i) => (_t(s, t, "write to private field"), t.set(s, e), e), I;
let f = class extends $t(T) {
  constructor() {
    super(...arguments), this._snapshots = [], this._selectedId = "", this._preview = null, this._syncResult = null, this._busy = !1, this._error = "", this._success = "", this._environment = "Dev", Vt(this, I);
  }
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(vt, (s) => {
      Ft(this, I, s), this._loadSnapshots();
    });
  }
  // ── Render ────────────────────────────────────────────────────────────────
  render() {
    return d`
      <uui-box headline="Content Sync">

        ${this._busy ? d`<uui-loader-bar></uui-loader-bar>` : c}

        ${this._renderSnapshotSection()}

        ${this._preview !== null ? this._renderPreviewSection() : c}

        ${this._syncResult !== null ? this._renderResultSection() : c}

        ${this._error ? d`<p class="message error" role="alert">${this._error}</p>` : c}

        ${this._success ? d`<p class="message success">${this._success}</p>` : c}

      </uui-box>
    `;
  }
  // ── Section renderers ─────────────────────────────────────────────────────
  _renderSnapshotSection() {
    return d`
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

          ${this._snapshots.length > 0 ? d`
            <select
              aria-label="Choose a snapshot to preview or restore"
              .value=${this._selectedId}
              ?disabled=${this._busy}
              @change=${this._onSnapshotChange}>
              <option value="">— Select a snapshot —</option>
              ${this._snapshots.map((s) => d`
                <option value=${s.id}>
                  [${s.environment}]
                  ${new Date(s.createdAt).toLocaleString()}
                  — by ${s.createdBy}
                </option>
              `)}
            </select>

            ${this._selectedId ? d`
              <uui-button
                look="secondary"
                label="Preview the selected snapshot"
                .state=${this._busy ? "loading" : void 0}
                ?disabled=${this._busy}
                @click=${this._runPreview}>
                Preview
              </uui-button>
            ` : c}

          ` : d`
            <span class="empty-hint">No snapshots yet — click "Export &amp; Snapshot" to create one.</span>
          `}
        </div>
      </section>
    `;
  }
  _renderPreviewSection() {
    const s = this._preview;
    return d`
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

        <!-- Conflict list -->
        ${s.hasConflicts ? this._renderConflicts(s.conflicts) : d`<p class="no-conflict">✓ No conflicts detected — safe to sync.</p>`}

        <!-- Diff detail (collapsible to keep the page uncluttered) -->
        ${s.totalChanges > 0 ? this._renderDiffDetail(s.diffs) : c}

        <!-- Action buttons -->
        <div class="actions">
          <uui-button
            look="positive"
            label="Apply this snapshot to the current environment"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy || s.hasConflicts}
            @click=${() => this._runSync(!1)}>
            Sync
          </uui-button>

          ${s.hasConflicts ? d`
            <span class="sync-hint">Resolve conflicts to sync, or —</span>
            <div class="force-sync-wrap">
              <span class="force-sync-label">Danger zone</span>
              <uui-button
                look="danger"
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
    return d`
      <h3>⚠ Conflicts (${s.length})</h3>
      <div role="table" aria-label="Conflict list">
        <div class="conflict-header" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Property</span>
          <span role="columnheader">Type</span>
        </div>
        ${s.map((t) => d`
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
    const e = s.slice(0, 100), i = s.length - 100;
    return d`
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
            ${e.map((r) => d`
              <tr>
                <td title=${r.itemId}>${r.itemName}</td>
                <td>${r.propertyName}</td>
                <td class="change-${r.changeType}">${r.changeType}</td>
                <td>${r.sourcePropertyValue ?? d`<span class="null-value">—</span>`}</td>
                <td>${r.targetPropertyValue ?? d`<span class="null-value">—</span>`}</td>
              </tr>
            `)}
            ${i > 0 ? d`
              <tr>
                <td colspan="5" style="text-align:center;color:#888;padding:8px">
                  …and ${i} more changes not shown
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
    return d`
      <section aria-label="Sync result">
        <h2>Result</h2>
        <dl>
          <dt>Status</dt>
          <dd>${s.status}</dd>

          <dt>Items processed</dt>
          <dd>${s.importedCount}</dd>

          <dt>Completed at</dt>
          <dd>${new Date(s.processedAt).toLocaleString()}</dd>

          ${s.forced ? d`
            <dt>Forced</dt>
            <dd>Yes — conflicts were overridden</dd>
          ` : c}

          ${s.warnings.length > 0 ? d`
            <dt>Warnings</dt>
            <dd>
              <ul style="margin:0;padding-left:1.2em">
                ${s.warnings.map((t) => d`<li>${t}</li>`)}
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
    var r;
    const e = await ((r = Wt(this, I)) == null ? void 0 : r.getLatestToken()), i = {
      ...t.headers ?? {},
      ...e ? { Authorization: `Bearer ${e}` } : {}
    };
    return fetch(s, { ...t, headers: i });
  }
  async _exportAndRefresh() {
    this._startRequest();
    try {
      const s = await this._fetch("/api/contentsync/export");
      if (!s.ok) throw new Error(`Export failed: HTTP ${s.status}`);
      const t = await s.json();
      this._success = `Exported ${t.count} items — snapshot saved.`, await this._fetchSnapshots();
    } catch (s) {
      this._setError(`Export failed: ${N(s)}`);
    } finally {
      this._busy = !1;
    }
  }
  async _loadSnapshots() {
    this._startRequest();
    try {
      await this._fetchSnapshots();
    } catch (s) {
      this._setError(`Failed to load snapshots: ${N(s)}`);
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
    this._selectedId = s.target.value, this._preview = null, this._syncResult = null, this._error = "", this._success = "";
  }
  async _runPreview() {
    if (this._selectedId) {
      this._startRequest(), this._preview = null, this._syncResult = null;
      try {
        const s = await this._fetch(`/api/contentsync/snapshot/${this._selectedId}`);
        if (!s.ok) throw new Error(`Could not load snapshot: HTTP ${s.status}`);
        const t = await s.json(), e = await this._fetch("/api/contentsync/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: t.data })
        });
        if (e.status === 400) {
          const i = await e.json();
          throw new Error(i.errors.join(" · "));
        }
        if (!e.ok) throw new Error(`Preview failed: HTTP ${e.status}`);
        this._preview = await e.json();
      } catch (s) {
        this._setError(N(s));
      } finally {
        this._busy = !1;
      }
    }
  }
  async _runSync(s) {
    if (this._selectedId) {
      this._startRequest(), this._syncResult = null;
      try {
        const t = s ? "?force=true" : "", e = await this._fetch(`/api/contentsync/restore/${this._selectedId}${t}`, {
          method: "POST"
        });
        if (e.status === 409) {
          this._preview = await e.json(), this._setError('Conflicts were detected. Review the list above or click "Force Sync" to override.');
          return;
        }
        if (e.status === 400) {
          const i = await e.json();
          throw new Error(i.errors.join(" · "));
        }
        if (!e.ok) throw new Error(`Sync failed: HTTP ${e.status}`);
        this._syncResult = await e.json(), this._success = s ? "Force sync completed. Conflicts were overridden." : "Sync completed successfully.";
      } catch (t) {
        this._setError(N(t));
      } finally {
        this._busy = !1;
      }
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
I = /* @__PURE__ */ new WeakMap();
f.styles = mt`
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

    /* ── Utility ───────────────────────────────────────────────────── */
    uui-button + uui-button, uui-button + select { margin-left: 0; }
  `;
$([
  g()
], f.prototype, "_snapshots", 2);
$([
  g()
], f.prototype, "_selectedId", 2);
$([
  g()
], f.prototype, "_preview", 2);
$([
  g()
], f.prototype, "_syncResult", 2);
$([
  g()
], f.prototype, "_busy", 2);
$([
  g()
], f.prototype, "_error", 2);
$([
  g()
], f.prototype, "_success", 2);
$([
  g()
], f.prototype, "_environment", 2);
f = $([
  Dt("content-sync-dashboard")
], f);
function N(s) {
  return s instanceof Error ? s.message : String(s);
}
const Gt = f;
export {
  f as ContentSyncDashboard,
  Gt as default
};
