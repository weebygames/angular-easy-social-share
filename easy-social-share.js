'use strict';

angular.module('td.easySocialShare', [])
  .directive('shareLinks', ['$location', function ($location) {
    return {
      link: function (scope, elem, attrs) {
        var i,
            sites = ['twitter', 'facebook', 'linkedin', 'google-plus', 'reddit', 'tumblr', 'email'],
            theLink,
            links = attrs.shareLinks.toLowerCase().split(','),
            pageTitle = attrs.shareTitle,
            pageTitleUri = encodeURIComponent(pageTitle),
            square = '',
            circle = false;
        var shareLinks = null;
        var pageLink = '';

        scope.$watch(
          function() { return attrs.shareLink; },
          function(newVal, oldVal) {
            if (newVal) {
              pageLink = attrs.shareLink || encodeURIComponent($location.absUrl());
              buildChildren();
            } else {
              clearChildren();
            }
          }
        );

        var clearChildren = function() {
          var element = elem[0];
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        };

        var buildChildren = function() {
          clearChildren();

          buildShareLinks();

          for (i = 0; i < shareLinks.length; i++) {
            var anchor = '';
            anchor += '<a href="' + shareLinks[i].url + '" target="_blank">';
            if (circle) {
              anchor += '<span class="fa-stack fa-lg">\
                        <i class="fa fa-circle fa-stack-2x"></i>\
                        <i class="fa fa-' + getFAIcon(shareLinks[i].network) + ' fa-stack-1x fa-inverse"></i></span>';
            } else {
              anchor += '<i class="fa fa-' + getFAIcon(shareLinks[i].network) + square + '"></i>';
            }
            anchor += '</a>';
            elem.append(anchor);
          }
        };

        elem.addClass('td-easy-social-share');

        // check if square icon specified
        square = (attrs.shareSquare && attrs.shareSquare.toString() === 'true') ? '-square' : '';
        circle = (attrs.shareCircle && attrs.shareCircle.toString() === 'true');

        var buildShareLinks = function() {
          shareLinks = [];
          // assign share link for each network
          angular.forEach(links, function (key) {
            key = key.trim();

            switch (key) {
              case 'twitter':
                theLink = 'http://twitter.com/intent/tweet?text=' + pageTitleUri + '%20' + pageLink;
                break;
              case 'facebook':
                theLink = 'http://facebook.com/sharer.php?u=' + pageLink;
                break;
              case 'linkedin':
                theLink = 'http://www.linkedin.com/shareArticle?mini=true&url=' + pageLink + '&title=' + pageTitleUri;
                break;
              case 'google-plus':
                theLink = 'https://plus.google.com/share?url=' + pageLink;
                break;
              case 'reddit':
                 theLink = 'http://reddit.com/submit?url=' + pageLink + '&title=' + pageTitleUri;
                break;
              case 'tumblr':
                 theLink = 'http://www.tumblr.com/share/link?url=' + pageLink + '&amp;name=' + pageTitleUri;
                break;
              case 'email':
                 theLink = 'mailto:?to=&body=Check%20' + pageTitleUri + '%20out!%20' + pageLink;
                break;
            }

            if (sites.indexOf(key) > -1) {
              shareLinks.push({network: key, url: theLink});
            }
          });
        };

        var getFAIcon = function(network) {
          if (network === 'email') return 'envelope-o';
          return network;
        }

        buildChildren();
      }
    };
  }]);
