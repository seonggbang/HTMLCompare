/*!
* tn3 v1.1.0.28
* http://tn3gallery.com/
*
* License
* http://tn3gallery.com/license
*
* Date: 29 Jul, 2011 16:21:54 +0300
*/
(function(f)
{
    function e(h)
    {
        var k = h.skinDir + "/" + h.skin,
            l = p[k];
        if (l)
        {
            l.loaded ? a.call(this, h, l.html) : l.queue.push({
                c: this,
                s: h
            });
        } else
        {
            p[k] = {
                loaded: false,
                queue: [{
                    c: this,
                    s: h
                }]
            };
            f.ajax({
                url: k + ".html",
                dataType: "text",
                success: function(m)
                {
                    var q = p[k];
                    q.loaded = true;
                    q.html = m;
                    for (m = 0; m < q.queue.length; m++)
                    {
                        a.call(q.queue[m].c, q.queue[m].s, q.html);
                    }
                },
                dataFilter: function(m)
                {
                    return m = m.substring(m.indexOf("<body>") + 6, m.lastIndexOf("</body>"));
                },
                error: function()
                {
                    if (h.error)
                    {
                        var m = f.Event("tn3_error");
                        m.description = "tn3 skin load error";
                        h.error(m);
                    }
                }
            });
        }
        return this;
    };
    function a(h, k)
    {
        this.each(function()
        {
            for (var l = f(this), m, q, r = k.indexOf("<img src="); r != -1; )
            {
                r += 10;
                q = k.indexOf('"', r);
                m = h.skinDir + "/" + k.substring(r, q);
                k = k.substr(0, r) + m + k.substr(q);
                r = k.indexOf("<img src=", r);
            }
            l.append(k);
            l.data("tn3").init(l, h.fullOnly);
        });
    };
    function b(h)
    {
        var k = [],
            l = h.children(".tn3.album"),
            m, q;
        if (l.length > 0)
        {
            l.each(function(r)
            {
                m = f(this);
                k[r] = {
                    title: m.find(":header").html()
                };
                f.extend(k[r], c(m));
                q = d(m);
                if (q)
                {
                    k[r].imgs = q;
                    if (!k[r].thumb)
                    {
                        k[r].thumb = k[r].imgs[0].thumb;
                    }
                }
            });
        }
        else
        {
            q = d(h);
            if (q)
            {
                k[0] = {
                    imgs: q
                };
            }
        }
        return k;
    };
    function d(h)
    {
        var k = [], l, m, q;
        l = h.find("li");
        if (l.length > 0)
        {
            l.each(function(r)
            {
                m = f(this);
                q = m.find(":header");
                k[r] = {
                    title: q.html(),
                    img: m.find("a").attr("href"),
                    thumb: m.find("a img").attr("src")
                };
                if (!k[r].img)
                {
                    k[r].img = m.find("img").attr("src");
                }
                f.extend(k[r], c(m));
            });
        } else
        {
            l = h.find("img");
            l.each(function(r)
            {
                m = f(this);
                $at = m.parent("a");
                k[r] = !$at.length ? {
                    title: m.attr("title"),
                    img: m.attr("src")
                } : {
                    title: m.attr("title"),
                    img: $at.attr("href"),
                    thumb: m.attr("src")
                };
            });
        }
        if (!k.length)
        {
            return null;
        }
        return k;
    };
    function c(h)
    {
        var k = {};
        h = h.children(".tn3");
        var l;
        f.each(h, function()
        {
            l = f(this);
            k[l.attr("class").substr(4)] = l.html();
        });
        return k;
    };
    function g(h)
    {
        f('a[href^="#tn3-' + h + '"]').click(function(k)
        {
            var l = j[h];
            k = f(k.currentTarget).attr("href");
            k = k.substr(k.indexOf("-", 5) + 1);
            k = k.split("-");
            switch (k[0])
            {
                case "next":
                    l.cAlbum !== null && l.show("next", k[1] == "fs");
                    break;
                case "prev":
                    l.cAlbum !== null && l.show("prev", k[1] == "fs");
                    break;
                default:
                    l.cAlbum != parseInt(k[0]) ? l.showAlbum(parseInt(k[0]), parseInt(k[1]), k[2] == "fs") : l.show(parseInt(k[1]), k[2] == "fs");
                    break;
            }
        });
    };
    function i()
    {
        if (j.length === 0)
        {
            var h = f(".tn3gallery");
            h.length > 0 && h.tn3({});
        }
    };
    if ((/1\.(0|1|2|3|4)\.(0|1)/).test(f.fn.jquery) || (/^1.1/).test(f.fn.jquery) || (/^1.2/).test(f.fn.jquery) || (/^1.3/).test(f.fn.jquery))
    {
        //alert("tn3gallery requires jQuery v1.4.2 or later!  You are using v" + f.fn.jquery);
        return;
    }
    else
    {
        var p = {},
            j = [];
        f.fn.tn3 = function(h)
        {
            h = f.extend(true, {}, f.fn.tn3.config, h);
            if (h.skin !== null)
            {
                if (typeof h.skin == "object")
                {
                    h.skinDir += "/" + h.skin[0];
                    if (h.cssID === null)
                    {
                        h.cssID = h.skin[0];
                    }
                    h.skin = h.skin[1];
                } else
                {
                    h.skinDir += "/" + h.skin;
                }
            } else
            {
                h.skin = "tn3";
                h.skinDir += "/tn3";
                var k = true;
            }
            if (h.cssID === null)
            {
                h.cssID = h.skin === null ? "tn3" : h.skin;
            }
            this.each(function()
            {
                var l = f(this);
                h.fullOnly ? l.hide() : l.css("visibility", "hidden");
                var m = h.data ? h.data : b(l);
                m = j.push(new f.fn.tn3.Gallery(m, h)) - 1;
                l.data("tn3", j[m]);
                for (var q = 0; q < f.fn.tn3.plugins.length; q++)
                {
                    f.fn.tn3.plugins[q].init(l, h);
                }
                l.empty();
                g(m);
            });
            k ? a.call(this, h, h.skinDefault) : e.call(this, h);
            return this;
        };
        f.fn.tn3.plugins = [];
        f.fn.tn3.plugIn = function(h, k)
        {
            f.fn.tn3.plugins.push({
                id: h,
                init: k
            });
        };
        f.fn.tn3.version = "1.1.0.28";
        f.fn.tn3.config = {
            data: null,
            skin: null,
            skinDir: "skins",
            skinDefault: '<div class="tn3-gallery"><div class="tn3-image"><div class="tn3-text-bg"><div class="tn3-image-title"></div><div class="tn3-image-description"></div></div><div class="tn3-next tn3_v tn3_o"></div><div class="tn3-prev tn3_v tn3_o"></div><div class="tn3-preloader tn3_h tn3_v"><img src="preload.gif"/></div><div class="tn3-timer"></div></div><div class="tn3-controls-bg tn3_rh"><div class="tn3-sep1"></div><div class="tn3-sep2"></div><div class="tn3-sep3"></div></div><div class="tn3-thumbs"></div><div class="tn3-fullscreen"></div><div class="tn3-show-albums"></div><div class="tn3-next-page"></div><div class="tn3-prev-page"></div><div class="tn3-play"></div><div class="tn3-count"></div><div class="tn3-albums"><div class="tn3-inalbums"><div class="tn3-album"></div></div><div class="tn3-albums-next"></div><div class="tn3-albums-prev"></div><div class="tn3-albums-close"></div></div></div>',
            cssID: null
        };
        f.fn.tn3.translations = {};
        f.fn.tn3.translate = function(h, k)
        {
            if (k)
            {
                f.fn.tn3.translations[h] = k;
            } else
            {
                var l = f.fn.tn3.translations[h];
                return l ? l : h;
            }

            return null;
        };
        f(function()
        {
            setTimeout(i, 1);
        });
    }
})(jQuery);
(function(f)
{
    f.fn.tn3utils = U = {};
    U.shuffle = function(e)
    {
        var a, b, d = e.length;
        if (d)
        {
            for (; --d; )
            {
                b = Math.floor(Math.random() * (d + 1));
                a = e[b];
                e[b] = e[d];
                e[d] = a;
            }
        }
    };
    f.extend(f.easing, {
        def: "easeOutQuad",
        swing: function(e, a, b, d, c)
        {
            return f.easing[f.easing.def](e, a, b, d, c);
        },
        linear: function(e, a, b, d, c)
        {
            return d * a / c + b;
        },
        easeInQuad: function(e, a, b, d, c)
        {
            return d * (a /= c) * a + b;
        },
        easeOutQuad: function(e, a, b, d, c)
        {
            return -d * (a /= c) * (a - 2) + b;
        },
        easeInOutQuad: function(e, a, b, d, c)
        {
            if ((a /= c / 2) < 1)
            {
                return d / 2 * a * a + b;
            }
            return -d / 2 * (--a * (a - 2) - 1) + b;
        },
        easeInCubic: function(e, a, b, d, c)
        {
            return d * (a /= c) * a * a + b;
        },
        easeOutCubic: function(e, a, b, d, c)
        {
            return d * ((a = a / c - 1) * a * a + 1) + b;
        },
        easeInOutCubic: function(e, a, b, d, c)
        {
            if ((a /= c / 2) < 1)
            {
                return d / 2 * a * a * a + b;
            }
            return d / 2 * ((a -= 2) * a * a + 2) + b;
        },
        easeInQuart: function(e, a, b, d, c)
        {
            return d * (a /= c) * a * a * a + b;
        },
        easeOutQuart: function(e, a, b, d, c)
        {
            return -d * ((a = a / c - 1) * a * a * a - 1) + b;
        },
        easeInOutQuart: function(e, a, b, d, c)
        {
            if ((a /= c / 2) < 1)
            {
                return d / 2 * a * a * a * a + b;
            }
            return -d / 2 * ((a -= 2) * a * a * a - 2) + b;
        },
        easeInQuint: function(e, a, b, d, c)
        {
            return d * (a /= c) * a * a * a * a + b;
        },
        easeOutQuint: function(e, a, b, d, c)
        {
            return d * ((a = a / c - 1) * a * a * a * a + 1) + b;
        },
        easeInOutQuint: function(e, a, b, d, c)
        {
            if ((a /= c / 2) < 1)
            {
                return d / 2 * a * a * a * a * a + b;
            }
            return d / 2 * ((a -= 2) * a * a * a * a + 2) + b;
        },
        easeInSine: function(e, a, b, d, c)
        {
            return -d * Math.cos(a / c * (Math.PI / 2)) + d + b;
        },
        easeOutSine: function(e, a, b, d, c)
        {
            return d * Math.sin(a / c * (Math.PI / 2)) + b;
        },
        easeInOutSine: function(e, a, b, d, c)
        {
            return -d / 2 * (Math.cos(Math.PI * a / c) - 1) + b;
        },
        easeInExpo: function(e, a, b, d, c)
        {
            return a === 0 ? b : d * Math.pow(2, 10 * (a / c - 1)) + b;
        },
        easeOutExpo: function(e, a, b, d, c)
        {
            return a == c ? b + d : d * (-Math.pow(2, -10 * a / c) + 1) + b;
        },
        easeInOutExpo: function(e, a, b, d, c)
        {
            if (a === 0)
            {
                return b;
            }
            if (a == c)
            {
                return b + d;
            }
            if ((a /= c / 2) < 1)
            {
                return d / 2 * Math.pow(2, 10 * (a - 1)) + b;
            }
            return d / 2 * (-Math.pow(2, -10 * --a) + 2) + b;
        },
        easeInCirc: function(e, a, b, d, c)
        {
            return -d * (Math.sqrt(1 - (a /= c) * a) - 1) + b;
        },
        easeOutCirc: function(e, a, b, d, c)
        {
            return d * Math.sqrt(1 - (a = a / c - 1) * a) + b;
        },
        easeInOutCirc: function(e, a, b, d, c)
        {
            if ((a /= c / 2) < 1)
            {
                return -d / 2 * (Math.sqrt(1 - a * a) - 1) + b;
            }
            return d / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b;
        },
        easeInElastic: function(e, a, b, d, c)
        {
            e = 1.70158;
            var g = 0,
                i = d;
            if (a === 0)
            {
                return b;
            }
            if ((a /= c) == 1)
            {
                return b + d;
            }
            g || (g = c * 0.3);
            if (i < Math.abs(d))
            {
                i = d;
                e = g / 4;
            } else
            {
                e = g / (2 * Math.PI) * Math.asin(d / i);
            }
            return -(i * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * c - e) * 2 * Math.PI / g)) + b;
        },
        easeOutElastic: function(e, a, b, d, c)
        {
            e = 1.70158;
            var g = 0,
                i = d;
            if (a === 0)
            {
                return b;
            }
            if ((a /= c) == 1)
            {
                return b + d;
            }
            g || (g = c * 0.3);
            if (i < Math.abs(d))
            {
                i = d;
                e = g / 4;
            } else
            {
                e = g / (2 * Math.PI) * Math.asin(d / i);
            }
            return i * Math.pow(2, -10 * a) * Math.sin((a * c - e) * 2 * Math.PI / g) + d + b;
        },
        easeInOutElastic: function(e, a, b, d, c)
        {
            e = 1.70158;
            var g = 0,
                i = d;
            if (a === 0)
            {
                return b;
            }
            if ((a /= c / 2) == 2)
            {
                return b + d;
            }
            g || (g = c * 0.3 * 1.5);
            if (i < Math.abs(d))
            {
                i = d;
                e = g / 4;
            } else
            {
                e = g / (2 * Math.PI) * Math.asin(d / i);
            }
            if (a < 1)
            {
                return -0.5 * i * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * c - e) * 2 * Math.PI / g) + b;
            }
            return i * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * c - e) * 2 * Math.PI / g) * 0.5 + d + b;
        },
        easeInBack: function(e, a, b, d, c, g)
        {
            if (g === undefined)
            {
                g = 1.70158;
            }
            return d * (a /= c) * a * ((g + 1) * a - g) + b;
        },
        easeOutBack: function(e, a, b, d, c, g)
        {
            if (g === undefined)
            {
                g = 1.70158;
            }
            return d * ((a = a / c - 1) * a * ((g + 1) * a + g) + 1) + b;
        },
        easeInOutBack: function(e, a, b, d, c, g)
        {
            if (g === undefined)
            {
                g = 1.70158;
            }
            if ((a /= c / 2) < 1)
            {
                return d / 2 * a * a * (((g *= 1.525) + 1) * a - g) + b;
            }
            return d / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + b;
        },
        easeInBounce: function(e, a, b, d, c)
        {
            return d - f.easing.easeOutBounce(e, c - a, 0, d, c) + b;
        },
        easeOutBounce: function(e, a, b, d, c)
        {
            return (a /= c) < 1 / 2.75 ? d * 7.5625 * a * a + b : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + b : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + b : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + b;
        },
        easeInOutBounce: function(e, a, b, d, c)
        {
            if (a < c / 2)
            {
                return f.easing.easeInBounce(e, a * 2, 0, d, c) * 0.5 + b;
            }
            return f.easing.easeOutBounce(e, a * 2 - c, 0, d, c) * 0.5 + d * 0.5 + b;
        }
    });
})(jQuery);
(function(f)
{
    f.fn.tn3.Gallery = function(a, b)
    {
        this.data = a;
        this.config = f.extend(true, {}, f.fn.tn3.Gallery.config, b);
        this.initialized = false;
        this.t = f.fn.tn3.translate;
        this.loader = new f.fn.tn3.External(b.external, this);
    };
    f.fn.tn3.Gallery.config = {
        cssID: "tn3",
        active: [],
        iniAlbum: 0,
        imageClick: "next",
        startWithAlbums: false,
        autoplay: false,
        delay: 7E3,
        timerMode: "bar",
        timerSteps: 500,
        timerStepChar: "&#8226;",
        isFullScreen: false,
        fullOnly: false,
        width: null,
        height: null,
        mouseWheel: true,
        image: {},
        thumbnailer: {}
    };
    var e;
    f.fn.tn3.Gallery.prototype = {
        config: null,
        $c: null,
        $tn3: null,
        data: null,
        thumbnailer: null,
        imager: null,
        cAlbum: null,
        timer: null,
        items: null,
        initialized: null,
        n: null,
        albums: null,
        loader: null,
        fso: null,
        timerSize: null,
        special: null,
        areHidden: false,
        $inImage: null,
        init: function(a, b)
        {
            this.$c = a;
            if (!(this.loader.reqs > 0 || this.data.length === 0 || b))
            {
                this.trigger("init_start");
                this.config.fullOnly && this.$c.show();
                this.$c.css("visibility", "visible");
                this.$tn3 = this.$c.find("." + this.config.cssID + "-gallery");
                var d = this.config.initValues = {
                    width: this.$tn3.width(),
                    height: this.$tn3.height()
                };
                this.$tn3.css("float", "left");
                d.wDif = this.$tn3.outerWidth(true) - d.width;
                d.hDif = this.$tn3.outerHeight(true) - d.height;
                this.config.mouseWheel && this.initMouseWheel();
                var c = this;
                this.timer = new f.fn.tn3.Timer(this.$c, this.config.delay, this.config.timerSteps);
                this.$c.bind("timer_end", function()
                {
                    c.show("next");
                });
                this.special = {
                    rv: [],
                    rh: [],
                    v: [],
                    h: [],
                    o: []
                };
                this.parseLayout();
                this.center();
                f.each(this.items, function(g, i)
                {
                    switch (g)
                    {
                        case "next":
                            i.click(function(j)
                            {
                                c.show("next");
                                j.stopPropagation();
                            });
                            i.attr("title", c.t("Next Image"));
                            break;
                        case "prev":
                            i.click(function(j)
                            {
                                c.show("prev");
                                j.stopPropagation();
                            });
                            i.attr("title", c.t("Previous Image"));
                            break;
                        case "next-page":
                            i.click(function()
                            {
                                c.items.thumbs && c.thumbnailer.next(true);
                            });
                            i.attr("title", c.t("Next Page"));
                            break;
                        case "prev-page":
                            i.click(function()
                            {
                                c.items.thumbs && c.thumbnailer.prev(true);
                            });
                            i.attr("title", c.t("Previous Page"));
                            break;
                        case "thumbs":
                            c.config.thumbnailer.cssID = c.config.cssID;
                            c.config.thumbnailer.initValues = {
                                width: i.width(),
                                height: i.height()
                            };
                            c.config.thumbnailer.initValues.vertical = i.width() <= i.height();
                            i.bind("tn_click", function(j)
                            {
                                c.show(j.n);
                            }).bind("tn_over", function()
                            {
                                //c.timer.pause(true); //disable pause on mouse-over
                            }).bind("tn_out", function()
                            {
                                //c.timer.pause(false);
                            }).bind("tn_error", function(j)
                            {
                                c.trigger("error", j);
                            });
                            break;
                        case "image":
                            c.config.image.cssID = c.config.cssID;
                            c.config.image.initValues = {
                                width: i.width(),
                                height: i.height()
                            };
                            i.bind("img_click", function(j)
                            {
                                switch (c.config.imageClick)
                                {
                                    case "next":
                                        c.show("next");
                                        break;
                                    case "fullscreen":
                                        c.fullscreen();
                                        break;
                                    case "url":
                                        j = c.data[c.cAlbum].imgs[j.n].url;
                                        if (j)
                                        {
                                            window.location = j;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }).bind("img_load_start", function()
                            {
                                c.items.preloader && c.items.preloader.show();
                            }).bind("img_load_end", function(j)
                            {
                                c.n = j.n;
                                c.items.thumbs && c.thumbnailer.thumbClick(j.n);
                                c.items.preloader && c.items.preloader.hide();
                                c.items.timer && c.items.timer.hide();
                                c.$inImage && c.$inImage.hide();
                            }).bind("img_transition", function()
                            {
                                c.setTextValues(false, "image");
                                c.$inImage && c.$inImage.fadeIn(300);
                                c.items.count && c.items.count.text(c.n + 1 + "/" + c.data[c.cAlbum].imgs.length);
                                c.config.autoplay && c.timer.start();
                                c.special.o.length > 0 && c.hideElements();
                            }).bind("img_enter", function()
                            {
                                //c.items.timer && c.timer.pause(true); //disable pause on mouse-over
                                c.special.o.length > 0 && c.showElements(300);
                            }).bind("img_leave", function()
                            {
                                //c.items.timer && c.timer.pause(false);
                                c.special.o.length > 0 && c.hideElements(300);
                            }).bind("img_resize", function(j)
                            {
                                if (c.$inImage)
                                {
                                    c.$inImage.width(j.w).height(j.h).css("left", j.left).css("top", j.top);
                                    c.center();
                                    c.imager.bindMouseEvents(c.$inImage);
                                }
                            }).bind("img_error", function(j)
                            {
                                c.trigger("error", j);
                            });
                            break;
                        case "preloader":
                            i.hide();
                            break;
                        case "timer":
                            var p = i.width() > i.height() ? "width" : "height";
                            c.$c.bind("timer_tick", function(j)
                            {
                                if (c.config.timerMode == "char")
                                {
                                    for (var h = c.config.timerStepChar; --j.tick; )
                                    {
                                        h += c.config.timerStepChar;
                                    }
                                    c.items.timer.html(h);
                                } else
                                {
                                    c.items.timer[p](c.timerSize / j.totalTicks * j.tick);
                                }
                                c.trigger(j.type, j);
                            }).bind("timer_start", function(j)
                            {
                                c.timerSize = c.$inImage[p]();
                                c.items.timer.fadeIn(300);
                                c.trigger(j.type, j);
                            }).bind("timer_end timer_stop", function()
                            {
                                c.items.timer.hide();
                            });
                            i.hide();
                            break;
                        case "play":
                            i.click(function(j)
                            {
                                if (c.timer.runs)
                                {
                                    c.timer.stop();
                                    c.config.autoplay = false;
                                    i.removeClass(c.config.cssID + "-play-active");
                                    i.attr("title", c.t("Start Slideshow"));
                                } else
                                {
                                    c.timer.start();
                                    c.config.autoplay = true;
                                    i.addClass(c.config.cssID + "-play-active");
                                    i.attr("title", c.t("Stop Slideshow"));
                                }
                                j.stopPropagation();
                            });
                            i.attr("title", c.t("Start Slideshow"));
                            c.config.autoplay && i.click();
                            break;
                        case "albums":
                            c.albums = new f.fn.tn3.Albums(c.data, i, c.config.cssID);
                            i.hide();
                            i.bind("albums_binit", function(j)
                            {
                                c.trigger(j.type, j);
                            }).bind("albums_click", function(j)
                            {
                                c.showAlbum(j.n);
                                c.trigger(j.type, j);
                            }).bind("albums_init", function(j)
                            {
                                c.timer.stop();
                                c.trigger(j.type, j);
                            }).bind("albums_error", function(j)
                            {
                                c.trigger("error", j);
                            });
                            break;
                        case "albums-next":
                            c.albums && c.albums.setControl("next", i);
                            i.attr("title", c.t("Next Album Page"));
                            break;
                        case "albums-prev":
                            c.albums && c.albums.setControl("prev", i);
                            i.attr("title", c.t("Previous Album Page"));
                            break;
                        case "albums-close":
                            c.albums && c.albums.setControl("close", i);
                            i.attr("title", c.t("Close"));
                            break;
                        case "show-albums":
                            i.click(function(j)
                            {
                                c.items.albums && c.albums.show(0, c.cAlbum);
                                j.stopPropagation();
                            });
                            i.attr("title", c.t("Album List"));
                            break;
                        case "fullscreen":
                            i.click(function(j)
                            {
                                c.fullscreen();
                                j.stopPropagation();
                            });
                            i.attr("title", c.t("Maximize"));
                            break;
                        default:
                            break;
                    }
                });
                if (this.config.width !== null || this.config.height !== null)
                {
                    if (this.config.width === null)
                    {
                        this.config.width = this.config.initValues.width;
                    }
                    if (this.config.height === null)
                    {
                        this.config.height = this.config.initValues.height;
                    }
                    this.resize(this.config.width, this.config.height);
                }
                d = Math.min(this.config.iniAlbum, this.data.length - 1);
                this.initialized = true;
                this.config.startWithAlbums && this.data.length > 1 && this.items.albums ? this.albums.show() : this.showAlbum(d, this.config.iniImage);
                this.config.isFullScreen && this.onFullResize(f(window).width(), f(window).height());
                this.trigger("init");
            }
        },
        parseLayout: function()
        {
            var a = this.items = {},
                    b = this.config,
                    d = b.active,
                    c = b.cssID.length + 1,
                    g = this,
                    i, p;
            this.$c.find("div[class^='" + b.cssID + "-']").each(function()
            {
                i = f(this);
                p = i.attr("class").split(" ")[0].substr(c);
                if (d.length === 0 || f.inArray(p, d) != -1)
                {
                    a[p] = i;
                } else
                {
                    p != "gallery" && i.remove();
                }
                if (i.parent().hasClass(b.cssID + "-image"))
                {
                    if (!g.$inImage)
                    {
                        g.$inImage = i.parent().append('<div class="tn3-in-image"></div>').find(":last");
                        if (f.browser.msie)
                        {
                            var j = f("<div />");
                            j.css("background-color", "#fff").css("opacity", 0).css("width", "100%").css("height", "100%");
                            j.appendTo(g.$inImage);
                        }
                        g.$inImage.css("position", "absolute").width(a.image.width()).height(a.image.height());
                    }
                    i.appendTo(g.$inImage);
                }
                this.className.indexOf("tn3_") != -1 && g.addSpecial(p, this.className);
            });
        },
        addSpecial: function(a, b)
        {
            for (var d = b.split(" "), c, g = 0; g < d.length; g++)
            {
                c = d[g].split("_");
                if (c[0] == "tn3")
                {
                    this.special[c[1]].push(a);
                    if (c[1] == "rh" || c[1] == "rv")
                    {
                        this.config.initValues[a] = {
                            w: this.items[a].width(),
                            h: this.items[a].height()
                        };
                    }
                }
            }
        },
        initHover: function(a, b)
        {
            var d = this;
            a.hover(function()
            {
                a.addClass(d.config.cssID + "-" + b + "-over");
            }, function()
            {
                a.removeClass(d.config.cssID + "-" + b + "-over");
            });
        },
        setTextValues: function(a, b)
        {
            var d, c, g, i = b + "-";
            for (g in this.items)
            {
                if (g.indexOf(i) === 0)
                {
                    d = g.substr(i.length);
                    if (d != "info" && d != "prev" && d != "next")
                    {
                        c = b == "image" ? this.data[this.cAlbum].imgs[this.n] : this.data[this.cAlbum];
                        if (!(!c || c[d] == undefined))
                        {
                            c[d] = f.trim(c[d]);
                            d = {
                                field: d,
                                text: c[d],
                                data: c
                            };
                            this.trigger("set_text", d);
                            if (a || d.text === undefined || d.text.length === 0)
                            {
                                this.items[g].html("");
                                this.items[g].hide();
                            } else
                            {
                                this.items[g].html(d.text);
                                this.items[g].show();
                            }
                        }
                    }
                }
            }
        },
        show: function(a, b)
        {
            this.timer.stop();
            this.imager && this.imager.show(a);
            b && this.fullscreen();
        },
        setAlbumData: function(a, b)
        {
            if (b)
            {
                this.trigger("error", {
                    description: b
                });
            } else
            {
                for (var d = 0, c = a.length; d < c; d++)
                {
                    this.data.push(a[d]);
                }
                this.$c && this.init(this.$c, this.config.fullOnly);
            }
        },
        setImageData: function(a, b, d)
        {
            if (d)
            {
                this.trigger("error", {
                    description: d
                });
            } else
            {
                a = {
                    data: a
                };
                this.trigger("image_data", a);
                this.data[b].imgs = a.data;
                this.cAlbum == b && this.rebuild(a.data);
            }
        },
        showAlbum: function(a, b, d)
        {
            if (this.initialized)
            {
                if (a > this.data.length)
                {
                    return;
                }
                this.timer.stop();
                this.cAlbum = a;
                if (this.data[this.cAlbum].imgs === undefined)
                {
                    this.loader ? this.loader.getImages(this.data[this.cAlbum].adata, this.cAlbum) : this.trigger("error", {
                        description: "Wrong album id"
                    });
                } else
                {
                    this.rebuild(this.data[this.cAlbum].imgs, b);
                }
                this.albums && this.albums.hide();
                this.items.preloader && this.items.preloader.show();
            } else
            {
                this.config.iniAlbum = a;
                this.config.iniImage = b;
                this.init(this.$c, false);
            }
            d && this.fullscreen();
        },
        rebuild: function(a, b)
        {
            if (this.items.thumbs)
            {
                if (this.thumbnailer)
                {
                    this.thumbnailer.rebuild(a);
                } else
                {
                    this.thumbnailer = new f.fn.tn3.Thumbnailer(this.items.thumbs, a, this.config.thumbnailer);
                }
            }

            if (this.items.image)
            {
                if (this.imager)
                {
                    this.imager.rebuild(a);
                } else
                {
                    this.imager = new f.fn.tn3.Imager(this.items.image, a, this.config.image);
                }
            }

            this.setTextValues(true, "image");
            this.setTextValues(false, "album");
            this.show(b === null || b === undefined ? 0 : b);
            this.trigger("rebuild", {
                album: this.cAlbum
            });
        },
        showElements: function(a)
        {
            if (this.areHidden)
            {
                var b = this,
                        d;
                f.each(this.special.o, function(c, g)
                {
                    d = b.items[g];
                    d.show();
                    if (a && f.support.opacity)
                    {
                        d.stop(true);
                        d.css("opacity", 0);
                        d.animate({
                            opacity: 1
                        }, {
                            duration: a,
                            queue: false
                        });
                    }
                });
                this.areHidden = false;
            }
        },
        hideElements: function(a)
        {
            if (!this.areHidden)
            {
                var b = this,
                        d;
                f.each(this.special.o, function(c, g)
                {
                    d = b.items[g];
                    if (a && f.support.opacity)
                    {
                        d.stop(true);
                        d.animate({
                            opacity: 0
                        }, {
                            duration: a,
                            complete: function()
                            {
                                d.hide();
                            },
                            queue: false
                        });
                    } else
                    {
                        d.hide();
                    }
                });
                this.areHidden = true;
            }
        },
        setData: function(a)
        {
            if (this.items.thumbs)
            {
                this.thumbnailer.data = a;
            }
            if (this.items.imager)
            {
                this.imager.data = a;
            }
        },
        fullscreen: function()
        {
            if (this.config.isFullScreen)
            {
                f(window).unbind("resize", this.onFullResize);
                f.tn3unblock();
                this.config.width !== null || this.config.height !== null ? this.resize(this.config.width, this.config.height) : this.resize(this.config.initValues.width, this.config.initValues.height);
                if (this.items.fullscreen)
                {
                    this.items.fullscreen.removeClass(this.config.cssID + "-fullscreen-active");
                    this.items.fullscreen.attr("title", this.t("Maximize"));
                }
                this.config.fullOnly && this.$c.hide();
                this.config.isFullScreen = false;
                this.trigger("fullscreen", {
                    fullscreen: false
                });
                f(document).unbind("keyup", this.onEscape);
            } else
            {
                f.tn3block({
                    message: this.$tn3,
                    cssID: this.config.cssID
                });
                f(window).bind("resize", f.proxy(this.onFullResize, this));
                this.config.fullOnly && this.$c.show();
                this.config.isFullScreen = true;
                if (this.items.fullscreen)
                {
                    this.items.fullscreen.addClass(this.config.cssID + "-fullscreen-active");
                    this.items.fullscreen.attr("title", this.t("Minimize"));
                }
                this.onFullResize();
                e = this;
                f(document).bind("keyup", this.onEscape);
                this.trigger("fullscreen", {
                    fullscreen: true
                });
            }
        },
        onEscape: function(a)
        {
            a.keyCode == 27 && e.fullscreen();
            a.keyCode == 39 && e.show("next");
            a.keyCode == 37 && e.show("prev");
            a.keyCode == 38 && e.items.albums && e.albums.show(0, e.cAlbum);
            a.keyCode == 40 && e.albums.hide();
        },
        onFullResize: function()
        {
            var a = f(window),
                    b = a.width();
            a = a.height();
            b -= this.config.initValues.wDif;
            a -= this.config.initValues.hDif;
            this.resize(b, a);
        },
        resize: function(a, b)
        {
            this.$tn3.width(a).height(b);
            var d = a - this.config.initValues.width,
                    c = b - this.config.initValues.height,
                    g, i, p = this;
            if (this.items.image)
            {
                g = this.config.image.initValues.width + d;
                i = this.config.image.initValues.height + c;
                if (this.imager)
                {
                    this.imager.setSize(g, i);
                } else
                {
                    this.items.image.width(g).height(i);
                    this.$inImage.width(g).height(i);
                }
            }
            if (this.items.thumbs)
            {
                g = this.config.thumbnailer.initValues.width + d;
                i = this.config.thumbnailer.initValues.height + c;
                if (this.thumbnailer)
                {
                    this.thumbnailer.setSize(g, i);
                } else
                {
                    this.config.thumbnailer.initValues.vertical ? this.items.thumbs.height(i) : this.items.thumbs.width(g);
                }
            }
            if (this.items.albums)
            {
                g = this.albums.initValues.width + d;
                i = this.albums.initValues.height + c;
                this.albums.changeSize(d, c);
            }
            f.each(this.special.rh, function(j, h)
            {
                p.items[h].width(p.config.initValues[h].w + d);
            });
            f.each(this.special.rv, function(j, h)
            {
                p.items[h].height(p.config.initValues[h].h + c);
            });
            this.center();
        },
        center: function()
        {
            var a, b = this;
            f.each(this.special.v, function(d, c)
            {
                a = b.items[c];
                a.css("top", (a.parent().height() - a.height()) / 2);
            });
            f.each(this.special.h, function(d, c)
            {
                a = b.items[c];
                a.css("left", (a.parent().width() - a.width()) / 2);
            });
        },
        trigger: function(a, b)
        {
            var d = f.Event("tn3_" + a), c;
            for (c in b)
            {
                d[c] = b[c];
            }
            if (b && b.type != undefined)
            {
                d.type = "tn3_" + a;
            }
            d.source = this;
            this.$c.trigger(d);
            this.config[a] && this.config[a].call(this, d);
            for (c in b)
            {
                b[c] = d[c];
            }
        },
        initMouseWheel: function()
        {
            var a = this,
                    b = function(d)
                    {
                        a.show((d.detail ? -d.detail : d.wheelDelta) > 0 ? "prev" : "next");
                        d.preventDefault();
                    };
            this.$tn3.bind("mousewheel", b);
            this.$tn3.bind("DOMMouseScroll", b);
        },
        replaceMenu: function(a, b)
        {
            var d = '<div style="position:absolute;background-color:#fff;color: #000;padding:0px 4px 0px 4px;z-index:1010;font-family:sans-serif;font-size:12px;">&copy; <a href="' + b + '">' + a + "</a></div>";
            this.$tn3.bind("contextmenu", function(c)
            {
                c.preventDefault();
            }).bind("mousedown", function(c)
            {
                if (c.which == 3)
                {
                    var g = f("body").append(d).find("div:last");
                    g.css("left", c.pageX).css("top", c.pageY);
                    g.find("a").mouseup(function(i)
                    {
                        window.location = b;
                        g.unbind(i);
                    });
                    f("body").mouseup(function(i)
                    {
                        g.remove();
                        f("body").unbind(i);
                    });
                }
            });
        }
    };
})(jQuery);
(function(f)
{
    f.fn.tn3.Imager = function(e, a, b)
    {
        this.$c = e;
        this.data = a;
        this.config = f.extend(true, {}, f.fn.tn3.Imager.config, b);
        this.init();
    };
    f.fn.tn3.Imager.config = {
        transitions: null,
        defaultTransition: {
            type: "slide"
        },
        random: false,
        cssID: "tn3",
        maxZoom: 1.4,
        crop: false,
        clickEvent: "click",
        idleDelay: 3E3,
        dif: 0
    };
    f.fn.tn3.Imager.prototype = {
        config: null,
        $c: false,
        data: false,
        cached: null,
        active: -1,
        $active: false,
        $buffer: false,
        isInTransition: false,
        ts: null,
        cDim: null,
        qid: null,
        currentlyLoading: null,
        side: null,
        $ic: null,
        $binder: null,
        infoID: null,
        lastEnter: false,
        mouseCoor: {
            x: 0,
            y: 0
        },
        mouseIsOver: false,
        init: function()
        {
            this.$c.css("overflow", "hidden");
            this.$c.css("position", "relative");
            this.bindMouseEvents(this.$c);
            this.cached = [];
            this.ts = new f.fn.tn3.Transitions(this.config.transitions, this.config.defaultTransition, this.config.random, this, "onTransitionEnd");
        },
        bindMouseEvents: function(e)
        {
            this.unbindMouseEvents();
            var a = this;
            e.hover(function()
            {
                a.mouseIsOver = true;
                a.enterLeave("enter");
                a.startIdle();
                f(document).mousemove(f.proxy(a.onMouseMove, a));
            }, function()
            {
                a.mouseIsOver = false;
                a.enterLeave("leave");
                a.stopIdle();
                f(document).unbind("mousemove", a.onMouseMove);
            });
            e[this.config.clickEvent](function(b)
            {
                a.active == -1 || a.isInTransition || b.target.tagName.toUpperCase() != "A" && a.trigger("click", {
                    n: a.active
                });
            });
            this.$binder = e;
        },
        unbindMouseEvents: function()
        {
            this.$binder && this.$binder.unbind("mouseenter mouseleave " + this.config.clickEvent);
            f(document).unbind("mousemove", this.onMouseMove);
            this.stopIdle();
        },
        startIdle: function()
        {
            this.stopIdle();
            var e = this;
            if (this.config.idleDelay > 0)
            {
                this.infoID = setTimeout(function()
                {
                    e.enterLeave("leave");
                    e.stopIdle();
                }, this.config.idleDelay);
            }
        },
        onMouseMove: function(e)
        {
            this.mouseCoor = {
                x: e.pageX,
                y: e.pageY
            };
            if (!this.isInTransition)
            {
                this.infoID || this.enterLeave("enter");
                this.startIdle();
            }
        },
        stopIdle: function()
        {
            clearTimeout(this.infoID);
            this.infoID = null;
        },
        enterLeave: function(e)
        {
            this.lastEnter != e && this.trigger(e);
            this.lastEnter = e;
        },
        show: function(e)
        {
            if (this.isInTransition)
            {
                this.qid = e;
            } else
            {
                this.qid = null;
                if (e == "next")
                {
                    e = this.active + 1 < this.data.length ? this.active + 1 : 0;
                    this.side = "left";
                } else if (e == "prev")
                {
                    e = this.active > 0 ? this.active - 1 : this.data.length - 1;
                    this.side = "right";
                } else
                {
                    this.side = this.active > e ? "right" : "left";
                }
                this.trigger("load_start", {
                    n: e
                });
                this.$buffer = this.$c.prepend('<div class="' + this.config.cssID + '-image-in" style="position:absolute;overflow:hidden;"></div>').find(":first");
                if (this.cached[this.currentlyLoading] != undefined)
                {
                    this.cached[this.currentlyLoading].init = false;
                }
                if (this.cached[e] != undefined)
                {
                    if (this.cached[e].status == "loaded")
                    {
                        this.initImage(this.cached[e].loader.$img, e);
                    } else
                    {
                        this.cached[e].init = true;
                        this.currentlyLoading = e;
                    }
                } else
                {
                    this.cached[e] = {
                        status: "loading",
                        init: true
                    };
                    this.currentlyLoading = e;
                    this.cached[e].loader = new f.fn.tn3.ImageLoader(this.data[e].img, this, this.onCacheLoad, [e]);
                }
            }
        },
        onCacheLoad: function(e, a, b)
        {
            this.cached[a].status = "loaded";
            b && this.trigger("error", {
                description: b,
                n: a
            });
            this.cached[a].init && this.initImage(e, a);
        },
        initImage: function(e, a)
        {
            this.currentlyLoading = null;
            this.active = a;
            if (!this.cDim)
            {
                this.cDim = {
                    w: this.$c.width(),
                    h: this.$c.height()
                };
            }
            this.$buffer.width(this.cDim.w).height(this.cDim.h);
            var b = f('<div class="' + this.config.cssID + '-full-image" style="position:absolute"></div>');
            e.appendTo(b);
            this.$buffer.append(b);
            this.$buffer.data("ic", b);
            this.$buffer.data("img", e);
            this.resize(this.$buffer);
            this.trigger("load_end", {
                n: a
            });
            if (this.$active !== false)
            {
                this.isInTransition = true;
                this.unbindMouseEvents();
                if (this.mouseIsOver)
                {
                    f(document).mousemove(f.proxy(this.onMouseMove, this));
                } else
                {
                    this.mouseCoor = {
                        x: 0,
                        y: 0
                    };
                }
                this.lastEnter = "leave";
                this.ts.start(this.$active, this.$buffer, this.side);
            } else
            {
                this.$active = this.$buffer;
                this.trigger("transition", {
                    n: this.active
                });
            }
            if (this.cached[a + 1] == undefined && this.data[a + 1] != undefined)
            {
                this.cached[a + 1] = {
                    status: "loading",
                    init: false
                };
                this.cached[a + 1].loader = new f.fn.tn3.ImageLoader(this.data[a + 1].img, this, this.onCacheLoad, [a + 1]);
            }
        },
        setSize: function(e, a)
        {
            this.isInTransition && this.ts.stop(this.$active, this.$buffer, this.ts.config);
            this.$c.width(e).height(a);
            this.cDim = {
                w: this.$c.width(),
                h: this.$c.height()
            };
            if (this.$active)
            {
                this.$active.width(e).height(a);
                this.resize(this.$active);
            }
        },
        resize: function(e)
        {
            $img = e.data("img");
            if ($img == undefined)
            {
                this.trigger("resize", {
                    w: this.cDim.w,
                    h: this.cDim.h,
                    left: 0,
                    top: 0
                });
            } else
            {
                $ic = e.data("ic");
                $img.width("").height("");
                e.data("scaled", false);
                var a = $img.width(),
                    b = $img.height(),
                    d = 0,
                    c = 0,
                    g = {
                        w: a,
                        h: b,
                        left: 0,
                        top: 0
                    };
                if (a != this.cDim.w || b != this.cDim.h)
                {
                    d = this.cDim.w / a;
                    c = this.cDim.h / b;
                    d = this.config.crop ? Math.max(d, c) : Math.min(d, c);
                    d = Math.min(this.config.maxZoom, d);
                    a = g.w = Math.round(a * d) - this.config.dif;
                    b = g.h = Math.round(b * d) - this.config.dif;
                    if (this.cDim.w >= a)
                    {
                        d = g.left = (this.cDim.w - a) / 2;
                    } else
                    {
                        d = -(a - this.cDim.w) * 0.5;
                        g.w = this.cDim.w;
                    }
                    if (this.cDim.h > b)
                    {
                        c = g.top = (this.cDim.h - b) / 2;
                    } else
                    {
                        c = -(b - this.cDim.h) * 0.5;
                        g.h = this.cDim.h;
                    }
                    $img.width(a).height(b);
                    $ic.width(a).height(b);
                    e.data("scaled", true);
                }
                $ic.css("left", d).css("top", c);
                this.bindMouseEvents($ic);
                this.trigger("resize", g);
            }
        },
        onTransitionEnd: function()
        {
            this.$active.remove();
            this.$active = this.$buffer;
            this.isInTransition = false;
            this.trigger("transition", {
                n: this.active
            });
            this.bindMouseEvents(this.$binder);
            var e = this.$binder.offset();
            this.mouseIsOver = false;
            if (this.mouseCoor.x >= e.left && this.mouseCoor.x <= e.left + this.$binder.width())
            {
                if (this.mouseCoor.y >= e.top && this.mouseCoor.y <= e.top + this.$binder.height())
                {
                    this.lastEnter = "leave";
                    this.enterLeave("enter");
                    this.startIdle();
                    this.mouseIsOver = true;
                    f(document).mousemove(f.proxy(this.onMouseMove, this));
                }
            }
            this.qid !== null && this.qid !== undefined && this.show(this.qid);
        },
        trigger: function(e, a)
        {
            var b = f.Event("img_" + e),
                d;
            for (d in a)
            {
                b[d] = a[d];
            }
            b.source = this;
            this.$c.trigger(b);
            this.config[e] && this.config[e].call(this, b);
        },
        destroy: function()
        {
            this.isInTransition && this.ts.stop(this.$active, this.$buffer);
            this.$active && this.$active.remove();
            this.$buffer.remove();
        },
        rebuild: function(e)
        {
            this.quid = null;
            this.isInTransition && this.ts.stop(this.$active, this.$buffer);
            this.$buffer.remove();
            this.cached = [];
            this.data = e;
            this.loader && this.loader.cancel();
        }
    };
})(jQuery);
(function(f)
{
    f.fn.tn3.Thumbnailer = function(e, a, b)
    {
        this.$c = e;
        this.data = a;
        this.config = f.extend({}, f.fn.tn3.Thumbnailer.config, b);
        this.init();
    };
    f.fn.tn3.Thumbnailer.config = {
        overMove: true,
        buffer: 20,
        speed: 8,
        slowdown: 50,
        shaderColor: "#000000",
        shaderOpacity: 0.5,
        shaderDuration: 300,
        shaderOut: 300,
        useTitle: false,
        seqLoad: true,
        align: 1,
        mode: "thumbs",
        cssID: "tn3"
    };
    f.fn.tn3.Thumbnailer.prototype = {
        config: null,
        $c: null,
        $oc: null,
        $ul: null,
        data: null,
        active: -1,
        listSize: 0,
        containerSize: 0,
        containerPadding: 0,
        noBufSize: 0,
        containerOffset: 0,
        mcoor: "mouseX",
        edge: "left",
        size: "width",
        outerSize: "outerWidth",
        mouseX: 0,
        mouseY: 0,
        intID: false,
        pos: 0,
        difference: 0,
        cnt: 1,
        thumbCount: -1,
        initialized: false,
        clickWhenReady: -1,
        loaders: null,
        lis: null,
        isVertical: null,
        marginDif: 0,
        nloaded: 0,
        init: function()
        {
            this.$c.css("position", "absolute").css("cursor", "progress");
            this.lis = [];
            this.loaders = [];
            this.initialized = false;
            this.$oc = f("<div />");
            this.$ul = f("<ul />");
            this.$oc.appendTo(this.$c);
            this.$oc.css("position", "absolute").css("overflow", "hidden").width(this.$c.width()).height(this.$c.height());
            this.$ul.appendTo(this.$oc);
            this.$ul.css("position", "relative").css("margin", "0px").css("padding", "0px").css("border-width", "0px").css("width", "12000px").css("list-style", "none");
            if (this.isVertical === null)
            {
                this.isVertical = this.$c.width() < this.$c.height();
                if (this.isVertical)
                {
                    this.mcoor = "mouseY";
                    this.edge = "top";
                    this.size = "height";
                    this.outerSize = "outerHeight";
                } else
                {
                    this.mcoor = "mouseX";
                    this.edge = "left";
                    this.size = "width";
                    this.outerSize = "outerWidth";
                }
                this.containerSize = this.$oc[this.size]();
                this.noBufSize = this.containerSize - 2 * this.config.buffer;
                this.containerOffset = this.$oc.offset()[this.edge];
                this.containerPadding = parseInt(this.$c.css("padding-" + this.edge));
            }
            this.listSize = 0;
            if (navigator.userAgent.indexOf("MSIE") != -1)
            {
                this.config.seqLoad = false;
            }
            this.loadNextThumb();
        },
        loadNextThumb: function()
        {
            this.thumbCount++;
            var e = this.$ul.append("<li></li>").find(":last");
            if (this.config.mode == "thumbs")
            {
                var a = this.data[this.thumbCount].thumb;
                if (a)
                {
                    this.loaders.push(new f.fn.tn3.ImageLoader(a, this, this.onLoadThumb, [e, this.thumbCount]));
                    !this.config.seqLoad && this.thumbCount < this.data.length - 1 && this.loadNextThumb();
                    return;
                } else
                {
                    this.config.mode = "bullets";
                }
            }
            this.config.mode == "numbers" && e.text(this.thumbCount + 1);
            this.onLoadThumb(null, e, this.thumbCount);
        },
        onLoadThumb: function(e, a, b, d)
        {
            this.lis[b] = {
                li: a
            };
            a.addClass(this.config.cssID + "-thumb");
            a.css("float", this.isVertical ? "none" : "left");
            if (e)
            {
                var c = this.lis[b].thumb = a.append(e).find(":last");
                this.lis[b].pos = a.position()[this.edge];
            }
            this.config.useTitle && a.attr("title", this.data[b].title);
            if (this.config.mode == "thumbs")
            {
                this.lis[b].shade = a.prepend("<div/>").find(":first");
                this.lis[b].shade.css("background-color", this.config.shaderColor).css("width", c.width()).css("height", c.height()).css("position", "absolute");
            }
            this.initThumb(b);
            a.css("opacity", 0);
            a.animate({
                opacity: 1
            }, 1E3);
            this.listSize += a[this.outerSize](true);
            if (!this.initialized)
            {
                this.initialized = true;
                this.initMouse(true);
            }
            d && this.trigger("error", {
                description: d,
                n: b
            });
            this.trigger("thumbLoad", {
                n: b
            });
            this.nloaded++;
            if (this.nloaded < this.data.length)
            {
                if (this.config.seqLoad || this.config.mode != "thumbs")
                {
                    this.loadNextThumb();
                }
            } else
            {
                if (e)
                {
                    this.loaders = null;
                }
                if (!this.config.seqLoad)
                {
                    for (e = 0; e < this.lis.length; e++)
                    {
                        this.lis[e].pos = this.lis[e].li ? this.lis[e].li.position()[this.edge] : 0;
                    }
                }
                this.thumbsLoaded();
            }
            if (this.clickWhenReady == b)
            {
                this.clickWhenReady = -1;
                this.thumbClick(b);
            }
        },
        initThumb: function(e)
        {
            var a = this.lis[e];
            if (a.li)
            {
                a.li.removeClass().addClass(this.config.cssID + "-thumb");
                if (a.shade)
                {
                    a.shade.stop();
                    a.shade.css("opacity", this.config.shaderOpacity);
                }
                var b = this;
                a.li.click(function()
                {
                    b.thumbClick(e);
                    b.trigger("click", {
                        n: e
                    });
                    return false;
                });
                this.config.mode != "thumbs" && a.li.hover(function()
                {
                    b.mouseOver(e);
                }, function()
                {
                    b.mouseOver(-1);
                });
            }
        },
        lastOver: -1,
        mouseOver: function(e)
        {
            if (e != this.lastOver)
            {
                if (this.lastOver != -1 && this.lastOver != this.active)
                {
                    a = this.lis[this.lastOver];
                    if (a.li)
                    {
                        a.li.removeClass(this.config.cssID + "-thumb-over");
                    }
                    if (a.shade)
                    {
                        a.shade.stop();
                        a.shade.animate({
                            opacity: this.config.shaderOpacity
                        }, {
                            duration: this.config.shaderOut,
                            easing: "easeOutCubic",
                            queue: false
                        });
                    }
                    this.trigger("thumbOut", {
                        n: e
                    });
                }
                this.lastOver = e;
                if (!(e == -1 && e == this.active))
                {
                    var a = this.lis[e];
                    if (a.li)
                    {
                        a.li.addClass(this.config.cssID + "-thumb-over");
                    }
                    if (a.shade)
                    {
                        a.shade.stop();
                        a.shade.animate({
                            opacity: 0
                        }, {
                            duration: this.config.shaderDuration,
                            easing: "easeOutCubic",
                            queue: false
                        });
                    }
                    this.trigger("thumbOver", {
                        n: e
                    });
                }
            }
        },
        next: function(e)
        {
            if (e)
            {
                this.listSize > this.containerSize && this.move(this.$ul.position()[this.edge] - this.containerSize);
            } else
            {
                e = this.active + 1;
                if (this.active == -1 || this.active + 1 == this.data.length)
                {
                    e = 0;
                }
                this.thumbClick(e);
            }
        },
        prev: function(e)
        {
            if (e)
            {
                this.listSize > this.containerSize && this.move(this.$ul.position()[this.edge] + this.containerSize);
            } else
            {
                e = this.active - 1;
                if (this.active == -1 || this.active === 0)
                {
                    e = this.data.length - 1;
                }
                this.thumbClick(e);
            }
        },
        move: function(e)
        {
            var a = {};
            a[this.edge] = Math.min(0, Math.max(e, -(this.listSize - this.containerSize)));
            this.$ul.stop();
            this.$ul.animate(a, 300);
        },
        thumbClick: function(e)
        {
            if (this.active == -1)
            {
                if (this.thumbCount <= e)
                {
                    this.clickWhenReady = e;
                    return;
                }
            } else if (e == this.active)
            {
                return;
            } else
            {
                this.initThumb(this.active);
            }
            if (e == "next")
            {
                e = this.active + 1 < this.data.length ? this.active + 1 : 0;
            } else if (e == "prev")
            {
                e = this.active > 0 ? this.active - 1 : this.data.length - 1;
            }
            var a = this.lis[e];
            if (a.li)
            {
                a.li.addClass(this.config.cssID + "-thumb-selected").unbind("click mouseenter mouseleave");
            }
            a.shade && a.shade.animate({
                opacity: 0
            }, this.config.shaderDuration);
            this.active = e;
            this.centerActive();
        },
        centerActive: function(e)
        {
            if (this.active != -1)
            {
                var a = this.lis[this.active].li,
                    b = this.$ul.position()[this.edge] + a.position()[this.edge],
                    d = a[this.outerSize]() / 2;
                if (b + d > this.containerSize || b + d < 0)
                {
                    a = 10 - a.position()[this.edge] + this.containerSize / 2 - d;
                    a = Math.min(0, a);
                    a = Math.max(a, -this.listSize + this.containerSize);
                    b = {};
                    b[this.edge] = a;
                    e ? this.$ul.css(b) : this.$ul.animate(b, 200);
                }
            }
        },
        thumbsLoaded: function()
        {
            this.$c.css("cursor", "auto");
            this.$ul.css("width", this.listSize + "px");
            this.centerList();
            this.trigger("load");
        },
        centerList: function(e)
        {
            if (this.listSize < this.containerSize)
            {
                var a = {};
                a[this.edge] = this.config.align ? this.config.align == 1 ? (this.containerSize - this.listSize) / 2 : this.containerSize - this.listSize : 0;
                e || this.config.mode != "thumbs" ? this.$ul.css(a) : this.$ul.animate(a, 300);
            } else
            {
                this.centerActive(e);
                if (this.$ul.position()[this.edge] > 0)
                {
                    this.$ul.css(this.edge, 0);
                } else
                {
                    this.$ul.position()[this.edge] + this.listSize < this.containerSize && this.$ul.css(this.edge, -(this.listSize - this.containerSize));
                }
            }
        },
        initMouse: function(e)
        {
            if (this.config.mode == "thumbs")
            {
                e = e ? "bind" : "unbind";
                this.$oc[e]("mouseenter", f.proxy(this.mouseenter, this));
                this.$oc[e]("mouseleave", f.proxy(this.mouseleave, this));
            }
        },
        mouseenter: function()
        {
            this.trigger("over");
            clearInterval(this.intID);
            var e = this;
            this.$ul.stop();
            this.$c.mousemove(this.mcoor == "mouseX" ?
            function(a)
            {
                e.mouseX = a.pageX - e.containerOffset;
            } : function(a)
            {
                e.mouseY = a.pageY - e.containerOffset;
            });
            if (this.lis[0].li)
            {
                this.marginDif = parseInt(this.lis[0].li.css("margin-" + this.edge));
            }
            if (isNaN(this.marginDif))
            {
                this.marginDif = 0;
            }
            e.intID = this.listSize > this.containerSize && this.config.overMove ? setInterval(function()
            {
                e.slide.call(e);
            }, 10) : setInterval(function()
            {
                e.mouseTrack.call(e);
            }, 10);
        },
        mouseleave: function()
        {
            this.trigger("out");
            this.$c.unbind("mousemove");
            clearInterval(this.intID);
            var e = this;
            this.intID = setInterval(function()
            {
                e.slideOut.call(e);
            }, 10);
            this.mouseOver(-1);
        },
        slide: function()
        {
            this.cnt = 1;
            var e = this[this.mcoor];
            if (e <= this.config.buffer)
            {
                this.pos = 0;
            } else if (e >= this.containerSize - this.config.buffer)
            {
                this.pos = this.containerSize - this.listSize - 1;
            } else
            {
                var a = this.containerSize * (e - this.config.buffer);
                a /= this.noBufSize;
                this.pos = a * (1 - this.listSize / this.containerSize);
            }
            for (a = this.lis.length - 1; a > -1; a--)
            {
                var b = e - this.prevdx;
                if (b >= this.lis[a].pos && b < this.lis[a].pos + (this.lis[a].li ? this.lis[a].li.width() : 0))
                {
                    this.mouseOver(a);
                    break;
                }
            }
            e = this.prevdx - this.marginDif;
            this.difference = e - this.pos;
            e = Math.round(e - this.difference / this.config.speed);
            if (this.prevdx != e)
            {
                this.$ul.css(this.edge, e);
                this.prevdx = e;
            }
        },
        prevdx: 0,
        mouseTrack: function()
        {
            for (var e = this[this.mcoor], a = this.lis.length - 1; a > -1; a--)
            {
                var b = e - this.$ul.position()[this.edge];
                if (b >= this.lis[a].pos && b < this.lis[a].pos + (this.lis[a].li ? this.lis[a].li.width() : 0))
                {
                    this.mouseOver(a);
                    break;
                }
            }
        },
        slideOut: function()
        {
            if (this.config.slowdown !== 0 && this.difference !== 0)
            {
                var e = this.$ul.position()[this.edge];
                this.difference = e - this.pos;
                this.$ul.css(this.edge, e - this.difference / (this.config.speed * this.cnt));
                this.cnt *= 1 + 4 / this.config.slowdown;
                if (this.cnt >= 40)
                {
                    this.difference = 0;
                    this.cnt = 1;
                }
            } else
            {
                clearInterval(this.intID);
                this.intID = null;
            }
        },
        trigger: function(e, a)
        {
            var b = f.Event("tn_" + e),
                d;
            for (d in a)
            {
                b[d] = a[d];
            }
            b.source = this;
            this.$c.trigger(b);
            this.config[e] && this.config[e].call(this, b);
        },
        destroy: function()
        {
            clearInterval(this.intID);
            this.$c.empty();
        },
        rebuild: function(e)
        {
            clearInterval(this.intID);
            this.$c.empty();
            this.data = e;
            this.active = this.thumbCount = -1;
            this.nloaded = 0;
            this.initMouse(false);
            this.loaders !== null && f.each(this.loaders, function(a, b)
            {
                b.cancel();
            });
            this.init();
        },
        setSize: function(e, a)
        {
            this.isVertical ? this.$c.height(a) : this.$c.width(e);
            this.$oc.width(this.$c.width()).height(this.$c.height());
            this.containerSize = this.$oc[this.size]();
            this.noBufSize = this.containerSize - 2 * this.config.buffer;
            this.containerOffset = this.$oc.offset()[this.edge];
            this.initMouse(true);
            this.loaders === null && this.centerList(true);
        }
    };
})(jQuery);
(function(f)
{
    f.fn.tn3.altLink = null;
    f.fn.tn3.ImageLoader = function(e, a, b, d)
    {
        this.$img = f(new Image);
        d.unshift(this.$img);
        this.altLink = f.fn.tn3.altLink;
        a = {
            url: e,
            context: a,
            callback: b,
            args: d
        };
        this.$img.bind("load", a, this.load);
        this.$img.bind("error", a, f.proxy(this.error, this));
        this.$img.attr("src", e);
    };
    f.fn.tn3.ImageLoader.prototype = {
        $img: null,
        altLink: null,
        load: function(e)
        {
            e.data.callback.apply(e.data.context, e.data.args);
            e.data.args[0].unbind("load").unbind("error");
        },
        error: function(e)
        {
            if (this.altLink)
            {
                this.altLink = null;
                this.$img.attr("src", f.fn.tn3.altLink + "?u=" + e.data.url);
            } else
            {
                e.data.args.push("image loading error: " + e.data.url);
                e.data.callback.apply(e.data.context, e.data.args);
                this.$img.unbind("load").unbind("error");
            }
        },
        cancel: function()
        {
            this.$img.unbind("load").unbind("error");
        }
    };
})(jQuery);
(function(f)
{
    f.fn.tn3.Timer = function(e, a, b)
    {
        this.$target = e;
        this.duration = a;
        this.tickint = b;
    };
    f.fn.tn3.Timer.prototype = {
        $target: null,
        duration: null,
        id: null,
        runs: false,
        counter: null,
        countDuration: null,
        tickid: null,
        ticks: null,
        tickint: 500,
        start: function()
        {
            if (!this.runs)
            {
                this.runs = true;
                this.startCount(this.duration);
                this.trigger("timer_start");
            }
        },
        startCount: function(e)
        {
            this.clean();
            this.countDuration = e;
            this.counter = +new Date;
            var a = this;
            this.id = setTimeout(function()
            {
                a.clean.call(a);
                a.runs = false;
                a.trigger.call(a, "timer_end");
            }, e);
            var b = this.duration / this.tickint;
            this.ticks = Math.round(e / b);
            this.tickid = setInterval(function()
            {
                a.ticks = Math.ceil((e - new Date + a.counter) / b);
                a.ticks > 0 && a.trigger.call(a, "timer_tick", {
                    tick: a.ticks,
                    totalTicks: a.tickint
                });
            }, b);
            this.trigger("timer_tick", {
                tick: this.ticks,
                totalTicks: this.tickint
            });
        },
        stop: function()
        {
            this.clean();
            this.runs = false;
            this.trigger("timer_stop");
        },
        clean: function()
        {
            clearTimeout(this.id);
            this.id = null;
            clearInterval(this.tickid);
            this.elapsed = this.tickid = null;
        },
        elapsed: null,
        pause: function(e)
        {
            if (this.runs)
            {
                if (e)
                {
                    this.clean();
                    e = this.duration / this.tickint;
                    this.elapsed = Math.floor((+new Date - this.counter) / e) * e;
                }
            } else if (this.elapsed !== null)
            {
                this.startCount(this.countDuration - this.elapsed);
                this.elapsed = null;
            }
        },
        trigger: function(e, a)
        {
            var b = f.Event(e),
                d;
            for (d in a)
            {
                b[d] = a[d];
            }
            this.$target.trigger(b);
        }
    };
})(jQuery);
(function(f)
{
    f.fn.tn3.Albums = function(e, a, b)
    {
        this.data = e;
        this.$c = a;
        this.$in = a.find("." + b + "-inalbums");
        this.cssID = b;
        this.$a = this.$in.find("." + this.cssID + "-album");
        this.n = 0;
        this.initValues = {
            width: a.width(),
            height: a.height(),
            aw: this.$a.width(),
            ah: this.$a.height(),
            inw: this.$in.width(),
            inh: this.$in.height()
        };
        this.pad = parseInt(this.$in.css("padding-left"));
    };
    f.fn.tn3.Albums.prototype = {
        data: null,
        $c: null,
        $in: null,
        $a: null,
        initValues: null,
        p: null,
        aw: null,
        ah: null,
        cssID: null,
        coors: null,
        ctrl_next: null,
        ctrl_prev: null,
        n: null,
        selected: null,
        pad: null,
        space: null,
        getButtons: function()
        {
            this.$in.empty();
            var e = [];
            $cur = this.$a.clone();
            $cur.appendTo(this.$in);
            this.space = this.space === null ? this.pad : this.space;
            var a = this.$in.width() - 2 * this.pad;
            this.$in.height();
            var b = Math.floor(a / this.initValues.aw);
            this.aw = Math.floor((a - (b - 1) * this.space) / b);
            this.ah = this.initValues.ah;
            for (b = a = this.pad; b + this.ah < this.$in.height(); )
            {
                for (; a + this.aw < this.$in.width(); )
                {
                    e.push($cur);
                    $cur.css("left", a).css("top", b);
                    $cur.width(this.aw).height(this.ah);
                    $cur.hide();
                    $cur = this.$a.clone();
                    $cur.appendTo(this.$in);
                    a += this.aw + this.space;
                }
                b += this.ah + this.space;
                a = this.pad;
            }
            $cur.remove();
            return e;
        },
        show: function(e, a, b)
        {
            this.$c.show();
            if (e == undefined)
            {
                e = 0;
            } else if (e == "next")
            {
                e = this.n + 1 < this.data.length ? this.n + 1 : 0;
            } else if (e == "prev")
            {
                e = this.n > 0 ? this.n - 1 : this.data.length - 1;
            }

            if (a != undefined)
            {
                this.selected = a;
            }
            var d, c, g = this.getButtons(),
                i = this;
            a = e * g.length;
            var p = Math.min(this.data.length, (e + 1) * g.length);
            this.trigger("init");
            for (var j = a; j < p; j++)
            {
                var h = this.data[j];
                if (!h.title)
                {
                    h.title = "Unknown";
                }
                d = g[j - a];
                c = '<div class="' + this.cssID + '-album-image"></div>';
                c += '<div class="' + this.cssID + '-album-title">' + h.title + "</div>";
                if (h.description)
                {
                    c += '<div class="' + this.cssID + '-album-description">' + h.description + "</div>";
                }
                d.html(c);
                new f.fn.tn3.ImageLoader(h.thumb, this, this.onThumbLoad, [d.find("." + this.cssID + "-album-image")]);
                d.data("tn3", j);
                this.trigger("binit", {
                    $a: d
                });
                if (j != this.selected)
                {
                    d.click(function()
                    {
                        i.trigger("click", {
                            n: f(this).data("tn3")
                        });
                    }).hover(function()
                    {
                        f(this).addClass(i.cssID + "-album-over");
                    }, function()
                    {
                        f(this).removeClass(i.cssID + "-album-over");
                    });
                } else
                {
                    d.addClass(this.cssID + "-album-selected");
                    d.unbind("click mouseenter mouseleave");
                }
            }
            d = j % g.length;
            if (d !== 0)
            {
                for (c = g.length - 1; c >= d; c--)
                {
                    g.splice(c, 1);
                }
            }
            this.n = e;
            if (b)
            {
                f.each(g, function(l)
                {
                    g[l].show();
                });
            } else
            {
                var k = 800 / g.length;
                this.$c.slideDown(e === 0 ? 300 : 0, function()
                {
                    f.each(g, function(l)
                    {
                        g[l].delay(l * k).fadeIn(150);
                    });
                });
            }
            this.ctrl_prev && this.enablePageControl("prev", a > 0);
            this.ctrl_next && this.enablePageControl("next", p < this.data.length);
        },
        onThumbLoad: function(e, a, b)
        {
            b && this.trigger("error", {
                description: b
            });
            a.prepend(e);
        },
        hide: function()
        {
            this.$c.hide();
        },
        enablePageControl: function(e, a)
        {
            var b = this["ctrl_" + e];
            if (a)
            {
                if (!b.data("active"))
                {
                    var d = this;
                    b.click(function(c)
                    {
                        d.show(e);
                        c.stopPropagation();
                    }).hover(function()
                    {
                        f(this).addClass(d.cssID + "-albums-" + e + "-over");
                    }, function()
                    {
                        f(this).removeClass(d.cssID + "-albums-" + e + "-over");
                    });
                    b.data("active", true);
                }
            } else
            {
                b.removeClass(this.cssID + "-albums-" + e + "-over");
                b.unbind();
                b.data("active", false);
            }
        },
        setControl: function(e, a)
        {
            if (e == "close")
            {
                var b = this;
                a.click(function(d)
                {
                    b.$c.hide();
                    b.trigger("close");
                    d.stopPropagation();
                });
            }
            this["ctrl_" + e] = a;
        },
        trigger: function(e, a)
        {
            var b = f.Event("albums_" + e),
                d;
            for (d in a)
            {
                b[d] = a[d];
            }
            b.source = this;
            this.$c.trigger(b);
        },
        changeSize: function(e, a)
        {
            this.$c.width(this.initValues.width + e).height(this.initValues.height + a);
            this.$in.width(this.initValues.inw + e).height(this.initValues.inh + a);
            this.$c.css("display") != "none" && this.show(undefined, undefined, true);
        }
    };
})(jQuery);
(function(f)
{
    var e = f.fn.tn3.Transitions = function(b, d, c, g, i)
    {
        this.ts = b;
        this.def = f.extend(true, {}, this[d.type + "Config"], d);
        if (!b)
        {
            this.ts = [this.def];
        }
        for (var p in this.ts)
        {
            this.ts[p] = f.extend(true, {}, this[this.ts[p].type + "Config"], this.ts[p]);
        }
        this.random = c;
        this.end = f.proxy(g, i);
    },
        a = e.prototype = {
            ts: null,
            def: {
                type: "slide"
            },
            random: false,
            gs: [],
            end: null,
            ct: null,
            counter: -1,
            setTransition: function()
            {
                if (this.ts.length == 1)
                {
                    this.ct = this.ts[0];
                } else
                {
                    this.counter++;
                    if (this.counter == this.ts.length)
                    {
                        this.counter = 0;
                    }
                    this.random && this.counter === 0 && f.fn.tn3utils.shuffle(this.ts);
                    this.ct = this.ts[this.counter];
                }
            },
            start: function(b, d, c)
            {
                this.setTransition();
                if (this[this.ct.type + "Condition"] !== undefined && !this[this.ct.type + "Condition"](b, d, this.ct))
                {
                    this.ct = this.def;
                }
                this[this.ct.type](b, d, this.ct, c);
            },
            stop: function(b, d)
            {
                this[this.ct.type + "Stop"](b, d, this.ct);
            },
            makeGrid: function(b, d, c)
            {
                var g = b.width(),
                    i = Math.round(g / d);
                g = g - i * d;
                var p = b.height(),
                    j = Math.round(p / c);
                p = p - j * c;
                var h, k, l, m, q, r = 0,
                    s = 0,
                    u = "url(" + b.find("img").attr("src") + ") no-repeat scroll -";
                for (h = 0; h < d; h++)
                {
                    this.gs[h] = [];
                    m = g > h ? i + 1 : i;
                    for (k = 0; k < c; k++)
                    {
                        l = b.append("<div></div>").find(":last");
                        q = p > k ? j + 1 : j;
                        l.width(m).height(q).css("background", u + r + "px -" + s + "px").css("left", r).css("top", s).css("position", "absolute");
                        this.gs[h].push(l);
                        s += q;
                    }
                    r += m;
                    s = 0;
                }
                b.find("img").remove();
            },
            stopGrid: function()
            {
                for (var b = 0; b < this.gs.length; b++)
                {
                    for (var d = 0; d < this.gs[b].length; d++)
                    {
                        this.gs[b][d].clearQueue();
                        this.gs[b][d].remove();
                    }
                }
                this.gs = [];
            },
            flatSort: function(b)
            {
                for (var d = [], c = 0; c < this.gs.length; c++)
                {
                    for (var g = 0; g < this.gs[c].length; g++)
                    {
                        d.push(this.gs[c][g]);
                    }
                }
                b && d.reverse();
                return d;
            },
            randomSort: function()
            {
                var b = this.flatSort();
                f.fn.tn3utils.shuffle(b);
                return b;
            },
            diagonalSort: function(b, d)
            {
                for (var c = [], g = b > 0 ? this.gs.length - 1 : 0, i = d > 0 ? 0 : this.gs[0].length - 1; this.gs[g]; )
                {
                    c.push(this.addDiagonal([], g, i, b, d));
                    g -= b;
                }
                g += b;
                for (i += d; this.gs[g][i]; )
                {
                    c.push(this.addDiagonal([], g, i, b, d));
                    i += d;
                }
                return c;
            },
            addDiagonal: function(b, d, c, g, i)
            {
                b.push(this.gs[d][c]);
                return this.gs[d + g] && this.gs[d + g][c + i] ? this.addDiagonal(b, d + g, c + i, g, i) : b;
            },
            circleSort: function(b)
            {
                var d = [],
                    c = this.gs.length,
                    g = this.gs[0].length,
                    i = [Math.floor(c / 2), Math.floor(g / 2)];
                c = c * g;
                g = [[1, 0], [0, 1], [-1, 0], [0, -1]];
                var p = 0,
                    j = 0,
                    h;
                for (d.push(this.gs[i[0]][i[1]]); d.length < c; )
                {
                    for (h = 0; h <= p; h++)
                    {
                        this.addGridPiece(d, i, g[j]);
                    }
                    if (j == g.length - 1)
                    {
                        j = 0;
                    } else
                    {
                        j++;
                    }
                    p += 0.5;
                }
                b && d.reverse();
                return d;
            },
            addGridPiece: function(b, d, c)
            {
                d[0] += c[0];
                d[1] += c[1];
                this.gs[d[0]] && this.gs[d[0]][d[1]] && b.push(this.gs[d[0]][d[1]]);
            },
            getSlidePositions: function(b, d)
            {
                var c = {
                    dir: d
                };
                switch (d)
                {
                    case "left":
                        c.pos = b.outerWidth(true);
                        break;
                    case "right":
                        c.pos = -b.outerWidth(true);
                        c.dir = "left";
                        break;
                    case "top":
                        c.pos = -b.outerHeight(true);
                        break;
                    case "bottom":
                        c.pos = b.outerHeight(true);
                        c.dir = "top";
                        break;
                    default:
                        break;
                }
                return c;
            },
            animateGrid: function(b, d, c, g, i, p, j)
            {
                var h = {
                    duration: g,
                    easing: c,
                    complete: function()
                    {
                        f(this).remove();
                    }
                };
                for (c = 0; c < b.length; c++)
                {
                    g = f.easing[i](0, c, 0, p, b.length);
                    if (c == b.length - 1)
                    {
                        var k = this;
                        h.complete = function()
                        {
                            f(this).remove();
                            j.call(k);
                        };
                    }
                    if (f.isArray(b[c]))
                    {
                        for (var l in b[c])
                        {
                            b[c][l].delay(g).animate(d[c], h);
                        }
                    } else
                    {
                        b[c].delay(g).animate(d[c], h);
                    }
                }
            },
            getValueArray: function(b, d, c)
            {
                var g = [],
                    i = f.isArray(d),
                    p = f.isArray(c),
                    j;
                for (j = 0; j < b; j++)
                {
                    o = {};
                    o[i ? d[j % d.length] : d] = p ? c[j % c.length] : c;
                    g.push(o);
                }
                return g;
            }
        };
    e.defined = [];
    e.define = function(b)
    {
        for (var d in b)
        {
            switch (d)
            {
                case "type":
                    e.defined.push(b.type);
                    break;
                case "config":
                    a[b.type + "Config"] = b.config;
                    break;
                case "f":
                    a[b.type] = b.f;
                    break;
                case "stop":
                    a[b.type + "Stop"] = b.stop;
                    break;
                case "condition":
                    a[b.type + "Condition"] = b.condition;
                    break;
                default:
                    a[d] = b[d];
                    break;
            }
        }
    };
    e.define({
        type: "none",
        config: {},
        f: function()
        {
            this.end();
        },
        stop: function()
        {
            this.end();
        }
    });
    e.define({
        type: "fade",
        config: {
            duration: 300,
            easing: "easeInQuad"
        },
        f: function(b, d, c)
        {
            var g = this;
            b.animate({
                opacity: 0
            }, c.duration, c.easing, function()
            {
                g.end();
            });
        },
        stop: function(b)
        {
            b.stop();
            this.end();
        }
    });
    e.define({
        type: "slide",
        config: {
            duration: 300,
            direction: "auto",
            easing: "easeInOutCirc"
        },
        f: function(b, d, c, g)
        {
            g = this.getSlidePositions(d, c.direction == "auto" ? g : c.direction);
            var i = {},
                p = {};
            d.css(g.dir, g.pos);
            i[g.dir] = 0;
            d.animate(i, c.duration, c.easing, this.end);
            p[g.dir] = -g.pos;
            b.animate(p, c.duration, c.easing);
        },
        stop: function(b, d)
        {
            d.stop();
            b.stop();
            b.css("left", 0).css("top", 0);
            d.css("left", 0).css("top", 0);
            this.end();
        }
    });
    e.define({
        type: "blinds",
        config: {
            duration: 240,
            easing: "easeInQuad",
            direction: "vertical",
            parts: 12,
            partDuration: 100,
            partEasing: "easeInQuad",
            method: "fade",
            partDirection: "auto",
            cross: true
        },
        f: function(b, d, c, g)
        {
            c.direction == "horizontal" ? this.makeGrid(b, 1, c.parts) : this.makeGrid(b, c.parts, 1);
            g = c.partDirection == "auto" ? g : c.partDirection;
            b = this.flatSort(g == "left" || g == "top");
            var i;
            switch (c.method)
            {
                case "fade":
                    i = this.getValueArray(b.length, "opacity", 0);
                    break;
                case "scale":
                    i = this.getValueArray(b.length, g == "left" ? "width" : "height", "1px");
                    break;
                case "slide":
                    d = this.getSlidePositions(d, g);
                    i = this.getValueArray(b.length, d.dir, c.cross ? [d.pos, -d.pos] : d.pos);
                    break;
                default:
                    break;
            }
            this.animateGrid(b, i, c.partEasing, c.partDuration, c.easing, c.duration, this.blindsStop);
        },
        stop: function()
        {
            this.stopGrid();
            this.end();
        },
        condition: function(b, d)
        {
            return !b.data("scaled") || !d.data("scaled");
        }
    });
    e.define({
        type: "grid",
        config: {
            duration: 260,
            easing: "easeInQuad",
            gridX: 7,
            gridY: 5,
            sort: "diagonal",
            sortReverse: false,
            diagonalStart: "bl",
            method: "fade",
            partDuration: 300,
            partEasing: "easeOutSine",
            partDirection: "left"
        },
        f: function(b, d, c, g)
        {
            this.makeGrid(b, c.gridX, c.gridY);
            b = c.partDirection == "auto" ? g : c.partDirection;
            var i, p;
            if (c.sort == "diagonal")
            {
                switch (c.diagonalStart)
                {
                    case "tr":
                        i = this.diagonalSort(1, 1);
                        break;
                    case "tl":
                        i = this.diagonalSort(-1, 1);
                        break;
                    case "br":
                        i = this.diagonalSort(1, -1);
                        break;
                    case "bl":
                        i = this.diagonalSort(-1, -1);
                        break;
                    default:
                        break;
                }
            } else
            {
                i = this[c.sort + "Sort"](c.sortReverse);
            }
            switch (c.method)
            {
                case "fade":
                    p = this.getValueArray(i.length, "opacity", 0);
                    break;
                case "scale":
                    p = this.getValueArray(i.length, b == "left" ? "width" : "height", "1px");
                    break;
                default:
                    break;
            }
            this.animateGrid(i, p, c.partEasing, c.partDuration, c.easing, c.duration, this.gridStop);
        },
        stop: function()
        {
            this.stopGrid();
            this.end();
        },
        condition: function(b, d)
        {
            return !b.data("scaled") || !d.data("scaled");
        }
    });
})(jQuery);
(function(f)
{
    function e(h)
    {
        var k = h && h.message !== undefined ? h.message : undefined;
        h = f.extend({}, f.tn3block.defaults, h || {});
        k = k === undefined ? h.message : k;
        j && a({});
        var l = h.baseZ;
        var m = f.browser.msie || h.forceIframe ? f('<iframe class="blockUI" style="z-index:' + l + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + h.iframeSrc + '"></iframe>') : f('<div class="blockUI" style="display:none"></div>');
        l++;
        var q = f('<div class="blockUI ' + h.cssID + '-overlay" style="z-index:' + l + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
        l++;
        l = f('<div class="blockUI ' + h.blockMsgClass + ' blockPage" style="z-index:' + l + ';display:none;position:fixed"></div>');
        l.css("left", "0px").css("top", "0px");
        if (!h.applyPlatformOpacityRules || !(f.browser.mozilla && (/Linux/).test(navigator.platform)))
        {
            q.css(h.overlayCSS);
        }
        q.css("position", "fixed");
        if (f.browser.msie || h.forceIframe)
        {
            m.css("opacity", 0);
        }
        var r = [m, q, l],
            s = f("body");
        f.each(r, function()
        {
            this.appendTo(s);
        });
        r = i && (!f.boxModel || f("object,embed", null).length > 0);
        if (p || r)
        {
            h.allowBodyStretch && f.boxModel && f("html,body").css("height", "100%");
            f.each([m, q, l], function(u, v)
            {
                var t = v[0].style;
                t.position = "absolute";
                if (u < 2)
                {
                    t.setExpression("height", "Math.max(document.body.scrollHeight, document.body.offsetHeight)- (jQuery.boxModel?0:" + h.quirksmodeOffsetHack + ') + "px"');
                    t.setExpression("width", 'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
                } else if (h.centerY)
                {
                    t.setExpression("top", '(document.documentElement.clientHeight || document.body.clientHeight) / 2- (this.offsetHeight / 2)+ (blah = document.documentElement.scrollTop? document.documentElement.scrollTop: document.body.scrollTop)+ "px"');
                    t.marginTop = 0;
                } else
                {
                    h.centerY || t.setExpression("top", '(document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                }
            });
        }
        if (k)
        {
            k.data("blockUI.parent", k.parent());
            l.append(k);
            if (k.jquery || k.nodeType)
            {
                f(k).show();
            }
        }
        if ((f.browser.msie || h.forceIframe) && h.showOverlay)
        {
            m.show();
        }
        h.showOverlay && q.show();
        k && l.show();
        h.onBlock && h.onBlock();
        d(1, h);
        j = k;
    }
    function a(h)
    {
        h = f.extend({}, f.tn3block.defaults, h || {});
        d(0, h);
        var k = f("body").children().filter(".blockUI").add("body > .blockUI");
        b(k, h);
    }
    function b(h, k)
    {
        h.each(function()
        {
            this.parentNode && this.parentNode.removeChild(this);
        });
        j.data("blockUI.parent").append(j);
        j = null;
        typeof k.onUnblock == "function" && k.onUnblock.call(k.con);
    }
    function d(h, k)
    {
        if (h || j)
        {
            !k.bindEvents || h && !k.showOverlay || (h ? f(document).bind("mousedown mouseup keydown keypress", k, c) : f(document).unbind("mousedown mouseup keydown keypress", c));
        }
    }
    function c(h)
    {
        var k = h.data;
        if (f(h.target).parents("div." + k.blockMsgClass).length > 0)
        {
            return true;
        }
        return f(h.target).parents().children().filter("div.blockUI").length === 0;
    };
    var g = document.documentMode || 0,
        i = f.browser.msie && (f.browser.version < 8 && !g || g < 8),
        p = f.browser.msie && (/MSIE 6.0/).test(navigator.userAgent) && !g;
    f.tn3block = function(h)
    {
        e(h);
    };
    f.tn3unblock = function(h)
    {
        a(h);
    };
    var j = undefined;
    f.tn3block.defaults = {
        message: "<h1>Please wait...</h1>",
        overlayCSS: {},
        iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank",
        forceIframe: false,
        baseZ: 1E3,
        allowBodyStretch: true,
        bindEvents: true,
        showOverlay: true,
        applyPlatformOpacityRules: true,
        onBlock: null,
        onUnblock: null,
        quirksmodeOffsetHack: 4,
        blockMsgClass: "blockMsg",
        cssID: "tn3"
    };
})(jQuery);
(function(f)
{
    (f.fn.tn3.External = function(e, a)
    {
        if (e)
        {
            this.context = a;
            this.reqs = e.length;
            for (var b = 0; b < e.length; b++)
            {
                new f.fn.tn3.External[e[b].origin](e[b], this);
            }
        }
    }).prototype = {
        context: null,
        reqs: 0,
        getImages: function(e, a)
        {
            e.origin.getImages(e, a);
        },
        setAlbumData: function(e, a)
        {
            this.reqs--;
            this.context.setAlbumData.call(this.context, e, a);
        },
        setImageData: function(e, a, b)
        {
            this.context.setImageData.call(this.context, e, a, b);
        }
    };
})(jQuery);
(function(f)
{
    var e = f.fn.tn3.External;
    e.xml = function(a, b)
    {
        this.extcon = b;
        this.config = f.extend(true, {}, e.xml.config, a);
        this.init();
    };
    e.xml.config = {
        url: "",
        thumb_size: 1,
        image_size: 0
    };
    e.xml.prototype = {
        config: null,
        extcon: null,
        getImages: function() { },
        init: function()
        {
            this.request();
        },
        request: function()
        {
            f.ajax({
                url: this.config.url,
                cache: false,
                context: this,
                success: function(a)
                {
                    this.extcon.setAlbumData(this.parseXML(a));
                },
                error: function()
                {
                    this.extcon.setAlbumData([], "XML loading failed");
                }
            });
        },
        parseXML: function(a)
        {
            try
            {
                var b = [],
                    d = this,
                    c, g, i;
                f(a).find(":first").children().each(function(j, h)
                {
                    c = f(this);
                    b[j] = {};
                    b[j].adata = {
                        id: j,
                        origin: d
                    };
                    g = c.find("file_root").text();
                    d.setProps(h, b[j], g);
                    b[j].imgs = [];
                    delete b[j].images;
                    c.find("images > image").each(function(k, l)
                    {
                        i = b[j].imgs[k] = {};
                        d.setProps(l, i, g);
                    });
                });
            } catch (p)
            {
                this.extcon.setAlbumData([], "XML parsing error");
            }
            return b;
        },
        setProps: function(a, b, d)
        {
            var c;
            f(a).children().each(function(g, i)
            {
                if (i.firstChild)
                {
                    c = i.firstChild.nodeValue;
                    n = i.tagName;
                    if (n.substring(n.length - 3) == "src")
                    {
                        c = d + c;
                        if (n == "image_src")
                        {
                            n = "img";
                        } else if (n == "thumb_src")
                        {
                            n = "thumb";
                        }
                    }
                    b[n] = c;
                }
            });
            if (!b.thumb)
            {
                b.thumb = this.getThumb(b.img, this.config.thumb_size);
            }
            if (this.config.image_size > 0)
            {
                b.img = this.getThumb(b.img, this.config.image_size);
            }
        },
        getThumb: function(a, b)
        {
            if (!(!a || a === ""))
            {
                if (b == undefined)
                {
                    b = 1;
                } else if (b === 0)
                {
                    return a;
                }
                var d = a.split("/"),
                    c = d.pop().split("."),
                    g = c.pop().toString();
                g = c.join(".") + "_" + b + "." + g.toLowerCase();
                return a = d.join("/") + "/thumbs/" + g;
            }
        }
    };
})(jQuery);