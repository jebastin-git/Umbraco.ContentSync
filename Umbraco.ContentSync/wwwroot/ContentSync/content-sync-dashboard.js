/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, F = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), K = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const pt = (i) => new lt(typeof i == "string" ? i : i + "", void 0, J), ft = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new lt(e, i, J);
}, $t = (i, t) => {
  if (F) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = N.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, Y = F ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return pt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _t, defineProperty: yt, getOwnPropertyDescriptor: vt, getOwnPropertyNames: gt, getOwnPropertySymbols: mt, getPrototypeOf: bt } = Object, v = globalThis, G = v.trustedTypes, wt = G ? G.emptyScript : "", L = v.reactiveElementPolyfillSupport, R = (i, t) => i, D = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? wt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, X = (i, t) => !_t(i, t), Q = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && yt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = vt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const e = this.properties, s = [...gt(e), ...mt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(Y(r));
    } else t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : D).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = s.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : D;
      this._$Em = r;
      const u = a.fromAttribute(e, l.type);
      this[r] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? X)(n, e) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var s;
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
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
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
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[R("elementProperties")] = /* @__PURE__ */ new Map(), x[R("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: x }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, tt = (i) => i, I = T.trustedTypes, et = I ? I.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ct = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + y, At = `<${ht}>`, A = document, z = () => A.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", Z = Array.isArray, St = (i) => Z(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, st = /-->/g, it = />/g, m = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, ot = /"/g, dt = /^(?:script|style|textarea|title)$/i, xt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), d = xt(1), E = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), nt = /* @__PURE__ */ new WeakMap(), b = A.createTreeWalker(A, 129);
function ut(i, t) {
  if (!Z(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return et !== void 0 ? et.createHTML(t) : t;
}
const Et = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let u, p, h = -1, $ = 0;
    for (; $ < a.length && (o.lastIndex = $, p = o.exec(a), p !== null); ) $ = o.lastIndex, o === P ? p[1] === "!--" ? o = st : p[1] !== void 0 ? o = it : p[2] !== void 0 ? (dt.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = m) : p[3] !== void 0 && (o = m) : o === m ? p[0] === ">" ? (o = r ?? P, h = -1) : p[1] === void 0 ? h = -2 : (h = o.lastIndex - p[2].length, u = p[1], o = p[3] === void 0 ? m : p[3] === '"' ? ot : rt) : o === ot || o === rt ? o = m : o === st || o === it ? o = P : (o = m, r = void 0);
    const _ = o === m && i[l + 1].startsWith("/>") ? " " : "";
    n += o === P ? a + At : h >= 0 ? (s.push(u), a.slice(0, h) + ct + a.slice(h) + y + _) : a + y + (h === -2 ? l : _);
  }
  return [ut(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class M {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [u, p] = Et(t, e);
    if (this.el = M.createElement(u, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = b.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(ct)) {
          const $ = p[o++], _ = r.getAttribute(h).split(y), H = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: n, name: H[2], strings: _, ctor: H[1] === "." ? Pt : H[1] === "?" ? Rt : H[1] === "@" ? Tt : j }), r.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (dt.test(r.tagName)) {
          const h = r.textContent.split(y), $ = h.length - 1;
          if ($ > 0) {
            r.textContent = I ? I.emptyScript : "";
            for (let _ = 0; _ < $; _++) r.append(h[_], z()), b.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[$], z());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ht) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(i, t, e = i, s) {
  var o, l;
  if (t === E) return t;
  let r = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = C(i, r._$AS(i, t.values), r, s)), t;
}
class Ct {
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
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    b.currentNode = r;
    let n = b.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new k(n, n.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (u = new Ot(n, this, t)), this._$AV.push(u), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = b.nextNode(), o++);
    }
    return b.currentNode = A, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class k {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = C(this, t, e), U(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = M.createElement(ut(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new Ct(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = nt.get(t.strings);
    return e === void 0 && nt.set(t.strings, e = new M(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new k(this.O(z()), this.O(z()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = tt(t).nextSibling;
      tt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class j {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = C(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
    else {
      const l = t;
      let a, u;
      for (t = n[0], a = 0; a < n.length - 1; a++) u = C(this, l[s + a], e, a), u === E && (u = this._$AH[a]), o || (o = !U(u) || u !== this._$AH[a]), u === c ? t = c : t !== c && (t += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends j {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Rt extends j {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Tt extends j {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? c) === E) return;
    const s = this._$AH, r = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ot {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const B = T.litHtmlPolyfillSupport;
B == null || B(M, k), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.2");
const zt = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new k(t.insertBefore(z(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w = globalThis;
class O extends x {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = zt(e, this.renderRoot, this.renderOptions);
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
var at;
O._$litElement$ = !0, O.finalized = !0, (at = w.litElementHydrateSupport) == null || at.call(w, { LitElement: O });
const W = w.litElementPolyfillSupport;
W == null || W({ LitElement: O });
(w.litElementVersions ?? (w.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mt = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: X }, kt = (i = Mt, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Ht(i) {
  return (t, e) => typeof e == "object" ? kt(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function S(i) {
  return Ht({ ...i, state: !0, attribute: !1 });
}
var Nt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, g = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Dt(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && Nt(t, e, r), r;
};
let f = class extends O {
  constructor() {
    super(...arguments), this._snapshots = [], this._selectedId = "", this._preview = null, this._syncResult = null, this._busy = !1, this._error = "", this._success = "";
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
        <h2>Select Snapshot</h2>

        <div class="toolbar">
          <uui-button
            look="secondary"
            label="Load snapshots from the current environment"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy}
            @click=${this._loadSnapshots}>
            Load Snapshots
          </uui-button>

          ${this._snapshots.length > 0 ? d`
            <select
              aria-label="Choose a snapshot to preview or restore"
              .value=${this._selectedId}
              ?disabled=${this._busy}
              @change=${this._onSnapshotChange}>
              <option value="">— Select a snapshot —</option>
              ${this._snapshots.map((i) => d`
                <option value=${i.id}>
                  [${i.environment}]
                  ${new Date(i.createdAt).toLocaleString()}
                  — by ${i.createdBy}
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
            <span class="empty-hint">
              Click "Load Snapshots" to populate the list.
            </span>
          `}
        </div>
      </section>
    `;
  }
  _renderPreviewSection() {
    const i = this._preview;
    return d`
      <section aria-label="Preview results">
        <h2>Preview</h2>

        <!-- Summary counts -->
        <div class="summary-bar">
          <div class="count-card added">
            <span class="count">${i.addedCount}</span>
            <span class="label">Added</span>
          </div>
          <div class="count-card updated">
            <span class="count">${i.updatedCount}</span>
            <span class="label">Updated</span>
          </div>
          <div class="count-card deleted">
            <span class="count">${i.deletedCount}</span>
            <span class="label">Deleted</span>
          </div>
        </div>

        <!-- Conflict list -->
        ${i.hasConflicts ? this._renderConflicts(i.conflicts) : d`<p class="no-conflict">✓ No conflicts detected — safe to sync.</p>`}

        <!-- Diff detail (collapsible to keep the page uncluttered) -->
        ${i.totalChanges > 0 ? this._renderDiffDetail(i.diffs) : c}

        <!-- Action buttons -->
        <div class="actions">
          <uui-button
            look="positive"
            label="Apply this snapshot to the current environment"
            .state=${this._busy ? "loading" : void 0}
            ?disabled=${this._busy || i.hasConflicts}
            @click=${() => this._runSync(!1)}>
            Sync
          </uui-button>

          ${i.hasConflicts ? d`
            <uui-button
              look="danger"
              label="Force sync — apply despite detected conflicts"
              .state=${this._busy ? "loading" : void 0}
              ?disabled=${this._busy}
              @click=${() => this._runSync(!0)}>
              Force Sync
            </uui-button>
          ` : c}
        </div>
      </section>
    `;
  }
  _renderConflicts(i) {
    return d`
      <h3>⚠ Conflicts (${i.length})</h3>
      <div role="table" aria-label="Conflict list">
        <div class="conflict-header" role="row">
          <span role="columnheader">Item</span>
          <span role="columnheader">Property</span>
          <span role="columnheader">Type</span>
        </div>
        ${i.map((t) => d`
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
  _renderDiffDetail(i) {
    const e = i.slice(0, 100), s = i.length - 100;
    return d`
      <details>
        <summary>View property changes (${i.length})</summary>
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
            ${s > 0 ? d`
              <tr>
                <td colspan="5" style="text-align:center;color:#888;padding:8px">
                  …and ${s} more changes not shown
                </td>
              </tr>
            ` : c}
          </tbody>
        </table>
      </details>
    `;
  }
  _renderResultSection() {
    const i = this._syncResult;
    return d`
      <section aria-label="Sync result">
        <h2>Result</h2>
        <dl>
          <dt>Status</dt>
          <dd>${i.status}</dd>

          <dt>Items processed</dt>
          <dd>${i.importedCount}</dd>

          <dt>Completed at</dt>
          <dd>${new Date(i.processedAt).toLocaleString()}</dd>

          ${i.forced ? d`
            <dt>Forced</dt>
            <dd>Yes — conflicts were overridden</dd>
          ` : c}

          ${i.warnings.length > 0 ? d`
            <dt>Warnings</dt>
            <dd>
              <ul style="margin:0;padding-left:1.2em">
                ${i.warnings.map((t) => d`<li>${t}</li>`)}
              </ul>
            </dd>
          ` : c}
        </dl>
      </section>
    `;
  }
  // ── API helpers ───────────────────────────────────────────────────────────
  async _loadSnapshots() {
    this._startRequest();
    try {
      const i = await fetch("/api/contentsync/snapshots?env=Dev");
      if (!i.ok) throw new Error(`Server returned HTTP ${i.status}`);
      this._snapshots = await i.json(), this._selectedId = "", this._preview = null, this._syncResult = null;
    } catch (i) {
      this._setError(`Failed to load snapshots: ${V(i)}`);
    } finally {
      this._busy = !1;
    }
  }
  _onSnapshotChange(i) {
    this._selectedId = i.target.value, this._preview = null, this._syncResult = null, this._error = "", this._success = "";
  }
  async _runPreview() {
    if (this._selectedId) {
      this._startRequest(), this._preview = null, this._syncResult = null;
      try {
        const i = await fetch(`/api/contentsync/snapshot/${this._selectedId}`);
        if (!i.ok) throw new Error(`Could not load snapshot: HTTP ${i.status}`);
        const t = await i.json(), e = await fetch("/api/contentsync/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: t.data })
        });
        if (e.status === 400) {
          const s = await e.json();
          throw new Error(s.errors.join(" · "));
        }
        if (!e.ok) throw new Error(`Preview failed: HTTP ${e.status}`);
        this._preview = await e.json();
      } catch (i) {
        this._setError(V(i));
      } finally {
        this._busy = !1;
      }
    }
  }
  async _runSync(i) {
    if (this._selectedId) {
      this._startRequest(), this._syncResult = null;
      try {
        const t = i ? "?force=true" : "", e = await fetch(`/api/contentsync/restore/${this._selectedId}${t}`, {
          method: "POST"
        });
        if (e.status === 409) {
          this._preview = await e.json(), this._setError('Conflicts were detected. Review the list above or click "Force Sync" to override.');
          return;
        }
        if (e.status === 400) {
          const s = await e.json();
          throw new Error(s.errors.join(" · "));
        }
        if (!e.ok) throw new Error(`Sync failed: HTTP ${e.status}`);
        this._syncResult = await e.json(), this._success = i ? "Force sync completed. Conflicts were overridden." : "Sync completed successfully.";
      } catch (t) {
        this._setError(V(t));
      } finally {
        this._busy = !1;
      }
    }
  }
  // ── State helpers ─────────────────────────────────────────────────────────
  _startRequest() {
    this._busy = !0, this._error = "", this._success = "";
  }
  _setError(i) {
    this._error = i, this._success = "";
  }
};
f.styles = ft`
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
      background: var(--uui-color-warning-standalone, #fff3cd);
      color: var(--uui-color-warning-contrast, #7a4f00);
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
      border: 1px solid transparent;
    }
    .message.error   {
      background: var(--uui-color-danger-standalone, #f8d7da);
      border-color: var(--uui-color-danger, #c82333);
      color: #7d1a24;
    }
    .message.success {
      background: var(--uui-color-positive-standalone, #d4edda);
      border-color: var(--uui-color-positive, #28a745);
      color: #155724;
    }
    .empty-hint {
      color: var(--uui-color-text-alt, #888);
      font-style: italic;
      font-size: 0.875rem;
    }
    .no-conflict { color: var(--uui-color-positive-standalone, #1c8140); font-size: 0.875rem; }

    /* ── Utility ───────────────────────────────────────────────────── */
    uui-button + uui-button, uui-button + select { margin-left: 0; }
    .actions { display: flex; gap: var(--uui-size-space-3, 8px); margin-top: var(--uui-size-space-4, 12px); align-items: center; flex-wrap: wrap; }
  `;
g([
  S()
], f.prototype, "_snapshots", 2);
g([
  S()
], f.prototype, "_selectedId", 2);
g([
  S()
], f.prototype, "_preview", 2);
g([
  S()
], f.prototype, "_syncResult", 2);
g([
  S()
], f.prototype, "_busy", 2);
g([
  S()
], f.prototype, "_error", 2);
g([
  S()
], f.prototype, "_success", 2);
f = g([
  Ut("content-sync-dashboard")
], f);
function V(i) {
  return i instanceof Error ? i.message : String(i);
}
const Lt = f;
export {
  f as ContentSyncDashboard,
  Lt as default
};
