!(function (t, e, i) {
    "use strict";
    var o;
    (o = function (i) {
        var o = "webuiPopover",
            n = "webui-popover",
            s = "webui.popover",
            h = {
                placement: "auto",
                container: null,
                width: "auto",
                height: "auto",
                trigger: "click",
                style: "",
                selector: !1,
                delay: { show: null, hide: 300 },
                async: { type: "GET", before: null, success: null, error: null },
                cache: !0,
                multi: !1,
                arrow: !0,
                title: "",
                content: "",
                closeable: !1,
                padding: !0,
                url: "",
                type: "html",
                direction: "",
                animation: null,
                template:
                    '<div class="webui-popover"><div class="webui-arrow"></div><div class="webui-popover-inner"><a href="#" class="close"></a><h3 class="webui-popover-title"></h3><div class="webui-popover-content"><i class="icon-refresh"></i> <p>&nbsp;</p></div></div></div>',
                backdrop: !1,
                dismissible: !0,
                onShow: null,
                onHide: null,
                abortXHR: !0,
                autoHide: !1,
                offsetTop: 0,
                offsetLeft: 0,
                iframeOptions: { frameborder: "0", allowtransparency: "true", id: "", name: "", scrolling: "", onload: "", height: "", width: "" },
                hideEmpty: !1,
            },
            r = n + "-rtl",
            a = [],
            l = i('<div class="webui-popover-backdrop"></div>'),
            c = 0,
            p = !1,
            f = -2e3,
            d = i(e),
            u = function (t, e) {
                return isNaN(t) ? e || 0 : Number(t);
            },
            g = function (t) {
                return t.data("plugin_" + o);
            },
            m = function () {
                for (var t = null, e = 0; e < a.length; e++) (t = g(a[e])) && t.hide(!0);
                d.trigger("hiddenAll." + s);
            },
            v = "ontouchstart" in e.documentElement && /Mobi/.test(navigator.userAgent),
            y = function (t) {
                var e = { x: 0, y: 0 };
                if ("touchstart" === t.type || "touchmove" === t.type || "touchend" === t.type || "touchcancel" === t.type) {
                    var i = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0];
                    (e.x = i.pageX), (e.y = i.pageY);
                } else ("mousedown" !== t.type && "mouseup" !== t.type && "click" !== t.type) || ((e.x = t.pageX), (e.y = t.pageY));
                return e;
            };
        function w(t, e) {
            return (
                (this.$element = i(t)),
                e && (("string" !== i.type(e.delay) && "number" !== i.type(e.delay)) || (e.delay = { show: e.delay, hide: e.delay })),
                (this.options = i.extend({}, h, e)),
                (this._defaults = h),
                (this._name = o),
                (this._targetclick = !1),
                this.init(),
                a.push(this.$element),
                this
            );
        }
        (w.prototype = {
            init: function () {
                if (this.$element[0] instanceof e.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
                "manual" !== this.getTrigger() &&
                    (v
                        ? this.$element.off("touchend", this.options.selector).on("touchend", this.options.selector, i.proxy(this.toggle, this))
                        : "click" === this.getTrigger()
                        ? this.$element.off("click", this.options.selector).on("click", this.options.selector, i.proxy(this.toggle, this))
                        : "hover" === this.getTrigger() &&
                          this.$element
                              .off("mouseenter mouseleave click", this.options.selector)
                              .on("mouseenter", this.options.selector, i.proxy(this.mouseenterHandler, this))
                              .on("mouseleave", this.options.selector, i.proxy(this.mouseleaveHandler, this))),
                    (this._poped = !1),
                    (this._inited = !0),
                    (this._opened = !1),
                    (this._idSeed = c),
                    (this.id = o + this._idSeed),
                    (this.options.container = i(this.options.container || e.body).first()),
                    this.options.backdrop && l.appendTo(this.options.container).hide(),
                    c++,
                    "sticky" === this.getTrigger() && this.show(),
                    this.options.selector && (this._options = i.extend({}, this.options, { selector: "" }));
            },
            destroy: function () {
                for (var t = -1, e = 0; e < a.length; e++)
                    if (a[e] === this.$element) {
                        t = e;
                        break;
                    }
                a.splice(t, 1),
                    this.hide(),
                    this.$element.data("plugin_" + o, null),
                    "click" === this.getTrigger() ? this.$element.off("click") : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave"),
                    this.$target && this.$target.remove();
            },
            getDelegateOptions: function () {
                var t = {};
                return (
                    this._options &&
                        i.each(this._options, function (e, i) {
                            h[e] !== i && (t[e] = i);
                        }),
                    t
                );
            },
            hide: function (t, e) {
                if ((t || "sticky" !== this.getTrigger()) && this._opened) {
                    e && (e.preventDefault(), e.stopPropagation()), this.xhr && !0 === this.options.abortXHR && (this.xhr.abort(), (this.xhr = null));
                    var o = i.Event("hide." + s);
                    if ((this.$element.trigger(o, [this.$target]), this.$target)) {
                        this.$target.removeClass("in").addClass(this.getHideAnimation());
                        var n = this;
                        setTimeout(function () {
                            n.$target.hide(), n.getCache() || n.$target.remove();
                        }, n.getHideDelay());
                    }
                    this.options.backdrop && l.hide(), (this._opened = !1), this.$element.trigger("hidden." + s, [this.$target]), this.options.onHide && this.options.onHide(this.$target);
                }
            },
            resetAutoHide: function () {
                var t = this,
                    e = t.getAutoHide();
                e &&
                    (t.autoHideHandler && clearTimeout(t.autoHideHandler),
                    (t.autoHideHandler = setTimeout(function () {
                        t.hide();
                    }, e)));
            },
            delegate: function (t) {
                var e = i(t).data("plugin_" + o);
                return e || ((e = new w(t, this.getDelegateOptions())), i(t).data("plugin_" + o, e)), e;
            },
            toggle: function (t) {
                var e = this;
                t && (t.preventDefault(), t.stopPropagation(), this.options.selector && (e = this.delegate(t.currentTarget))), e[e.getTarget().hasClass("in") ? "hide" : "show"]();
            },
            hideAll: function () {
                m();
            },
            hideOthers: function () {
                !(function (t) {
                    for (var e = null, i = 0; i < a.length; i++) (e = g(a[i])) && e.id !== t.id && e.hide(!0);
                    d.trigger("hiddenAll." + s);
                })(this);
            },
            show: function () {
                if (!this._opened) {
                    var t = this.getTarget().removeClass().addClass(n).addClass(this._customTargetClass);
                    if ((this.options.multi || this.hideOthers(), !this.getCache() || !this._poped || "" === this.content)) {
                        if (
                            ((this.content = ""),
                            this.setTitle(this.getTitle()),
                            this.options.closeable || t.find(".close").off("click").remove(),
                            this.isAsync() ? this.setContentASync(this.options.content) : this.setContent(this.getContent()),
                            this.canEmptyHide() && "" === this.content)
                        )
                            return;
                        t.show();
                    }
                    this.displayContent(), this.options.onShow && this.options.onShow(t), this.bindBodyEvents(), this.options.backdrop && l.show(), (this._opened = !0), this.resetAutoHide();
                }
            },
            displayContent: function () {
                var t,
                    e = this.getElementPosition(),
                    o = this.getTarget().removeClass().addClass(n).addClass(this._customTargetClass),
                    h = this.getContentElement(),
                    a = o[0].offsetWidth,
                    l = o[0].offsetHeight,
                    c = i.Event("show." + s);
                if (this.canEmptyHide()) {
                    var p = h.children().html();
                    if (null !== p && 0 === p.trim().length) return;
                }
                this.$element.trigger(c, [o]);
                var d = this.$element.data("width") || this.options.width;
                "" === d && (d = this._defaults.width), "auto" !== d && o.width(d);
                var u = this.$element.data("height") || this.options.height;
                "" === u && (u = this._defaults.height),
                    "auto" !== u && h.height(u),
                    this.options.style && this.$target.addClass(n + "-" + this.options.style),
                    "rtl" !== this.options.direction || h.hasClass(r) || h.addClass(r),
                    this.options.arrow || o.find(".webui-arrow").remove(),
                    o.detach().css({ top: f, left: f, display: "block" }),
                    this.getAnimation() && o.addClass(this.getAnimation()),
                    o.appendTo(this.options.container),
                    (t = this.getPlacement(e)),
                    this.$element.trigger("added." + s),
                    this.initTargetEvents(),
                    this.options.padding || ("auto" !== this.options.height && h.css("height", h.outerHeight()), this.$target.addClass("webui-no-padding")),
                    this.options.maxHeight && h.css("maxHeight", this.options.maxHeight),
                    this.options.maxWidth && h.css("maxWidth", this.options.maxWidth),
                    (a = o[0].offsetWidth),
                    (l = o[0].offsetHeight);
                var g = this.getTargetPositin(e, t, a, l);
                if ((this.$target.css(g.position).addClass(t).addClass("in"), "iframe" === this.options.type)) {
                    var m = o.find("iframe"),
                        v = o.width(),
                        y = m.parent().height();
                    "" !== this.options.iframeOptions.width && "auto" !== this.options.iframeOptions.width && (v = this.options.iframeOptions.width),
                        "" !== this.options.iframeOptions.height && "auto" !== this.options.iframeOptions.height && (y = this.options.iframeOptions.height),
                        m.width(v).height(y);
                }
                if ((this.options.arrow || this.$target.css({ margin: 0 }), this.options.arrow)) {
                    var w = this.$target.find(".webui-arrow");
                    w.removeAttr("style"),
                        "left" === t || "right" === t ? w.css({ top: this.$target.height() / 2 }) : ("top" !== t && "bottom" !== t) || w.css({ left: this.$target.width() / 2 }),
                        g.arrowOffset && (-1 === g.arrowOffset.left || -1 === g.arrowOffset.top ? w.hide() : w.css(g.arrowOffset));
                }
                (this._poped = !0), this.$element.trigger("shown." + s, [this.$target]);
            },
            isTargetLoaded: function () {
                return 0 === this.getTarget().find("i.glyphicon-refresh").length;
            },
            getTriggerElement: function () {
                return this.$element;
            },
            getTarget: function () {
                if (!this.$target) {
                    var t = o + this._idSeed;
                    (this.$target = i(this.options.template).attr("id", t)), (this._customTargetClass = this.$target.attr("class") !== n ? this.$target.attr("class") : null), this.getTriggerElement().attr("data-target", t);
                }
                return this.$target.data("trigger-element") || this.$target.data("trigger-element", this.getTriggerElement()), this.$target;
            },
            removeTarget: function () {
                this.$target.remove(), (this.$target = null), (this.$contentElement = null);
            },
            getTitleElement: function () {
                return this.getTarget().find("." + n + "-title");
            },
            getContentElement: function () {
                return this.$contentElement || (this.$contentElement = this.getTarget().find("." + n + "-content")), this.$contentElement;
            },
            getTitle: function () {
                return this.$element.attr("data-title") || this.options.title || this.$element.attr("title");
            },
            getUrl: function () {
                return this.$element.attr("data-url") || this.options.url;
            },
            getAutoHide: function () {
                return this.$element.attr("data-auto-hide") || this.options.autoHide;
            },
            getOffsetTop: function () {
                return u(this.$element.attr("data-offset-top")) || this.options.offsetTop;
            },
            getOffsetLeft: function () {
                return u(this.$element.attr("data-offset-left")) || this.options.offsetLeft;
            },
            getCache: function () {
                var t = this.$element.attr("data-cache");
                if (void 0 !== t)
                    switch (t.toLowerCase()) {
                        case "true":
                        case "yes":
                        case "1":
                            return !0;
                        case "false":
                        case "no":
                        case "0":
                            return !1;
                    }
                return this.options.cache;
            },
            getTrigger: function () {
                return this.$element.attr("data-trigger") || this.options.trigger;
            },
            getDelayShow: function () {
                var t = this.$element.attr("data-delay-show");
                return void 0 !== t ? t : 0 === this.options.delay.show ? 0 : this.options.delay.show || 100;
            },
            getHideDelay: function () {
                var t = this.$element.attr("data-delay-hide");
                return void 0 !== t ? t : 0 === this.options.delay.hide ? 0 : this.options.delay.hide || 100;
            },
            getAnimation: function () {
                return this.$element.attr("data-animation") || this.options.animation;
            },
            getHideAnimation: function () {
                var t = this.getAnimation();
                return t ? t + "-out" : "out";
            },
            setTitle: function (t) {
                var e = this.getTitleElement();
                if (t) {
                  // Use textContent to automatically escape any special characters
                  e.textContent = t;
                  ("rtl" !== this.options.direction || e.hasClass(r) || e.addClass(r))
                } else {
                  e.remove();
                }
              },
            hasContent: function () {
                return this.getContent();
            },
            canEmptyHide: function () {
                return this.options.hideEmpty && "html" === this.options.type;
            },
            getIframe: function () {
                var src = this.getUrl(),
                    // Use DOMPurify to sanitize the src parameter
                    src = DOMPurify.sanitize(src),
                    iframe = i("<iframe></iframe>").attr("src", src),
                    e = this;
                return i.each(this._defaults.iframeOptions, function (i) {
                  void 0 !== e.options.iframeOptions[i] && t.attr(i, e.options.iframeOptions[i]);
                }),
                t;
              },              
            ggetContent: function () {
                if (this.getUrl()) {
                  switch (this.options.type) {
                    case "iframe":
                      this.content = this.getIframe();
                      break;
                    case "html":
                      try {
                        // Use textContent to automatically escape any special characters
                        var html = i(this.getUrl());
                        this.content.textContent = html;
                        this.content.is(":visible") || this.content.show();
                      } catch (e) {
                        console.error(e);
                      }
                      break;
                  }
                } else if (!this.content) {
                  var t = "";
                  if (
                    ((t = i.isFunction(this.options.content)
                      ? this.options.content.apply(this.$element[0], [this])
                      : this.options.content),
                    (this.content = this.$element.attr("data-content") || t),
                    !this.content)
                  ) {
                    var e = this.$element.next();
                    e && e.hasClass(n + "-content") && (this.content = e);
                  }
                }
                return this.content;
              },              
            setContent: function (t) {
                var e = this.getTarget(),
                    o = this.getContentElement();
                if ("string" == typeof t) {
                  // Use textContent to automatically escape any special characters
                  o.textContent = t;
                } else if (t instanceof i) {
                  o.html("");
                  if (this.options.cache) {
                    t.removeClass(n + "-content").appendTo(o);
                  } else {
                    t.clone(true, true).removeClass(n + "-content").appendTo(o);
                  }
                }
                this.$target = e;
              },              
            isAsync: function () {
                return "async" === this.options.type;
            },
            setContentASync: function (t) {
                var e = this;
                this.xhr ||
                    (this.xhr = i.ajax({
                        url: this.getUrl(),
                        type: this.options.async.type,
                        cache: this.getCache(),
                        beforeSend: function (t, i) {
                            e.options.async.before && e.options.async.before(e, t, i);
                        },
                        success: function (o) {
                            e.bindBodyEvents(),
                                t && i.isFunction(t) ? (e.content = t.apply(e.$element[0], [o])) : (e.content = o),
                                e.setContent(e.content),
                                e.getContentElement().removeAttr("style"),
                                e.displayContent(),
                                e.options.async.success && e.options.async.success(e, o);
                        },
                        complete: function () {
                            e.xhr = null;
                        },
                        error: function (t, i) {
                            e.options.async.error && e.options.async.error(e, t, i);
                        },
                    }));
            },
            bindBodyEvents: function () {
                p ||
                    (this.options.dismissible && "click" === this.getTrigger()
                        ? v
                            ? d.off("touchstart.webui-popover").on("touchstart.webui-popover", i.proxy(this.bodyTouchStartHandler, this))
                            : (d.off("keyup.webui-popover").on("keyup.webui-popover", i.proxy(this.escapeHandler, this)), d.off("click.webui-popover").on("click.webui-popover", i.proxy(this.bodyClickHandler, this)))
                        : "hover" === this.getTrigger() && d.off("touchend.webui-popover").on("touchend.webui-popover", i.proxy(this.bodyClickHandler, this)));
            },
            mouseenterHandler: function (t) {
                var e = this;
                t && this.options.selector && (e = this.delegate(t.currentTarget)),
                    e._timeout && clearTimeout(e._timeout),
                    (e._enterTimeout = setTimeout(function () {
                        e.getTarget().is(":visible") || e.show();
                    }, this.getDelayShow()));
            },
            mouseleaveHandler: function () {
                var t = this;
                clearTimeout(t._enterTimeout),
                    (t._timeout = setTimeout(function () {
                        t.hide();
                    }, this.getHideDelay()));
            },
            escapeHandler: function (t) {
                27 === t.keyCode && this.hideAll();
            },
            bodyTouchStartHandler: function (t) {
                var e = this,
                    o = i(t.currentTarget);
                o.on("touchend", function (t) {
                    e.bodyClickHandler(t), o.off("touchend");
                }),
                    o.on("touchmove", function () {
                        o.off("touchend");
                    });
            },
            bodyClickHandler: function (t) {
                p = !0;
                for (var e = !0, i = 0; i < a.length; i++) {
                    var o = g(a[i]);
                    if (o && o._opened) {
                        var n = o.getTarget().offset(),
                            s = n.left,
                            h = n.top,
                            r = n.left + o.getTarget().width(),
                            l = n.top + o.getTarget().height(),
                            c = y(t);
                        if (c.x >= s && c.x <= r && c.y >= h && c.y <= l) {
                            e = !1;
                            break;
                        }
                    }
                }
                e && m();
            },
            initTargetEvents: function () {
                "hover" === this.getTrigger() && this.$target.off("mouseenter mouseleave").on("mouseenter", i.proxy(this.mouseenterHandler, this)).on("mouseleave", i.proxy(this.mouseleaveHandler, this)),
                    this.$target.find(".close").off("click").on("click", i.proxy(this.hide, this, !0));
            },
            getPlacement: function (t) {
                var e,
                    i = this.options.container,
                    o = i.innerWidth(),
                    n = i.innerHeight(),
                    s = i.scrollTop(),
                    h = i.scrollLeft(),
                    r = Math.max(0, t.left - h),
                    a = Math.max(0, t.top - s),
                    l = "horizontal" === (e = "function" == typeof this.options.placement ? this.options.placement.call(this, this.getTarget()[0], this.$element[0]) : this.$element.data("placement") || this.options.placement),
                    c = "vertical" === e;
                return (
                    "auto" === e || l || c
                        ? (e =
                              r < o / 3
                                  ? a < n / 3
                                      ? l
                                          ? "right-bottom"
                                          : "bottom-right"
                                      : a < (2 * n) / 3
                                      ? c
                                          ? a <= n / 2
                                              ? "bottom-right"
                                              : "top-right"
                                          : "right"
                                      : l
                                      ? "right-top"
                                      : "top-right"
                                  : r < (2 * o) / 3
                                  ? a < n / 3
                                      ? l
                                          ? r <= o / 2
                                              ? "right-bottom"
                                              : "left-bottom"
                                          : "bottom"
                                      : a < (2 * n) / 3
                                      ? l
                                          ? r <= o / 2
                                              ? "right"
                                              : "left"
                                          : a <= n / 2
                                          ? "bottom"
                                          : "top"
                                      : l
                                      ? r <= o / 2
                                          ? "right-top"
                                          : "left-top"
                                      : "top"
                                  : a < n / 3
                                  ? l
                                      ? "left-bottom"
                                      : "bottom-left"
                                  : a < (2 * n) / 3
                                  ? c
                                      ? a <= n / 2
                                          ? "bottom-left"
                                          : "top-left"
                                      : "left"
                                  : l
                                  ? "left-top"
                                  : "top-left")
                        : "auto-top" === e
                        ? (e = r < o / 3 ? "top-right" : r < (2 * o) / 3 ? "top" : "top-left")
                        : "auto-bottom" === e
                        ? (e = r < o / 3 ? "bottom-right" : r < (2 * o) / 3 ? "bottom" : "bottom-left")
                        : "auto-left" === e
                        ? (e = a < n / 3 ? "left-top" : a < (2 * n) / 3 ? "left" : "left-bottom")
                        : "auto-right" === e && (e = a < n / 3 ? "right-bottom" : a < (2 * n) / 3 ? "right" : "right-top"),
                    e
                );
            },
            getElementPosition: function () {
                var t = this.$element[0].getBoundingClientRect(),
                    o = this.options.container,
                    n = o.css("position");
                if (o.is(e.body) || "static" === n) return i.extend({}, this.$element.offset(), { width: this.$element[0].offsetWidth || t.width, height: this.$element[0].offsetHeight || t.height });
                if ("fixed" === n) {
                    var s = o[0].getBoundingClientRect();
                    return { top: t.top - s.top + o.scrollTop(), left: t.left - s.left + o.scrollLeft(), width: t.width, height: t.height };
                }
                return "relative" === n
                    ? { top: this.$element.offset().top - o.offset().top, left: this.$element.offset().left - o.offset().left, width: this.$element[0].offsetWidth || t.width, height: this.$element[0].offsetHeight || t.height }
                    : void 0;
            },
            getTargetPositin: function (t, i, o, n) {
                var s = t,
                    h = this.options.container,
                    r = this.$element.outerWidth(),
                    a = this.$element.outerHeight(),
                    l = e.documentElement.scrollTop + h.scrollTop(),
                    c = e.documentElement.scrollLeft + h.scrollLeft(),
                    p = {},
                    d = null,
                    u = this.options.arrow ? 20 : 0,
                    g = r < u + 10 ? u : 0,
                    m = a < u + 10 ? u : 0,
                    v = 0,
                    y = e.documentElement.clientHeight + l,
                    w = e.documentElement.clientWidth + c,
                    b = s.left + s.width / 2 - g > 0,
                    $ = s.left + s.width / 2 + g < w,
                    T = s.top + s.height / 2 - m > 0,
                    C = s.top + s.height / 2 + m < y;
                switch (i) {
                    case "bottom":
                        p = { top: s.top + s.height, left: s.left + s.width / 2 - o / 2 };
                        break;
                    case "top":
                        p = { top: s.top - n, left: s.left + s.width / 2 - o / 2 };
                        break;
                    case "left":
                        p = { top: s.top + s.height / 2 - n / 2, left: s.left - o };
                        break;
                    case "right":
                        p = { top: s.top + s.height / 2 - n / 2, left: s.left + s.width };
                        break;
                    case "top-right":
                        (p = { top: s.top - n, left: b ? s.left - g : 10 }), (d = { left: b ? Math.min(r, o) / 2 + g : f });
                        break;
                    case "top-left":
                        (v = $ ? g : -10), (p = { top: s.top - n, left: s.left - o + s.width + v }), (d = { left: $ ? o - Math.min(r, o) / 2 - g : f });
                        break;
                    case "bottom-right":
                        (p = { top: s.top + s.height, left: b ? s.left - g : 10 }), (d = { left: b ? Math.min(r, o) / 2 + g : f });
                        break;
                    case "bottom-left":
                        (v = $ ? g : -10), (p = { top: s.top + s.height, left: s.left - o + s.width + v }), (d = { left: $ ? o - Math.min(r, o) / 2 - g : f });
                        break;
                    case "right-top":
                        (v = C ? m : -10), (p = { top: s.top - n + s.height + v, left: s.left + s.width }), (d = { top: C ? n - Math.min(a, n) / 2 - m : f });
                        break;
                    case "right-bottom":
                        (p = { top: T ? s.top - m : 10, left: s.left + s.width }), (d = { top: T ? Math.min(a, n) / 2 + m : f });
                        break;
                    case "left-top":
                        (v = C ? m : -10), (p = { top: s.top - n + s.height + v, left: s.left - o }), (d = { top: C ? n - Math.min(a, n) / 2 - m : f });
                        break;
                    case "left-bottom":
                        (p = { top: T ? s.top - m : 10, left: s.left - o }), (d = { top: T ? Math.min(a, n) / 2 + m : f });
                }
                return (p.top += this.getOffsetTop()), (p.left += this.getOffsetLeft()), { position: p, arrowOffset: d };
            },
        }),
            (i.fn[o] = function (t, e) {
                var n = [],
                    s = this.each(function () {
                        var s = i.data(this, "plugin_" + o);
                        s
                            ? "destroy" === t
                                ? s.destroy()
                                : "string" == typeof t && n.push(s[t]())
                            : (t ? ("string" == typeof t ? "destroy" !== t && (e || ((s = new w(this, null)), n.push(s[t]()))) : "object" == typeof t && (s = new w(this, t))) : (s = new w(this, null)), i.data(this, "plugin_" + o, s));
                    });
                return n.length ? n : s;
            });
        var b = {
            show: function (t, e) {
                e ? i(t).webuiPopover(e).webuiPopover("show") : i(t).webuiPopover("show");
            },
            hide: function (t) {
                i(t).webuiPopover("hide");
            },
            create: function (t, e) {
                (e = e || {}), i(t).webuiPopover(e);
            },
            isCreated: function (t) {
                var e = !0;
                return (
                    i(t).each(function (t, n) {
                        e = e && void 0 !== i(n).data("plugin_" + o);
                    }),
                    e
                );
            },
            hideAll: function () {
                m();
            },
            updateContent: function (t, e) {
                var n = i(t).data("plugin_" + o);
                if (n) {
                    var s = n.getCache();
                    (n.options.cache = !1), (n.options.content = e), n._opened ? ((n._opened = !1), n.show()) : n.isAsync() ? n.setContentASync(e) : n.setContent(e), (n.options.cache = s);
                }
            },
            updateContentAsync: function (t, e) {
                var n = i(t).data("plugin_" + o);
                if (n) {
                    var s = n.getCache(),
                        h = n.options.type;
                    (n.options.cache = !1), (n.options.url = e), n._opened ? ((n._opened = !1), n.show()) : ((n.options.type = "async"), n.setContentASync(n.content)), (n.options.cache = s), (n.options.type = h);
                }
            },
            setDefaultOptions: function (t) {
                h = i.extend({}, h, t);
            },
        };
        t.WebuiPopovers = b;
    }),
        "function" == typeof define && define.amd ? define(["jquery"], o) : "object" == typeof exports ? (module.exports = o(require("jquery"))) : o(t.jQuery);
})(window, document);
