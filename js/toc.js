(function () {
    function getToc(parent) {
        var id;
        var toc = $(parent).find("h3").map(function (index, h3) {
            h3 = $(h3);
            id = h3.text().replace(/[@|#|\.]/g, '');
            h3.attr('data-id', id);
            h3.before(["<i class='anchor' id='", id, "'></i>"].join(''));
            var h4s = h3.nextUntil("h3", "h4").map(function (index, h4) {
                h4 = $(h4);
                id = h4.text().replace(/[@|#|\.]/g, '');
                h4.attr('data-id', id);
                h4.before(["<i class='anchor' id='", id, "'></i>"].join(''));
                return {
                    id: id,
                    name: h4.text()
                };
            });
            return {
                name: h3.text(),
                id: h3.attr('data-id'),
                child: h4s
            };
        });
        return toc;
    }

    function renderToc(toc, target) {
        $(target).append(toMenu(toc, function (h3, li) {
            if (h3.child.length !== 0) {
                li.append(toMenu(h3.child));
            }
        })).append("<a href='#' class='back'>回到顶部</a>");

        function toMenu(list, each) {
            var ul = $("<ul class='nav'></ul>");
            list.each(function (index, item) {
                var li = $(["<li><a href='#", item.id, "'>", item.name, "</a></li>"].join(''));
                each && each(item, li);
                ul.append(li);
            });
            return ul;
        }
    }

    function fixAffixPosition() {
        var docRight = $(window).width() - ($(".doc-content").position().left + $(".doc-content").width() + 255);
        $(".toc").css('right', docRight);
    }

    $(document).ready(function () {
        function setScrollSpy() {
            $(".doc-content h3, .doc-content h4").each(function (i) {
                var me = $(this);
                var top = i === 0 ? 0 : me.position().top;
                var next = me.nextUntil(me[0].tagName).last().next();
                var end = next.length === 0 ? $(document).height() : me.nextUntil(me[0].tagName).last().next()
                    .position().top;
                me.scrollspy2({
                    min: top,
                    max: end,
                    onEnter: function (element, position) {
                        $(".toc a[href='#" + $(element).attr('id') + "']").parent('li').addClass(
                            'active');
                    },
                    onLeave: function (element, position) {
                        $(".toc a[href='#" + $(element).attr('id') + "']").parent('li').removeClass(
                            'active');
                    }
                });
            });
        }
        renderToc(getToc($(".doc-content")), $(".toc"));
        setTimeout(function() {
            var oldHash = window.location.hash
            window.location.hash = '#';
            window.location.hash = oldHash;
        }, 200);
        if (window.respond && !window.respond.mediaQueriesSupported) {
            setTimeout(setScrollSpy, 3000);
        }
        else {
            setTimeout(setScrollSpy, 300);
        }
        fixAffixPosition();
        $(window).resize(fixAffixPosition);
    });
})();
